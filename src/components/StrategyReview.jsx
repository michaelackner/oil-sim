import { useState, useMemo } from 'react';
import useGameStore from '../state/gameStore.js';

export default function StrategyReview({ onClose }) {
    const currentScenario = useGameStore(s => s.currentScenario);
    const trades = useGameStore(s => s.trades);
    const news = useGameStore(s => s.news);
    const [expandedEvent, setExpandedEvent] = useState(null);

    const impactEvents = useMemo(() => {
        if (!currentScenario?.events) return [];
        return currentScenario.events.filter(e => e.strategy);
    }, [currentScenario]);

    // Find trades the player made near each event
    const getPlayerTradesNearEvent = (eventTick) => {
        return trades.filter(t => Math.abs(t.tick - eventTick) <= 15);
    };

    const gradePlayerResponse = (event, playerTrades) => {
        if (playerTrades.length === 0) {
            if (event.impact?.direction === 0 || (event.strategy?.action || '').includes('NOTHING')) {
                return { grade: 'A', label: 'Correct — No Trade', color: '#22c55e' };
            }
            return { grade: 'D', label: 'Missed Opportunity', color: '#ef4444' };
        }

        const eventDir = event.impact?.direction || 0;
        const netLots = playerTrades.reduce((sum, t) => {
            return sum + (t.side === 'buy' ? t.lots : -t.lots);
        }, 0);

        if (eventDir > 0 && netLots > 0) return { grade: 'A', label: 'Correct Direction', color: '#22c55e' };
        if (eventDir < 0 && netLots < 0) return { grade: 'A', label: 'Correct Direction', color: '#22c55e' };
        if (eventDir > 0 && netLots < 0) return { grade: 'F', label: 'Wrong Direction', color: '#ef4444' };
        if (eventDir < 0 && netLots > 0) return { grade: 'F', label: 'Wrong Direction', color: '#ef4444' };
        return { grade: 'C', label: 'Neutral', color: '#eab308' };
    };

    if (!currentScenario) return null;

    return (
        <div className="strategy-review-overlay">
            <div className="strategy-review-modal">
                <div className="strategy-review-header">
                    <h2>📋 Strategy Review — {currentScenario.name}</h2>
                    <button className="strategy-close-btn" onClick={onClose}>✕</button>
                </div>

                {currentScenario.strategyOverview && (
                    <div className="strategy-overview">
                        <h3>🎯 Scenario Strategy Overview</h3>
                        <p>{currentScenario.strategyOverview}</p>
                    </div>
                )}

                <div className="strategy-events-list">
                    {impactEvents.map((event, idx) => {
                        const playerTrades = getPlayerTradesNearEvent(event.tick);
                        const grade = gradePlayerResponse(event, playerTrades);
                        const isExpanded = expandedEvent === idx;

                        return (
                            <div
                                key={idx}
                                className={`strategy-event-card ${isExpanded ? 'expanded' : ''}`}
                                onClick={() => setExpandedEvent(isExpanded ? null : idx)}
                            >
                                <div className="strategy-event-header">
                                    <div className="strategy-event-left">
                                        <span className="strategy-tick">Tick {event.tick}</span>
                                        <span className={`strategy-direction ${event.impact.direction > 0 ? 'bull' : event.impact.direction < 0 ? 'bear' : 'neutral'}`}>
                                            {event.impact.direction > 0 ? '▲ BULLISH' : event.impact.direction < 0 ? '▼ BEARISH' : '— NEUTRAL'}
                                        </span>
                                        <span className="strategy-category">{event.category.toUpperCase()}</span>
                                    </div>
                                    <div className="strategy-event-right">
                                        <span className="strategy-grade-badge" style={{ background: grade.color + '20', color: grade.color, borderColor: grade.color }}>
                                            {grade.grade} — {grade.label}
                                        </span>
                                        <span className="strategy-expand">{isExpanded ? '▾' : '▸'}</span>
                                    </div>
                                </div>

                                <div className="strategy-headline">{event.headline}</div>

                                {isExpanded && event.strategy && (
                                    <div className="strategy-detail-panel">
                                        <div className="strategy-detail-row action">
                                            <span className="strategy-label">✅ Optimal Action</span>
                                            <span className="strategy-value">{event.strategy.action}</span>
                                        </div>
                                        <div className="strategy-detail-row reasoning">
                                            <span className="strategy-label">🧠 Reasoning</span>
                                            <span className="strategy-value">{event.strategy.reasoning}</span>
                                        </div>
                                        <div className="strategy-detail-row effect">
                                            <span className="strategy-label">📈 Expected Effect</span>
                                            <span className="strategy-value">{event.strategy.expectedEffect}</span>
                                        </div>
                                        <div className="strategy-detail-row principle">
                                            <span className="strategy-label">📖 Trading Principle</span>
                                            <span className="strategy-value">{event.strategy.principle}</span>
                                        </div>
                                        <div className="strategy-detail-row risk">
                                            <span className="strategy-label">⚠️ Risk Note</span>
                                            <span className="strategy-value">{event.strategy.riskNote}</span>
                                        </div>

                                        {playerTrades.length > 0 && (
                                            <div className="strategy-player-trades">
                                                <span className="strategy-label">🔄 Your Trades Near This Event</span>
                                                <div className="strategy-trades-list">
                                                    {playerTrades.map((t, ti) => (
                                                        <span key={ti} className={`strategy-trade-tag ${t.side}`}>
                                                            {t.side.toUpperCase()} {t.lots} @ ${t.price.toFixed(2)} (tick {t.tick})
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
