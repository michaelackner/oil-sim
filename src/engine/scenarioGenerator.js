import { scenarios } from './scenarios/index.js';

// Simple Linear Congruential Generator for deterministic results based on date
class SeededRNG {
    constructor(seedStr) {
        this.seed = this.hashString(seedStr);
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    range(min, max) {
        return min + this.next() * (max - min);
    }

    choice(array) {
        return array[Math.floor(this.range(0, array.length))];
    }
}

export function generateDailyScenario(dateString) {
    // Default to today if no date provided
    if (!dateString) {
        const now = new Date();
        dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    const rng = new SeededRNG(dateString);

    // Pick a random scenario from the curated list
    const selectedTemplate = rng.choice(scenarios);

    // Return a clone with daily specific metadata
    // We clone to avoid mutating the original scenario object if we were to modify it later
    return {
        ...selectedTemplate,
        id: `daily-${dateString}`, // Override ID for daily tracking
        isDaily: true,
        dateString: dateString,
        // We keep the original name, difficulty, events, etc.
        // This ensures the "pricing" and "strategy" are exactly as designed in the handcrafted scenario.
    };
}
