/**
 * cargoStore.js
 *
 * Zustand store for the cargo hedging game state.
 */
import { create } from 'zustand';
import { CargoEngine } from '../engine/CargoEngine.js';
import useCareerStore from './careerStore.js';

const useCargoStore = create((set, get) => ({
    // ─── State ──────────────────────────────────────────────
    engine: null,
    scenario: null,
    phase: 'menu',         // menu | briefing | constructing | monitoring | settling | review
    engineState: null,      // Snapshot from engine.getState()
    settlement: null,       // Settlement results
    pendingEvent: null,     // BL shift event waiting for player response
    autoAdvanceTimer: null, // For pricing period animation

    // Player input state for hedge builder
    hedgeInput: {
        lots: '',
        month: '',
        direction: 0, // -1 = sell, 1 = buy
    },

    // ─── Actions ────────────────────────────────────────────

    /** Start a scenario */
    startScenario: (scenarioConfig) => {
        const engine = new CargoEngine(scenarioConfig);
        engine.phase = 'briefing';
        set({
            engine,
            scenario: scenarioConfig,
            phase: 'briefing',
            engineState: engine.getState(),
            settlement: null,
            pendingEvent: null,
            hedgeInput: { lots: '', month: '', direction: 0 },
        });
    },

    /** Move from briefing to constructing */
    beginConstructing: () => {
        const { engine } = get();
        if (!engine) return;
        engine.phase = 'constructing';
        set({ phase: 'constructing', engineState: engine.getState() });
    },

    /** Update hedge input fields */
    setHedgeInput: (field, value) => {
        set((state) => ({
            hedgeInput: { ...state.hedgeInput, [field]: value },
        }));
    },

    /** Place the initial hedge and move to monitoring */
    placeHedge: () => {
        const { engine, hedgeInput } = get();
        if (!engine) return;

        const lots = parseInt(hedgeInput.lots, 10);
        const month = hedgeInput.month;
        const direction = hedgeInput.direction;

        if (!lots || !month || !direction) return;

        // Place hedge (direction: -1 = sell = negative lots for short)
        engine.placeHedge(month, direction * lots);
        engine.phase = 'monitoring';

        // Advance a few days to get past the start
        set({
            phase: 'monitoring',
            engineState: engine.getState(),
        });
    },

    /** Place an additional hedge during the monitoring phase based on daily messages */
    placeHedgeDuringMonitoring: (month, lots, direction) => {
        const { engine } = get();
        if (!engine) return;
        engine.placeHedge(month, direction * lots);
        set({ engineState: engine.getState() });
    },

    /** Report the current deal sheet to risk management */
    reportToRisk: () => {
        const { engine } = get();
        if (!engine) return;
        engine.reportToRisk();
        set({ engineState: engine.getState() });
    },

    /** Advance one day during monitoring */
    advanceDay: () => {
        const { engine, phase } = get();
        if (!engine || phase !== 'monitoring') return;

        const events = engine.advanceDay();

        // Check if a BL shift event fired
        if (events.length > 0) {
            const blEvent = events.find(e => e.blShiftDays);
            if (blEvent) {
                set({
                    pendingEvent: blEvent,
                    engineState: engine.getState(),
                });
                return;
            }
        }

        const settlement = engine.calculateSettlement();
        engine.phase = 'review';

        // Career Integration
        const career = useCareerStore.getState();
        const totalPnL = settlement.unhedgedPnl + settlement.netHedgePnl;

        // Calculate XP
        let earnedXp = 500; // Base for completion
        if (totalPnL > 0) earnedXp += 200; // Profitable
        if (Math.abs(totalPnL) < 50000) earnedXp += 300; // Good hedge (low variance/error)

        career.addXp(earnedXp);
        career.recordSession(totalPnL, 1, scenario.id);

        set({
            phase: 'review',
            settlement,
            engineState: engine.getState(),
        });
        return;

        set({ engineState: engine.getState() });
    },

    /** Advance multiple days (fast forward) */
    advanceDays: (count) => {
        const { engine, phase } = get();
        if (!engine || phase !== 'monitoring') return;

        for (let i = 0; i < count; i++) {
            const events = engine.advanceDay();

            // If event fires, stop and show it
            if (events.length > 0) {
                const blEvent = events.find(e => e.blShiftDays);
                if (blEvent) {
                    set({
                        pendingEvent: blEvent,
                        engineState: engine.getState(),
                    });
                    return;
                }
            }

            // If pricing complete, settle
            if (engine.pricingComplete) {
                const settlement = engine.calculateSettlement();
                engine.phase = 'review';
                set({
                    phase: 'review',
                    settlement,
                    engineState: engine.getState(),
                });
                return;
            }
        }

        set({ engineState: engine.getState() });
    },

    /** Execute a roll after a BL shift event */
    executeRoll: (fromMonth, toMonth, lots) => {
        const { engine } = get();
        if (!engine) return;

        engine.rollHedge(fromMonth, toMonth, -lots); // Negative = short (selling futures)

        set({
            pendingEvent: null,
            engineState: engine.getState(),
        });
    },

    /** Skip the roll (don't adjust hedge after BL shift) */
    skipRoll: () => {
        set({ pendingEvent: null });
    },

    /** Move to settling phase (auto-advance through pricing period) */
    startSettling: () => {
        const { engine } = get();
        if (!engine) return;
        engine.phase = 'settling';
        set({ phase: 'settling' });
    },

    /** Run the pricing period (advance day by day) */
    tickPricing: () => {
        const { engine } = get();
        if (!engine) return;

        engine.advanceDay();

        const settlement = engine.calculateSettlement();
        engine.phase = 'review';

        // Career Integration
        const career = useCareerStore.getState();
        const totalPnL = settlement.unhedgedPnl + settlement.netHedgePnl;

        // Calculate XP
        let earnedXp = 500; // Base for completion
        if (totalPnL > 0) earnedXp += 200; // Profitable
        if (Math.abs(totalPnL) < 50000) earnedXp += 300; // Good hedge (low variance/error)

        career.addXp(earnedXp);
        career.recordSession(totalPnL, 1, get().scenario.id);

        set({
            phase: 'review',
            settlement,
            engineState: engine.getState(),
        });
        return;

        set({ engineState: engine.getState() });
    },

    /** Return to menu */
    returnToMenu: () => {
        set({
            engine: null,
            scenario: null,
            phase: 'menu',
            engineState: null,
            settlement: null,
            pendingEvent: null,
            hedgeInput: { lots: '', month: '', direction: 0 },
        });
    },
}));

export default useCargoStore;
