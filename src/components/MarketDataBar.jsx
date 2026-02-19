import useGameStore from '../state/gameStore.js';

export default function MarketDataBar() {
    const { currentPrice, startPrice, currentTick, speed, gameStatus } = useGameStore();
    const { setSpeed, pauseGame } = useGameStore();
    const scenario = useGameStore(s => s.currentScenario);

    const change = currentPrice - startPrice;
    const changePct = startPrice > 0 ? (change / startPrice * 100) : 0;
    const changeClass = change >= 0 ? 'positive' : 'negative';

    // Approximate WTI from Brent with correlated spread
    const wtiSpread = 3.80 + (Math.random() - 0.5) * 0.2;
    const wtiPrice = currentPrice - wtiSpread;
    const wtiChange = change * 0.85;

    const totalTicks = scenario?.totalTicks || 300;
    const progress = Math.min(100, (currentTick / totalTicks) * 100);

    return (
        <div className="market-data-bar">
            <div className="ticker-items">
                <div className="ticker-item">
                    <span className="ticker-label">Brent:</span>
                    <span className="ticker-value">{currentPrice.toFixed(2)}</span>
                    <span className={`ticker-change ${changeClass}`}>
                        ({change >= 0 ? '+' : ''}{change.toFixed(2)} / {changePct >= 0 ? '+' : ''}{changePct.toFixed(1)}%)
                    </span>
                </div>
                <div className="ticker-item" style={{ opacity: 0.6 }}>
                    <span className="ticker-label">WTI:</span>
                    <span className="ticker-value">{wtiPrice.toFixed(2)}</span>
                    <span className={`ticker-change ${changeClass}`}>
                        ({wtiChange >= 0 ? '+' : ''}{wtiChange.toFixed(2)})
                    </span>
                </div>
                <div className="ticker-item" style={{ opacity: 0.6 }}>
                    <span className="ticker-label">Spread:</span>
                    <span className="ticker-value">{wtiSpread.toFixed(2)}</span>
                </div>
                <div className="ticker-item">
                    <span className="ticker-label">Tick:</span>
                    <span className="ticker-value">{currentTick}/{totalTicks}</span>
                </div>
                <div style={{
                    width: '80px',
                    height: '4px',
                    background: 'var(--bg-input)',
                    borderRadius: '2px',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        background: 'var(--cyan)',
                        borderRadius: '2px',
                        transition: 'width 0.3s ease',
                    }} />
                </div>
            </div>

            <div className="speed-controls">
                {[1, 2, 5].map(s => (
                    <button
                        key={s}
                        className={`speed-btn ${speed === s ? 'active' : ''}`}
                        onClick={() => setSpeed(s)}
                    >
                        {s}x
                    </button>
                ))}
                <button
                    className={`pause-btn ${gameStatus === 'paused' ? 'paused' : ''}`}
                    onClick={pauseGame}
                >
                    {gameStatus === 'paused' ? '▶' : '⏸'}
                </button>
            </div>
        </div>
    );
}
