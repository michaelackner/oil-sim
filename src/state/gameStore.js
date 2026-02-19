import { create } from 'zustand';
import { PriceEngine } from '../engine/PriceEngine.js';
import { EventScheduler } from '../engine/EventScheduler.js';
import useCareerStore from './careerStore.js';
import { LOT_SIZE, DAILY_VOL_PCT, VAR_LIMIT, BASE_TICK_INTERVAL_MS, SPEED_MULTIPLIERS, TICKS_PER_ROUND } from '../utils/constants.js';

let priceEngine = null;
let eventScheduler = null;
let tickInterval = null;

const useGameStore = create((set, get) => ({
    // Game state
    gameStatus: 'menu', // 'menu' | 'playing' | 'paused' | 'finished'
    gameMode: 'learning', // 'learning' | 'trading'
    currentScenario: null,
    currentTick: 0,
    speed: 1,

    // Timer state (wall-clock for trading mode)
    startTime: null,
    elapsedTime: 0,

    // Price state
    currentPrice: 0,
    bidPrice: 0,
    askPrice: 0,
    priceHistory: [],
    candles: [],
    startPrice: 0,

    // News state
    newsItems: [],

    // Pending event popup state
    pendingEvent: null,
    pendingEventTrade: null,

    // Position state
    position: 0,
    averageEntry: 0,
    trades: [],

    // P&L state
    realisedPnL: 0,
    unrealisedPnL: 0,
    maxDrawdown: 0,
    peakPnL: 0,

    // Risk state
    varLimit: VAR_LIMIT,
    currentVar: 0,
    varBreaches: 0,

    // Momentum data (from PriceEngine)
    momentumData: null,

    // Event markers for chart
    eventMarkers: [],
    tradeMarkers: [],

    // Actions
    startGame: (scenario, mode = 'learning') => {
        // Stop any existing interval
        if (tickInterval) clearInterval(tickInterval);

        priceEngine = new PriceEngine(scenario.startPrice);
        eventScheduler = new EventScheduler(scenario);

        set({
            gameStatus: 'playing',
            gameMode: mode,
            currentScenario: scenario,
            currentTick: 0,
            speed: 1,
            currentPrice: scenario.startPrice,
            bidPrice: scenario.startPrice - 0.02,
            askPrice: scenario.startPrice + 0.02,
            priceHistory: [{ tick: 0, price: scenario.startPrice }],
            candles: [],
            startPrice: scenario.startPrice,
            newsItems: [{
                tick: 0,
                headline: `Simulation started — ${scenario.name}`,
                detail: scenario.description,
                category: 'system',
                isNoise: false,
                timestamp: formatTime(0),
            }],
            position: 0,
            averageEntry: 0,
            trades: [],
            realisedPnL: 0,
            unrealisedPnL: 0,
            maxDrawdown: 0,
            peakPnL: 0,
            currentVar: 0,
            varBreaches: 0,
            eventMarkers: [],
            tradeMarkers: [],
            momentumData: null,
            pendingEvent: null,
            pendingEventTrade: null,
            startTime: Date.now(),
            elapsedTime: 0,
        });

        // Start tick loop
        const state = get();
        tickInterval = setInterval(() => {
            get().advanceTick();
        }, BASE_TICK_INTERVAL_MS * SPEED_MULTIPLIERS[1]);
    },

    pauseGame: () => {
        const state = get();
        if (state.gameStatus === 'playing') {
            if (tickInterval) clearInterval(tickInterval);
            tickInterval = null;
            set({ gameStatus: 'paused' });
        } else if (state.gameStatus === 'paused') {
            const speed = state.speed;
            tickInterval = setInterval(() => {
                get().advanceTick();
            }, BASE_TICK_INTERVAL_MS * SPEED_MULTIPLIERS[speed]);
            set({ gameStatus: 'playing' });
        }
    },

    setSpeed: (speed) => {
        const state = get();
        if (state.gameStatus === 'playing') {
            if (tickInterval) clearInterval(tickInterval);
            tickInterval = setInterval(() => {
                get().advanceTick();
            }, BASE_TICK_INTERVAL_MS * SPEED_MULTIPLIERS[speed]);
        }
        set({ speed });
    },

    advanceTick: () => {
        if (!priceEngine || !eventScheduler) return;

        const state = get();
        if (state.gameStatus !== 'playing') return;

        // Check if scenario is finished
        if (eventScheduler.isFinished()) {
            if (tickInterval) clearInterval(tickInterval);
            tickInterval = null;

            // Calculate final unrealised P&L
            const finalUnrealised = state.position !== 0
                ? state.position * LOT_SIZE * (state.currentPrice - state.averageEntry)
                : 0;

            const elapsed = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;

            // Career Integration
            const career = useCareerStore.getState();
            const totalPnL = (state.realisedPnL || 0) + finalUnrealised;
            const tradeCount = state.tradeHistory ? state.tradeHistory.length : 0;

            let earnedXp = 400; // Base
            if (totalPnL > 0) earnedXp += 200;
            if (totalPnL > 100000) earnedXp += 500;

            career.addXp(earnedXp);
            if (state.scenario) {
                career.recordSession(totalPnL, tradeCount, state.scenario.id);
            }

            set({ gameStatus: 'finished', unrealisedPnL: finalUnrealised, elapsedTime: elapsed });
            return;
        }

        // Advance event scheduler
        const events = eventScheduler.tick();

        // Process impact events
        const newNewsItems = [];
        const newEventMarkers = [];
        let eventToPopup = null;
        for (const event of events.impactEvents) {
            priceEngine.applyEvent(event.impact);
            newNewsItems.push({
                tick: eventScheduler.currentTick,
                headline: event.headline,
                detail: event.detail,
                category: event.category,
                isNoise: false,
                impact: event.impact,
                timestamp: formatTime(eventScheduler.currentTick),
            });
            newEventMarkers.push({
                tick: eventScheduler.currentTick,
                direction: event.impact.direction,
                headline: event.headline,
            });
            // Queue the event for popup if it has a strategy annotation
            if (event.strategy) {
                eventToPopup = { ...event, tick: eventScheduler.currentTick };
            }
        }

        // Process noise events
        for (const headline of events.noiseHeadlines) {
            newNewsItems.push({
                tick: eventScheduler.currentTick,
                headline,
                detail: '',
                category: 'noise',
                isNoise: true,
                timestamp: formatTime(eventScheduler.currentTick),
            });
        }

        // Advance price engine
        const priceResult = priceEngine.tick();

        // Calculate unrealised P&L
        const unrealisedPnL = state.position !== 0
            ? state.position * LOT_SIZE * (priceResult.price - state.averageEntry)
            : 0;

        const totalPnL = state.realisedPnL + unrealisedPnL;
        const newPeakPnL = Math.max(state.peakPnL, totalPnL);
        const drawdownFromPeak = totalPnL - newPeakPnL;
        const newMaxDrawdown = Math.min(state.maxDrawdown, drawdownFromPeak);

        // Update VAR
        const newVar = Math.abs(state.position) * LOT_SIZE * priceResult.price * DAILY_VOL_PCT;

        const updates = {
            currentTick: eventScheduler.currentTick,
            currentPrice: priceResult.price,
            bidPrice: priceResult.bid,
            askPrice: priceResult.ask,
            priceHistory: [...state.priceHistory, { tick: priceResult.tick, price: priceResult.price }],
            unrealisedPnL,
            peakPnL: newPeakPnL,
            maxDrawdown: newMaxDrawdown,
            currentVar: newVar,
            momentumData: priceEngine.getMomentumData(),
        };

        if (priceResult.newCandle) {
            updates.candles = [...state.candles, priceResult.newCandle];
        }

        if (newNewsItems.length > 0) {
            updates.newsItems = [...state.newsItems, ...newNewsItems];
        }

        if (newEventMarkers.length > 0) {
            updates.eventMarkers = [...state.eventMarkers, ...newEventMarkers];
        }

        // If there's an impact event with strategy, auto-pause and show popup
        if (eventToPopup) {
            if (tickInterval) clearInterval(tickInterval);
            tickInterval = null;
            updates.gameStatus = 'paused';
            updates.pendingEvent = eventToPopup;
            updates.pendingEventTrade = null;
        }

        set(updates);
    },

    executeTrade: (side, lots) => {
        const state = get();
        if (state.gameStatus !== 'playing' && state.gameStatus !== 'paused') return false;

        const price = side === 'buy' ? state.askPrice : state.bidPrice;
        const signedLots = side === 'buy' ? lots : -lots;
        const newPosition = state.position + signedLots;

        // VAR check
        const newVar = Math.abs(newPosition) * LOT_SIZE * price * DAILY_VOL_PCT;
        if (newVar > state.varLimit) {
            set({ varBreaches: state.varBreaches + 1 });
            return false; // rejected
        }

        // Calculate realised P&L if reducing/closing/reversing position
        let realisedDelta = 0;
        if (state.position !== 0) {
            const isReducing = Math.sign(signedLots) !== Math.sign(state.position);
            if (isReducing) {
                const closedLots = Math.min(Math.abs(state.position), lots);
                realisedDelta = closedLots * LOT_SIZE * (price - state.averageEntry) * Math.sign(state.position);
            }
        }

        // Update average entry
        let newAvgEntry;
        if (newPosition === 0) {
            newAvgEntry = 0;
        } else if (state.position === 0) {
            // Opening new position
            newAvgEntry = price;
        } else if (Math.sign(newPosition) !== Math.sign(state.position)) {
            // Reversed through zero
            newAvgEntry = price;
        } else if (Math.sign(signedLots) === Math.sign(state.position)) {
            // Adding to existing position — weighted average
            newAvgEntry = (state.averageEntry * Math.abs(state.position) + price * lots) / Math.abs(newPosition);
        } else {
            // Partially reducing
            newAvgEntry = state.averageEntry;
        }

        const trade = {
            tick: state.currentTick,
            side,
            lots,
            price,
            timestamp: formatTime(state.currentTick),
        };

        const newTrades = [...state.trades, trade];
        const newRealisedPnL = state.realisedPnL + realisedDelta;
        const newUnrealisedPnL = newPosition !== 0
            ? newPosition * LOT_SIZE * (state.currentPrice - newAvgEntry)
            : 0;

        const totalPnL = newRealisedPnL + newUnrealisedPnL;
        const newPeakPnL = Math.max(state.peakPnL, totalPnL);
        const drawdownFromPeak = totalPnL - newPeakPnL;
        const newMaxDrawdown = Math.min(state.maxDrawdown, drawdownFromPeak);

        const tradeMarker = {
            tick: state.currentTick,
            side,
            lots,
            price,
        };

        set({
            position: newPosition,
            averageEntry: Math.round(newAvgEntry * 100) / 100,
            realisedPnL: newRealisedPnL,
            unrealisedPnL: newUnrealisedPnL,
            currentVar: newVar,
            trades: newTrades,
            tradeMarkers: [...state.tradeMarkers, tradeMarker],
            peakPnL: newPeakPnL,
            maxDrawdown: newMaxDrawdown,
        });

        return true;
    },

    flattenPosition: () => {
        const state = get();
        if (state.position === 0) return;
        const side = state.position > 0 ? 'sell' : 'buy';
        const lots = Math.abs(state.position);
        get().executeTrade(side, lots);
    },

    // Record what the player traded for the pending event popup
    recordPendingEventTrade: (side, lots) => {
        set({ pendingEventTrade: { side, lots } });
    },

    // Dismiss event popup and resume game
    dismissPendingEvent: () => {
        const state = get();
        set({ pendingEvent: null, pendingEventTrade: null });
        // Resume play
        if (state.gameStatus === 'paused') {
            const speed = state.speed;
            tickInterval = setInterval(() => {
                get().advanceTick();
            }, BASE_TICK_INTERVAL_MS * SPEED_MULTIPLIERS[speed]);
            set({ gameStatus: 'playing' });
        }
    },

    returnToMenu: () => {
        if (tickInterval) clearInterval(tickInterval);
        tickInterval = null;
        set({
            gameStatus: 'menu',
            gameMode: 'learning',
            currentScenario: null,
            currentTick: 0,
            startTime: null,
            elapsedTime: 0,
            momentumData: null,
        });
    },
}));

function formatTime(tick) {
    const baseHour = 9;
    const baseMin = 0;
    const totalMinutes = baseMin + tick;
    const hours = baseHour + Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export default useGameStore;
