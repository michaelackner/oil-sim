export class EventScheduler {
    constructor(scenario) {
        // Deep clone events and apply slight timing randomization (±3 ticks) for replayability
        this.events = scenario.events.map(e => ({
            ...e,
            tick: Math.max(1, e.tick + Math.floor(Math.random() * 7) - 3),
        })).sort((a, b) => a.tick - b.tick);

        this.noiseEvents = scenario.noiseEvents || [];
        this.currentTick = 0;
        this.firedEvents = [];
        this.firedNoiseHeadlines = [];
        this.totalTicks = scenario.totalTicks || 300;
    }

    tick() {
        this.currentTick++;
        const results = { impactEvents: [], noiseHeadlines: [] };

        // Check for impact events
        while (this.events.length > 0 && this.events[0].tick <= this.currentTick) {
            const event = this.events.shift();
            results.impactEvents.push(event);
            this.firedEvents.push({ ...event, firedAtTick: this.currentTick });
        }

        // Check for noise events
        for (const noiseConfig of this.noiseEvents) {
            if (
                this.currentTick >= noiseConfig.tickRange[0] &&
                this.currentTick <= noiseConfig.tickRange[1] &&
                this.currentTick % noiseConfig.frequency === 0
            ) {
                const headline = noiseConfig.pool[Math.floor(Math.random() * noiseConfig.pool.length)];
                results.noiseHeadlines.push(headline);
                this.firedNoiseHeadlines.push({ tick: this.currentTick, headline });
            }
        }

        return results;
    }

    isFinished() {
        return this.currentTick >= this.totalTicks;
    }

    reset(scenario) {
        this.events = scenario.events.map(e => ({
            ...e,
            tick: Math.max(1, e.tick + Math.floor(Math.random() * 7) - 3),
        })).sort((a, b) => a.tick - b.tick);
        this.noiseEvents = scenario.noiseEvents || [];
        this.currentTick = 0;
        this.firedEvents = [];
        this.firedNoiseHeadlines = [];
        this.totalTicks = scenario.totalTicks || 300;
    }
}
