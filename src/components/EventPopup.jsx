import { useState, useCallback, useEffect } from 'react';
import useGameStore from '../state/gameStore.js';

const CATEGORY_COLORS = {
    geopolitical: { bg: '#7c3aed', label: 'GEOPOLITICAL' },
    opec: { bg: '#f59e0b', label: 'OPEC' },
    supply: { bg: '#22c55e', label: 'SUPPLY' },
    demand: { bg: '#3b82f6', label: 'DEMAND' },
    weather: { bg: '#06b6d4', label: 'WEATHER' },
    policy: { bg: '#f97316', label: 'POLICY' },
    data: { bg: '#94a3b8', label: 'DATA' },
};

// Educational info for each category — what it means in ticks and typical price yield
const CATEGORY_EDUCATION = {
    geopolitical: {
        emoji: '🌍',
        typicalRange: '$2–$6 per event',
        tickProfile: '40–70 tick drift after initial spike',
        description: 'Wars, sanctions, infrastructure attacks. Fastest movers — fear premium spikes instantly then decays. Physical actions (ship seizures, bombings) yield 5–6% moves; verbal threats yield 2–3%.',
        exitWindow: '20–50 ticks after event for spike trades',
        examples: [
            { event: 'Verbal threat (Hormuz closure)', move: '~4–5%', ticks: '~60 tick drift' },
            { event: 'Physical attack (infrastructure)', move: '~5–6%', ticks: '~70 tick drift' },
            { event: 'Diplomatic resolution', move: '~3–4% reversal', ticks: '~60 tick unwind' },
        ]
    },
    opec: {
        emoji: '🛢️',
        typicalRange: '$2–$5 per event',
        tickProfile: '45–80 tick drift, sustained momentum',
        description: 'OPEC production decisions are the most reliable movers. Cuts = bullish, increases = bearish. Size matters: measure in bbl/d vs global demand (~100m bbl/d). Coordinated actions amplify.',
        exitWindow: '30–60 ticks; OPEC moves tend to trend longer',
        examples: [
            { event: 'Price war (Saudi floods market)', move: '~6–7%', ticks: '~80 tick drift' },
            { event: 'Emergency production cut', move: '~5–6%', ticks: '~70 tick drift' },
            { event: 'Modest output adjustment', move: '~2–3%', ticks: '~45 tick drift' },
        ]
    },
    supply: {
        emoji: '⚙️',
        typicalRange: '$1–$3 per event',
        tickProfile: '30–50 tick drift, moderate',
        description: 'Production outages, well shut-ins, pipeline issues. Usually smaller moves than geopolitical or OPEC events, but important as reversal signals when they indicate price floors.',
        exitWindow: '20–40 ticks; supply events are moderate movers',
        examples: [
            { event: 'Shale producer shut-ins', move: '~1–2%', ticks: '~40 tick drift' },
            { event: 'Major pipeline disruption', move: '~2–3%', ticks: '~45 tick drift' },
            { event: 'Compliance verification data', move: '~2%', ticks: '~40 tick drift' },
        ]
    },
    demand: {
        emoji: '📊',
        typicalRange: '$1–$3 per event',
        tickProfile: '35–50 tick drift, gradual',
        description: 'Economic data, stimulus packages, consumption shifts. Demand events are slower-burning — they set the medium-term trend rather than causing sharp spikes. China demand = most important.',
        exitWindow: '30–50 ticks; demand shifts trend slowly',
        examples: [
            { event: 'China stimulus package', move: '~2–3%', ticks: '~45 tick drift' },
            { event: 'Economic slowdown data', move: '~2–3%', ticks: '~40 tick drift' },
            { event: 'Seasonal demand shift', move: '~1–2%', ticks: '~35 tick drift' },
        ]
    },
    weather: {
        emoji: '🌊',
        typicalRange: '$1–$4 per event',
        tickProfile: '30–60 tick drift, varies by severity',
        description: 'Hurricanes, extreme weather affecting Gulf of Mexico production or refining. Key trick: production disruption = crude bullish, refinery disruption = crude bearish (less demand at refining stage).',
        exitWindow: '25–50 ticks; weather events resolve faster',
        examples: [
            { event: 'Hurricane threatening production', move: '~3–4%', ticks: '~50 tick drift' },
            { event: 'Refinery outage from storm', move: '~2–3% bearish', ticks: '~40 tick drift' },
            { event: 'Weather clears / storm weakens', move: '~2% reversal', ticks: '~35 tick drift' },
        ]
    },
    policy: {
        emoji: '🏛️',
        typicalRange: '$1–$2 per event',
        tickProfile: '25–40 tick drift, short-lived',
        description: 'Government actions like SPR releases, sanctions, regulations. Usually smaller moves but carry signalling weight — they indicate governments want prices lower/higher.',
        exitWindow: '15–30 ticks; policy moves cap rallies rather than reverse them',
        examples: [
            { event: 'SPR release (30m barrels)', move: '~1–2%', ticks: '~30 tick drift' },
            { event: 'New sanctions announced', move: '~2–3%', ticks: '~40 tick drift' },
            { event: 'Regulatory change', move: '~1%', ticks: '~25 tick drift' },
        ]
    },
    data: {
        emoji: '📉',
        typicalRange: '$0.50–$1.50 per event',
        tickProfile: '20–30 tick drift, mild',
        description: 'Inventory reports, rig counts, trade data. Smallest movers individually, but they set background sentiment. Multiple data points in the same direction create a trend.',
        exitWindow: '15–25 ticks; data events are modest',
        examples: [
            { event: 'Weekly inventory draw', move: '~0.5–1%', ticks: '~20 tick drift' },
            { event: 'Rig count change', move: '~0.5%', ticks: '~20 tick drift' },
            { event: 'Monthly IEA/EIA report', move: '~1%', ticks: '~25 tick drift' },
        ]
    },
};

// Calculate the actual $ impact from the event's impact parameters
function calcImpactBreakdown(impact, currentPrice) {
    if (!impact) return null;

    const dir = impact.direction;
    const immediateMove = currentPrice * impact.immediatePct * dir;
    const driftMove = currentPrice * impact.driftPct * dir;
    const totalMove = immediateMove + driftMove;
    const totalPct = ((impact.immediatePct + impact.driftPct) * 100).toFixed(1);
    const driftTicks = impact.driftDecayTicks;
    const volLabel = impact.volatilityMultiplier >= 2.0 ? 'EXTREME'
        : impact.volatilityMultiplier >= 1.5 ? 'HIGH'
            : impact.volatilityMultiplier >= 1.2 ? 'MODERATE'
                : 'LOW';

    return {
        immediateMove: Math.abs(immediateMove).toFixed(2),
        immediatePct: (impact.immediatePct * 100).toFixed(1),
        driftMove: Math.abs(driftMove).toFixed(2),
        driftPct: (impact.driftPct * 100).toFixed(1),
        totalMove: Math.abs(totalMove).toFixed(2),
        totalPct,
        driftTicks,
        direction: dir > 0 ? '▲ UP' : dir < 0 ? '▼ DOWN' : '— FLAT',
        dirClass: dir > 0 ? 'bull' : dir < 0 ? 'bear' : 'neutral',
        volLabel,
        volMultiplier: impact.volatilityMultiplier.toFixed(1),
        noiseMultiplier: impact.noiseAmplifier.toFixed(1),
        perTickDrift: Math.abs((currentPrice * impact.driftPct) / driftTicks).toFixed(3),
    };
}

export default function EventPopup() {
    const pendingEvent = useGameStore(s => s.pendingEvent);
    const pendingEventTrade = useGameStore(s => s.pendingEventTrade);
    const executeTrade = useGameStore(s => s.executeTrade);
    const recordPendingEventTrade = useGameStore(s => s.recordPendingEventTrade);
    const dismissPendingEvent = useGameStore(s => s.dismissPendingEvent);
    const bidPrice = useGameStore(s => s.bidPrice);
    const askPrice = useGameStore(s => s.askPrice);
    const position = useGameStore(s => s.position);
    const gameMode = useGameStore(s => s.gameMode);
    const currentPrice = useGameStore(s => s.currentPrice);

    const isLearning = gameMode === 'learning';

    const [phase, setPhase] = useState('decide'); // 'decide' | 'feedback'
    const [selectedAction, setSelectedAction] = useState(null);
    const [showCatGuide, setShowCatGuide] = useState(false);

    // Reset phase when new event appears
    useEffect(() => {
        if (pendingEvent) {
            setPhase('decide');
            setSelectedAction(null);
            setShowCatGuide(false);
        }
    }, [pendingEvent]);

    const handleTrade = useCallback((side, lots) => {
        const success = executeTrade(side, lots);
        if (success) {
            recordPendingEventTrade(side, lots);
            setSelectedAction({ side, lots });
            if (isLearning) {
                setPhase('feedback');
            } else {
                // Trading mode: dismiss immediately after trade
                dismissPendingEvent();
            }
        }
    }, [executeTrade, recordPendingEventTrade, isLearning, dismissPendingEvent]);

    const handleSkip = useCallback(() => {
        recordPendingEventTrade('skip', 0);
        setSelectedAction({ side: 'skip', lots: 0 });
        if (isLearning) {
            setPhase('feedback');
        } else {
            dismissPendingEvent();
        }
    }, [recordPendingEventTrade, isLearning, dismissPendingEvent]);

    const handleFlatten = useCallback(() => {
        if (position !== 0) {
            const side = position > 0 ? 'sell' : 'buy';
            const lots = Math.abs(position);
            executeTrade(side, lots);
            recordPendingEventTrade('flatten', lots);
            setSelectedAction({ side: 'flatten', lots });
        } else {
            recordPendingEventTrade('skip', 0);
            setSelectedAction({ side: 'skip', lots: 0 });
        }
        if (isLearning) {
            setPhase('feedback');
        } else {
            dismissPendingEvent();
        }
    }, [position, executeTrade, recordPendingEventTrade, isLearning, dismissPendingEvent]);

    const handleDismiss = useCallback(() => {
        dismissPendingEvent();
    }, [dismissPendingEvent]);

    // Keyboard shortcuts
    useEffect(() => {
        if (!pendingEvent) return;

        const handleKey = (e) => {
            if (phase === 'feedback') {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                    e.preventDefault();
                    handleDismiss();
                }
                return;
            }

            // In decide phase
            if (e.key === 'b' || e.key === 'B') {
                e.preventDefault();
                const lots = e.shiftKey ? 5 : e.ctrlKey || e.metaKey ? 10 : 1;
                handleTrade('buy', lots);
            } else if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                const lots = e.shiftKey ? 5 : e.ctrlKey || e.metaKey ? 10 : 1;
                handleTrade('sell', lots);
            } else if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                handleFlatten();
            } else if (e.key === 'Escape' || e.key === 'n' || e.key === 'N') {
                e.preventDefault();
                handleSkip();
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [pendingEvent, phase, handleTrade, handleSkip, handleFlatten, handleDismiss]);

    if (!pendingEvent) return null;

    const cat = CATEGORY_COLORS[pendingEvent.category] || { bg: '#64748b', label: pendingEvent.category?.toUpperCase() };
    const direction = pendingEvent.impact?.direction;
    const strategy = pendingEvent.strategy;
    const catEdu = CATEGORY_EDUCATION[pendingEvent.category];
    const impactBreakdown = calcImpactBreakdown(pendingEvent.impact, currentPrice);

    // Grade the player's response
    const getGrade = () => {
        if (!selectedAction || !strategy) return null;

        const { side } = selectedAction;

        if (side === 'skip') {
            const optimalAction = strategy.action.toUpperCase();
            if (optimalAction.includes('NOTHING') || optimalAction.includes('HOLD') || optimalAction.includes('STAY')) {
                return { grade: '✅', label: 'CORRECT — No trade was the right call', color: '#22c55e' };
            }
            return { grade: '❌', label: 'MISSED — You should have traded', color: '#ef4444' };
        }

        if (side === 'flatten') {
            const optimalAction = strategy.action.toUpperCase();
            if (optimalAction.includes('FLATTEN') || optimalAction.includes('CLOSE') || optimalAction.includes('TAKE PROFIT')) {
                return { grade: '✅', label: 'CORRECT — Flattening was right', color: '#22c55e' };
            }
            return { grade: '⚠️', label: 'PARTIAL — Flattening wasn\'t optimal here', color: '#eab308' };
        }

        const playerBullish = side === 'buy';
        const eventBullish = direction > 0;
        const eventBearish = direction < 0;

        if ((playerBullish && eventBullish) || (!playerBullish && eventBearish)) {
            return { grade: '✅', label: 'CORRECT DIRECTION — Well read!', color: '#22c55e' };
        }

        if (direction === 0) {
            return { grade: '⚠️', label: 'NEUTRAL EVENT — Risky to trade on this', color: '#eab308' };
        }

        return { grade: '❌', label: 'WRONG DIRECTION — Study the reasoning below', color: '#ef4444' };
    };

    const grade = phase === 'feedback' ? getGrade() : null;

    return (
        <div className="event-popup-overlay">
            <div className={`event-popup-modal ${phase}`}>

                {/* Mode Badge */}
                <div className="event-popup-mode-badge">
                    {isLearning ? '🎓 LEARNING MODE' : '⚡ TRADING MODE'}
                </div>

                {/* Category & Direction Badge */}
                <div className="event-popup-badges">
                    <span className="event-popup-category" style={{ background: cat.bg + '25', color: cat.bg, borderColor: cat.bg + '60' }}>
                        {cat.label}
                    </span>
                    <span className={`event-popup-direction ${direction > 0 ? 'bull' : direction < 0 ? 'bear' : 'neutral'}`}>
                        {direction > 0 ? '▲ BULLISH' : direction < 0 ? '▼ BEARISH' : '— NEUTRAL'}
                    </span>
                    <span className="event-popup-tick">Tick {pendingEvent.tick}</span>
                </div>

                {/* Headline */}
                <h1 className="event-popup-headline">{pendingEvent.headline}</h1>

                {/* Detail */}
                {pendingEvent.detail && (
                    <p className="event-popup-detail">{pendingEvent.detail}</p>
                )}

                {/* === IMPACT ANATOMY (Learning Mode, decide phase) === */}
                {isLearning && phase === 'decide' && impactBreakdown && (
                    <div className="impact-anatomy">
                        <div className="impact-anatomy-header">
                            <span className="impact-anatomy-title">📐 Impact Anatomy</span>
                            {catEdu && (
                                <button
                                    className="impact-cat-guide-btn"
                                    onClick={() => setShowCatGuide(!showCatGuide)}
                                >
                                    {showCatGuide ? '▾ Hide' : '▸ Show'} {cat.label} Guide
                                </button>
                            )}
                        </div>
                        <div className="impact-anatomy-grid">
                            <div className="impact-stat">
                                <span className="impact-stat-label">Instant Jump</span>
                                <span className={`impact-stat-value ${impactBreakdown.dirClass}`}>
                                    {impactBreakdown.direction} ${impactBreakdown.immediateMove}
                                </span>
                                <span className="impact-stat-sub">{impactBreakdown.immediatePct}% immediate</span>
                            </div>
                            <div className="impact-stat">
                                <span className="impact-stat-label">Drift</span>
                                <span className={`impact-stat-value ${impactBreakdown.dirClass}`}>
                                    +${impactBreakdown.driftMove} over {impactBreakdown.driftTicks} ticks
                                </span>
                                <span className="impact-stat-sub">~${impactBreakdown.perTickDrift}/tick</span>
                            </div>
                            <div className="impact-stat">
                                <span className="impact-stat-label">Total Move</span>
                                <span className={`impact-stat-value ${impactBreakdown.dirClass} total`}>
                                    ~${impactBreakdown.totalMove} ({impactBreakdown.totalPct}%)
                                </span>
                                <span className="impact-stat-sub">instant + drift combined</span>
                            </div>
                            <div className="impact-stat">
                                <span className="impact-stat-label">Volatility</span>
                                <span className={`impact-stat-value vol-${impactBreakdown.volLabel.toLowerCase()}`}>
                                    {impactBreakdown.volLabel} ({impactBreakdown.volMultiplier}×)
                                </span>
                                <span className="impact-stat-sub">noise: {impactBreakdown.noiseMultiplier}×</span>
                            </div>
                        </div>

                        {/* Expandable category guide */}
                        {showCatGuide && catEdu && (
                            <div className="impact-cat-guide">
                                <div className="cat-guide-header">
                                    <span className="cat-guide-emoji">{catEdu.emoji}</span>
                                    <div>
                                        <div className="cat-guide-title">{cat.label} Events</div>
                                        <div className="cat-guide-range">Typical range: {catEdu.typicalRange}</div>
                                    </div>
                                </div>
                                <p className="cat-guide-desc">{catEdu.description}</p>
                                <div className="cat-guide-meta">
                                    <span>⏱ Drift: {catEdu.tickProfile}</span>
                                    <span>🚪 Exit window: {catEdu.exitWindow}</span>
                                </div>
                                <div className="cat-guide-examples">
                                    <span className="cat-guide-examples-title">Typical Moves:</span>
                                    <table className="cat-example-table">
                                        <thead>
                                            <tr>
                                                <th>Event Type</th>
                                                <th>Move</th>
                                                <th>Drift</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {catEdu.examples.map((ex, i) => (
                                                <tr key={i}>
                                                    <td>{ex.event}</td>
                                                    <td className={impactBreakdown.dirClass}>{ex.move}</td>
                                                    <td>{ex.ticks}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Current Position Info */}
                <div className="event-popup-position">
                    <span>Current Position: <strong className={position > 0 ? 'long' : position < 0 ? 'short' : 'flat'}>
                        {position === 0 ? 'FLAT' : `${position > 0 ? 'LONG' : 'SHORT'} ${Math.abs(position)} lots`}
                    </strong></span>
                    <span>Bid: <strong>${bidPrice.toFixed(2)}</strong></span>
                    <span>Ask: <strong>${askPrice.toFixed(2)}</strong></span>
                </div>

                {/* ===== DECIDE PHASE ===== */}
                {phase === 'decide' && (
                    <div className="event-popup-actions">
                        <div className="event-popup-action-label">
                            {isLearning ? "What's your trade?" : "⚡ Trade fast — clock is running!"}
                        </div>

                        <div className="event-popup-trade-row">
                            <div className="event-popup-trade-group">
                                <span className="event-popup-group-label buy-label">BUY (Long)</span>
                                <div className="event-popup-btn-row">
                                    <button className="ep-btn buy" onClick={() => handleTrade('buy', 1)}>B×1</button>
                                    <button className="ep-btn buy" onClick={() => handleTrade('buy', 3)}>B×3</button>
                                    <button className="ep-btn buy" onClick={() => handleTrade('buy', 5)}>B×5</button>
                                    <button className="ep-btn buy" onClick={() => handleTrade('buy', 10)}>B×10</button>
                                </div>
                            </div>

                            <div className="event-popup-trade-group">
                                <span className="event-popup-group-label sell-label">SELL (Short)</span>
                                <div className="event-popup-btn-row">
                                    <button className="ep-btn sell" onClick={() => handleTrade('sell', 1)}>S×1</button>
                                    <button className="ep-btn sell" onClick={() => handleTrade('sell', 3)}>S×3</button>
                                    <button className="ep-btn sell" onClick={() => handleTrade('sell', 5)}>S×5</button>
                                    <button className="ep-btn sell" onClick={() => handleTrade('sell', 10)}>S×10</button>
                                </div>
                            </div>
                        </div>

                        <div className="event-popup-alt-actions">
                            {position !== 0 && (
                                <button className="ep-btn flatten" onClick={handleFlatten}>
                                    ⚡ Flatten Position
                                </button>
                            )}
                            <button className="ep-btn skip" onClick={handleSkip}>
                                ⏭ No Trade (Skip)
                            </button>
                        </div>

                        <div className="event-popup-kbd-hints">
                            <span><kbd>B</kbd> Buy 1  <kbd>⇧B</kbd> Buy 5  <kbd>⌘B</kbd> Buy 10</span>
                            <span><kbd>S</kbd> Sell 1  <kbd>⇧S</kbd> Sell 5  <kbd>⌘S</kbd> Sell 10</span>
                            <span><kbd>F</kbd> Flatten  <kbd>N</kbd> / <kbd>Esc</kbd> Skip</span>
                        </div>
                    </div>
                )}

                {/* ===== FEEDBACK PHASE (Learning Mode only) ===== */}
                {phase === 'feedback' && strategy && isLearning && (
                    <div className="event-popup-feedback">
                        {/* Grade */}
                        {grade && (
                            <div className="event-popup-grade" style={{ background: grade.color + '15', borderColor: grade.color + '40' }}>
                                <span className="grade-icon">{grade.grade}</span>
                                <span className="grade-text" style={{ color: grade.color }}>{grade.label}</span>
                            </div>
                        )}

                        {/* What you did */}
                        {selectedAction && (
                            <div className="event-popup-your-action">
                                <span className="feedback-label">YOUR ACTION</span>
                                <span className="feedback-value">
                                    {selectedAction.side === 'skip' ? '⏭ No Trade'
                                        : selectedAction.side === 'flatten' ? `⚡ Flattened ${selectedAction.lots} lots`
                                            : `${selectedAction.side === 'buy' ? '🟢 BOUGHT' : '🔴 SOLD'} ${selectedAction.lots} lots @ $${(selectedAction.side === 'buy' ? askPrice : bidPrice).toFixed(2)}`}
                                </span>
                            </div>
                        )}

                        {/* Impact breakdown in feedback */}
                        {impactBreakdown && (
                            <div className="feedback-impact-summary">
                                <span className="feedback-label">📐 THIS EVENT'S IMPACT IN TICKS</span>
                                <div className="feedback-impact-row">
                                    <span className={`fis-item ${impactBreakdown.dirClass}`}>
                                        Instant: {impactBreakdown.direction} ${impactBreakdown.immediateMove} ({impactBreakdown.immediatePct}%)
                                    </span>
                                    <span className="fis-sep">→</span>
                                    <span className={`fis-item ${impactBreakdown.dirClass}`}>
                                        Drift: +${impactBreakdown.driftMove} over {impactBreakdown.driftTicks} ticks (~${impactBreakdown.perTickDrift}/tick)
                                    </span>
                                    <span className="fis-sep">→</span>
                                    <span className={`fis-item total ${impactBreakdown.dirClass}`}>
                                        Total: ~${impactBreakdown.totalMove} ({impactBreakdown.totalPct}%)
                                    </span>
                                </div>
                                <div className="feedback-impact-meta">
                                    Volatility: {impactBreakdown.volLabel} ({impactBreakdown.volMultiplier}×)
                                    · Exit window: ~{Math.round(impactBreakdown.driftTicks * 0.6)}–{impactBreakdown.driftTicks} ticks after this event
                                </div>
                            </div>
                        )}

                        {/* Optimal strategy */}
                        <div className="event-popup-optimal">
                            <div className="feedback-block optimal">
                                <span className="feedback-label">✅ OPTIMAL ACTION</span>
                                <span className="feedback-value">{strategy.action}</span>
                            </div>

                            <div className="feedback-block reasoning">
                                <span className="feedback-label">🧠 WHY</span>
                                <span className="feedback-value">{strategy.reasoning}</span>
                            </div>

                            <div className="feedback-block effect">
                                <span className="feedback-label">📈 EXPECTED PRICE EFFECT</span>
                                <span className="feedback-value">{strategy.expectedEffect}</span>
                            </div>

                            <div className="feedback-block principle">
                                <span className="feedback-label">📖 TRADING PRINCIPLE</span>
                                <span className="feedback-value highlight">{strategy.principle}</span>
                            </div>

                            <div className="feedback-block risk">
                                <span className="feedback-label">⚠️ RISK NOTE</span>
                                <span className="feedback-value">{strategy.riskNote}</span>
                            </div>
                        </div>

                        <button className="ep-btn continue" onClick={handleDismiss}>
                            Continue Trading → <kbd>Enter</kbd>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
