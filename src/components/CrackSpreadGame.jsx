import { useState, useEffect, useRef, useCallback } from 'react';
import { CrackSpreadEngine } from '../engine/CrackSpreadEngine.js';
import { crackSpreadScenarios } from '../engine/crackSpreadScenarios.js';
import useCareerStore from '../state/careerStore.js';

const LOT_SIZE = 1000;
const CRACK_TYPES = [
    { key: 'gasCrack', label: 'Gas Crack', desc: 'Gasoline − Crude', color: '#66bb6a' },
    { key: 'dieselCrack', label: 'Diesel Crack', desc: 'Diesel − Crude', color: '#42a5f5' },
    { key: 'crack321', label: '3-2-1 Crack', desc: '(2×Gas + Diesel)/3 − Crude', color: '#ce93d8' },
];

// ─── Crack Spread Time Series Chart ──────────────────
function CrackChart({ history, width = 560, height = 220 }) {
    if (history.length < 2) {
        return (
            <div className="csg-chart-empty">Collecting crack spread data…</div>
        );
    }

    const PAD = { t: 16, r: 20, b: 28, l: 50 };
    const plotW = width - PAD.l - PAD.r;
    const plotH = height - PAD.t - PAD.b;

    // Gather all crack values for Y-axis scaling
    const allVals = history.flatMap(h => [h.gasCrack, h.dieselCrack, h.crack321]);
    const minV = Math.min(...allVals) - 1;
    const maxV = Math.max(...allVals) + 1;
    const rangeV = maxV - minV || 1;

    const xOf = i => PAD.l + (i / (history.length - 1)) * plotW;
    const yOf = v => PAD.t + (1 - (v - minV) / rangeV) * plotH;

    const makePath = (key) =>
        history.map((h, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(h[key]).toFixed(1)}`).join(' ');

    // Y-axis ticks
    const yTicks = [];
    const step = rangeV > 20 ? 5 : rangeV > 10 ? 2 : 1;
    for (let v = Math.ceil(minV / step) * step; v <= maxV; v += step) {
        yTicks.push(v);
    }

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="csg-chart-svg">
            {/* Grid */}
            {yTicks.map(v => (
                <g key={v}>
                    <line x1={PAD.l} y1={yOf(v)} x2={width - PAD.r} y2={yOf(v)} stroke="rgba(255,255,255,0.06)" />
                    <text x={PAD.l - 6} y={yOf(v) + 4} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="10">${v.toFixed(0)}</text>
                </g>
            ))}

            {/* Zero line if in range */}
            {minV <= 0 && maxV >= 0 && (
                <line x1={PAD.l} y1={yOf(0)} x2={width - PAD.r} y2={yOf(0)} stroke="rgba(255,255,255,0.15)" strokeDasharray="4 3" />
            )}

            {/* Crack lines */}
            {CRACK_TYPES.map(ct => (
                <path key={ct.key} d={makePath(ct.key)} fill="none" stroke={ct.color} strokeWidth="1.8" strokeLinejoin="round" />
            ))}

            {/* Current value labels (right edge) */}
            {CRACK_TYPES.map(ct => {
                const last = history[history.length - 1][ct.key];
                return (
                    <text key={ct.key + '_lbl'} x={width - PAD.r + 4} y={yOf(last) + 3} fill={ct.color}
                        fontSize="9" fontWeight="600">{last.toFixed(1)}</text>
                );
            })}

            {/* Legend */}
            {CRACK_TYPES.map((ct, i) => (
                <g key={ct.key + '_leg'} transform={`translate(${PAD.l + i * 140}, ${height - 6})`}>
                    <line x1="0" y1="-4" x2="16" y2="-4" stroke={ct.color} strokeWidth="2" />
                    <text x="20" y="0" fill="rgba(255,255,255,0.5)" fontSize="9">{ct.label}</text>
                </g>
            ))}
        </svg>
    );
}

// ─── Event Popup ──────────────────────────────────────
function CrackEventPopup({ event, onDismiss, gameMode, prices, cracks }) {
    return (
        <div className="csg-event-overlay">
            <div className="csg-event-modal">
                <div className="csg-event-badge">{event.category?.toUpperCase()}</div>
                <h3 className="csg-event-headline">{event.headline}</h3>
                <p className="csg-event-detail">{event.detail}</p>

                {/* Live prices and cracks */}
                <div className="csg-event-prices">
                    <div className="csg-ep-product">
                        <span className="csg-ep-label">🛢 Crude</span>
                        <span className="csg-ep-val">${prices.crude?.toFixed(2)}</span>
                    </div>
                    <div className="csg-ep-product">
                        <span className="csg-ep-label" style={{ color: '#66bb6a' }}>⛽ Gasoline</span>
                        <span className="csg-ep-val">${prices.gasoline?.toFixed(2)}</span>
                    </div>
                    <div className="csg-ep-product">
                        <span className="csg-ep-label" style={{ color: '#42a5f5' }}>🚛 Diesel</span>
                        <span className="csg-ep-val">${prices.diesel?.toFixed(2)}</span>
                    </div>
                </div>
                <div className="csg-event-cracks">
                    {CRACK_TYPES.map(ct => (
                        <div key={ct.key} className="csg-ec-item" style={{ borderColor: ct.color }}>
                            <span className="csg-ec-name">{ct.label}</span>
                            <span className="csg-ec-val">${cracks[ct.key]?.toFixed(2)}/bbl</span>
                        </div>
                    ))}
                </div>

                {gameMode === 'learning' && event.strategy && (
                    <div className="csg-event-strategy">
                        <div className="csg-es-row"><strong>Action:</strong> {event.strategy.action}</div>
                        <div className="csg-es-row"><strong>Reasoning:</strong> {event.strategy.reasoning}</div>
                        <div className="csg-es-row csg-es-principle"><strong>Principle:</strong> {event.strategy.principle}</div>
                        {event.strategy.riskNote && <div className="csg-es-row csg-es-risk">⚠️ {event.strategy.riskNote}</div>}
                    </div>
                )}

                <button className="csg-event-dismiss" onClick={onDismiss}>
                    {gameMode === 'learning' ? 'Trade & Continue ▸' : 'Continue ▸'}
                </button>
            </div>
        </div>
    );
}

// ─── Score Card ───────────────────────────────────────
function CrackScoreCard({ trades, positions, cracks, avgEntries, realisedPnL, startCracks, onBack }) {
    let totalUnrealised = 0;
    const crackPnLs = {};
    CRACK_TYPES.forEach(ct => {
        const pos = positions[ct.key] || 0;
        const entry = avgEntries[ct.key] || 0;
        const curr = cracks[ct.key] || 0;
        const unr = pos !== 0 ? (curr - entry) * pos * LOT_SIZE : 0;
        crackPnLs[ct.key] = unr;
        totalUnrealised += unr;
    });
    const totalPnL = realisedPnL + totalUnrealised;
    const grade = totalPnL > 50000 ? 'A' : totalPnL > 20000 ? 'B' : totalPnL > 0 ? 'C' : totalPnL > -20000 ? 'D' : 'F';

    return (
        <div className="csg-event-overlay">
            <div className="csg-score-modal">
                <h2 className="csg-score-title">Crack Spread Trading Report</h2>
                <div className="csg-score-grade-row">
                    <div className={`ftg-score-grade ${grade}`}>{grade}</div>
                    <div className="ftg-score-pnl-block">
                        <span className="ftg-score-pnl-label">Total P&L</span>
                        <span className={`ftg-score-pnl-val ${totalPnL >= 0 ? 'pos' : 'neg'}`}>
                            ${totalPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                </div>

                <div className="ftg-score-sections">
                    <div className="ftg-score-section">
                        <h4>Realised P&L</h4>
                        <span className={realisedPnL >= 0 ? 'pos' : 'neg'}>${realisedPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="ftg-score-section">
                        <h4>Unrealised P&L</h4>
                        <span className={totalUnrealised >= 0 ? 'pos' : 'neg'}>${totalUnrealised.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="ftg-score-section">
                        <h4>Total Trades</h4>
                        <span>{trades.length}</span>
                    </div>
                </div>

                <h4 style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Crack Spread Movement</h4>
                <div className="csg-score-crack-grid">
                    {CRACK_TYPES.map(ct => (
                        <div key={ct.key} className="csg-score-crack-cell" style={{ borderLeftColor: ct.color }}>
                            <span className="csg-scc-name">{ct.label}</span>
                            <span className="csg-scc-start">${startCracks[ct.key]?.toFixed(2)}</span>
                            <span className="csg-scc-arrow">→</span>
                            <span className="csg-scc-end">${cracks[ct.key]?.toFixed(2)}</span>
                            <span className={`csg-scc-chg ${(cracks[ct.key] - startCracks[ct.key]) >= 0 ? 'pos' : 'neg'}`}>
                                {(cracks[ct.key] - startCracks[ct.key]) >= 0 ? '+' : ''}{(cracks[ct.key] - startCracks[ct.key]).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>

                {trades.length > 0 && (
                    <>
                        <h4 style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Trade Log</h4>
                        <div className="ftg-score-trades">
                            <table>
                                <thead>
                                    <tr><th>Tick</th><th>Crack</th><th>Side</th><th>Lots</th><th>Spread</th></tr>
                                </thead>
                                <tbody>
                                    {trades.map((t, i) => (
                                        <tr key={i}>
                                            <td>{t.tick}</td>
                                            <td>{t.crackLabel}</td>
                                            <td className={t.side === 'BUY' ? 'pos' : 'neg'}>{t.side}</td>
                                            <td>{t.lots}</td>
                                            <td>${t.spread.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                <button className="ftg-back-btn" onClick={onBack} style={{ marginTop: '20px', width: '100%' }}>
                    ← Back to Menu
                </button>
            </div>
        </div>
    );
}


// ═══════════════════════════════════════════════════════
// ═══ MAIN CRACK SPREAD GAME COMPONENT ═════════════════
// ═══════════════════════════════════════════════════════
export default function CrackSpreadGame({ onBack }) {
    const [phase, setPhase] = useState('menu');
    const [scenario, setScenario] = useState(null);
    const [gameMode, setGameMode] = useState('learning');

    const [tick, setTick] = useState(0);
    const [prices, setPrices] = useState({ crude: 0, gasoline: 0, diesel: 0 });
    const [cracks, setCracks] = useState({ gasCrack: 0, dieselCrack: 0, crack321: 0 });
    const [startCracks, setStartCracks] = useState({ gasCrack: 0, dieselCrack: 0, crack321: 0 });
    const [crackHistory, setCrackHistory] = useState([]);
    const [positions, setPositions] = useState({ gasCrack: 0, dieselCrack: 0, crack321: 0 });
    const [avgEntries, setAvgEntries] = useState({ gasCrack: 0, dieselCrack: 0, crack321: 0 });
    const [selectedCrack, setSelectedCrack] = useState('gasCrack');
    const [lotSize, setLotSize] = useState(5);
    const [realisedPnL, setRealisedPnL] = useState(0);
    const [trades, setTrades] = useState([]);
    const [newsItems, setNewsItems] = useState([]);
    const [pendingEvent, setPendingEvent] = useState(null);
    const [speed, setSpeed] = useState(1);

    const engineRef = useRef(null);
    const timerRef = useRef(null);
    const eventIndexRef = useRef(0);
    const noiseTimerRef = useRef(0);

    // ─── Start game ───────────────────────────────────
    const startGame = useCallback((sc, mode) => {
        const engine = new CrackSpreadEngine({
            crudePrice: sc.crudePrice,
            gasolinePrice: sc.gasolinePrice,
            dieselPrice: sc.dieselPrice,
            volatility: sc.volatility,
        });
        engineRef.current = engine;
        eventIndexRef.current = 0;
        noiseTimerRef.current = 0;

        setPrices(engine.getPrices());
        setCracks(engine.getCracks());
        setStartCracks(engine.getStartCracks());
        setCrackHistory([engine.getCracks()]);
        setPositions({ gasCrack: 0, dieselCrack: 0, crack321: 0 });
        setAvgEntries({ gasCrack: 0, dieselCrack: 0, crack321: 0 });
        setSelectedCrack('gasCrack');
        setRealisedPnL(0);
        setTrades([]);
        setNewsItems([]);
        setPendingEvent(null);
        setTick(0);
        setSpeed(1);
        setGameMode(mode);
        setScenario(sc);
        setPhase('playing');
    }, []);

    // ─── Game loop ────────────────────────────────────
    useEffect(() => {
        if (phase !== 'playing' || pendingEvent) return;
        const engine = engineRef.current;
        if (!engine || !scenario) return;

        const interval = speed === 1 ? 220 : speed === 2 ? 120 : 60;

        timerRef.current = setInterval(() => {
            setTick(prev => {
                const nextTick = prev + 1;
                if (nextTick >= scenario.totalTicks) {
                    clearInterval(timerRef.current);
                    setPhase('finished');
                    return nextTick;
                }

                const newPrices = engine.tick();
                const newCracks = engine.getCracks();
                setPrices(newPrices);
                setCracks(newCracks);
                setCrackHistory(h => {
                    const next = [...h, newCracks];
                    return next.length > 250 ? next.slice(-250) : next;
                });

                // Check events
                const events = scenario.events || [];
                if (eventIndexRef.current < events.length && nextTick >= events[eventIndexRef.current].tick) {
                    const ev = events[eventIndexRef.current];
                    eventIndexRef.current++;
                    const impacted = engine.applyEvent(ev.impact);
                    const impactedCracks = engine.getCracks();
                    setPrices(impacted);
                    setCracks(impactedCracks);
                    setNewsItems(items => [{ tick: nextTick, headline: ev.headline, isEvent: true, category: ev.category }, ...items].slice(0, 50));
                    setPendingEvent(ev);
                    clearInterval(timerRef.current);
                }

                // Noise events
                noiseTimerRef.current++;
                const noiseConfig = scenario.noiseEvents?.[0];
                if (noiseConfig && noiseTimerRef.current >= noiseConfig.frequency) {
                    noiseTimerRef.current = 0;
                    if (nextTick >= noiseConfig.tickRange[0] && nextTick <= noiseConfig.tickRange[1]) {
                        const pool = noiseConfig.pool;
                        const headline = pool[Math.floor(Math.random() * pool.length)];
                        setNewsItems(items => [{ tick: nextTick, headline, isEvent: false }, ...items].slice(0, 50));
                    }
                }

                return nextTick;
            });
        }, interval);

        return () => clearInterval(timerRef.current);
    }, [phase, pendingEvent, speed, scenario]);

    // ─── Career Integration ────────────────────────────────
    const careerUpdatedRef = useRef(false);

    useEffect(() => {
        if (phase === 'finished' && scenario && !careerUpdatedRef.current) {
            careerUpdatedRef.current = true;

            // Recalculate Total PnL here to be safe
            let currentUnrealised = 0;
            CRACK_TYPES.forEach(ct => {
                const pos = positions[ct.key];
                const unr = pos !== 0 ? (cracks[ct.key] - avgEntries[ct.key]) * pos * LOT_SIZE : 0;
                currentUnrealised += unr;
            });
            const totalPnL = realisedPnL + currentUnrealised;

            const career = useCareerStore.getState();
            let earnedXp = 600; // Base for crack spread
            if (totalPnL > 0) earnedXp += 300;
            if (totalPnL > 50000) earnedXp += 400;

            career.addXp(earnedXp);
            career.recordSession(totalPnL, trades.length, scenario.id);
        }
        if (phase !== 'finished') {
            careerUpdatedRef.current = false;
        }
    }, [phase, scenario, positions, cracks, realisedPnL, avgEntries, trades]);

    // ─── Trading ──────────────────────────────────────
    const executeTrade = useCallback((side) => {
        if (phase !== 'playing') return;
        const crackKey = selectedCrack;
        const spread = cracks[crackKey];
        const lots = side === 'BUY' ? lotSize : -lotSize;

        setPositions(prev => {
            const prevPos = prev[crackKey];
            const newPos = prevPos + lots;

            // Realised P&L if reducing
            if (prevPos !== 0 && Math.sign(lots) !== Math.sign(prevPos)) {
                const closedLots = Math.min(Math.abs(prevPos), Math.abs(lots));
                const pnl = (spread - avgEntries[crackKey]) * (prevPos > 0 ? 1 : -1) * closedLots * LOT_SIZE;
                setRealisedPnL(r => r + pnl);
            }

            // Update average entry
            setAvgEntries(ae => {
                const nextAe = { ...ae };
                if (newPos === 0) {
                    nextAe[crackKey] = 0;
                } else if (prevPos === 0) {
                    nextAe[crackKey] = spread;
                } else if (Math.sign(newPos) === Math.sign(prevPos)) {
                    // Only update average entry if adding to position
                    if (Math.abs(newPos) > Math.abs(prevPos)) {
                        nextAe[crackKey] = (ae[crackKey] * Math.abs(prevPos) + spread * Math.abs(lots)) / Math.abs(newPos);
                    }
                    // If reducing position, average entry stays the same
                } else {
                    nextAe[crackKey] = spread;
                }
                return nextAe;
            });

            return { ...prev, [crackKey]: newPos };
        });

        const ct = CRACK_TYPES.find(c => c.key === crackKey);
        setTrades(prev => [...prev, { tick, crackKey, crackLabel: ct?.label || crackKey, side, lots: lotSize, spread }]);
    }, [phase, selectedCrack, cracks, lotSize, tick, avgEntries]);

    // ─── Computed ─────────────────────────────────────
    let totalUnrealised = 0;
    const crackUnrealised = {};
    CRACK_TYPES.forEach(ct => {
        const pos = positions[ct.key];
        const unr = pos !== 0 ? (cracks[ct.key] - avgEntries[ct.key]) * pos * LOT_SIZE : 0;
        crackUnrealised[ct.key] = unr;
        totalUnrealised += unr;
    });
    const totalPnL = realisedPnL + totalUnrealised;

    // ═══ RENDER ═══════════════════════════════════════

    // ─── Menu ─────────────────────────────────────────
    if (phase === 'menu') {
        return (
            <div className="ftg-container">
                <button className="ftg-back-btn" onClick={onBack}>← Back to Main Menu</button>
                <h1 className="ftg-title" style={{ color: '#ff8a65' }}>🔥 Crack Spread Trading</h1>
                <p className="ftg-subtitle">
                    Trade the refining margin — the spread between crude and products.<br />
                    BUY crack = profit when products rise vs crude (margins widen).<br />
                    SELL crack = profit when crude rises vs products (margins narrow).<br />
                    <em>Master the relationship between crude, gasoline, and diesel.</em>
                </p>

                <div className="ftg-scenario-grid">
                    {crackSpreadScenarios.map(sc => (
                        <div key={sc.id} className="ftg-scenario-card" onClick={() => { setScenario(sc); setPhase('modeSelect'); }}>
                            <div className="ftg-sc-header">
                                <span className="ftg-sc-name">{sc.name}</span>
                                <span className={`difficulty-badge ${sc.difficulty.toLowerCase().replace(' ', '-')}`}>{sc.difficulty}</span>
                            </div>
                            <p className="ftg-sc-desc">{sc.description}</p>
                            <div className="ftg-sc-meta">
                                <span>📊 {sc.events.length} events</span>
                                <span>⏱ {sc.totalTicks} ticks</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // ─── Mode Select ──────────────────────────────────
    if (phase === 'modeSelect') {
        return (
            <div className="ftg-container">
                <div className="mode-picker-overlay" style={{ position: 'relative', background: 'transparent' }}>
                    <div className="mode-picker-modal">
                        <button className="mode-picker-close" onClick={() => setPhase('menu')}>✕</button>
                        <div className="mode-picker-scenario">
                            <span className="mode-picker-scenario-name">{scenario.name}</span>
                            <span className={`difficulty-badge ${scenario.difficulty.toLowerCase().replace(' ', '-')}`}>{scenario.difficulty}</span>
                        </div>
                        <h2 className="mode-picker-title">Choose Your Mode</h2>
                        <div className="mode-picker-cards">
                            <div className="mode-card learning" onClick={() => startGame(scenario, 'learning')}>
                                <div className="mode-card-icon">🎓</div>
                                <div className="mode-card-name">Learning Mode</div>
                                <div className="mode-card-desc">Game pauses on events. Get <strong>strategy feedback</strong> explaining which crack to buy/sell and the principle behind the product-specific impact.</div>
                                <div className="mode-card-badge">Recommended for beginners</div>
                            </div>
                            <div className="mode-card trading" onClick={() => startGame(scenario, 'trading')}>
                                <div className="mode-card-icon">⚡</div>
                                <div className="mode-card-name">Trading Mode</div>
                                <div className="mode-card-desc">Events pause but no hints. Trade the crack spread on your own judgment. Total P&L is your <strong>final score</strong>.</div>
                                <div className="mode-card-badge">Assessment simulation</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ─── Finished ─────────────────────────────────────
    if (phase === 'finished') {
        return (
            <CrackScoreCard
                trades={trades} positions={positions} cracks={cracks}
                avgEntries={avgEntries} realisedPnL={realisedPnL}
                startCracks={startCracks} onBack={() => { setPhase('menu'); setScenario(null); }}
            />
        );
    }

    // ─── Playing ──────────────────────────────────────
    const selectedCT = CRACK_TYPES.find(c => c.key === selectedCrack);

    return (
        <div className="csg-game-container">
            {/* Header */}
            <div className="ftg-game-header">
                <div className="ftg-gh-left">
                    <button className="ftg-exit-btn" onClick={() => { clearInterval(timerRef.current); setPhase('menu'); setScenario(null); }}>✕</button>
                    <span className="ftg-gh-title" style={{ color: '#ff8a65' }}>Crack Spread</span>
                    <span className="ftg-gh-scenario">{scenario?.name}</span>
                    <span className={`mode-indicator ${gameMode}`}>{gameMode === 'learning' ? '🎓' : '⚡'}</span>
                </div>
                <div className="ftg-gh-right">
                    <span className="ftg-gh-tick">Tick {tick}/{scenario?.totalTicks}</span>
                    <span className={`ftg-gh-pnl ${totalPnL >= 0 ? 'pos' : 'neg'}`}>
                        P&L: ${totalPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                    <div className="ftg-speed-btns">
                        {[1, 2, 3].map(s => (
                            <button key={s} className={`ftg-speed-btn ${speed === s ? 'active' : ''}`} onClick={() => setSpeed(s)}>
                                {s}×
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="ftg-game-body">
                {/* Left Column */}
                <div className="ftg-left-col">
                    {/* Product Prices Strip */}
                    <div className="csg-prices-strip">
                        <div className="csg-product crude">
                            <span className="csg-prod-icon">🛢</span>
                            <span className="csg-prod-name">Crude</span>
                            <span className="csg-prod-price">${prices.crude?.toFixed(2)}</span>
                        </div>
                        <div className="csg-product gasoline">
                            <span className="csg-prod-icon">⛽</span>
                            <span className="csg-prod-name">Gasoline</span>
                            <span className="csg-prod-price">${prices.gasoline?.toFixed(2)}</span>
                        </div>
                        <div className="csg-product diesel">
                            <span className="csg-prod-icon">🚛</span>
                            <span className="csg-prod-name">Diesel</span>
                            <span className="csg-prod-price">${prices.diesel?.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Crack Spread Bars */}
                    <div className="csg-crack-bars">
                        {CRACK_TYPES.map(ct => {
                            const val = cracks[ct.key];
                            const start = startCracks[ct.key];
                            const change = val - start;
                            return (
                                <div key={ct.key}
                                    className={`csg-crack-bar ${selectedCrack === ct.key ? 'selected' : ''}`}
                                    onClick={() => setSelectedCrack(ct.key)}
                                    style={{ '--crack-color': ct.color }}>
                                    <span className="csg-cb-name" style={{ color: ct.color }}>{ct.label}</span>
                                    <span className="csg-cb-val">${val.toFixed(2)}/bbl</span>
                                    <span className={`csg-cb-chg ${change >= 0 ? 'pos' : 'neg'}`}>
                                        {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Crack Chart */}
                    <div className="csg-chart-panel">
                        <div className="ftg-chart-title"><span>Crack Spread History</span></div>
                        <CrackChart history={crackHistory} />
                    </div>

                    {/* Position Grid */}
                    <div className="ftg-position-panel">
                        <div className="ftg-pp-title">Crack Positions</div>
                        <div className="csg-pos-grid">
                            {CRACK_TYPES.map(ct => (
                                <div key={ct.key}
                                    className={`csg-pos-cell ${selectedCrack === ct.key ? 'selected' : ''} ${positions[ct.key] !== 0 ? 'has-pos' : ''}`}
                                    onClick={() => setSelectedCrack(ct.key)}>
                                    <span className="csg-pc-name" style={{ color: ct.color }}>{ct.label}</span>
                                    <span className={`ftg-pc-pos ${positions[ct.key] > 0 ? 'long' : positions[ct.key] < 0 ? 'short' : ''}`}>
                                        {positions[ct.key] > 0 ? `+${positions[ct.key]}` : positions[ct.key] || '—'}
                                    </span>
                                    {positions[ct.key] !== 0 && (
                                        <span className={`ftg-pc-pnl ${crackUnrealised[ct.key] >= 0 ? 'pos' : 'neg'}`}>
                                            ${crackUnrealised[ct.key].toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="ftg-pp-summary">
                            <span>Realised: <span className={realisedPnL >= 0 ? 'pos' : 'neg'}>${realisedPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></span>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="ftg-right-col">
                    {/* Trading Panel */}
                    <div className="ftg-trade-panel">
                        <div className="ftg-tp-header">
                            <span className="ftg-tp-title">Trade</span>
                            <span className="ftg-tp-month" style={{ background: `${selectedCT?.color}22`, color: selectedCT?.color, borderColor: selectedCT?.color }}>
                                {selectedCT?.label}
                            </span>
                            <span className="ftg-tp-price">${cracks[selectedCrack]?.toFixed(2)}</span>
                        </div>

                        <div className="csg-tp-crack-selector">
                            {CRACK_TYPES.map(ct => (
                                <button key={ct.key}
                                    className={`csg-tp-crack-btn ${selectedCrack === ct.key ? 'active' : ''} ${positions[ct.key] !== 0 ? 'has-pos' : ''}`}
                                    onClick={() => setSelectedCrack(ct.key)}
                                    style={{ '--btn-color': ct.color }}>
                                    <span className="csg-tcb-name">{ct.label}</span>
                                    <span className="csg-tcb-val">${cracks[ct.key]?.toFixed(2)}</span>
                                </button>
                            ))}
                        </div>

                        <div className="ftg-tp-lots">
                            <span>Lots:</span>
                            {[1, 3, 5, 10].map(l => (
                                <button key={l} className={`ftg-lot-btn ${lotSize === l ? 'active' : ''}`} onClick={() => setLotSize(l)}>{l}</button>
                            ))}
                        </div>

                        <div className="ftg-tp-actions">
                            <button className="ftg-buy-btn" onClick={() => executeTrade('BUY')}>BUY {lotSize}</button>
                            <button className="ftg-sell-btn" onClick={() => executeTrade('SELL')}>SELL {lotSize}</button>
                        </div>

                        <div className="csg-tp-explanation">
                            <span className="csg-tpe-buy">BUY = crack widens (products ↑ vs crude)</span>
                            <span className="csg-tpe-sell">SELL = crack narrows (crude ↑ vs products)</span>
                        </div>

                        {positions[selectedCrack] !== 0 && (
                            <div className="ftg-tp-pos-info">
                                Position: <strong className={positions[selectedCrack] > 0 ? 'pos' : 'neg'}>
                                    {positions[selectedCrack] > 0 ? 'LONG' : 'SHORT'} {Math.abs(positions[selectedCrack])}
                                </strong>
                                @ ${avgEntries[selectedCrack]?.toFixed(2)}
                                → <span className={crackUnrealised[selectedCrack] >= 0 ? 'pos' : 'neg'}>
                                    ${crackUnrealised[selectedCrack].toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* News Feed */}
                    <div className="ftg-news-panel">
                        <div className="ftg-np-title">News Feed</div>
                        <div className="ftg-np-list">
                            {newsItems.length === 0 && <div className="ftg-np-empty">Waiting for market events…</div>}
                            {newsItems.map((item, i) => (
                                <div key={i} className={`ftg-np-item ${item.isEvent ? 'impact' : ''}`}>
                                    <span className="ftg-np-tick">T{item.tick}</span>
                                    {item.category && <span className={`ftg-np-cat ${item.category}`}>{item.category}</span>}
                                    <span className="ftg-np-headline">{item.headline}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="ftg-progress-bar">
                <div className="ftg-progress-fill" style={{ width: `${(tick / (scenario?.totalTicks || 1)) * 100}%` }} />
            </div>

            {/* Event Popup */}
            {pendingEvent && (
                <CrackEventPopup
                    event={pendingEvent}
                    onDismiss={() => setPendingEvent(null)}
                    gameMode={gameMode}
                    prices={prices}
                    cracks={cracks}
                />
            )}
        </div>
    );
}
