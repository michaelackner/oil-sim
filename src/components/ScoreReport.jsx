import { useState } from 'react';
import useGameStore from '../state/gameStore.js';
import { calculateScore } from '../engine/ScoringEngine.js';

function formatElapsed(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
}

// ── Dimension display config ──
const DIM_META = {
    understanding: { label: 'Understanding', icon: '🧠', color: '#4fc3f7', desc: 'Market knowledge & event response accuracy' },
    execution: { label: 'Execution', icon: '⚡', color: '#ffa726', desc: 'Reaction speed & sizing discipline' },
    organisation: { label: 'Organisation', icon: '📋', color: '#66bb6a', desc: 'Risk management & drawdown control' },
    interpersonal: { label: 'Interpersonal', icon: '🤝', color: '#ab47bc', desc: 'Event engagement & communication' },
    strategic: { label: 'Strategic', icon: '♟️', color: '#ef5350', desc: 'Holding period & regime adaptation' },
    analytical: { label: 'Analytical', icon: '📊', color: '#26c6da', desc: 'Sharpe ratio & learning curve' },
};

const DIM_ORDER = ['understanding', 'execution', 'organisation', 'interpersonal', 'strategic', 'analytical'];

// ── SVG Radar Chart (no dependencies) ──
function RadarChart({ dimensions }) {
    const cx = 130, cy = 130, maxR = 100;
    const n = DIM_ORDER.length;
    const angleStep = (2 * Math.PI) / n;

    // Points for each dimension
    const points = DIM_ORDER.map((key, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        const r = (dimensions[key].score / 5) * maxR;
        return {
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle),
            lx: cx + (maxR + 22) * Math.cos(angle),
            ly: cy + (maxR + 22) * Math.sin(angle),
            key,
        };
    });

    const polygon = points.map(p => `${p.x},${p.y}`).join(' ');

    // Grid rings
    const rings = [1, 2, 3, 4, 5];

    return (
        <svg viewBox="0 0 260 260" className="radar-svg">
            {/* Grid rings */}
            {rings.map(ring => {
                const r = (ring / 5) * maxR;
                const ringPoints = Array.from({ length: n }, (_, i) => {
                    const angle = -Math.PI / 2 + i * angleStep;
                    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
                }).join(' ');
                return <polygon key={ring} points={ringPoints} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />;
            })}

            {/* Axis lines */}
            {points.map((p, i) => {
                const angle = -Math.PI / 2 + i * angleStep;
                return (
                    <line key={i}
                        x1={cx} y1={cy}
                        x2={cx + maxR * Math.cos(angle)}
                        y2={cy + maxR * Math.sin(angle)}
                        stroke="rgba(255,255,255,0.1)" strokeWidth="1"
                    />
                );
            })}

            {/* Data polygon */}
            <polygon points={polygon} fill="rgba(79,195,247,0.15)" stroke="#4fc3f7" strokeWidth="2" />

            {/* Data dots */}
            {points.map(p => (
                <circle key={p.key} cx={p.x} cy={p.y} r="4" fill={DIM_META[p.key].color} stroke="#0a0a1a" strokeWidth="1.5" />
            ))}

            {/* Labels */}
            {points.map(p => (
                <text key={p.key} x={p.lx} y={p.ly}
                    textAnchor="middle" dominantBaseline="middle"
                    fill={DIM_META[p.key].color} fontSize="9" fontWeight="600"
                    fontFamily="var(--font-mono, monospace)"
                >
                    {DIM_META[p.key].icon} {dimensions[p.key].score}
                </text>
            ))}
        </svg>
    );
}

// ── Dimension detail cards ──
function DimensionCard({ dimKey, dim }) {
    const meta = DIM_META[dimKey];
    const pct = (dim.score / 5) * 100;

    const detailLabels = {
        understanding: d => [
            ['Correct Directions', `${d.correct}/${d.total}`],
            ['Response Rate', `${d.responseRate || 0}%`],
            ['Directional Accuracy', `${d.accuracy}%`],
        ],
        execution: d => [
            ['Avg Reaction', d.avgReaction === 'N/A' ? 'N/A' : `${d.avgReaction} ticks`],
            ['Sizing Consistency', `${d.sizingConsistency}%`],
        ],
        organisation: d => [
            ['Drawdown Control', `${d.drawdownScore}%`],
            ['VAR Breaches', `${d.varBreaches}`],
            ['Flat at End', d.flatAtEnd ? '✓ Yes' : '✗ No'],
        ],
        interpersonal: d => [
            ['Event Engagement', `${d.engagement}%`],
        ],
        strategic: d => [
            ['Avg Holding', `${d.avgHolding} ticks`],
            ['Adaptation', `${d.adaptationScore}%`],
            ['End-game Mgmt', `${d.endGameScore}%`],
        ],
        analytical: d => [
            ['Sharpe Ratio', `${d.sharpe}`],
            ['Learning Curve', `${d.learningCurve}%`],
            ['Win Rate', `${d.winRate}%`],
        ],
    };

    const details = (detailLabels[dimKey] || (() => []))(dim.details);

    return (
        <div className="dim-card">
            <div className="dim-card-header">
                <span className="dim-card-icon">{meta.icon}</span>
                <div className="dim-card-title-group">
                    <span className="dim-card-label">{meta.label}</span>
                    <span className="dim-card-desc">{meta.desc}</span>
                </div>
                <span className="dim-card-score" style={{ color: meta.color }}>{dim.score}/5</span>
            </div>
            <div className="dim-card-bar-track">
                <div className="dim-card-bar-fill" style={{ width: `${pct}%`, background: meta.color }} />
            </div>
            {details.length > 0 && (
                <div className="dim-card-details">
                    {details.map(([label, value]) => (
                        <div key={label} className="dim-detail-row">
                            <span className="dim-detail-label">{label}</span>
                            <span className="dim-detail-value">{value}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ScoreReport({ onReviewStrategy }) {
    const state = useGameStore();
    const { trades, realisedPnL, unrealisedPnL, maxDrawdown, priceHistory, newsItems, varBreaches, position } = state;
    const { startGame, returnToMenu, currentScenario, gameMode, elapsedTime } = state;

    const [showDetails, setShowDetails] = useState(false);

    const score = calculateScore({
        trades, realisedPnL, unrealisedPnL, maxDrawdown, priceHistory, newsItems, varBreaches, position,
    });

    const pnlClass = score.totalPnL >= 0 ? 'positive' : 'negative';

    return (
        <div className="report-overlay">
            <div className="report-modal score-report-v2">
                {/* Header */}
                <div className="report-header">
                    <h2>Simulation Complete</h2>
                    <div className="scenario-name">{currentScenario?.name}</div>
                    <div className="report-mode-badge">
                        {gameMode === 'learning' ? '🎓 Learning Mode' : '⚡ Trading Mode'}
                    </div>
                </div>

                {/* Composite score + grade */}
                <div className="sr2-composite">
                    <div className="sr2-grade-ring">
                        <svg viewBox="0 0 120 120" className="sr2-ring-svg">
                            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                            <circle cx="60" cy="60" r="52" fill="none"
                                stroke={score.grade === 'A' ? '#66bb6a' : score.grade === 'B' ? '#4fc3f7' : score.grade === 'C' ? '#ffa726' : '#ef5350'}
                                strokeWidth="8" strokeLinecap="round"
                                strokeDasharray={`${score.compositeScore * 3.27} 327`}
                                transform="rotate(-90 60 60)"
                            />
                        </svg>
                        <div className="sr2-ring-content">
                            <div className={`grade-letter ${score.grade}`}>{score.grade}</div>
                            <div className="sr2-pct">{score.compositeScore}%</div>
                        </div>
                    </div>
                    <div className="sr2-pnl-block">
                        <div className="sr2-pnl-label">Total P&L</div>
                        <div className={`sr2-pnl-value ${pnlClass}`}>
                            {score.totalPnL >= 0 ? '+' : ''}${Math.abs(score.totalPnL).toLocaleString()}
                        </div>
                        <div className="sr2-meta-row">
                            <span>Sharpe: {score.sharpeRatio}</span>
                            <span>Win: {score.winRate}%</span>
                            <span>Trades: {score.totalTrades}</span>
                        </div>
                        {gameMode === 'trading' && (
                            <div className="sr2-time">⏱ {formatElapsed(elapsedTime)}</div>
                        )}
                    </div>
                </div>

                {/* Radar chart */}
                <div className="sr2-radar-section">
                    <RadarChart dimensions={score.dimensions} />
                </div>

                {/* Dimension summary bar */}
                <div className="sr2-dim-bar">
                    {DIM_ORDER.map(key => (
                        <div key={key} className="sr2-dim-pill" title={DIM_META[key].label}>
                            <span className="sr2-dim-pill-icon">{DIM_META[key].icon}</span>
                            <span className="sr2-dim-pill-score" style={{ color: DIM_META[key].color }}>{score.dimensions[key].score}</span>
                        </div>
                    ))}
                </div>

                {/* Dimension detail toggle */}
                <button className="sr2-details-toggle" onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? '▲ Hide Breakdown' : '▼ Show Full Breakdown'}
                </button>

                {showDetails && (
                    <div className="sr2-dim-grid">
                        {DIM_ORDER.map(key => (
                            <DimensionCard key={key} dimKey={key} dim={score.dimensions[key]} />
                        ))}
                    </div>
                )}

                {/* Legacy stats row */}
                <div className="sr2-legacy-stats">
                    <div className="report-stat">
                        <div className="stat-label">Reaction</div>
                        <div className="stat-value">
                            {score.avgReactionTicks === 'N/A' ? 'N/A' : `${score.avgReactionTicks}t`}
                        </div>
                    </div>
                    <div className="report-stat">
                        <div className="stat-label">Direction</div>
                        <div className="stat-value">{score.directionAccuracy}%</div>
                    </div>
                    <div className="report-stat">
                        <div className="stat-label">Drawdown</div>
                        <div className={`stat-value ${score.maxDrawdown < 0 ? 'negative' : ''}`}>
                            ${Math.abs(score.maxDrawdown).toLocaleString()}
                        </div>
                    </div>
                    <div className="report-stat">
                        <div className="stat-label">VAR Breaches</div>
                        <div className={`stat-value ${score.varBreaches > 0 ? 'negative' : ''}`}>
                            {score.varBreaches}
                        </div>
                    </div>
                </div>

                {/* Trade log */}
                {trades.length > 0 && (
                    <div className="trade-log">
                        <h3>Trade Log</h3>
                        <table className="trade-log-table">
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Side</th>
                                    <th>Lots</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trades.slice(-20).map((trade, i) => (
                                    <tr key={i}>
                                        <td>{trade.timestamp}</td>
                                        <td className={trade.side === 'buy' ? 'buy-cell' : 'sell-cell'}>
                                            {trade.side.toUpperCase()}
                                        </td>
                                        <td>{trade.lots}</td>
                                        <td>${trade.price.toFixed(2)}</td>
                                    </tr>
                                ))}
                                {trades.length > 20 && (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                                            ... and {trades.length - 20} more trades
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="report-actions">
                    <button className="report-btn primary" onClick={() => startGame(currentScenario, gameMode)}>
                        Play Again
                    </button>
                    <button className="report-btn primary" onClick={onReviewStrategy}
                        style={{ background: '#a855f720', borderColor: '#a855f780', color: '#a855f7' }}>
                        📋 Review Strategy
                    </button>
                    <button className="report-btn secondary" onClick={returnToMenu}>
                        Main Menu
                    </button>
                </div>
            </div>
        </div>
    );
}
