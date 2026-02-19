import useGameStore from '../state/gameStore.js';

/**
 * MomentumMeter — Learning Mode only component that shows:
 * 1. Event drift remaining (when momentum fades)
 * 2. Volatility level (how noisy the market is)
 * 3. Mean reversion pressure (natural pull direction)
 * 4. Contextual profit-taking guidance based on position + market state
 */
export default function MomentumMeter() {
    const momentumData = useGameStore(s => s.momentumData);
    const position = useGameStore(s => s.position);
    const unrealisedPnL = useGameStore(s => s.unrealisedPnL);
    const currentPrice = useGameStore(s => s.currentPrice);
    const gameMode = useGameStore(s => s.gameMode);

    // Only show in Learning Mode
    if (gameMode !== 'learning') return null;
    if (!momentumData) return null;

    const {
        activeDriftCount,
        totalRemainingTicks,
        maxRemainingTicks,
        netDriftDirection,
        volMultiplier,
        noiseAmplifier,
        meanRevPressurePct,
        meanRevDirection,
        longTermMean,
    } = momentumData;

    // === DRIFT STRENGTH ===
    const hasDrift = totalRemainingTicks > 0;
    const driftStrength = hasDrift
        ? maxRemainingTicks > 50 ? 'STRONG' : maxRemainingTicks > 25 ? 'MODERATE' : maxRemainingTicks > 10 ? 'FADING' : 'EXHAUSTED'
        : 'NONE';
    const driftClass = hasDrift
        ? maxRemainingTicks > 50 ? 'strong' : maxRemainingTicks > 25 ? 'moderate' : 'fading'
        : 'none';
    const driftPct = hasDrift ? Math.min(100, (maxRemainingTicks / 70) * 100) : 0;

    // === VOLATILITY ===
    const volLevel = volMultiplier >= 2.0 ? 'EXTREME' : volMultiplier >= 1.5 ? 'HIGH' : volMultiplier >= 1.15 ? 'ELEVATED' : 'NORMAL';
    const volClass = volMultiplier >= 2.0 ? 'extreme' : volMultiplier >= 1.5 ? 'high' : volMultiplier >= 1.15 ? 'elevated' : 'normal';
    const volPct = Math.min(100, ((volMultiplier - 1) / 1.5) * 100);

    // === MEAN REVERSION ===
    const meanRevActive = Math.abs(meanRevPressurePct) > 0.1;
    const meanRevLabel = meanRevDirection > 0 ? '▲ Upward pull' : meanRevDirection < 0 ? '▼ Downward pull' : '— Neutral';
    const meanRevClass = meanRevDirection > 0 ? 'bull' : meanRevDirection < 0 ? 'bear' : 'neutral';

    // === PROFIT-TAKING GUIDANCE ===
    const getGuidance = () => {
        if (position === 0) {
            // FLAT — general market read
            if (!hasDrift) {
                return {
                    icon: '⏸',
                    text: 'No active drift — market is in random walk mode. Wait for the next event before entering.',
                    type: 'wait',
                };
            }
            if (driftStrength === 'FADING' || driftStrength === 'EXHAUSTED') {
                return {
                    icon: '⏳',
                    text: 'Drift nearly exhausted. Late entry has poor risk/reward. Wait for the next catalyst.',
                    type: 'caution',
                };
            }
            return {
                icon: '📊',
                text: `Active drift ${netDriftDirection > 0 ? 'bullish ▲' : 'bearish ▼'} with ~${maxRemainingTicks} ticks remaining. Consider entering with the trend.`,
                type: 'opportunity',
            };
        }

        // HAS POSITION
        const isProfit = unrealisedPnL > 0;
        const isLoss = unrealisedPnL < 0;
        const positionBullish = position > 0;
        const driftAligned = (positionBullish && netDriftDirection > 0) || (!positionBullish && netDriftDirection < 0);
        const meanRevAligned = (positionBullish && meanRevDirection > 0) || (!positionBullish && meanRevDirection < 0);

        // Drift exhausted with profit → TAKE PROFIT
        if (!hasDrift && isProfit) {
            return {
                icon: '💰',
                text: 'TAKE PROFIT NOW — Drift is exhausted. No directional catalyst supporting your position. The market will random-walk or revert. Lock in gains before they fade.',
                type: 'take-profit',
            };
        }

        // Drift exhausted with loss → CUT LOSS
        if (!hasDrift && isLoss) {
            return {
                icon: '✂️',
                text: 'Consider cutting losses — No drift is supporting a recovery. Without a new event catalyst, the market won\'t trend back to your entry. Flatten and wait for the next opportunity.',
                type: 'cut-loss',
            };
        }

        // Drift fading & profitable
        if ((driftStrength === 'FADING' || driftStrength === 'EXHAUSTED') && isProfit) {
            return {
                icon: '⚠️',
                text: `Momentum fading — only ~${maxRemainingTicks} ticks of drift left. Take at least partial profit now. The move is entering its final phase.`,
                type: 'partial-profit',
            };
        }

        // Drift against position (wrong way)
        if (hasDrift && !driftAligned) {
            if (isProfit) {
                return {
                    icon: '🔄',
                    text: 'CAUTION — Drift is moving AGAINST your position. Take profit before the trend erodes your gains. Consider reversing.',
                    type: 'take-profit',
                };
            }
            return {
                icon: '🚨',
                text: 'DANGER — Drift is pushing AGAINST you. The market is trending away from your position. Consider flattening.',
                type: 'cut-loss',
            };
        }

        // Drift aligned, strong
        if (hasDrift && driftAligned && driftStrength === 'STRONG') {
            return {
                icon: '🚀',
                text: `Strong drift supporting your position (~${maxRemainingTicks} ticks remaining). Hold for now — take partial profit when drift falls below 25 ticks.`,
                type: 'hold',
            };
        }

        // Drift aligned, moderate
        if (hasDrift && driftAligned && driftStrength === 'MODERATE') {
            return {
                icon: '📈',
                text: `Drift still supporting you (~${maxRemainingTicks} ticks left). Consider taking 30–50% partial profit to lock in gains while riding the rest.`,
                type: 'partial-profit',
            };
        }

        // Mean reversion going against position, no drift
        if (!hasDrift && meanRevActive && !meanRevAligned) {
            return {
                icon: '🧲',
                text: `Mean reversion pulling price ${meanRevDirection > 0 ? 'UP' : 'DOWN'} (toward $${longTermMean.toFixed(2)}). This works against your ${positionBullish ? 'long' : 'short'}. Consider exiting.`,
                type: 'caution',
            };
        }

        // Default — generic guidance
        if (isProfit) {
            return {
                icon: '💡',
                text: 'Position is profitable. Monitor drift and volatility for exit timing.',
                type: 'neutral',
            };
        }

        return {
            icon: '🔍',
            text: 'Watch for the next event. Market is in normal fluctuation mode.',
            type: 'neutral',
        };
    };

    const guidance = getGuidance();

    return (
        <div className="panel momentum-meter">
            <div className="panel-header">
                <span className="panel-title">📡 Market Momentum</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    Learning Mode
                </span>
            </div>
            <div className="panel-body">
                {/* Event Drift Gauge */}
                <div className="momentum-row">
                    <div className="momentum-label">
                        <span className="mm-label">Event Drift</span>
                        <span className={`mm-badge drift-${driftClass}`}>{driftStrength}</span>
                    </div>
                    <div className="momentum-bar">
                        <div className={`momentum-fill drift-${driftClass}`} style={{ width: `${driftPct}%` }} />
                    </div>
                    <div className="momentum-detail">
                        {hasDrift ? (
                            <>
                                <span>{netDriftDirection > 0 ? '▲' : netDriftDirection < 0 ? '▼' : '—'} {maxRemainingTicks} ticks left</span>
                                <span className="mm-sub">{activeDriftCount} active drift{activeDriftCount > 1 ? 's' : ''}</span>
                            </>
                        ) : (
                            <span className="mm-sub">No event-driven motion — random walk</span>
                        )}
                    </div>
                </div>

                {/* Volatility Gauge */}
                <div className="momentum-row">
                    <div className="momentum-label">
                        <span className="mm-label">Volatility</span>
                        <span className={`mm-badge vol-${volClass}`}>{volLevel}</span>
                    </div>
                    <div className="momentum-bar">
                        <div className={`momentum-fill vol-${volClass}`} style={{ width: `${volPct}%` }} />
                    </div>
                    <div className="momentum-detail">
                        <span>{volMultiplier.toFixed(2)}× base vol</span>
                        <span className="mm-sub">Noise: {noiseAmplifier.toFixed(2)}×</span>
                    </div>
                </div>

                {/* Mean Reversion */}
                <div className="momentum-row">
                    <div className="momentum-label">
                        <span className="mm-label">Mean Rev.</span>
                        <span className={`mm-badge meanrev-${meanRevClass}`}>{meanRevLabel}</span>
                    </div>
                    <div className="momentum-detail" style={{ width: '100%' }}>
                        <span>Equilibrium: ${longTermMean.toFixed(2)}</span>
                        <span className="mm-sub">
                            {meanRevActive ?
                                `Price ${meanRevPressurePct > 0 ? 'below' : 'above'} equilibrium by ${Math.abs(meanRevPressurePct).toFixed(2)}%`
                                : 'Price at equilibrium'
                            }
                        </span>
                    </div>
                </div>

                {/* Guidance Box */}
                <div className={`momentum-guidance guidance-${guidance.type}`}>
                    <span className="guidance-icon">{guidance.icon}</span>
                    <span className="guidance-text">{guidance.text}</span>
                </div>
            </div>
        </div>
    );
}
