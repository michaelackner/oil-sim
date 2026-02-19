
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

const EVENT_TEMPLATES = [
    { headline: "OPEC talks break down", impact: -3, sentiment: "bearish" },
    { headline: "Pipeline leak reported in Cushing", impact: 2, sentiment: "bullish" },
    { headline: "Inventory data shows surplus", impact: -2, sentiment: "bearish" },
    { headline: "Geopolitical tensions rise in Strait of Hormuz", impact: 4, sentiment: "bullish" },
    { headline: "Global demand forecast upgraded", impact: 3, sentiment: "bullish" },
    { headline: "Fed rate hike fears trigger sell-off", impact: -3, sentiment: "bearish" },
    { headline: "Refinery maintenance season begins", impact: -1, sentiment: "bearish" },
    { headline: "Hurricane enters Gulf of Mexico", impact: 5, sentiment: "bullish" }
];

export function generateDailyScenario(dateString) {
    // Default to today if no date provided
    if (!dateString) {
        const now = new Date();
        dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD
    }

    const rng = new SeededRNG(dateString);

    const startPrice = Math.floor(rng.range(60, 100));
    const difficultyLevel = rng.choice(['Medium', 'Hard', 'Very Hard']);
    const totalTicks = 300;

    // Generate Events
    const numEvents = Math.floor(rng.range(3, 6)); // 3 to 5 events
    const events = [];

    // Sort events by tick to ensure order
    const ticks = new Set();
    while (ticks.size < numEvents) {
        ticks.add(Math.floor(rng.range(30, 280)));
    }
    const sortedTicks = Array.from(ticks).sort((a, b) => a - b);

    sortedTicks.forEach(tick => {
        const template = rng.choice(EVENT_TEMPLATES);
        // Vary impact slightly
        const actualImpact = template.impact + rng.range(-1, 1);

        events.push({
            tick: tick,
            headline: template.headline,
            impact: parseFloat(actualImpact.toFixed(1)),
            sentiment: template.sentiment,
            type: "news"
        });
    });

    return {
        id: `daily-${dateString}`,
        name: `Daily Challenge: ${dateString}`,
        description: `A unique scenario generated for ${dateString}. Difficulty: ${difficultyLevel}`,
        difficulty: difficultyLevel,
        startPrice: startPrice,
        totalTicks: totalTicks,
        events: events,
        isDaily: true, // Flag to identify daily scenarios
        dateString: dateString // Metadata
    };
}
