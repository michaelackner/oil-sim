import useGameStore from '../state/gameStore.js';
import { VAR_LIMIT } from '../utils/constants.js';

export default function PositionTracker() {
    const {
        position, averageEntry, currentPrice,
        realisedPnL, unrealisedPnL, maxDrawdown,
        currentVar, varLimit, trades
    } = useGameStore();

    const totalPnL = realisedPnL + unrealisedPnL;
    const varPct = varLimit > 0 ? (currentVar / varLimit) * 100 : 0;

    const positionClass = position > 0 ? 'long' : position < 0 ? 'short' : 'flat';
    const positionLabel = position > 0 ? `LONG ${position}` : position < 0 ? `SHORT ${Math.abs(position)}` : 'FLAT';

    const pnlClass = (val) => val > 0 ? 'positive' : val < 0 ? 'negative' : '';
    const formatPnL = (val) => {
        const sign = val >= 0 ? '+' : '';
        return `${sign}$${Math.abs(Math.round(val)).toLocaleString()}`;
    };

    const varFillClass = varPct > 80 ? 'high' : varPct > 50 ? 'medium' : 'low';

    return (
        <div className="panel position-tracker">
            <div className="panel-header">
                <span className="panel-title">Position & P&L</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {trades.length} trades
                </span>
            </div>
            <div className="panel-body">
                <div className="position-main">
                    <div className="stat-item">
                        <span className="stat-label">Net Position</span>
                        <span className={`stat-value ${positionClass}`}>{positionLabel}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Avg Entry</span>
                        <span className="stat-value">
                            {averageEntry > 0 ? `$${averageEntry.toFixed(2)}` : '—'}
                        </span>
                    </div>
                </div>

                <div className="pnl-section">
                    <div className="stat-item">
                        <span className="stat-label">Unrealised</span>
                        <span className={`stat-value ${pnlClass(unrealisedPnL)}`}>
                            {formatPnL(unrealisedPnL)}
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Realised</span>
                        <span className={`stat-value ${pnlClass(realisedPnL)}`}>
                            {formatPnL(realisedPnL)}
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Total P&L</span>
                        <span className={`stat-value ${pnlClass(totalPnL)}`} style={{ fontSize: '18px' }}>
                            {formatPnL(totalPnL)}
                        </span>
                    </div>
                </div>

                <div className="var-gauge">
                    <div className="gauge-label">
                        <span>VAR Used</span>
                        <span>{Math.round(varPct)}% (${Math.round(currentVar).toLocaleString()} / ${varLimit.toLocaleString()})</span>
                    </div>
                    <div className="gauge-bar">
                        <div
                            className={`gauge-fill ${varFillClass}`}
                            style={{ width: `${Math.min(100, varPct)}%` }}
                        />
                    </div>
                </div>

                <div className="stat-item" style={{ marginTop: 'var(--gap-sm)' }}>
                    <span className="stat-label">Max Drawdown</span>
                    <span className={`stat-value ${pnlClass(maxDrawdown)}`} style={{ fontSize: '14px' }}>
                        {formatPnL(maxDrawdown)}
                    </span>
                </div>
            </div>
        </div>
    );
}
