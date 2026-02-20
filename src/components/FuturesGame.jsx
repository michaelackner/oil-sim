import { useState, useEffect, useRef, useCallback } from 'react';
import { FuturesCurveEngine } from '../engine/FuturesCurveEngine.js';
import { futuresScenarios } from '../engine/futuresScenarios.js';
import { gasoilScenarios } from '../engine/gasoilScenarios.js';
import useCareerStore from '../state/careerStore.js';

// ─── Forward Curve SVG Chart ──────────────────────────
function CurveChart({ prices, startPrices, months, selectedMonth, onSelectMonth }) {
    const W = 560, H = 260, PAD = { t: 20, r: 30, b: 40, l: 55 };
    const plotW = W - PAD.l - PAD.r;
    const plotH = H - PAD.t - PAD.b;

    const allPrices = [...prices, ...startPrices];
    const minP = Math.min(...allPrices) - 0.5;
    const maxP = Math.max(...allPrices) + 0.5;
    const range = maxP - minP || 1;

    const xOf = i => PAD.l + (i / (prices.length - 1)) * plotW;
    const yOf = p => PAD.t + (1 - (p - minP) / range) * plotH;

    // Current curve path
    const curvePath = prices.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(p).toFixed(1)}`).join(' ');
    // Start curve path
    const startPath = startPrices.map((p, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(p).toFixed(1)}`).join(' ');
    // Fill area under current curve
    const fillPath = curvePath + ` L${xOf(prices.length - 1).toFixed(1)},${yOf(minP).toFixed(1)} L${xOf(0).toFixed(1)},${yOf(minP).toFixed(1)} Z`;

    // Curve shape determines colour
    const shape = prices[prices.length - 1] - prices[0];
    const curveColor = shape > 0.3 ? '#4fc3f7' : shape < -0.3 ? '#ff8a65' : '#a5d6a7';
    const fillColor = shape > 0.3 ? 'rgba(79,195,247,0.08)' : shape < -0.3 ? 'rgba(255,138,101,0.08)' : 'rgba(165,214,167,0.08)';

    // Y-axis ticks
    const yTicks = [];
    const step = range > 8 ? 2 : range > 4 ? 1 : 0.5;
    for (let v = Math.ceil(minP / step) * step; v <= maxP; v += step) {
        yTicks.push(v);
    }

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="ftg-curve-svg">
            {/* Grid */}
            {yTicks.map(v => (
                <g key={v}>
                    <line x1={PAD.l} y1={yOf(v)} x2={W - PAD.r} y2={yOf(v)} stroke="rgba(255,255,255,0.06)" />
                    <text x={PAD.l - 8} y={yOf(v) + 4} textAnchor="end" fill="rgba(255,255,255,0.4)" fontSize="10">${v.toFixed(v % 1 === 0 ? 0 : 2)}</text>
                </g>
            ))}

            {/* Start curve (dashed reference) */}
            <path d={startPath} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="4 3" />

            {/* Fill under current curve */}
            <path d={fillPath} fill={fillColor} />

            {/* Current curve */}
            <path d={curvePath} fill="none" stroke={curveColor} strokeWidth="2.5" strokeLinejoin="round" />

            {/* Interactive month dots */}
            {prices.map((p, i) => {
                const isSelected = i === selectedMonth;
                const change = p - startPrices[i];
                const dotColor = change >= 0 ? '#4caf50' : '#ef5350';
                return (
                    <g key={i} onClick={() => onSelectMonth(i)} style={{ cursor: 'pointer' }}>
                        {/* Hit area */}
                        <circle cx={xOf(i)} cy={yOf(p)} r={16} fill="transparent" />
                        {/* Dot */}
                        <circle cx={xOf(i)} cy={yOf(p)} r={isSelected ? 7 : 4.5} fill={isSelected ? curveColor : dotColor}
                            stroke={isSelected ? '#fff' : 'none'} strokeWidth={isSelected ? 2 : 0}
                            style={{ transition: 'r 0.15s' }} />
                        {/* Price label */}
                        <text x={xOf(i)} y={yOf(p) - 12} textAnchor="middle" fill={isSelected ? '#fff' : 'rgba(255,255,255,0.7)'}
                            fontSize={isSelected ? '11' : '9'} fontWeight={isSelected ? '700' : '400'}>
                            ${p.toFixed(2)}
                        </text>
                        {/* Month label */}
                        <text x={xOf(i)} y={H - 8} textAnchor="middle" fill={isSelected ? '#fff' : 'rgba(255,255,255,0.5)'}
                            fontSize="10" fontWeight={isSelected ? '700' : '400'}>
                            {months[i]}
                        </text>
                    </g>
                );
            })}

            {/* Curve shape label */}
            <text x={W - PAD.r} y={PAD.t - 4} textAnchor="end" fill={curveColor} fontSize="11" fontWeight="600">
                {shape > 0.3 ? '📈 Contango' : shape < -0.3 ? '📉 Backwardation' : '➡️ Flat'}
            </text>
        </svg>
    );
}

// ─── M1 Sparkline ─────────────────────────────────────
function Sparkline({ history, width = 180, height = 36 }) {
    if (history.length < 2) return null;
    const min = Math.min(...history) - 0.2;
    const max = Math.max(...history) + 0.2;
    const range = max - min || 1;
    const pts = history.map((v, i) => `${(i / (history.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
    const color = history[history.length - 1] >= history[0] ? '#4caf50' : '#ef5350';
    return (
        <svg width={width} height={height} className="ftg-sparkline">
            <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
        </svg>
    );
}

// ─── Event Popup ──────────────────────────────────────
function FuturesEventPopup({ event, onDismiss, gameMode, prices, months }) {
    return (
        <div className="ftg-event-overlay">
            <div className="ftg-event-modal">
                <div className="ftg-event-badge">{event.category?.toUpperCase()}</div>
                <h3 className="ftg-event-headline">{event.headline}</h3>
                <p className="ftg-event-detail">{event.detail}</p>

                {/* Live curve snapshot */}
                <div className="ftg-event-curve-info">
                    {months.map((m, i) => (
                        <span key={i} className="ftg-event-price-tag">
                            <span className="ftg-epm">{m}</span>
                            <span className="ftg-epv">${prices[i]?.toFixed(2)}</span>
                        </span>
                    ))}
                </div>

                {gameMode === 'learning' && event.strategy && (
                    <div className="ftg-event-strategy">
                        <div className="ftg-es-row"><strong>Action:</strong> {event.strategy.action}</div>
                        <div className="ftg-es-row"><strong>Reasoning:</strong> {event.strategy.reasoning}</div>
                        <div className="ftg-es-row ftg-es-principle"><strong>Principle:</strong> {event.strategy.principle}</div>
                        {event.strategy.riskNote && <div className="ftg-es-row ftg-es-risk">⚠️ {event.strategy.riskNote}</div>}
                    </div>
                )}

                <button className="ftg-event-dismiss" onClick={onDismiss}>
                    {gameMode === 'learning' ? 'Trade & Continue ▸' : 'Continue ▸'}
                </button>
            </div>
        </div>
    );
}

// ─── Score Card ───────────────────────────────────────
function FuturesScoreCard({ trades, positions, prices, avgEntries, realisedPnL, startPrices, months, contractSize, assetType, onBack }) {
    // Unrealised P&L per month
    const LOT_SIZE = contractSize || 1000;
    let totalUnrealised = 0;
    const monthPnL = positions.map((pos, i) => {
        if (pos === 0) return 0;
        const unr = (prices[i] - avgEntries[i]) * pos * LOT_SIZE;
        totalUnrealised += unr;
        return unr;
    });

    const totalPnL = realisedPnL + totalUnrealised;
    const grade = totalPnL > 50000 ? 'A' : totalPnL > 20000 ? 'B' : totalPnL > 0 ? 'C' : totalPnL > -20000 ? 'D' : 'F';

    // Curve change
    const curveChange = prices.map((p, i) => p - startPrices[i]);
    const spreadChange = (prices[prices.length - 1] - prices[0]) - (startPrices[startPrices.length - 1] - startPrices[0]);

    return (
        <div className="ftg-event-overlay">
            <div className="ftg-score-modal">
                <h2 className="ftg-score-title">Futures Trading Report</h2>

                <div className="ftg-score-grade-row">
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
                    <div className="ftg-score-section">
                        <h4>Spread Change</h4>
                        <span className={spreadChange >= 0 ? 'pos' : 'neg'}>{spreadChange >= 0 ? '+' : ''}{spreadChange.toFixed(2)}/{assetType === 'gasoil' ? 'MT' : 'bbl'}</span>
                    </div>
                </div>

                <h4 style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Curve Movement (Start → End)</h4>
                <div className="ftg-score-curve-grid">
                    {months.map((m, i) => (
                        <div key={i} className="ftg-score-curve-cell">
                            <span className="ftg-scc-month">{m}</span>
                            <span className="ftg-scc-start">${startPrices[i].toFixed(2)}</span>
                            <span className="ftg-scc-arrow">→</span>
                            <span className="ftg-scc-end">${prices[i].toFixed(2)}</span>
                            <span className={`ftg-scc-chg ${curveChange[i] >= 0 ? 'pos' : 'neg'}`}>
                                {curveChange[i] >= 0 ? '+' : ''}{curveChange[i].toFixed(2)}
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
                                    <tr><th>Tick</th><th>Month</th><th>Side</th><th>Lots</th><th>Price</th></tr>
                                </thead>
                                <tbody>
                                    {trades.map((t, i) => (
                                        <tr key={i}>
                                            <td>{t.tick}</td>
                                            <td>{t.monthLabel}</td>
                                            <td className={t.side === 'BUY' ? 'pos' : 'neg'}>{t.side}</td>
                                            <td>{t.lots}</td>
                                            <td>${t.price.toFixed(2)}</td>
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
// ═══ MAIN FUTURES GAME COMPONENT ══════════════════════
// ═══════════════════════════════════════════════════════
export default function FuturesGame({ onBack }) {
    // ─── Phase state ──────────────────────────────────
    const [phase, setPhase] = useState('menu');
    const [assetFilter, setAssetFilter] = useState('crude');
    const [scenario, setScenario] = useState(null);
    const [gameMode, setGameMode] = useState('learning');

    // ─── Game state ───────────────────────────────────
    const [tick, setTick] = useState(0);
    const [prices, setPrices] = useState([]);
    const [startPrices, setStartPrices] = useState([]);
    const [m1History, setM1History] = useState([]);
    const [positions, setPositions] = useState([0, 0, 0, 0, 0, 0]);
    const [avgEntries, setAvgEntries] = useState([0, 0, 0, 0, 0, 0]);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [lotSize, setLotSize] = useState(5);
    const [realisedPnL, setRealisedPnL] = useState(0);
    const [trades, setTrades] = useState([]);
    const [newsItems, setNewsItems] = useState([]);
    const [pendingEvent, setPendingEvent] = useState(null);
    const [speed, setSpeed] = useState(1);
    const [maxDrawdown, setMaxDrawdown] = useState(0);
    const [peakPnL, setPeakPnL] = useState(0);

    // ─── Refs ─────────────────────────────────────────
    const engineRef = useRef(null);
    const timerRef = useRef(null);
    const eventIndexRef = useRef(0);
    const noiseTimerRef = useRef(0);

    // ─── Game start ───────────────────────────────────
    const startGame = useCallback((sc, mode) => {
        const engine = new FuturesCurveEngine({
            startPrice: sc.startPrice,
            monthlySpread: sc.monthlySpread,
            volatility: sc.volatility,
            numMonths: sc.numMonths || 6,
        });
        engineRef.current = engine;
        eventIndexRef.current = 0;
        noiseTimerRef.current = 0;

        setPrices(engine.getPrices());
        setStartPrices(engine.getStartPrices());
        setM1History([engine.getPrices()[0]]);
        setPositions(new Array(sc.numMonths || 6).fill(0));
        setAvgEntries(new Array(sc.numMonths || 6).fill(0));
        setSelectedMonth(0);
        setRealisedPnL(0);
        setTrades([]);
        setNewsItems([]);
        setPendingEvent(null);
        setTick(0);
        setSpeed(1);
        setMaxDrawdown(0);
        setPeakPnL(0);
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

                // Advance engine
                const newPrices = engine.tick();
                setPrices(newPrices);
                setM1History(h => {
                    const next = [...h, newPrices[0]];
                    return next.length > 200 ? next.slice(-200) : next;
                });

                // Check for impact events
                const events = scenario.events || [];
                if (eventIndexRef.current < events.length && nextTick >= events[eventIndexRef.current].tick) {
                    const ev = events[eventIndexRef.current];
                    eventIndexRef.current++;

                    // Apply event to engine
                    const impactedPrices = engine.applyEvent(ev.impact);
                    setPrices(impactedPrices);

                    // Add headline
                    setNewsItems(items => [{
                        tick: nextTick,
                        headline: ev.headline,
                        isEvent: true,
                        category: ev.category,
                    }, ...items].slice(0, 50));

                    // Show popup
                    if (!scenario.disablePopups) {
                        setPendingEvent(ev);
                        clearInterval(timerRef.current);
                    }
                }

                // Noise events
                noiseTimerRef.current++;
                const noiseConfig = scenario.noiseEvents?.[0];
                if (noiseConfig && noiseTimerRef.current >= noiseConfig.frequency) {
                    noiseTimerRef.current = 0;
                    if (nextTick >= noiseConfig.tickRange[0] && nextTick <= noiseConfig.tickRange[1]) {
                        const pool = noiseConfig.pool;
                        const headline = pool[Math.floor(Math.random() * pool.length)];
                        setNewsItems(items => [{
                            tick: nextTick,
                            headline,
                            isEvent: false,
                        }, ...items].slice(0, 50));
                    }
                }

                // Track drawdown
                setPositions(pos => {
                    let unr = 0;
                    pos.forEach((p, i) => {
                        if (p !== 0) unr += (newPrices[i] - avgEntries[i]) * p * (scenario?.contractSize || 1000);
                    });
                    const totalPnL = realisedPnL + unr;
                    if (totalPnL > peakPnL) setPeakPnL(totalPnL);
                    const dd = peakPnL - totalPnL;
                    if (dd > maxDrawdown) setMaxDrawdown(dd);
                    return pos;
                });

                return nextTick;
            });
        }, interval);

        return () => clearInterval(timerRef.current);
    }, [phase, pendingEvent, speed, scenario, avgEntries, realisedPnL, peakPnL, maxDrawdown]);

    // ─── Career Integration ────────────────────────────────
    const careerUpdatedRef = useRef(false);

    useEffect(() => {
        if (phase === 'finished' && scenario && !careerUpdatedRef.current) {
            careerUpdatedRef.current = true;

            const currentValuations = positions.reduce((acc, pos, i) => {
                if (pos === 0) return acc;
                const currentPrice = prices[i];
                return acc + (pos * (scenario?.contractSize || 1000) * (currentPrice - avgEntries[i]));
            }, 0);
            const totalPnL = realisedPnL + currentValuations;

            const career = useCareerStore.getState();
            let earnedXp = 800; // Base for futures
            if (totalPnL > 0) earnedXp += 400;
            if (totalPnL > 100000) earnedXp += 500;

            career.addXp(earnedXp);
            career.recordSession(totalPnL, trades.length, scenario.id);
        }
        if (phase !== 'finished') {
            careerUpdatedRef.current = false;
        }
    }, [phase, scenario, positions, prices, realisedPnL, avgEntries, trades]);

    // ─── Trading ──────────────────────────────────────
    const executeTrade = useCallback((side) => {
        if (phase !== 'playing') return;
        const month = selectedMonth;
        const price = prices[month];

        setPositions(prev => {
            const next = [...prev];
            const prevPos = next[month];
            const lots = side === 'BUY' ? lotSize : -lotSize;
            const newPos = prevPos + lots;

            // Calculate realised P&L if reducing/flipping
            if (prevPos !== 0 && Math.sign(prevPos) !== Math.sign(newPos) || (prevPos !== 0 && Math.sign(lots) !== Math.sign(prevPos))) {
                const closedLots = Math.min(Math.abs(prevPos), Math.abs(lots));
                const pnl = (price - avgEntries[month]) * (prevPos > 0 ? 1 : -1) * closedLots * (scenario?.contractSize || 1000);
                setRealisedPnL(r => r + pnl);
            }

            // Update average entry
            setAvgEntries(ae => {
                const nextAe = [...ae];
                if (newPos === 0) {
                    nextAe[month] = 0;
                } else if (Math.sign(newPos) === Math.sign(lots) && prevPos === 0) {
                    nextAe[month] = price;
                } else if (Math.sign(newPos) === Math.sign(prevPos)) {
                    // Only update average entry if adding to position
                    if (Math.abs(newPos) > Math.abs(prevPos)) {
                        nextAe[month] = (ae[month] * Math.abs(prevPos) + price * Math.abs(lots)) / Math.abs(newPos);
                    }
                    // Else reducing: keep existing ae[month]
                } else {
                    // Flipped — new entry at current price
                    nextAe[month] = price;
                }
                return nextAe;
            });

            next[month] = newPos;
            return next;
        });

        setTrades(prev => [...prev, {
            tick,
            month: selectedMonth,
            monthLabel: scenario.months[selectedMonth],
            side,
            lots: lotSize,
            price,
        }]);
    }, [phase, selectedMonth, prices, lotSize, tick, scenario, avgEntries]);

    // ─── Dismiss event ────────────────────────────────
    const dismissEvent = useCallback(() => {
        setPendingEvent(null);
    }, []);

    // ─── Compute derived values ───────────────────────
    let totalUnrealised = 0;
    const monthUnrealised = positions.map((pos, i) => {
        if (pos === 0) return 0;
        const unr = (prices[i] - avgEntries[i]) * pos * (scenario?.contractSize || 1000);
        totalUnrealised += unr;
        return unr;
    });
    const totalPnL = realisedPnL + totalUnrealised;

    const spreads = [];
    for (let i = 0; i < prices.length - 1; i++) {
        spreads.push(Math.round((prices[i + 1] - prices[i]) * 100) / 100);
    }

    const totalPosition = positions.reduce((a, b) => a + b, 0);

    // ═══ RENDER ═══════════════════════════════════════

    // ─── Scenario Menu ────────────────────────────────
    if (phase === 'menu') {
        const activeScenarios = assetFilter === 'crude' ? futuresScenarios : gasoilScenarios;
        return (
            <div className="ftg-container">
                <button className="ftg-back-btn" onClick={onBack}>← Back to Main Menu</button>
                <h1 className="ftg-title">📊 Futures Curve Trading</h1>

                <div className="ftg-asset-toggle">
                    <button className={assetFilter === 'crude' ? 'active' : ''} onClick={() => setAssetFilter('crude')}>🛢️ Crude Oil</button>
                    <button className={assetFilter === 'gasoil' ? 'active' : ''} onClick={() => setAssetFilter('gasoil')}>🚚 ICE Gasoil</button>
                </div>

                <p className="ftg-subtitle">
                    {assetFilter === 'crude'
                        ? 'Trade the 6-month Brent/WTI forward curve. Balance supply shocks and demand sentiment.'
                        : 'Trade the 3-month ICE Gasoil curve. Navigate winter heating demand and refinery outages.'
                    }
                </p>

                <div className="ftg-scenario-grid">
                    {activeScenarios.map(sc => (
                        <div key={sc.id} className="ftg-scenario-card" onClick={() => { setScenario(sc); setPhase('modeSelect'); }}>
                            <div className="ftg-sc-header">
                                <span className="ftg-sc-name">{sc.name}</span>
                                <span className={`difficulty-badge ${sc.difficulty.toLowerCase().replace(' ', '-')}`}>{sc.difficulty}</span>
                            </div>
                            <p className="ftg-sc-desc">{sc.description}</p>
                            <div className="ftg-sc-meta">
                                <span>📊 {sc.events.length} events</span>
                                <span>⏱ {sc.totalTicks} ticks</span>
                                <span>📈 {sc.monthlySpread > 0 ? 'Contango' : sc.monthlySpread < 0 ? 'Backwardation' : 'Flat'}</span>
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
                                <div className="mode-card-desc">Game pauses on events. Get <strong>strategy feedback</strong> showing the optimal curve trade, which month to buy/sell, and the principle behind the curve impact.</div>
                                <div className="mode-card-badge">Recommended for beginners</div>
                            </div>
                            <div className="mode-card trading" onClick={() => startGame(scenario, 'trading')}>
                                <div className="mode-card-icon">⚡</div>
                                <div className="mode-card-name">Trading Mode</div>
                                <div className="mode-card-desc">Events pause the game but no strategy hints. Trade the curve on your own judgment. Your total P&L is your <strong>final score</strong>.</div>
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
            <FuturesScoreCard
                trades={trades}
                positions={positions}
                prices={prices}
                avgEntries={avgEntries}
                realisedPnL={realisedPnL}
                startPrices={startPrices}
                months={scenario.months}
                contractSize={scenario.contractSize}
                assetType={scenario.assetType}
                onBack={() => { setPhase('menu'); setScenario(null); }}
            />
        );
    }

    // ─── Playing ──────────────────────────────────────
    const months = scenario?.months || [];

    return (
        <div className="ftg-game-container">
            {/* ─── Header ──────────────────────────────── */}
            <div className="ftg-game-header">
                <div className="ftg-gh-left">
                    <button className="ftg-exit-btn" onClick={() => { clearInterval(timerRef.current); setPhase('menu'); setScenario(null); }}>✕ Exit to Menu</button>
                    <span className="ftg-gh-title">Futures Curve</span>
                    <span className="ftg-gh-scenario">{scenario.name}</span>
                    <span className={`mode-indicator ${gameMode}`}>
                        {gameMode === 'learning' ? '🎓' : '⚡'}
                    </span>
                </div>
                <div className="ftg-gh-right">
                    <span className="ftg-gh-tick">Tick {tick}/{scenario.totalTicks}</span>
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

            {/* ─── Main Body ───────────────────────────── */}
            <div className="ftg-game-body">
                {/* ─── Left Column: Chart + Positions ── */}
                <div className="ftg-left-col">
                    {/* Curve Chart */}
                    <div className="ftg-chart-panel">
                        <div className="ftg-chart-title">
                            <span>Forward Curve</span>
                            <Sparkline history={m1History} />
                            <span className="ftg-chart-m1">M+1: ${prices[0]?.toFixed(2)}</span>
                        </div>
                        <CurveChart
                            prices={prices}
                            startPrices={startPrices}
                            months={months}
                            selectedMonth={selectedMonth}
                            onSelectMonth={setSelectedMonth}
                        />
                    </div>

                    {/* Spread Display */}
                    <div className="ftg-spread-bar">
                        {spreads.map((s, i) => (
                            <div key={i} className="ftg-spread-cell">
                                <span className="ftg-sc-label">{months[i]}–{months[i + 1]}</span>
                                <span className={`ftg-sc-val ${s >= 0 ? 'contango' : 'backw'}`}>
                                    {s >= 0 ? '+' : ''}{s.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Position Grid */}
                    <div className="ftg-position-panel">
                        <div className="ftg-pp-title">Positions</div>
                        <div className="ftg-pos-grid">
                            {months.map((m, i) => (
                                <div key={i} className={`ftg-pos-cell ${selectedMonth === i ? 'selected' : ''} ${positions[i] !== 0 ? 'has-pos' : ''}`}
                                    onClick={() => setSelectedMonth(i)}>
                                    <span className="ftg-pc-month">{m}</span>
                                    <span className={`ftg-pc-pos ${positions[i] > 0 ? 'long' : positions[i] < 0 ? 'short' : ''}`}>
                                        {positions[i] > 0 ? `+${positions[i]}` : positions[i] || '—'}
                                    </span>
                                    {positions[i] !== 0 && (
                                        <span className={`ftg-pc-pnl ${monthUnrealised[i] >= 0 ? 'pos' : 'neg'}`}>
                                            ${monthUnrealised[i].toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="ftg-pp-summary">
                            <span>Net: {totalPosition > 0 ? `+${totalPosition}` : totalPosition} lots</span>
                            <span>Realised: <span className={realisedPnL >= 0 ? 'pos' : 'neg'}>${realisedPnL.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></span>
                        </div>
                    </div>
                </div>

                {/* ─── Right Column: News + Trading ──── */}
                <div className="ftg-right-col">
                    {/* Trading Panel */}
                    <div className="ftg-trade-panel">
                        <div className="ftg-tp-header">
                            <span className="ftg-tp-title">Trade</span>
                            <span className="ftg-tp-month">{months[selectedMonth]}</span>
                            <span className="ftg-tp-price">${prices[selectedMonth]?.toFixed(2)}</span>
                        </div>

                        <div className="ftg-tp-month-selector">
                            {months.map((m, i) => (
                                <button key={i} className={`ftg-tp-mbtn ${selectedMonth === i ? 'active' : ''} ${positions[i] !== 0 ? 'has-pos' : ''}`}
                                    onClick={() => setSelectedMonth(i)}>
                                    {m}
                                </button>
                            ))}
                        </div>

                        <div className="ftg-tp-lots">
                            <span>Lots:</span>
                            {[1, 3, 5, 10].map(l => (
                                <button key={l} className={`ftg-lot-btn ${lotSize === l ? 'active' : ''}`} onClick={() => setLotSize(l)}>
                                    {l}
                                </button>
                            ))}
                        </div>

                        <div className="ftg-tp-actions">
                            <button className="ftg-buy-btn" onClick={() => executeTrade('BUY')}>
                                BUY {lotSize}
                            </button>
                            <button className="ftg-sell-btn" onClick={() => executeTrade('SELL')}>
                                SELL {lotSize}
                            </button>
                        </div>

                        {positions[selectedMonth] !== 0 && (
                            <div className="ftg-tp-pos-info">
                                Position: <strong className={positions[selectedMonth] > 0 ? 'pos' : 'neg'}>
                                    {positions[selectedMonth] > 0 ? 'LONG' : 'SHORT'} {Math.abs(positions[selectedMonth])}
                                </strong>
                                @ ${avgEntries[selectedMonth]?.toFixed(2)}
                                → <span className={monthUnrealised[selectedMonth] >= 0 ? 'pos' : 'neg'}>
                                    ${monthUnrealised[selectedMonth].toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* News Feed */}
                    <div className="ftg-news-panel">
                        <div className="ftg-np-title">News Feed</div>
                        <div className="ftg-np-list">
                            {newsItems.length === 0 && (
                                <div className="ftg-np-empty">Waiting for market events…</div>
                            )}
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

            {/* ─── Progress Bar ─────────────────────── */}
            <div className="ftg-progress-bar">
                <div className="ftg-progress-fill" style={{ width: `${(tick / scenario.totalTicks) * 100}%` }} />
            </div>

            {/* ─── Event Popup ──────────────────────── */}
            {pendingEvent && (
                <FuturesEventPopup
                    event={pendingEvent}
                    onDismiss={dismissEvent}
                    gameMode={gameMode}
                    prices={prices}
                    months={months}
                />
            )}
        </div>
    );
}
