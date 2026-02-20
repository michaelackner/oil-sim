import { useState, useEffect, useCallback, useRef } from 'react';
import useCargoStore from '../state/cargoStore.js';
import cargoScenarios from '../engine/cargoScenarios.js';

// ─── TUTORIAL DATA ──────────────────────────────────────────────
const TUTORIAL_STEPS = [
    {
        title: 'What is Cargo Hedging?',
        icon: '⚓',
        content: 'When you buy a physical cargo of oil, you\'re exposed to price risk. The physical price is determined later (at the "pricing window"), so if prices move against you before then, you lose money.\n\nHedging means taking an opposite position in futures to lock in your economics.',
        visual: 'concept',
    },
    {
        title: 'The Bill of Lading (BL) Date',
        icon: '📋',
        content: 'The BL date is when the vessel loads cargo. Your pricing window is centred around this date.\n\nFor "5 days around BL" pricing:\n• Pricing starts 2 days before BL\n• Includes the BL day itself\n• Ends 2 days after BL\n\nThe pricing window determines WHICH futures month you hedge against.',
        visual: 'bl_timeline',
    },
    {
        title: 'Calculating Lots',
        icon: '🔢',
        content: 'Futures contracts trade in lots of 1,000 barrels.\n\nTo calculate how many lots you need:\n\n  Volume ÷ 1,000 = Lots\n\n• 500,000 bbl → 500 lots\n• 700,000 bbl → 700 lots\n• 1,000,000 bbl → 1,000 lots\n\nAlways match your hedge size to your cargo volume for a 1:1 hedge ratio.',
        visual: 'lots_calc',
    },
    {
        title: 'Hedge Direction — Long Physical',
        icon: '📉',
        content: 'When you OWN the cargo (LONG physical), you worry about prices FALLING before your pricing window.\n\n→ SELL futures to hedge\n\nIf prices drop: your physical cargo loses value, but your short futures position gains — offsetting the loss.\n\nThis is called a "short hedge" and is the most common hedge in oil trading.',
        visual: 'long_physical',
    },
    {
        title: 'Hedge Direction — Short Physical',
        icon: '📈',
        content: 'When you\'ve SOLD a cargo forward (SHORT physical), you worry about prices RISING before you purchase.\n\n→ BUY futures to hedge\n\nIf prices rise: your purchase price increases, but your long futures position gains — offsetting the higher cost.\n\nThis is called a "long hedge" and is used by refineries and buyers.',
        visual: 'short_physical',
    },
    {
        title: 'Choosing the Right Month',
        icon: '📅',
        content: 'Your hedge must be in the futures month that matches your pricing window.\n\nIf your BL is Day 30 and pricing runs Day 28–32, and months are:\n• Feb: Day 1–20\n• Mar: Day 21–42\n• Apr: Day 43–63\n\n→ Pricing falls in March → Hedge in March futures\n\nIf a BL shift pushes pricing into a different month, you must ROLL your hedge.',
        visual: 'month_selection',
    },
    {
        title: 'Contango — Rolling Costs Money',
        icon: '📈',
        content: 'In CONTANGO, far-month prices are HIGHER than near-month prices. The forward curve slopes upward.\n\nWhen you roll forward in contango:\n• You close (buy back) the near month cheap\n• You open (sell) the far month expensive\n• But you pay the SPREAD between months\n\nRoll Cost = Spread × Lots × 1,000 bbl\n\n⚠ In steep contango, rolling can significantly erode your hedge\'s P&L.',
        visual: 'contango',
    },
    {
        title: 'Backwardation — Rolling Earns Money',
        icon: '📉',
        content: 'In BACKWARDATION, near-month prices are HIGHER than far-month prices. The forward curve slopes downward.\n\nWhen you roll forward in backwardation:\n• You close (buy back) the near month expensive\n• You open (sell) the far month cheaper\n• You EARN the spread between months\n\nRoll Credit = Spread × Lots × 1,000 bbl\n\n✅ Backwardation makes rolling profitable — but don\'t assume it lasts!',
        visual: 'backwardation',
    },
];

/**
 * CargoHedgeGame — Main component for the cargo hedging training module.
 * Renders different phases: menu → tutorial → briefing → constructing → monitoring → review
 */
export default function CargoHedgeGame({ onBack }) {
    const phase = useCargoStore(s => s.phase);
    const scenario = useCargoStore(s => s.scenario);
    const engineState = useCargoStore(s => s.engineState);
    const settlement = useCargoStore(s => s.settlement);
    const pendingEvent = useCargoStore(s => s.pendingEvent);
    const hedgeInput = useCargoStore(s => s.hedgeInput);
    const startScenario = useCargoStore(s => s.startScenario);
    const beginConstructing = useCargoStore(s => s.beginConstructing);
    const setHedgeInput = useCargoStore(s => s.setHedgeInput);
    const placeHedge = useCargoStore(s => s.placeHedge);
    const advanceDay = useCargoStore(s => s.advanceDay);
    const advanceDays = useCargoStore(s => s.advanceDays);
    const executeRoll = useCargoStore(s => s.executeRoll);
    const skipRoll = useCargoStore(s => s.skipRoll);
    const returnToMenu = useCargoStore(s => s.returnToMenu);
    const placeHedgeDuringMonitoring = useCargoStore(s => s.placeHedgeDuringMonitoring);
    const reportToRisk = useCargoStore(s => s.reportToRisk);
    const [showTutorial, setShowTutorial] = useState(false);

    // ─── TUTORIAL ────────────────────────────────────────────
    if (showTutorial) {
        return <CargoTutorial onClose={() => setShowTutorial(false)} />;
    }

    // ─── SCENARIO MENU ──────────────────────────────────────
    if (phase === 'menu') {
        return (
            <div className="chg-container">
                <div className="chg-header">
                    <button className="snt-back-btn" onClick={onBack}>← Back to Main Menu</button>
                    <h1 className="chg-title">⚓ Cargo Hedging</h1>
                    <p className="chg-subtitle">
                        Learn to hedge physical oil cargoes using futures contracts.<br />
                        Master BL dates, pricing windows, and hedge rolls.
                    </p>
                </div>

                <div className="chg-menu-actions">
                    <button className="snt-btn primary tutorial-btn" onClick={() => setShowTutorial(true)}>
                        📖 Tutorial — Learn the Concepts
                    </button>
                </div>

                <div className="chg-overview">
                    <h2>How It Works</h2>
                    <div className="chg-steps-row">
                        <div className="chg-step-card">
                            <span className="chg-step-num">1</span>
                            <span className="chg-step-label">Receive Cargo</span>
                            <span className="chg-step-desc">Read the cargo docket — grade, volume, BL date</span>
                        </div>
                        <div className="chg-step-arrow">→</div>
                        <div className="chg-step-card">
                            <span className="chg-step-num">2</span>
                            <span className="chg-step-label">Build Hedge</span>
                            <span className="chg-step-desc">Calculate lots, pick month, sell or buy futures</span>
                        </div>
                        <div className="chg-step-arrow">→</div>
                        <div className="chg-step-card">
                            <span className="chg-step-num">3</span>
                            <span className="chg-step-label">React to Shifts</span>
                            <span className="chg-step-desc">BL date moves — roll your hedge to the right month</span>
                        </div>
                        <div className="chg-step-arrow">→</div>
                        <div className="chg-step-card">
                            <span className="chg-step-num">4</span>
                            <span className="chg-step-label">Settlement</span>
                            <span className="chg-step-desc">See your hedge effectiveness and P&L</span>
                        </div>
                    </div>
                </div>

                <div className="chg-scenarios-section">
                    <h2>Select Scenario</h2>
                    <div className="chg-scenario-grid">
                        {cargoScenarios.map((sc) => (
                            <div
                                key={sc.id}
                                className={`chg-scenario-card diff-${sc.difficulty.toLowerCase().replace(' ', '-')}`}
                                onClick={() => startScenario(sc)}
                            >
                                <div className="chg-sc-top">
                                    <span className={`chg-sc-diff ${sc.difficulty.toLowerCase().replace(' ', '-')}`}>
                                        {sc.difficulty}
                                    </span>
                                    {sc.hedgePosition === 'short' && (
                                        <span className="chg-sc-position-badge short">SHORT PHYS</span>
                                    )}
                                </div>
                                <div className="chg-sc-name">{sc.name}</div>
                                <div className="chg-sc-desc">{sc.description}</div>
                                <div className="chg-sc-details">
                                    <span>{(sc.cargo.volume / 1000).toFixed(0)}k bbl</span>
                                    <span>{sc.cargo.grade.split('(')[0].trim()}</span>
                                    {sc.curve.monthSpread > 0 && <span className="chg-sc-curve-tag contango">Contango</span>}
                                    {sc.curve.monthSpread < 0 && <span className="chg-sc-curve-tag backwardation">Backwardation</span>}
                                </div>
                                <div className="chg-sc-lessons">
                                    {sc.keyLessons.map((l, i) => (
                                        <div key={i} className="chg-sc-lesson">• {l}</div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // ─── BRIEFING ───────────────────────────────────────────
    if (phase === 'briefing' && engineState) {
        const c = engineState.cargo;
        const pRange = c.pricingRange;
        const recMonth = engineState.recommendedMonth;
        const isShort = scenario.hedgePosition === 'short';

        return (
            <div className="chg-container">
                <div className="chg-briefing">
                    <h1 className="chg-phase-title">⚓ Cargo Briefing</h1>
                    <p className="chg-phase-subtitle">{scenario.name} — {scenario.difficulty}</p>

                    {/* Position indicator */}
                    <div className={`chg-position-badge ${isShort ? 'short' : 'long'}`}>
                        {isShort
                            ? '📤 You are SHORT physical — you\'ve sold this cargo forward and need to BUY it'
                            : '📥 You are LONG physical — you own this cargo and need to SELL'}
                    </div>

                    <div className="chg-cargo-docket">
                        <h2>Cargo Docket</h2>
                        <div className="chg-docket-grid">
                            <div className="chg-docket-row">
                                <span className="chg-dk-label">Grade</span>
                                <span className="chg-dk-value">{c.grade}</span>
                            </div>
                            <div className="chg-docket-row">
                                <span className="chg-dk-label">Volume</span>
                                <span className="chg-dk-value">{c.volume.toLocaleString()} barrels</span>
                            </div>
                            <div className="chg-docket-row">
                                <span className="chg-dk-label">Origin</span>
                                <span className="chg-dk-value">{c.origin}</span>
                            </div>
                            <div className="chg-docket-row">
                                <span className="chg-dk-label">Destination</span>
                                <span className="chg-dk-value">{c.destination}</span>
                            </div>
                            <div className="chg-docket-row highlight">
                                <span className="chg-dk-label">BL Date</span>
                                <span className="chg-dk-value">Day {c.blDay}</span>
                            </div>
                            <div className="chg-docket-row">
                                <span className="chg-dk-label">Pricing</span>
                                <span className="chg-dk-value">{c.pricingDays} days {c.pricingType} BL (Dated Brent)</span>
                            </div>
                            <div className="chg-docket-row">
                                <span className="chg-dk-label">Pricing Window</span>
                                <span className="chg-dk-value">Day {pRange.start} – Day {pRange.end}</span>
                            </div>
                            <div className="chg-docket-row">
                                <span className="chg-dk-label">Position</span>
                                <span className={`chg-dk-value ${isShort ? 'short-text' : 'long-text'}`}>
                                    {isShort ? 'SHORT — Sold Forward' : 'LONG — Own Cargo'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="chg-task-box">
                        <div className="chg-task-icon">📋</div>
                        <div className="chg-task-text">
                            <strong>YOUR TASK</strong>
                            <p>{scenario.objective}</p>
                        </div>
                    </div>

                    <div className="chg-curve-preview">
                        <h3>Current Forward Curve ({engineState.curveStructure})</h3>
                        <div className="chg-curve-bars">
                            {engineState.monthLabels.map(m => {
                                const price = engineState.curve[m];
                                const maxPrice = Math.max(...Object.values(engineState.curve));
                                const minPrice = Math.min(...Object.values(engineState.curve));
                                const range = maxPrice - minPrice || 1;
                                const pct = ((price - minPrice) / range) * 60 + 30;
                                return (
                                    <div key={m} className="chg-curve-bar-col">
                                        <div className="chg-curve-price">${price.toFixed(2)}</div>
                                        <div className="chg-curve-bar-bg">
                                            <div
                                                className={`chg-curve-bar-fill ${m === recMonth ? 'recommended' : ''}`}
                                                style={{ height: `${pct}%` }}
                                            />
                                        </div>
                                        <div className={`chg-curve-month ${m === recMonth ? 'recommended' : ''}`}>{m}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="chg-curve-structure-badge">
                            {engineState.curveStructure === 'contango' && '📈 Contango — far months more expensive'}
                            {engineState.curveStructure === 'backwardation' && '📉 Backwardation — near months more expensive'}
                            {engineState.curveStructure === 'flat' && '➡️ Flat curve'}
                        </div>
                        {engineState.curveStructure !== 'flat' && (
                            <div className="chg-curve-roll-hint">
                                {engineState.curveStructure === 'contango'
                                    ? '⚠ Rolling forward will COST money in this market'
                                    : '✅ Rolling forward will EARN money in this market'}
                            </div>
                        )}
                    </div>

                    <button className="snt-btn primary" onClick={beginConstructing}>
                        🔧 Begin Hedging →
                    </button>
                </div>
            </div>
        );
    }

    // ─── CONSTRUCTING (Hedge Builder) ───────────────────────
    if (phase === 'constructing' && engineState) {
        const c = engineState.cargo;
        const correctLots = c.requiredLots;
        const lotsVal = parseInt(hedgeInput.lots, 10);
        const lotsCorrect = lotsVal === correctLots;
        const monthSelected = hedgeInput.month;
        const directionSelected = hedgeInput.direction;
        const isShort = scenario.hedgePosition === 'short';
        const correctDirection = scenario.hedgeDirection; // -1 for sell, 1 for buy

        const canPlace = lotsVal > 0 && monthSelected && directionSelected !== 0;
        const selectedPrice = monthSelected ? engineState.curve[monthSelected] : null;
        const notional = lotsVal && selectedPrice ? (lotsVal * 1000 * selectedPrice) : null;

        return (
            <div className="chg-container">
                <div className="chg-construct">
                    <h1 className="chg-phase-title">🔧 Construct Your Hedge</h1>

                    <div className="chg-construct-info">
                        <span>Cargo: <strong>{c.volume.toLocaleString()} bbl</strong> {c.grade}</span>
                        <span>BL Date: Day {c.blDay} | Pricing: Day {c.pricingRange.start}–{c.pricingRange.end}</span>
                        <span className={`chg-position-tag ${isShort ? 'short' : 'long'}`}>
                            {isShort ? 'SHORT physical' : 'LONG physical'}
                        </span>
                    </div>

                    {/* Lots input */}
                    <div className="chg-input-group">
                        <label className="chg-input-label">
                            How many lots? <span className="chg-hint">(1 lot = 1,000 barrels)</span>
                        </label>
                        <div className="chg-input-row">
                            <input
                                type="number"
                                className={`chg-input ${hedgeInput.lots && (lotsCorrect ? 'correct' : 'incorrect')}`}
                                value={hedgeInput.lots}
                                onChange={e => setHedgeInput('lots', e.target.value)}
                                placeholder={`${c.volume.toLocaleString()} ÷ 1,000 = ?`}
                            />
                            {hedgeInput.lots && (
                                <span className={`chg-input-feedback ${lotsCorrect ? 'correct' : 'incorrect'}`}>
                                    {lotsCorrect ? '✓' : `Need ${correctLots}`}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Direction */}
                    <div className="chg-input-group">
                        <label className="chg-input-label">
                            Direction? <span className="chg-hint">(You are {isShort ? 'SHORT' : 'LONG'} physical)</span>
                        </label>
                        <div className="chg-direction-btns">
                            <button
                                className={`chg-dir-btn sell ${directionSelected === -1 ? 'active' : ''}`}
                                onClick={() => setHedgeInput('direction', -1)}
                            >
                                ▼ SELL Futures
                                <span className="chg-dir-sub">Short hedge — protect against price drops</span>
                            </button>
                            <button
                                className={`chg-dir-btn buy ${directionSelected === 1 ? 'active' : ''}`}
                                onClick={() => setHedgeInput('direction', 1)}
                            >
                                ▲ BUY Futures
                                <span className="chg-dir-sub">Long hedge — protect against price rises</span>
                            </button>
                        </div>
                        {directionSelected !== 0 && (
                            <span className={`chg-input-feedback ${directionSelected === correctDirection ? 'correct' : 'incorrect'}`}>
                                {directionSelected === correctDirection
                                    ? (isShort
                                        ? '✓ Correct — buy to hedge short physical'
                                        : '✓ Correct — sell to hedge long physical')
                                    : (isShort
                                        ? '✗ Wrong — you\'re SHORT physical, BUY futures to hedge!'
                                        : '✗ Wrong — you\'re LONG physical, SELL futures to hedge!')
                                }
                            </span>
                        )}
                    </div>

                    {/* Month selector */}
                    <div className="chg-input-group">
                        <label className="chg-input-label">
                            Which futures month? <span className="chg-hint">(Match your pricing period)</span>
                        </label>
                        <div className="chg-month-picker">
                            {engineState.monthLabels.map(m => {
                                const price = engineState.curve[m];
                                const isRec = m === engineState.recommendedMonth;
                                const isSelected = m === monthSelected;
                                return (
                                    <button
                                        key={m}
                                        className={`chg-month-btn ${isSelected ? 'selected' : ''} ${isRec && isSelected ? 'correct' : ''}`}
                                        onClick={() => setHedgeInput('month', m)}
                                    >
                                        <span className="chg-mb-month">{m}</span>
                                        <span className="chg-mb-price">${price.toFixed(2)}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {monthSelected && (
                            <span className={`chg-input-feedback ${monthSelected === engineState.recommendedMonth ? 'correct' : 'incorrect'}`}>
                                {monthSelected === engineState.recommendedMonth
                                    ? `✓ Correct — pricing window falls in ${monthSelected}`
                                    : `Pricing window (Day ${c.pricingRange.start}–${c.pricingRange.end}) falls mostly in ${engineState.recommendedMonth}`
                                }
                            </span>
                        )}
                    </div>

                    {/* Preview */}
                    {canPlace && (
                        <div className="chg-preview">
                            <div className="chg-preview-title">Hedge Preview</div>
                            <div className="chg-preview-detail">
                                {directionSelected === -1 ? 'SELL' : 'BUY'} {lotsVal} lots {monthSelected} @ ${selectedPrice?.toFixed(2)}
                            </div>
                            <div className="chg-preview-notional">
                                Notional: ${notional?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                            </div>
                        </div>
                    )}

                    <button
                        className="snt-btn primary"
                        disabled={!canPlace}
                        onClick={placeHedge}
                        style={{ opacity: canPlace ? 1 : 0.4 }}
                    >
                        ✓ Place Hedge →
                    </button>
                </div>
            </div>
        );
    }

    // ─── MONITORING ─────────────────────────────────────────
    if (phase === 'monitoring' && engineState) {
        return <MonitoringPhase
            engineState={engineState}
            scenario={scenario}
            pendingEvent={pendingEvent}
            onAdvanceDay={advanceDay}
            onAdvanceDays={advanceDays}
            onRoll={executeRoll}
            onSkipRoll={skipRoll}
            onPlaceHedge={placeHedgeDuringMonitoring}
            onReportRisk={reportToRisk}
            onExit={returnToMenu}
        />;
    }

    // ─── REVIEW (Settlement Report) ─────────────────────────
    if (phase === 'review' && settlement) {
        return <SettlementReport
            settlement={settlement}
            scenario={scenario}
            engineState={engineState}
            onRetry={() => startScenario(scenario)}
            onMenu={() => { returnToMenu(); }}
            onBack={onBack}
        />;
    }

    return null;
}


// ─── MONITORING PHASE COMPONENT ─────────────────────────────────

function MonitoringPhase({ engineState, scenario, pendingEvent, onAdvanceDay, onAdvanceDays, onRoll, onSkipRoll, onPlaceHedge, onReportRisk, onExit }) {
    const [autoRunning, setAutoRunning] = useState(false);
    const [activeTab, setActiveTab] = useState('exposure'); // 'exposure' | 'messages' | 'control'
    const [hedgeLots, setHedgeLots] = useState('');
    const [hedgeMonth, setHedgeMonth] = useState('');
    const autoRef = useRef(null);

    // Auto-advance
    useEffect(() => {
        if (autoRunning && !pendingEvent) {
            autoRef.current = setInterval(() => {
                onAdvanceDay();
            }, 150);
            return () => clearInterval(autoRef.current);
        }
        return () => clearInterval(autoRef.current);
    }, [autoRunning, pendingEvent, onAdvanceDay]);

    // Stop auto when event fires
    useEffect(() => {
        if (pendingEvent) setAutoRunning(false);
    }, [pendingEvent]);

    const c = engineState.cargo;
    const progress = (engineState.currentDay / engineState.totalDays) * 100;
    const pRange = c.pricingRange;
    const monthSplit = engineState.pricingMonthSplit;
    const isShort = scenario.hedgePosition === 'short';

    // Physical exposure calc
    const physicalExposureLots = (isShort ? -1 : 1) * c.requiredLots;
    // Paper exposure calc
    const paperExposureLots = engineState.openHedges.reduce((sum, h) => sum + h.lots, 0);
    const netExposure = physicalExposureLots + paperExposureLots;

    // For the roll panel — determine what roll is needed
    let rollSuggestion = null;
    if (pendingEvent) {
        const currentHedgeMonths = engineState.openHedges.map(h => h.month);
        const newRec = engineState.recommendedMonth;
        const splitMonths = Object.entries(monthSplit);
        const totalPricingDays = Object.values(monthSplit).reduce((s, v) => s + v, 0);

        if (currentHedgeMonths.length > 0 && !currentHedgeMonths.includes(newRec)) {
            // Need to roll everything to the new month
            const totalLots = engineState.openHedges.reduce((s, h) => s + Math.abs(h.lots), 0);
            rollSuggestion = {
                fromMonth: currentHedgeMonths[0],
                toMonth: newRec,
                lots: totalLots,
                spread: engineState.curve[newRec] - engineState.curve[currentHedgeMonths[0]],
                rollCost: (engineState.curve[newRec] - engineState.curve[currentHedgeMonths[0]]) * totalLots * 1000,
            };
        } else if (splitMonths.length > 1) {
            // Pricing straddles months — may need partial roll
            const hedgedMonth = currentHedgeMonths[0];
            const otherMonth = splitMonths.find(([m]) => m !== hedgedMonth);
            if (otherMonth) {
                const totalLots = engineState.openHedges.reduce((s, h) => s + Math.abs(h.lots), 0);
                const otherPct = otherMonth[1] / totalPricingDays;
                const lotsToRoll = Math.round(totalLots * otherPct);
                if (lotsToRoll > 0) {
                    rollSuggestion = {
                        fromMonth: hedgedMonth,
                        toMonth: otherMonth[0],
                        lots: lotsToRoll,
                        spread: engineState.curve[otherMonth[0]] - engineState.curve[hedgedMonth],
                        rollCost: (engineState.curve[otherMonth[0]] - engineState.curve[hedgedMonth]) * lotsToRoll * 1000,
                        isSplit: true,
                        splitInfo: `${Object.entries(monthSplit).map(([m, d]) => `${d} days in ${m}`).join(', ')}`,
                    };
                }
            }
        }
    }

    return (
        <div className="chg-container">
            {/* Progress bar */}
            <div className="snt-progress-bar-bg" style={{ maxWidth: '100%' }}>
                <div className="snt-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="chg-monitor">
                <div className="chg-monitor-header">
                    <button className="ftg-exit-btn" onClick={onExit} style={{ marginRight: '16px' }} title="Exit">✕</button>
                    <span className="chg-mon-day">Day {engineState.currentDay} / {engineState.totalDays}</span>
                    <span className="chg-mon-scenario">{scenario.name}</span>
                    <div className="chg-mon-controls">
                        <button className="chg-ctrl-btn" onClick={onAdvanceDay} disabled={pendingEvent}>
                            +1 Day
                        </button>
                        <button className="chg-ctrl-btn" onClick={() => onAdvanceDays(5)} disabled={pendingEvent}>
                            +5 Days
                        </button>
                        <button
                            className={`chg-ctrl-btn ${autoRunning ? 'active' : ''}`}
                            onClick={() => setAutoRunning(!autoRunning)}
                            disabled={pendingEvent}
                        >
                            {autoRunning ? '⏸ Pause' : '▶ Auto'}
                        </button>
                    </div>
                </div>

                <div className="chg-monitor-grid">
                    {/* Left: Forward Curve */}
                    <div className="chg-monitor-panel">
                        <div className="chg-panel-title">Forward Curve ({engineState.curveStructure})</div>
                        <div className="chg-curve-bars compact">
                            {engineState.monthLabels.map(m => {
                                const price = engineState.curve[m];
                                const maxPrice = Math.max(...Object.values(engineState.curve));
                                const minPrice = Math.min(...Object.values(engineState.curve));
                                const range = maxPrice - minPrice || 1;
                                const pct = ((price - minPrice) / range) * 60 + 30;
                                const isHedged = engineState.openHedges.some(h => h.month === m);
                                const isRec = m === engineState.recommendedMonth;
                                return (
                                    <div key={m} className="chg-curve-bar-col">
                                        <div className="chg-curve-price">${price.toFixed(2)}</div>
                                        <div className="chg-curve-bar-bg">
                                            <div
                                                className={`chg-curve-bar-fill ${isHedged ? 'hedged' : ''} ${isRec ? 'recommended' : ''}`}
                                                style={{ height: `${pct}%` }}
                                            />
                                        </div>
                                        <div className={`chg-curve-month ${isHedged ? 'hedged' : ''}`}>
                                            {m} {isHedged && '🔒'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Tabbed Interface */}
                    <div className="chg-monitor-panel chg-tabs-panel">
                        <div className="chg-tabs-header">
                            <button className={`chg-tab-btn ${activeTab === 'exposure' ? 'active' : ''}`} onClick={() => setActiveTab('exposure')}>Exposure</button>
                            <button className={`chg-tab-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
                                Messages {engineState.messages?.length > 0 && <span className="chg-msg-badge">{engineState.messages.length}</span>}
                            </button>
                            <button className={`chg-tab-btn ${activeTab === 'control' ? 'active' : ''}`} onClick={() => setActiveTab('control')}>Control Room</button>
                        </div>

                        <div className="chg-tab-content">
                            {/* EXPOSURE TAB */}
                            {activeTab === 'exposure' && (
                                <div className="chg-exposure-view">
                                    <div className="chg-net-exposure">
                                        <span className="chg-ne-label">Net Exposure:</span>
                                        <span className={`chg-ne-val ${netExposure === 0 ? 'flat' : netExposure > 0 ? 'long' : 'short'}`}>
                                            {netExposure === 0 ? 'FLAT (Fully Hedged)' : `${Math.abs(netExposure)} Lots ${netExposure > 0 ? 'LONG' : 'SHORT'} (Unhedged Risk)`}
                                        </span>
                                    </div>

                                    <div className="chg-exposure-split">
                                        {/* Physical Side */}
                                        <div className="chg-exp-half physical">
                                            <h4>📦 Physical Exposure</h4>
                                            <div className="chg-exp-item">
                                                <strong>Source:</strong> Cargo Docket ({c.grade})<br />
                                                <strong>Volume:</strong> {c.volume.toLocaleString()} bbls ({c.requiredLots} lots)<br />
                                                <strong>Position:</strong> <span className={isShort ? 'short-text' : 'long-text'}>{isShort ? 'SHORT' : 'LONG'}</span><br />
                                                <strong>Effect:</strong> {isShort ? `-${c.requiredLots} lots` : `+${c.requiredLots} lots`}
                                            </div>
                                            <div className="chg-exp-item">
                                                <strong>BL:</strong> Day {c.blDay} {c.blShifted && <span className="chg-shifted-badge">shifted</span>}<br />
                                                <strong>Pricing Window:</strong> Day {pRange.start} – {pRange.end}
                                            </div>
                                        </div>

                                        {/* Paper Side */}
                                        <div className="chg-exp-half paper">
                                            <h4>📄 Paper Exposure</h4>
                                            {engineState.openHedges.length === 0 ? (
                                                <div className="chg-exp-item empty">No hedges placed.</div>
                                            ) : (
                                                engineState.openHedges.map((h, i) => (
                                                    <div key={i} className="chg-exp-item hedge-row">
                                                        <strong>Source:</strong> Hedge Executed<br />
                                                        <strong>Details:</strong> {Math.abs(h.lots)} lots {h.month} @ ${h.entryPrice.toFixed(2)}<br />
                                                        <strong>Effect:</strong> <span className={h.lots > 0 ? 'long-text' : 'short-text'}>{h.lots > 0 ? '+' : ''}{h.lots} lots</span><br />
                                                        <strong>Mark-to-Market:</strong> <span className={`chg-pnl ${h.unrealizedPnl >= 0 ? 'positive' : 'negative'}`}>
                                                            {h.unrealizedPnl >= 0 ? '+' : ''}{h.unrealizedPnl.toLocaleString()}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Mini Trade Widget */}
                                    <div className="chg-mini-trade">
                                        <h4>Add Hedge Trade</h4>
                                        <div className="chg-mt-inputs">
                                            <input type="number" placeholder="Lots" value={hedgeLots} onChange={e => setHedgeLots(e.target.value)} className="chg-mt-input" />
                                            <select value={hedgeMonth} onChange={e => setHedgeMonth(e.target.value)} className="chg-mt-select">
                                                <option value="" disabled>Month</option>
                                                {engineState.monthLabels.map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                            <button
                                                className="chg-mt-btn sell"
                                                disabled={!hedgeLots || !hedgeMonth}
                                                onClick={() => { onPlaceHedge(hedgeMonth, parseInt(hedgeLots, 10), -1); setHedgeLots(''); }}
                                            >Sell</button>
                                            <button
                                                className="chg-mt-btn buy"
                                                disabled={!hedgeLots || !hedgeMonth}
                                                onClick={() => { onPlaceHedge(hedgeMonth, parseInt(hedgeLots, 10), 1); setHedgeLots(''); }}
                                            >Buy</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MESSAGES TAB */}
                            {activeTab === 'messages' && (
                                <div className="chg-messages-view">
                                    {[...(engineState.messages || [])].reverse().map((msg, i) => (
                                        <div key={i} className={`chg-msg-bubble ${msg.isDealSheet ? 'dealsheet' : ''} ${msg.sender === 'Risk Dept' ? 'risk' : ''}`}>
                                            <div className="chg-msg-header">
                                                <span className="chg-msg-sender">{msg.sender}</span>
                                                <span className="chg-msg-time">Day {msg.day}</span>
                                            </div>
                                            <div className="chg-msg-body">{msg.text}</div>
                                        </div>
                                    ))}
                                    {(!engineState.messages || engineState.messages.length === 0) && (
                                        <div className="chg-msg-empty">No messages yet.</div>
                                    )}
                                </div>
                            )}

                            {/* CONTROL ROOM TAB */}
                            {activeTab === 'control' && engineState.dealSheet && (
                                <div className="chg-control-view">
                                    <h3>Risk Management Control Room</h3>
                                    <p className="chg-cr-desc">Verify Deal Sheet details against the physical Cargo Docket. If there are discrepancies, alert Risk Management immediately.</p>

                                    <div className="chg-cr-sheet">
                                        <div className="chg-cr-sheet-title">DEAL SHEET: <span>{engineState.dealSheet.id}</span></div>
                                        <div className="chg-cr-sheet-row"><strong>Counterparty:</strong> {engineState.dealSheet.counterparty}</div>
                                        <div className="chg-cr-sheet-row"><strong>Trade Date:</strong> {engineState.dealSheet.tradeDate}</div>
                                        <div className="chg-cr-sheet-row"><strong>Grade:</strong> {engineState.dealSheet.grade}</div>
                                        <div className="chg-cr-sheet-row"><strong>Volume:</strong> {engineState.dealSheet.volume.toLocaleString()} bbls</div>
                                        <div className="chg-cr-sheet-row"><strong>Pricing Terms:</strong> {engineState.dealSheet.pricingTerms}</div>
                                    </div>

                                    {!engineState.riskReportStatus ? (
                                        <button className="snt-btn secondary alert-risk-btn" onClick={onReportRisk}>
                                            🚨 Alert Risk: Discrepancy Found in Deal Sheet
                                        </button>
                                    ) : (
                                        <div className={`chg-risk-status ${engineState.riskReportStatus}`}>
                                            Status: {engineState.riskReportStatus === 'caught' ? 'Error Caught & Amended!' : 'False Alarm'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* BL Shift Event Alert */}
                {pendingEvent && (
                    <div className="chg-event-overlay">
                        <div className="chg-event-modal">
                            <div className="chg-event-icon">{pendingEvent.icon || '⚠️'}</div>
                            <h2 className="chg-event-headline">{pendingEvent.headline}</h2>
                            <p className="chg-event-detail">{pendingEvent.detail}</p>

                            <div className="chg-event-impact">
                                <div className="chg-ei-row">
                                    <span>BL Date Shift</span>
                                    <span className="chg-ei-value">+{pendingEvent.blShiftDays} days</span>
                                </div>
                                <div className="chg-ei-row">
                                    <span>New BL Date</span>
                                    <span className="chg-ei-value">Day {engineState.cargo.blDay}</span>
                                </div>
                                <div className="chg-ei-row">
                                    <span>New Pricing Window</span>
                                    <span className="chg-ei-value">Day {pRange.start} – {pRange.end}</span>
                                </div>
                                <div className="chg-ei-row">
                                    <span>Pricing Months</span>
                                    <span className="chg-ei-value">
                                        {Object.entries(monthSplit).map(([m, d]) => `${m}: ${d}d`).join(' | ')}
                                    </span>
                                </div>
                            </div>

                            {rollSuggestion && (
                                <div className="chg-roll-suggestion">
                                    <div className="chg-rs-title">
                                        {rollSuggestion.isSplit ? '⚠ Partial Roll Needed' : '⚠ Roll Needed'}
                                    </div>
                                    {rollSuggestion.isSplit && (
                                        <div className="chg-rs-split">{rollSuggestion.splitInfo}</div>
                                    )}
                                    <div className="chg-rs-detail">
                                        Roll {rollSuggestion.lots} lots from <strong>{rollSuggestion.fromMonth}</strong> → <strong>{rollSuggestion.toMonth}</strong>
                                    </div>
                                    <div className="chg-rs-spread">
                                        {rollSuggestion.fromMonth}/{rollSuggestion.toMonth} spread: {rollSuggestion.spread > 0 ? '+' : ''}{rollSuggestion.spread.toFixed(2)}
                                        <span className={rollSuggestion.rollCost > 0 ? 'negative' : 'positive'}>
                                            {' '}({rollSuggestion.rollCost > 0 ? 'COST' : 'EARN'}: ${Math.abs(rollSuggestion.rollCost).toLocaleString()})
                                        </span>
                                    </div>

                                    <div className="chg-roll-actions">
                                        <button className="snt-btn primary" onClick={() => onRoll(rollSuggestion.fromMonth, rollSuggestion.toMonth, rollSuggestion.lots)}>
                                            🔄 Execute Roll ({rollSuggestion.lots} lots)
                                        </button>
                                        <button className="snt-btn secondary" onClick={onSkipRoll}>
                                            Skip — Stay in {rollSuggestion.fromMonth}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {!rollSuggestion && (
                                <div className="chg-roll-actions" style={{ marginTop: '16px' }}>
                                    <button className="snt-btn primary" onClick={onSkipRoll}>
                                        Continue — No Roll Needed
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Pricing period indicator */}
                {engineState.pricingStarted && (
                    <div className="chg-pricing-indicator">
                        <div className="chg-pi-title">🔔 Pricing Period Active</div>
                        <div className="chg-pi-prices">
                            {engineState.pricingDailyPrices.map((p, i) => (
                                <div key={i} className="chg-pi-day">
                                    <span className="chg-pi-day-num">Day {p.day}</span>
                                    <span className="chg-pi-day-price">${p.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        {engineState.pricingDailyPrices.length > 0 && (
                            <div className="chg-pi-avg">
                                Running Avg: ${(engineState.pricingDailyPrices.reduce((s, p) => s + p.price, 0) / engineState.pricingDailyPrices.length).toFixed(2)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}


// ─── SETTLEMENT REPORT COMPONENT ────────────────────────────────

function SettlementReport({ settlement, scenario, engineState, onRetry, onMenu, onBack }) {
    const s = settlement;
    const gradeClass = s.hedgeEffectiveness >= 80 ? 'grade-a' : s.hedgeEffectiveness >= 60 ? 'grade-b' : 'grade-f';

    return (
        <div className="chg-container">
            <div className="chg-settlement">
                <h1 className="chg-phase-title">📊 Settlement Report</h1>
                <p className="chg-phase-subtitle">{scenario.name}</p>

                {/* Grade circle */}
                <div className={`snt-grade-circle ${gradeClass}`}>
                    <span className="snt-grade-letter">{s.grade}</span>
                    <span className="snt-grade-pct">{s.hedgeEffectiveness}%</span>
                </div>

                {/* Key metrics */}
                <div className="chg-settle-metrics">
                    <div className="chg-sm-card">
                        <span className="chg-sm-label">Physical Price</span>
                        <span className="chg-sm-value">${s.physicalPrice?.toFixed(2)}</span>
                        <span className="chg-sm-sub">{s.cargo?.pricingDays || 5}-day average</span>
                    </div>
                    <div className="chg-sm-card">
                        <span className="chg-sm-label">Hedge Entry</span>
                        <span className="chg-sm-value">${s.firstEntryPrice?.toFixed(2)}</span>
                        <span className="chg-sm-sub">Initial hedge price</span>
                    </div>
                    <div className="chg-sm-card">
                        <span className="chg-sm-label">Effective Price</span>
                        <span className={`chg-sm-value ${s.effectivePrice >= s.firstEntryPrice ? 'positive' : ''}`}>${s.effectivePrice?.toFixed(2)}</span>
                        <span className="chg-sm-sub">Physical + hedge gain</span>
                    </div>
                </div>

                {/* P&L breakdown */}
                <div className="chg-pnl-breakdown">
                    <h3>P&L Breakdown</h3>
                    <div className="chg-pnl-row">
                        <span>Price Change ({s.priceChange > 0 ? '+' : ''}{s.priceChange?.toFixed(2)}/bbl)</span>
                        <span className={s.unhedgedPnl >= 0 ? 'positive' : 'negative'}>
                            ${s.unhedgedPnl?.toLocaleString()}
                        </span>
                    </div>
                    <div className="chg-pnl-row">
                        <span>Hedge P&L</span>
                        <span className={s.hedgePnl >= 0 ? 'positive' : 'negative'}>
                            {s.hedgePnl >= 0 ? '+' : ''}${s.hedgePnl?.toLocaleString()}
                        </span>
                    </div>
                    {s.rollCosts !== 0 && (
                        <div className="chg-pnl-row">
                            <span>Roll Costs</span>
                            <span className={s.rollCosts <= 0 ? 'positive' : 'negative'}>
                                ${s.rollCosts?.toLocaleString()}
                            </span>
                        </div>
                    )}
                    <div className="chg-pnl-row total">
                        <span>Net Hedge P&L</span>
                        <span className={s.netHedgePnl >= 0 ? 'positive' : 'negative'}>
                            {s.netHedgePnl >= 0 ? '+' : ''}${s.netHedgePnl?.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Comparison */}
                <div className="chg-comparison">
                    <div className="chg-comp-col">
                        <span className="chg-comp-label">WITHOUT Hedge</span>
                        <span className={`chg-comp-value ${s.unhedgedPnl >= 0 ? 'positive' : 'negative'}`}>
                            ${s.unhedgedPnl?.toLocaleString()}
                        </span>
                    </div>
                    <div className="chg-comp-vs">vs</div>
                    <div className="chg-comp-col">
                        <span className="chg-comp-label">WITH Hedge</span>
                        <span className={`chg-comp-value ${(s.unhedgedPnl + s.netHedgePnl) >= 0 ? 'positive' : 'negative'}`}>
                            ${(s.unhedgedPnl + s.netHedgePnl)?.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Pricing period details */}
                {s.pricingDays && s.pricingDays.length > 0 && (
                    <div className="chg-pricing-detail">
                        <h3>Pricing Period</h3>
                        <div className="chg-pd-days">
                            {s.pricingDays.map((p, i) => (
                                <div key={i} className="chg-pd-day">
                                    <span>Day {p.day} ({p.month})</span>
                                    <span>${p.price.toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="chg-pd-day total">
                                <span>Average</span>
                                <span>${s.physicalPrice?.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Lessons */}
                <div className="chg-lessons">
                    <h3>Key Lessons</h3>
                    {scenario.keyLessons.map((l, i) => (
                        <div key={i} className="chg-lesson-item">💡 {l}</div>
                    ))}
                </div>

                <div className="snt-summary-actions">
                    <button className="snt-btn primary" onClick={onRetry}>🔄 Try Again</button>
                    <button className="snt-btn secondary" onClick={onMenu}>Choose Scenario</button>
                    <button className="snt-btn tertiary" onClick={onBack}>← Main Menu</button>
                </div>
            </div>
        </div>
    );
}


// ─── TUTORIAL COMPONENT ─────────────────────────────────────────

function CargoTutorial({ onClose }) {
    const [step, setStep] = useState(0);
    const current = TUTORIAL_STEPS[step];
    const isLast = step === TUTORIAL_STEPS.length - 1;
    const isFirst = step === 0;

    return (
        <div className="chg-container">
            <div className="chg-tutorial">
                <div className="chg-tut-header">
                    <button className="snt-back-btn" onClick={onClose}>← Back to Cargo Hedging</button>
                    <div className="chg-tut-progress">
                        {TUTORIAL_STEPS.map((_, i) => (
                            <div
                                key={i}
                                className={`chg-tut-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
                                onClick={() => setStep(i)}
                            />
                        ))}
                    </div>
                    <span className="chg-tut-counter">{step + 1} / {TUTORIAL_STEPS.length}</span>
                </div>

                <div className="chg-tut-card">
                    <div className="chg-tut-icon">{current.icon}</div>
                    <h2 className="chg-tut-title">{current.title}</h2>

                    <div className="chg-tut-content">
                        {current.content.split('\n').map((line, i) => {
                            if (line.trim() === '') return <br key={i} />;
                            // Bold text between ** **
                            const parts = line.split(/\*\*(.*?)\*\*/g);
                            return (
                                <p key={i}>
                                    {parts.map((part, j) =>
                                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                                    )}
                                </p>
                            );
                        })}
                    </div>

                    {/* Visual diagrams */}
                    <TutorialVisual type={current.visual} />
                </div>

                <div className="chg-tut-nav">
                    <button
                        className="snt-btn secondary"
                        onClick={() => setStep(s => s - 1)}
                        disabled={isFirst}
                        style={{ opacity: isFirst ? 0.3 : 1 }}
                    >
                        ← Previous
                    </button>
                    {isLast ? (
                        <button className="snt-btn primary" onClick={onClose}>
                            ✓ Start Playing →
                        </button>
                    ) : (
                        <button className="snt-btn primary" onClick={() => setStep(s => s + 1)}>
                            Next →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── TUTORIAL VISUAL DIAGRAMS ───────────────────────────────────

function TutorialVisual({ type }) {
    if (type === 'concept') {
        return (
            <div className="chg-tv-diagram">
                <div className="chg-tv-flow">
                    <div className="chg-tv-box cargo">📦 Buy Cargo</div>
                    <div className="chg-tv-arrow">⟶</div>
                    <div className="chg-tv-box risk">⚠️ Price Risk<br /><small>Days until pricing</small></div>
                    <div className="chg-tv-arrow">⟶</div>
                    <div className="chg-tv-box hedge">🛡️ Hedge<br /><small>Futures offset</small></div>
                </div>
            </div>
        );
    }
    if (type === 'bl_timeline') {
        return (
            <div className="chg-tv-diagram">
                <div className="chg-tv-timeline">
                    <div className="chg-tv-tl-track">
                        <div className="chg-tv-tl-segment" style={{ width: '45%' }}>
                            <span className="chg-tv-tl-label">Pre-BL</span>
                        </div>
                        <div className="chg-tv-tl-marker bl">BL</div>
                        <div className="chg-tv-tl-segment pricing" style={{ width: '25%' }}>
                            <span className="chg-tv-tl-label">Pricing Window (5d)</span>
                        </div>
                        <div className="chg-tv-tl-segment" style={{ width: '30%' }}>
                            <span className="chg-tv-tl-label">Post-pricing</span>
                        </div>
                    </div>
                    <div className="chg-tv-tl-days">
                        <span>Day 1</span>
                        <span>Day 28</span>
                        <span>Day 30 (BL)</span>
                        <span>Day 32</span>
                        <span>Day 45</span>
                    </div>
                </div>
            </div>
        );
    }
    if (type === 'lots_calc') {
        return (
            <div className="chg-tv-diagram">
                <div className="chg-tv-calc">
                    <div className="chg-tv-calc-row">
                        <span className="chg-tv-calc-val">500,000 bbl</span>
                        <span className="chg-tv-calc-op">÷</span>
                        <span className="chg-tv-calc-val">1,000</span>
                        <span className="chg-tv-calc-op">=</span>
                        <span className="chg-tv-calc-result">500 lots</span>
                    </div>
                </div>
            </div>
        );
    }
    if (type === 'long_physical') {
        return (
            <div className="chg-tv-diagram">
                <div className="chg-tv-hedge-visual">
                    <div className="chg-tv-hv-row">
                        <div className="chg-tv-hv-box positive">📥 OWN cargo</div>
                        <div className="chg-tv-hv-plus">+</div>
                        <div className="chg-tv-hv-box negative">📉 SELL futures</div>
                        <div className="chg-tv-hv-equals">=</div>
                        <div className="chg-tv-hv-box neutral">🛡️ HEDGED</div>
                    </div>
                    <div className="chg-tv-hv-caption">
                        If prices ↓ → physical loses, futures gain ✓<br />
                        If prices ↑ → physical gains, futures lose ✓
                    </div>
                </div>
            </div>
        );
    }
    if (type === 'short_physical') {
        return (
            <div className="chg-tv-diagram">
                <div className="chg-tv-hedge-visual">
                    <div className="chg-tv-hv-row">
                        <div className="chg-tv-hv-box negative">📤 SOLD cargo</div>
                        <div className="chg-tv-hv-plus">+</div>
                        <div className="chg-tv-hv-box positive">📈 BUY futures</div>
                        <div className="chg-tv-hv-equals">=</div>
                        <div className="chg-tv-hv-box neutral">🛡️ HEDGED</div>
                    </div>
                    <div className="chg-tv-hv-caption">
                        If prices ↑ → purchase costs more, futures gain ✓<br />
                        If prices ↓ → purchase costs less, futures lose ✓
                    </div>
                </div>
            </div>
        );
    }
    if (type === 'month_selection') {
        return (
            <div className="chg-tv-diagram">
                <div className="chg-tv-months">
                    <div className="chg-tv-month-box">Feb<br /><small>Day 1–20</small></div>
                    <div className="chg-tv-month-box highlight">Mar<br /><small>Day 21–42</small><br /><em className="chg-tv-pricing-tag">← Pricing here!</em></div>
                    <div className="chg-tv-month-box">Apr<br /><small>Day 43–63</small></div>
                </div>
                <div className="chg-tv-hv-caption">BL Day 30 → Pricing Day 28–32 → All in March → Hedge in March</div>
            </div>
        );
    }
    if (type === 'contango') {
        return (
            <div className="chg-tv-diagram">
                <div className="chg-tv-curve-demo">
                    <div className="chg-tv-curve-label">Contango: Far months &gt; Near months</div>
                    <div className="chg-tv-curve-bars">
                        {[['Feb', 78], ['Mar', 79], ['Apr', 80], ['May', 81]].map(([m, p]) => (
                            <div key={m} className="chg-tv-cb-col">
                                <div className="chg-tv-cb-price">${p}</div>
                                <div className="chg-tv-cb-bar" style={{ height: `${(p - 76) * 20}px` }} />
                                <div className="chg-tv-cb-month">{m}</div>
                            </div>
                        ))}
                    </div>
                    <div className="chg-tv-curve-arrow contango">Roll Feb→Mar = COST $1/bbl ⚠</div>
                </div>
            </div>
        );
    }
    if (type === 'backwardation') {
        return (
            <div className="chg-tv-diagram">
                <div className="chg-tv-curve-demo">
                    <div className="chg-tv-curve-label">Backwardation: Near months &gt; Far months</div>
                    <div className="chg-tv-curve-bars">
                        {[['Feb', 81], ['Mar', 80], ['Apr', 79], ['May', 78]].map(([m, p]) => (
                            <div key={m} className="chg-tv-cb-col">
                                <div className="chg-tv-cb-price">${p}</div>
                                <div className="chg-tv-cb-bar backwardation" style={{ height: `${(p - 76) * 20}px` }} />
                                <div className="chg-tv-cb-month">{m}</div>
                            </div>
                        ))}
                    </div>
                    <div className="chg-tv-curve-arrow backwardation">Roll Feb→Mar = EARN $1/bbl ✅</div>
                </div>
            </div>
        );
    }
    return null;
}
