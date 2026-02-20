/**
 * CargoEngine.js
 *
 * Core simulation engine for the oil cargo hedging game.
 * Handles: forward curve generation & evolution, cargo pricing,
 * hedge position tracking, hedge rolls, and settlement math.
 */

// ─── Forward Curve ──────────────────────────────────────────────
/**
 * Generates and evolves a multi-month futures forward curve.
 * Shape can be contango (upward slope) or backwardation (downward).
 */
export class ForwardCurve {
    /**
     * @param {Object} config
     * @param {number} config.basePrice        - Front month price (e.g. 82.00)
     * @param {number} config.monthSpread      - Per-month spread (positive = contango, negative = backwardation)
     * @param {number} config.months           - Number of months to generate (default 6)
     * @param {number} config.volatility       - Daily vol in $/bbl (default 0.80)
     * @param {string[]} config.monthLabels    - Labels like ['Feb', 'Mar', 'Apr', ...]
     */
    constructor(config) {
        this.basePrice = config.basePrice;
        this.monthSpread = config.monthSpread; // +0.25 = contango, -0.30 = backwardation
        this.numMonths = config.months || 6;
        this.volatility = config.volatility || 0.80;
        this.monthLabels = config.monthLabels || [];

        // Build initial curve
        this.prices = {};
        for (let i = 0; i < this.numMonths; i++) {
            const label = this.monthLabels[i] || `M${i + 1}`;
            this.prices[label] = +(this.basePrice + i * this.monthSpread).toFixed(2);
        }

        this.history = [{ ...this.prices }]; // Track daily snapshots
    }

    /**
     * Evolve the curve by one trading day.
     * Applies correlated random walk to all months (parallel shift + slight twist).
     */
    tickDay() {
        // Parallel shift — the whole curve moves together
        const parallelShift = (Math.random() - 0.5) * 2 * this.volatility;
        // Small twist — front months move slightly more than back months
        const twist = (Math.random() - 0.5) * 0.15;

        const labels = Object.keys(this.prices);
        labels.forEach((label, i) => {
            const twistFactor = 1 - (i / labels.length) * twist;
            this.prices[label] = +(this.prices[label] + parallelShift * twistFactor).toFixed(2);
        });

        this.history.push({ ...this.prices });
    }

    /** Get current price for a specific month */
    getPrice(monthLabel) {
        return this.prices[monthLabel];
    }

    /** Get the spread between two months */
    getSpread(monthA, monthB) {
        return +((this.prices[monthB] || 0) - (this.prices[monthA] || 0)).toFixed(2);
    }

    /** Get all current prices */
    getCurve() {
        return { ...this.prices };
    }

    /** Is the curve in contango (front < back) or backwardation? */
    getStructure() {
        const labels = Object.keys(this.prices);
        if (labels.length < 2) return 'flat';
        const front = this.prices[labels[0]];
        const back = this.prices[labels[labels.length - 1]];
        if (back > front + 0.10) return 'contango';
        if (front > back + 0.10) return 'backwardation';
        return 'flat';
    }
}


// ─── Hedge Position ─────────────────────────────────────────────

export class HedgePosition {
    /**
     * @param {string} month       - Futures month label (e.g. 'Mar')
     * @param {number} lots        - Number of lots (positive = long, negative = short)
     * @param {number} entryPrice  - Entry price per barrel
     */
    constructor(month, lots, entryPrice) {
        this.month = month;
        this.lots = lots; // Negative = short (selling futures)
        this.entryPrice = entryPrice;
        this.exitPrice = null;
        this.closed = false;
    }

    /** Close the position at a given price */
    close(exitPrice) {
        this.exitPrice = exitPrice;
        this.closed = true;
    }

    /** P&L per barrel */
    get pnlPerBarrel() {
        if (this.exitPrice === null) return 0;
        return this.lots > 0
            ? this.exitPrice - this.entryPrice
            : this.entryPrice - this.exitPrice;
    }

    /** Total P&L in dollars */
    get totalPnl() {
        return Math.abs(this.lots) * 1000 * this.pnlPerBarrel;
    }

    /** Notional value */
    get notional() {
        return Math.abs(this.lots) * 1000 * this.entryPrice;
    }
}


// ─── Cargo ──────────────────────────────────────────────────────

export class Cargo {
    /**
     * @param {Object} config
     * @param {string} config.grade        - e.g. 'Brent Crude (Forties Blend)'
     * @param {number} config.volume       - barrels (e.g. 600000)
     * @param {string} config.origin       - e.g. 'Hound Point, North Sea'
     * @param {string} config.destination  - e.g. 'Rotterdam'
     * @param {number} config.blDay        - BL date as day-of-simulation (e.g. day 30)
     * @param {number} config.pricingDays  - Number of pricing days around BL (default 5)
     * @param {string} config.pricingType  - 'around' | 'after' (default 'around')
     */
    constructor(config) {
        this.grade = config.grade;
        this.volume = config.volume;
        this.origin = config.origin;
        this.destination = config.destination;
        this.blDay = config.blDay;
        this.originalBlDay = config.blDay;
        this.pricingDays = config.pricingDays || 5;
        this.pricingType = config.pricingType || 'around';
    }

    /** Which lots count does this cargo need? */
    get requiredLots() {
        return Math.round(this.volume / 1000);
    }

    /** Shift the BL date by N days */
    shiftBL(days) {
        this.blDay += days;
    }

    /**
     * Get the pricing period day range [startDay, endDay] (inclusive).
     * For 'around': center on BL, extend 2 days each side for 5-day.
     * For 'after': start at BL, go forward.
     */
    getPricingRange() {
        const half = Math.floor(this.pricingDays / 2);
        if (this.pricingType === 'around') {
            return {
                start: this.blDay - half,
                end: this.blDay + half,
            };
        }
        // 'after'
        return {
            start: this.blDay,
            end: this.blDay + this.pricingDays - 1,
        };
    }
}


// ─── Main Engine ────────────────────────────────────────────────

export class CargoEngine {
    /**
     * @param {Object} scenarioConfig - A scenario from cargoScenarios.js
     */
    constructor(scenarioConfig) {
        this.scenario = scenarioConfig;

        // Create the cargo
        this.cargo = new Cargo(scenarioConfig.cargo);

        // Create forward curve
        this.curve = new ForwardCurve(scenarioConfig.curve);

        // Month boundaries — maps month labels to day ranges
        // e.g. { 'Feb': [1, 20], 'Mar': [21, 42], 'Apr': [43, 63], ... }
        this.monthBoundaries = scenarioConfig.monthBoundaries;

        // Hedge positions
        this.hedgePositions = [];

        // Events (BL shifts) — sorted by trigger day
        this.events = [...(scenarioConfig.events || [])].sort((a, b) => a.triggerDay - b.triggerDay);
        this.firedEvents = [];

        // Simulation state
        this.currentDay = 0;
        this.totalDays = scenarioConfig.totalDays || 60;
        this.pricingDailyPrices = []; // prices collected during pricing period
        this.phase = 'briefing'; // briefing → constructing → monitoring → settling → review

        // New features: Messages and Deal Sheet
        this.messages = [];
        this.riskReportStatus = null; // null | 'caught' | 'false_alarm'

        // Generate the Deal Sheet (10% chance of error)
        this.dealSheetError = Math.random() < 0.10;
        const actualVolume = this.cargo.volume;

        // Base deal sheet details
        this.dealSheet = {
            id: `TRADE-${Math.floor(Math.random() * 90000) + 10000}`,
            counterparty: 'Global Energy Trading Ltd',
            tradeDate: 'Today',
            grade: this.cargo.grade,
            volume: actualVolume,
            pricingTerms: `${this.cargo.pricingDays} days ${this.cargo.pricingType} BL (Dated Brent)`,
        };

        // If error, perturb either volume or something else noticeable
        if (this.dealSheetError) {
            // Error case: volume differs by 10%
            const errorVolume = actualVolume + (Math.random() > 0.5 ? 100000 : -100000);
            this.dealSheet.volume = errorVolume;
        }

        // Add initial message
        this.messages.push({
            day: 0,
            sender: 'Desk Head',
            text: `Morning. We just booked the ${this.cargo.grade} cargo. Deal sheet ${this.dealSheet.id} is attached. Review the exposure and start hedging.`,
            isDealSheet: true
        });

        // Roll history
        this.rollHistory = [];

        // For the pricing period ticker
        this.pricingStarted = false;
        this.pricingComplete = false;
    }

    /** Get the month label for a given simulation day */
    getMonthForDay(day) {
        for (const [label, [start, end]] of Object.entries(this.monthBoundaries)) {
            if (day >= start && day <= end) return label;
        }
        // Beyond boundaries — return last month
        const labels = Object.keys(this.monthBoundaries);
        return labels[labels.length - 1];
    }

    /** Get the correct hedge month based on current BL date */
    getRecommendedHedgeMonth() {
        const pricingRange = this.cargo.getPricingRange();
        // Count pricing days in each month
        const monthDays = {};
        for (let d = pricingRange.start; d <= pricingRange.end; d++) {
            const m = this.getMonthForDay(d);
            monthDays[m] = (monthDays[m] || 0) + 1;
        }
        // Return the month with the most pricing days
        let best = null;
        let bestCount = 0;
        for (const [m, count] of Object.entries(monthDays)) {
            if (count > bestCount) {
                best = m;
                bestCount = count;
            }
        }
        return { primaryMonth: best, monthBreakdown: monthDays };
    }

    /** Get the split of pricing days across months (for split-month scenarios) */
    getPricingMonthSplit() {
        const pricingRange = this.cargo.getPricingRange();
        const monthDays = {};
        for (let d = pricingRange.start; d <= pricingRange.end; d++) {
            const m = this.getMonthForDay(d);
            monthDays[m] = (monthDays[m] || 0) + 1;
        }
        return monthDays;
    }

    /**
     * Place a hedge.
     * @param {string} month - Futures month label
     * @param {number} lots - Number of lots (positive = buy, negative = sell)
     * @returns {HedgePosition}
     */
    placeHedge(month, lots) {
        const price = this.curve.getPrice(month);
        const pos = new HedgePosition(month, lots, price);
        this.hedgePositions.push(pos);
        return pos;
    }

    /**
     * Roll hedge lots from one month to another.
     * Closes lots in fromMonth and opens in toMonth at current prices.
     * @returns {Object} Roll details
     */
    rollHedge(fromMonth, toMonth, lotsToRoll) {
        // Find open positions in fromMonth
        const fromPositions = this.hedgePositions.filter(
            p => p.month === fromMonth && !p.closed
        );

        let lotsRemaining = Math.abs(lotsToRoll);
        const closedPositions = [];

        for (const pos of fromPositions) {
            if (lotsRemaining <= 0) break;
            const posLots = Math.abs(pos.lots);
            const closeLots = Math.min(posLots, lotsRemaining);

            if (closeLots === posLots) {
                // Close entire position
                pos.close(this.curve.getPrice(fromMonth));
                closedPositions.push(pos);
            } else {
                // Partial close — split position
                const partialExit = this.curve.getPrice(fromMonth);
                // Reduce the original position
                pos.lots = pos.lots > 0 ? pos.lots - closeLots : pos.lots + closeLots;
                // Create a closed partial position for tracking
                const closed = new HedgePosition(fromMonth, lotsToRoll > 0 ? closeLots : -closeLots, pos.entryPrice);
                closed.close(partialExit);
                closedPositions.push(closed);
                this.hedgePositions.push(closed);
            }
            lotsRemaining -= closeLots;
        }

        // Open new position in toMonth
        const direction = lotsToRoll > 0 ? Math.abs(lotsToRoll) : -Math.abs(lotsToRoll);
        const newPos = this.placeHedge(toMonth, direction);

        const spread = this.curve.getSpread(fromMonth, toMonth);
        const rollCost = spread * Math.abs(lotsToRoll) * 1000;

        const rollRecord = {
            day: this.currentDay,
            fromMonth,
            toMonth,
            lots: Math.abs(lotsToRoll),
            spread,
            rollCost,
            fromPrice: this.curve.getPrice(fromMonth),
            toPrice: this.curve.getPrice(toMonth),
        };

        this.rollHistory.push(rollRecord);
        return rollRecord;
    }

    /**
     * Advance one trading day.
     * Returns any events that fire on this day.
     */
    advanceDay() {
        this.currentDay++;
        this.curve.tickDay();

        // Check for events
        const dayEvents = this.events.filter(e => e.triggerDay === this.currentDay && !e.fired);
        dayEvents.forEach(e => {
            e.fired = true;
            this.firedEvents.push(e);
            // Apply BL shift
            if (e.blShiftDays) {
                this.cargo.shiftBL(e.blShiftDays);
            }
        });

        // Check if we're in the pricing period
        const pricingRange = this.cargo.getPricingRange();
        if (this.currentDay >= pricingRange.start && this.currentDay <= pricingRange.end) {
            this.pricingStarted = true;
            // During pricing period, record daily prices for the primary month(s)
            const monthSplit = this.getPricingMonthSplit();
            const months = Object.keys(monthSplit);
            // Use weighted price from relevant months
            let weightedPrice = 0;
            let totalWeight = 0;
            const monthForToday = this.getMonthForDay(this.currentDay);
            // The pricing uses Dated Brent, which tracks closest month
            const price = this.curve.getPrice(monthForToday) || this.curve.getPrice(months[0]);
            this.pricingDailyPrices.push({
                day: this.currentDay,
                price,
                month: monthForToday,
            });

            // Generate daily recap message from trader if during pricing
            this.messages.push({
                day: this.currentDay,
                sender: 'Trader',
                text: `Daily Pricing Recap: Physical priced at $${price.toFixed(2)} for ${monthForToday}.`
            });
        }

        if (this.currentDay > pricingRange.end && this.pricingStarted) {
            this.pricingComplete = true;
        }

        // Generate occasional random market chatter
        if (this.currentDay > 0 && Math.random() < 0.1 && !this.pricingStarted) {
            const chatter = [
                "Market feels heavy today, bids are pulling back.",
                "Seeing strong buying interest in the front month.",
                "Just heard a rumor about reduced OPEC output, might see a bump.",
                "Quiet session today, vols are collapsing.",
                "Spreads are getting blown out, careful if you need to roll soon."
            ];
            const msg = chatter[Math.floor(Math.random() * chatter.length)];
            this.messages.push({
                day: this.currentDay,
                sender: 'Trader',
                text: msg
            });
        }

        return dayEvents;
    }

    /** Fast-forward to a specific day (for skipping ahead) */
    advanceToDay(targetDay) {
        const events = [];
        while (this.currentDay < targetDay) {
            const dayEvents = this.advanceDay();
            events.push(...dayEvents);
        }
        return events;
    }

    /** Calculate the physical cargo price (average of pricing period) */
    getPhysicalPrice() {
        if (this.pricingDailyPrices.length === 0) return null;
        const sum = this.pricingDailyPrices.reduce((s, p) => s + p.price, 0);
        return +(sum / this.pricingDailyPrices.length).toFixed(2);
    }

    /**
     * Close all remaining open hedge positions at current prices.
     */
    closeAllHedges() {
        this.hedgePositions.forEach(pos => {
            if (!pos.closed) {
                pos.close(this.curve.getPrice(pos.month));
            }
        });
    }

    /**
     * Report an error to risk management based on the deal sheet
     */
    reportToRisk() {
        if (this.riskReportStatus) return; // already reported

        if (this.dealSheetError) {
            this.riskReportStatus = 'caught';
            this.messages.push({
                day: this.currentDay,
                sender: 'Risk Dept',
                text: `Good catch on ${this.dealSheet.id}! The entered volume did not match the cargo docket. We've amended the trade. Bonus XP awarded.`
            });
        } else {
            this.riskReportStatus = 'false_alarm';
            this.messages.push({
                day: this.currentDay,
                sender: 'Risk Dept',
                text: `We reviewed ${this.dealSheet.id} and found no discrepancies. Try to be more careful before escalating to Risk.`
            });
        }
    }

    /**
     * Calculate final settlement and scoring.
     */
    calculateSettlement() {
        // Close any remaining open hedges
        this.closeAllHedges();

        const physicalPrice = this.getPhysicalPrice();
        const volume = this.cargo.volume;

        // Hedge P&L
        const hedgePnl = this.hedgePositions
            .filter(p => p.closed)
            .reduce((sum, p) => sum + p.totalPnl, 0);

        // Roll costs
        const totalRollCost = this.rollHistory.reduce((sum, r) => sum + r.rollCost, 0);

        // Net hedge P&L
        const netHedgePnl = hedgePnl; // Roll cost is already embedded in entry/exit prices

        // Weighted average hedge entry price
        const openPositions = this.hedgePositions.filter(p => p.lots < 0); // short hedges
        const totalLots = openPositions.reduce((s, p) => s + Math.abs(p.lots), 0);
        const weightedEntry = totalLots > 0
            ? openPositions.reduce((s, p) => s + Math.abs(p.lots) * p.entryPrice, 0) / totalLots
            : 0;

        // Initial curve price (what you hedged at originally)
        const initialEntryPrices = this.hedgePositions
            .filter(p => p.lots < 0)
            .map(p => p.entryPrice);
        const firstEntryPrice = initialEntryPrices.length > 0
            ? initialEntryPrices[0]
            : this.curve.history[0]?.[Object.keys(this.curve.prices)[0]] || 0;

        // Unhedged P&L: what would have happened without the hedge
        // If you're long physical, price dropping is bad
        const priceChange = physicalPrice - firstEntryPrice;
        const unhedgedPnl = priceChange * volume;

        // Effective price = physical price + hedge gain per barrel
        const hedgeGainPerBarrel = netHedgePnl / volume;
        const effectivePrice = +(physicalPrice + hedgeGainPerBarrel).toFixed(2);

        // Hedge effectiveness: how much of the price move did the hedge offset?
        const totalExposure = Math.abs(priceChange) * volume;
        const hedgeEffectiveness = totalExposure > 0
            ? Math.min(100, Math.round((Math.abs(netHedgePnl) / totalExposure) * 100))
            : 100; // If price didn't move, hedge is 100% effective (trivially)

        // Grade
        let grade, gradeClass;
        if (hedgeEffectiveness >= 95) { grade = 'A+'; gradeClass = 'grade-a'; }
        else if (hedgeEffectiveness >= 85) { grade = 'A'; gradeClass = 'grade-a'; }
        else if (hedgeEffectiveness >= 75) { grade = 'B+'; gradeClass = 'grade-b'; }
        else if (hedgeEffectiveness >= 65) { grade = 'B'; gradeClass = 'grade-b'; }
        else if (hedgeEffectiveness >= 50) { grade = 'C'; gradeClass = 'grade-c'; }
        else { grade = 'D'; gradeClass = 'grade-f'; }

        return {
            physicalPrice,
            volume,
            firstEntryPrice,
            effectivePrice,
            hedgePnl: Math.round(hedgePnl),
            netHedgePnl: Math.round(netHedgePnl),
            rollCosts: Math.round(totalRollCost),
            unhedgedPnl: Math.round(unhedgedPnl),
            hedgeEffectiveness,
            grade,
            gradeClass,
            pricingDays: this.pricingDailyPrices,
            rollHistory: this.rollHistory,
            hedgePositions: this.hedgePositions,
            priceChange: +priceChange.toFixed(2),
        };
    }

    /** Get snapshot of current state for UI */
    getState() {
        const pricingRange = this.cargo.getPricingRange();
        const monthSplit = this.getPricingMonthSplit();
        const recommended = this.getRecommendedHedgeMonth();
        const openHedges = this.hedgePositions.filter(p => !p.closed);

        return {
            currentDay: this.currentDay,
            totalDays: this.totalDays,
            cargo: {
                grade: this.cargo.grade,
                volume: this.cargo.volume,
                origin: this.cargo.origin,
                destination: this.cargo.destination,
                blDay: this.cargo.blDay,
                originalBlDay: this.cargo.originalBlDay,
                blShifted: this.cargo.blDay !== this.cargo.originalBlDay,
                requiredLots: this.cargo.requiredLots,
                pricingDays: this.cargo.pricingDays,
                pricingType: this.cargo.pricingType,
                pricingRange,
            },
            curve: this.curve.getCurve(),
            curveStructure: this.curve.getStructure(),
            monthLabels: this.curve.monthLabels || Object.keys(this.curve.prices),
            openHedges: openHedges.map(p => ({
                month: p.month,
                lots: p.lots,
                entryPrice: p.entryPrice,
                currentPrice: this.curve.getPrice(p.month),
                unrealizedPnl: Math.round(
                    Math.abs(p.lots) * 1000 *
                    (p.lots > 0
                        ? this.curve.getPrice(p.month) - p.entryPrice
                        : p.entryPrice - this.curve.getPrice(p.month))
                ),
            })),
            recommendedMonth: recommended.primaryMonth,
            pricingMonthSplit: monthSplit,
            pricingStarted: this.pricingStarted,
            pricingComplete: this.pricingComplete,
            pricingDailyPrices: this.pricingDailyPrices,
            firedEvents: this.firedEvents,
            rollHistory: this.rollHistory,
            phase: this.phase,
            dealSheet: this.dealSheet,
            dealSheetError: this.dealSheetError,
            riskReportStatus: this.riskReportStatus,
            messages: this.messages,
        };
    }
}
