import { PRICE_CONFIG, SPREAD_CENTS, TICKS_PER_CANDLE } from '../utils/constants.js';

function randomNormal() {
    // Box-Muller transform
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export class PriceEngine {
    constructor(startPrice) {
        this.currentPrice = startPrice;
        this.longTermMean = startPrice;
        this.activeDrifts = [];
        this.currentVolMultiplier = 1.0;
        this.noiseAmplifier = 1.0;
        this.tickCount = 0;
        this.candleTickCount = 0;
        this.currentCandle = null;
        this.candles = [];
        this.priceHistory = [];
    }

    get bidPrice() {
        return Math.round((this.currentPrice - SPREAD_CENTS / 200) * 100) / 100;
    }

    get askPrice() {
        return Math.round((this.currentPrice + SPREAD_CENTS / 200) * 100) / 100;
    }

    applyEvent(impact) {
        // Immediate jump
        this.currentPrice *= (1 + impact.immediatePct * impact.direction);
        this.currentPrice = Math.max(PRICE_CONFIG.minPrice, Math.min(PRICE_CONFIG.maxPrice, this.currentPrice));

        // Update long-term mean to drift toward
        this.longTermMean = this.currentPrice;

        // Add decaying drift
        this.activeDrifts.push({
            remaining: impact.driftDecayTicks,
            perTickDrift: (impact.driftPct * impact.direction) / impact.driftDecayTicks,
        });

        // Update volatility multiplier (max of current and new)
        this.currentVolMultiplier = Math.max(this.currentVolMultiplier, impact.volatilityMultiplier);
        this.noiseAmplifier = Math.max(this.noiseAmplifier, impact.noiseAmplifier);
    }

    tick() {
        this.tickCount++;

        const dt = 1 / PRICE_CONFIG.ticksPerDay;
        const vol = PRICE_CONFIG.annualisedVol * this.currentVolMultiplier;

        // Mean-reverting GBM
        const drift = PRICE_CONFIG.meanReversionSpeed * (this.longTermMean - this.currentPrice) * dt;
        const diffusion = vol * Math.sqrt(dt) * randomNormal() * this.noiseAmplifier;

        // Apply active drifts
        let eventDrift = 0;
        this.activeDrifts = this.activeDrifts.filter(d => {
            if (d.remaining > 0) {
                eventDrift += d.perTickDrift;
                d.remaining--;
                return d.remaining > 0;
            }
            return false;
        });

        this.currentPrice = this.currentPrice * (1 + drift + diffusion) + this.currentPrice * eventDrift;
        this.currentPrice = Math.max(PRICE_CONFIG.minPrice, Math.min(PRICE_CONFIG.maxPrice, this.currentPrice));
        this.currentPrice = Math.round(this.currentPrice * 100) / 100;

        // Decay volatility multiplier toward 1
        this.currentVolMultiplier = 1 + (this.currentVolMultiplier - 1) * 0.98;
        this.noiseAmplifier = 1 + (this.noiseAmplifier - 1) * 0.98;

        // Record price
        this.priceHistory.push({ tick: this.tickCount, price: this.currentPrice });

        // Aggregate into candles
        this.candleTickCount++;
        if (!this.currentCandle) {
            this.currentCandle = {
                time: this.tickCount,
                open: this.currentPrice,
                high: this.currentPrice,
                low: this.currentPrice,
                close: this.currentPrice,
            };
        } else {
            this.currentCandle.high = Math.max(this.currentCandle.high, this.currentPrice);
            this.currentCandle.low = Math.min(this.currentCandle.low, this.currentPrice);
            this.currentCandle.close = this.currentPrice;
        }

        let newCandle = null;
        if (this.candleTickCount >= TICKS_PER_CANDLE) {
            newCandle = { ...this.currentCandle };
            this.candles.push(newCandle);
            this.currentCandle = null;
            this.candleTickCount = 0;
        }

        return {
            price: this.currentPrice,
            bid: this.bidPrice,
            ask: this.askPrice,
            tick: this.tickCount,
            newCandle,
        };
    }

    /**
     * Returns the current momentum/drift state for the UI.
     * This lets the player see when event-driven momentum is fading.
     */
    getMomentumData() {
        // Total remaining drift ticks across all active drifts
        const totalRemainingTicks = this.activeDrifts.reduce((sum, d) => sum + d.remaining, 0);
        // Net per-tick drift (positive = bullish, negative = bearish)
        const netPerTickDrift = this.activeDrifts.reduce((sum, d) => sum + d.perTickDrift, 0);
        // Max remaining ticks on any single drift (largest remaining)
        const maxRemainingTicks = this.activeDrifts.length > 0
            ? Math.max(...this.activeDrifts.map(d => d.remaining))
            : 0;
        // Mean reversion pressure: distance from long-term mean
        const meanRevGap = this.longTermMean - this.currentPrice;
        const meanRevPressurePct = this.currentPrice > 0
            ? (meanRevGap / this.currentPrice) * 100
            : 0;

        return {
            activeDriftCount: this.activeDrifts.length,
            totalRemainingTicks,
            maxRemainingTicks,
            netPerTickDrift,
            netDriftDirection: netPerTickDrift > 0.0001 ? 1 : netPerTickDrift < -0.0001 ? -1 : 0,
            volMultiplier: this.currentVolMultiplier,
            noiseAmplifier: this.noiseAmplifier,
            meanRevPressurePct: Math.round(meanRevPressurePct * 100) / 100,
            meanRevDirection: meanRevGap > 0.05 ? 1 : meanRevGap < -0.05 ? -1 : 0,
            longTermMean: this.longTermMean,
        };
    }

    reset(startPrice) {
        this.currentPrice = startPrice;
        this.longTermMean = startPrice;
        this.activeDrifts = [];
        this.currentVolMultiplier = 1.0;
        this.noiseAmplifier = 1.0;
        this.tickCount = 0;
        this.candleTickCount = 0;
        this.currentCandle = null;
        this.candles = [];
        this.priceHistory = [];
    }
}
