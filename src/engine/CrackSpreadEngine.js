// ─── Crack Spread Engine ──────────────────────────────
// Manages 3 correlated product prices: Crude, Gasoline ($/bbl eq), Diesel ($/bbl eq).
// The crack spread = product price - crude price.
// Events shift each product independently, creating spread dynamics.

export class CrackSpreadEngine {
    constructor(config) {
        this.crude = config.crudePrice;
        this.gasoline = config.gasolinePrice;   // $/bbl equivalent
        this.diesel = config.dieselPrice;       // $/bbl equivalent

        this.startCrude = this.crude;
        this.startGasoline = this.gasoline;
        this.startDiesel = this.diesel;

        this.baseVol = config.volatility || 0.003;
        this.volMultiplier = 1.0;
        this.noiseAmplifier = 1.0;

        this.drifts = { crude: 0, gasoline: 0, diesel: 0 };
        this.pendingDrifts = { crude: 0, gasoline: 0, diesel: 0 };
        this.tickCount = 0;
    }

    tick() {
        this.tickCount++;

        // Common energy-complex shock (correlated move)
        const commonShock = (Math.random() - 0.5) * this.baseVol * 2 * this.volMultiplier;

        // Product-specific idiosyncratic shocks
        const crudeNoise = (Math.random() - 0.5) * this.baseVol * 0.7 * this.noiseAmplifier;
        const gasNoise = (Math.random() - 0.5) * this.baseVol * 0.9 * this.noiseAmplifier;
        const dieselNoise = (Math.random() - 0.5) * this.baseVol * 0.8 * this.noiseAmplifier;

        // Drift momentum
        this.drifts.crude = this.drifts.crude * 0.97 + commonShock * 0.10;
        this.drifts.gasoline = this.drifts.gasoline * 0.97 + commonShock * 0.12;
        this.drifts.diesel = this.drifts.diesel * 0.97 + commonShock * 0.11;

        // Apply pending event drifts
        for (const prod of ['crude', 'gasoline', 'diesel']) {
            if (Math.abs(this.pendingDrifts[prod]) > 0.005) {
                const d = this.pendingDrifts[prod] * 0.06;
                this.pendingDrifts[prod] -= d;
                this.drifts[prod] += d;
            } else {
                this.pendingDrifts[prod] = 0;
            }
        }

        // Update prices — products are slightly more responsive to common shocks
        this.crude += commonShock + crudeNoise + this.drifts.crude;
        this.gasoline += commonShock * 1.08 + gasNoise + this.drifts.gasoline;
        this.diesel += commonShock * 1.04 + dieselNoise + this.drifts.diesel;

        // Floor prices
        this.crude = Math.max(20, Math.round(this.crude * 100) / 100);
        this.gasoline = Math.max(30, Math.round(this.gasoline * 100) / 100);
        this.diesel = Math.max(30, Math.round(this.diesel * 100) / 100);

        // Decay multipliers
        this.volMultiplier = 1.0 + (this.volMultiplier - 1.0) * 0.98;
        this.noiseAmplifier = 1.0 + (this.noiseAmplifier - 1.0) * 0.99;

        return this.getPrices();
    }

    applyEvent(impact) {
        for (const prod of ['crude', 'gasoline', 'diesel']) {
            if (impact[prod]) {
                const { direction, immediatePct, driftPct = 0 } = impact[prod];
                const change = this[prod] * immediatePct * direction;
                this[prod] += change;
                this[prod] = Math.max(20, Math.round(this[prod] * 100) / 100);
                if (driftPct > 0) {
                    this.pendingDrifts[prod] += this[prod] * driftPct * direction;
                }
            }
        }
        if (impact.volatilityMultiplier) {
            this.volMultiplier = Math.max(this.volMultiplier, impact.volatilityMultiplier);
        }
        if (impact.noiseAmplifier) {
            this.noiseAmplifier = Math.max(this.noiseAmplifier, impact.noiseAmplifier);
        }
        return this.getPrices();
    }

    getPrices() {
        return { crude: this.crude, gasoline: this.gasoline, diesel: this.diesel };
    }

    getCracks() {
        return {
            gasCrack: Math.round((this.gasoline - this.crude) * 100) / 100,
            dieselCrack: Math.round((this.diesel - this.crude) * 100) / 100,
            crack321: Math.round(((2 * this.gasoline + this.diesel) / 3 - this.crude) * 100) / 100,
        };
    }

    getStartPrices() {
        return { crude: this.startCrude, gasoline: this.startGasoline, diesel: this.startDiesel };
    }

    getStartCracks() {
        return {
            gasCrack: Math.round((this.startGasoline - this.startCrude) * 100) / 100,
            dieselCrack: Math.round((this.startDiesel - this.startCrude) * 100) / 100,
            crack321: Math.round(((2 * this.startGasoline + this.startDiesel) / 3 - this.startCrude) * 100) / 100,
        };
    }
}
