import { useEffect, useRef, useCallback } from 'react';
import { createChart, ColorType, CrosshairMode, CandlestickSeries, createSeriesMarkers } from 'lightweight-charts';
import useGameStore from '../state/gameStore.js';

export default function PriceChart() {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const candleSeriesRef = useRef(null);
    const isInitialized = useRef(false);
    const prevCandleLen = useRef(0);

    const candles = useGameStore(s => s.candles);
    const gameStatus = useGameStore(s => s.gameStatus);
    const tradeMarkers = useGameStore(s => s.tradeMarkers);
    const eventMarkers = useGameStore(s => s.eventMarkers);
    const currentPrice = useGameStore(s => s.currentPrice);

    const destroyChart = useCallback(() => {
        try {
            if (chartRef.current) chartRef.current.remove();
        } catch (e) { /* ignore */ }
        chartRef.current = null;
        candleSeriesRef.current = null;
        isInitialized.current = false;
        prevCandleLen.current = 0;
    }, []);

    // Initialize chart when game starts
    useEffect(() => {
        if (gameStatus !== 'playing' && gameStatus !== 'paused' && gameStatus !== 'finished') {
            destroyChart();
            return;
        }
        if (isInitialized.current) return;

        // Wait for container to have dimensions
        const timer = setTimeout(() => {
            const container = chartContainerRef.current;
            if (!container) return;

            const w = container.clientWidth;
            const h = container.clientHeight;
            if (w === 0 || h === 0) return;

            try {
                const chart = createChart(container, {
                    width: w,
                    height: h,
                    layout: {
                        background: { type: ColorType.Solid, color: '#111827' },
                        textColor: '#94a3b8',
                        fontSize: 11,
                        fontFamily: "'JetBrains Mono', monospace",
                    },
                    grid: {
                        vertLines: { color: '#1e2d4530' },
                        horzLines: { color: '#1e2d4530' },
                    },
                    crosshair: {
                        mode: CrosshairMode.Normal,
                        vertLine: { color: '#3b82f650', style: 2, width: 1 },
                        horzLine: { color: '#3b82f650', style: 2, width: 1 },
                    },
                    rightPriceScale: {
                        borderColor: '#1e2d45',
                        scaleMargins: { top: 0.1, bottom: 0.1 },
                    },
                    timeScale: {
                        borderColor: '#1e2d45',
                        timeVisible: false,
                        rightOffset: 5,
                    },
                    handleScroll: { vertTouchDrag: false },
                });

                // v5 API: addSeries(CandlestickSeries, options)
                const series = chart.addSeries(CandlestickSeries, {
                    upColor: '#22c55e',
                    downColor: '#ef4444',
                    borderUpColor: '#22c55e',
                    borderDownColor: '#ef4444',
                    wickUpColor: '#22c55e90',
                    wickDownColor: '#ef444490',
                });

                chartRef.current = chart;
                candleSeriesRef.current = series;
                isInitialized.current = true;

                // Resize observer
                const ro = new ResizeObserver((entries) => {
                    for (const entry of entries) {
                        const { width: rw, height: rh } = entry.contentRect;
                        if (rw > 0 && rh > 0 && chartRef.current) {
                            try { chartRef.current.applyOptions({ width: rw, height: rh }); } catch (e) { /* */ }
                        }
                    }
                });
                ro.observe(container);
                container._ro = ro;
            } catch (err) {
                console.error('[PriceChart] Init error:', err);
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [gameStatus, destroyChart]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            destroyChart();
            if (chartContainerRef.current?._ro) {
                chartContainerRef.current._ro.disconnect();
            }
        };
    }, [destroyChart]);

    // Update candle data
    useEffect(() => {
        if (!candleSeriesRef.current || !isInitialized.current || candles.length === 0) return;

        try {
            if (prevCandleLen.current === 0 && candles.length > 1) {
                // First batch or reset
                candleSeriesRef.current.setData(candles);
            } else if (candles.length > prevCandleLen.current) {
                candleSeriesRef.current.update(candles[candles.length - 1]);
            }
            prevCandleLen.current = candles.length;

            // Build markers
            const markers = [];

            for (const trade of tradeMarkers) {
                const ct = Math.floor(trade.tick / 5) * 5 || 5;
                const mc = candles.find(c => c.time === ct);
                if (mc) {
                    markers.push({
                        time: mc.time,
                        position: trade.side === 'buy' ? 'belowBar' : 'aboveBar',
                        color: trade.side === 'buy' ? '#22c55e' : '#ef4444',
                        shape: trade.side === 'buy' ? 'arrowUp' : 'arrowDown',
                        text: `${trade.side.toUpperCase()} ${trade.lots}`,
                    });
                }
            }

            for (const event of eventMarkers) {
                const ct = Math.floor(event.tick / 5) * 5 || 5;
                const mc = candles.find(c => c.time === ct);
                if (mc) {
                    markers.push({
                        time: mc.time,
                        position: 'aboveBar',
                        color: event.direction > 0 ? '#22c55e80' : '#ef444480',
                        shape: 'circle',
                        text: '⚡',
                    });
                }
            }

            markers.sort((a, b) => a.time - b.time);

            // Deduplicate
            const seen = new Map();
            for (const m of markers) {
                const key = `${m.time}-${m.position}`;
                if (!seen.has(key)) seen.set(key, m);
            }

            // v5 API: createSeriesMarkers
            try {
                createSeriesMarkers(candleSeriesRef.current, [...seen.values()]);
            } catch (e) {
                // Fallback: try old API
                try {
                    candleSeriesRef.current.setMarkers([...seen.values()]);
                } catch (e2) { /* ignore */ }
            }

            if (chartRef.current) {
                chartRef.current.timeScale().scrollToRealTime();
            }
        } catch (err) {
            console.error('[PriceChart] Update error:', err);
        }
    }, [candles, tradeMarkers, eventMarkers]);

    return (
        <div className="panel">
            <div className="panel-header">
                <span className="panel-title">Price Chart — Brent Crude</span>
                <span style={{ fontSize: '12px', color: 'var(--text-bright)', fontVariantNumeric: 'tabular-nums' }}>
                    ${currentPrice.toFixed(2)}
                </span>
            </div>
            <div
                className="chart-container"
                ref={chartContainerRef}
                style={{ flex: 1, minHeight: 0 }}
            />
        </div>
    );
}
