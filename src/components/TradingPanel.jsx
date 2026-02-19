import { useEffect, useState, useCallback } from 'react';
import useGameStore from '../state/gameStore.js';

export default function TradingPanel() {
    const { bidPrice, askPrice, currentPrice, gameStatus, executeTrade, flattenPosition } = useGameStore();
    const [flash, setFlash] = useState(null);

    const handleTrade = useCallback((side, lots) => {
        const success = executeTrade(side, lots);
        if (success) {
            setFlash({ type: side, text: `${side.toUpperCase()} ${lots}` });
        } else {
            setFlash({ type: 'rejected', text: 'VAR LIMIT' });
        }
        setTimeout(() => setFlash(null), 600);
    }, [executeTrade]);

    const handleFlatten = useCallback(() => {
        flattenPosition();
        setFlash({ type: 'sell', text: 'FLATTEN' });
        setTimeout(() => setFlash(null), 600);
    }, [flattenPosition]);

    // Keyboard shortcuts
    useEffect(() => {
        const handler = (e) => {
            if (gameStatus !== 'playing') return;
            // Don't capture if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            const key = e.key.toLowerCase();

            if (key === 'b' && !e.shiftKey) {
                e.preventDefault();
                handleTrade('buy', 1);
            } else if (key === 'b' && e.shiftKey) {
                e.preventDefault();
                handleTrade('buy', 5);
            } else if (key === 's' && !e.shiftKey) {
                e.preventDefault();
                handleTrade('sell', 1);
            } else if (key === 's' && e.shiftKey) {
                e.preventDefault();
                handleTrade('sell', 5);
            } else if (key === 'f') {
                e.preventDefault();
                handleFlatten();
            } else if (key === ' ') {
                e.preventDefault();
                useGameStore.getState().pauseGame();
            } else if (key === '1') {
                useGameStore.getState().setSpeed(1);
            } else if (key === '2') {
                useGameStore.getState().setSpeed(2);
            } else if (key === '3') {
                useGameStore.getState().setSpeed(5);
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [gameStatus, handleTrade, handleFlatten]);

    const isActive = gameStatus === 'playing';

    return (
        <div className="panel trading-panel">
            <div className="panel-header">
                <span className="panel-title">Trade</span>
            </div>
            <div className="panel-body">
                <div className="price-display">
                    <div className="price-box bid">
                        <div className="label">Bid</div>
                        <div className="price">${bidPrice.toFixed(2)}</div>
                    </div>
                    <div className="price-box mid">
                        <div className="label">Mid</div>
                        <div className="price">${currentPrice.toFixed(2)}</div>
                    </div>
                    <div className="price-box ask">
                        <div className="label">Ask</div>
                        <div className="price">${askPrice.toFixed(2)}</div>
                    </div>
                </div>

                <div className="trade-buttons">
                    <div className="trade-button-row">
                        <button className="trade-btn buy" disabled={!isActive} onClick={() => handleTrade('buy', 1)}>Buy 1</button>
                        <button className="trade-btn buy" disabled={!isActive} onClick={() => handleTrade('buy', 5)}>Buy 5</button>
                        <button className="trade-btn buy" disabled={!isActive} onClick={() => handleTrade('buy', 10)}>Buy 10</button>
                    </div>
                    <div className="trade-button-row">
                        <button className="trade-btn sell" disabled={!isActive} onClick={() => handleTrade('sell', 1)}>Sell 1</button>
                        <button className="trade-btn sell" disabled={!isActive} onClick={() => handleTrade('sell', 5)}>Sell 5</button>
                        <button className="trade-btn sell" disabled={!isActive} onClick={() => handleTrade('sell', 10)}>Sell 10</button>
                    </div>
                    <button className="trade-btn flatten" disabled={!isActive} onClick={handleFlatten}>⊠ Flatten All</button>
                </div>

                <div className="keyboard-hints">
                    <span className="kbd-hint"><kbd>B</kbd> Buy 1</span>
                    <span className="kbd-hint"><kbd>S</kbd> Sell 1</span>
                    <span className="kbd-hint"><kbd>⇧B</kbd> Buy 5</span>
                    <span className="kbd-hint"><kbd>⇧S</kbd> Sell 5</span>
                    <span className="kbd-hint"><kbd>F</kbd> Flatten</span>
                    <span className="kbd-hint"><kbd>␣</kbd> Pause</span>
                </div>
            </div>

            {flash && (
                <div className={`trade-flash ${flash.type}`}>
                    {flash.text}
                </div>
            )}
        </div>
    );
}
