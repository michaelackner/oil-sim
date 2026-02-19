// ─── Futures Forward Curve Engine ──────────────────────
// Manages 6 contract months with correlated price dynamics.
// Events shift the curve via frontWeight/backWeight parameters.

export class FuturesCurveEngine {
    constructor(config) {
        this.numMonths = config.numMonths || 6;
        this.basePrice = config.startPrice;
        this.monthlySpread = config.monthlySpread || 0.50; // +ve = contango, -ve = backwardation
        this.baseVolatility = config.volatility || 0.003;

        // Initialise curve
        this.prices = [];
        this.startPrices = [];
        for (let i = 0; i < this.numMonths; i++) {
            const p = Math.round((this.basePrice + i * this.monthlySpread) * 100) / 100;
            this.prices.push(p);
            this.startPrices.push(p);
        }

        this.drift = 0;
        this.volMultiplier = 1.0;
        this.noiseAmplifier = 1.0;
        this.pendingDrift = new Array(this.numMonths).fill(0);
        this.tickCount = 0;
    }

    tick() {
        this.tickCount++;

        // Common market-wide shock (correlated across months)
        const commonShock = (Math.random() - 0.5) * this.baseVolatility * 2 * this.volMultiplier;
        this.drift = this.drift * 0.97 + commonShock * 0.15;

        for (let i = 0; i < this.numMonths; i++) {
            // Front months are more volatile
            const monthVolScale = 1.0 - i * 0.08;
            const idiosyncratic = (Math.random() - 0.5) * this.baseVolatility * monthVolScale * this.noiseAmplifier;

            // Pending drift from events
            let eventDrift = 0;
            if (Math.abs(this.pendingDrift[i]) > 0.005) {
                eventDrift = this.pendingDrift[i] * 0.06;
                this.pendingDrift[i] -= eventDrift;
            } else {
                this.pendingDrift[i] = 0;
            }

            this.prices[i] += commonShock + idiosyncratic + this.drift + eventDrift;
            this.prices[i] = Math.max(10, Math.round(this.prices[i] * 100) / 100);
        }

        // Decay multipliers back toward 1
        this.volMultiplier = 1.0 + (this.volMultiplier - 1.0) * 0.98;
        this.noiseAmplifier = 1.0 + (this.noiseAmplifier - 1.0) * 0.99;

        return this.prices.slice();
    }

    applyEvent(impact) {
        const {
            direction,
            immediatePct,
            frontWeight = 1.0,
            backWeight = 1.0,
            driftPct = 0,
            volatilityMultiplier = 1.0,
            noiseAmplifier = 1.0,
        } = impact;

        for (let i = 0; i < this.numMonths; i++) {
            const t = i / Math.max(this.numMonths - 1, 1);
            const weight = frontWeight * (1 - t) + backWeight * t;

            // Immediate move
            const change = this.prices[i] * immediatePct * direction * weight;
            this.prices[i] += change;
            this.prices[i] = Math.max(10, Math.round(this.prices[i] * 100) / 100);

            // Pending drift
            if (driftPct > 0) {
                this.pendingDrift[i] += this.prices[i] * driftPct * direction * weight;
            }
        }

        this.volMultiplier = Math.max(this.volMultiplier, volatilityMultiplier);
        this.noiseAmplifier = Math.max(this.noiseAmplifier, noiseAmplifier);

        return this.prices.slice();
    }

    getSpreads() {
        const spreads = [];
        for (let i = 0; i < this.numMonths - 1; i++) {
            spreads.push(Math.round((this.prices[i + 1] - this.prices[i]) * 100) / 100);
        }
        return spreads;
    }

    getCurveShape() {
        const frontBack = this.prices[this.numMonths - 1] - this.prices[0];
        if (frontBack > 0.80) return 'Contango';
        if (frontBack < -0.80) return 'Backwardation';
        return 'Flat';
    }

    getPrices() { return this.prices.slice(); }
    getStartPrices() { return this.startPrices.slice(); }
}
