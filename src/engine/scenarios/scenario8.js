const scenario8 = {
    id: "scenario_inventory_surprise",
    name: "Inventory Shock",
    description: "Unexpected inventory data creates short-term trading opportunities. Distinguish between significant data surprises and statistical noise — and size your trades accordingly.",
    difficulty: "Medium",
    startPrice: 79.00,
    totalTicks: 300,
    strategyOverview: `This scenario tests analytical precision. You'll see multiple inventory reports — some are genuine surprises (trade-worthy) and some are within normal variance (noise). The best traders calculate the surprise magnitude vs consensus, compare it to seasonal norms, and ONLY trade the truly significant data points. Key skill: knowing WHEN the data is big enough to trade and when to sit on your hands.`,
    events: [
        {
            tick: 25,
            headline: "EIA crude inventories: massive 12.1m barrel draw (consensus: -2.0m)",
            detail: "Largest draw in 3 years. Cushing stocks also fall 3.2m barrels to near operational minimums.",
            category: "data",
            impact: { direction: 1, immediatePct: 0.035, driftPct: 0.02, driftDecayTicks: 45, volatilityMultiplier: 1.6, noiseAmplifier: 1.3 },
            strategy: {
                action: "BUY 5-8 lots immediately",
                reasoning: "A 10m+ barrel miss vs consensus is extremely rare (>3 sigma). Cushing near operational limits means physical tightness, not just accounting noise. This is the type of inventory data that genuinely moves markets for days.",
                expectedEffect: "3-4% spike that holds. Physical tightness at Cushing supports the move.",
                principle: "DATA SURPRISE MAGNITUDE — A 10m barrel miss is trade-worthy. A 1m barrel miss is noise. Always compare the surprise to historical variance.",
                riskNote: "Size with conviction here — this is a genuine data surprise."
            }
        },
        {
            tick: 65,
            headline: "API weekly crude stocks: build of 0.8m barrels (consensus: -0.5m)",
            detail: "API data slightly bearish. Gasoline stocks in line with expectations.",
            category: "data",
            impact: { direction: -1, immediatePct: 0.006, driftPct: 0.003, driftDecayTicks: 15, volatilityMultiplier: 1.05, noiseAmplifier: 1.02 },
            strategy: {
                action: "DO NOTHING — hold existing position",
                reasoning: "1.3m barrel miss on API data is within normal weekly variance. API is also less reliable than EIA. The spread cost of a round-trip trade (~$40/lot) exceeds the expected profit from this tiny move.",
                expectedEffect: "Minimal — maybe 0.3% dip that reverses. Not tradeable.",
                principle: "NOISE FILTER — Small inventory misses (< 2-3m barrels) are statistical noise. API data is less authoritative than EIA. Don't trade noise.",
                riskNote: "If you traded this, you paid spread for no edge."
            }
        },
        {
            tick: 120,
            headline: "EIA crude inventories: surprise 8.5m barrel BUILD (consensus: -1.5m)",
            detail: "Massive import surge from Saudi Arabia. Gasoline demand unexpectedly weak at 8.6m bbl/d.",
            category: "data",
            impact: { direction: -1, immediatePct: 0.04, driftPct: 0.025, driftDecayTicks: 50, volatilityMultiplier: 1.7, noiseAmplifier: 1.4 },
            strategy: {
                action: "SELL long position, go SHORT 5 lots",
                reasoning: "A 10m barrel miss in the other direction is equally significant. The combination of high imports + weak gasoline demand suggests structural oversupply. This reverses the tightness thesis from the first draw.",
                expectedEffect: "Sharp 3-4% drop. Two-signal bearish (supply up + demand down).",
                principle: "REVERSING YOUR THESIS — Great traders change their mind when the data demands it. Don't marry your position. The market doesn't care about your previous trades.",
                riskNote: "Reversing from long to short is psychologically difficult but necessary."
            }
        },
        {
            tick: 180,
            headline: "DOE weekly petroleum status: crude draw 3.1m (consensus: -2.8m)",
            detail: "Draw slightly larger than expected. Refinery utilization rises to 92.8%.",
            category: "data",
            impact: { direction: 1, immediatePct: 0.008, driftPct: 0.004, driftDecayTicks: 20, volatilityMultiplier: 1.08, noiseAmplifier: 1.03 },
            strategy: {
                action: "HOLD SHORT — do not cover",
                reasoning: "Only 0.3m barrel miss vs consensus. This is noise, not signal. The refinery utilization increase is consistent with seasonal norms. Don't let small data points shake you out of a well-reasoned short.",
                expectedEffect: "Tiny 0.5% bounce that fades. Not worth trading.",
                principle: "CONVICTION IN YOUR THESIS — Don't let noise shake you out of a signal-driven position. If your short is based on structural oversupply, a 0.3m miss doesn't change that thesis.",
                riskNote: "Staying in a short during small bullish data requires discipline."
            }
        },
        {
            tick: 240,
            headline: "EIA crude: massive 14.2m barrel draw — refineries pulling max crude",
            detail: "Refinery crude input jumps to 17.1m bbl/d — highest since 2019. Cushing drops below 22m barrels.",
            category: "data",
            impact: { direction: 1, immediatePct: 0.055, driftPct: 0.035, driftDecayTicks: 60, volatilityMultiplier: 1.9, noiseAmplifier: 1.5 },
            strategy: {
                action: "COVER SHORT immediately, go LONG 5-8 lots",
                reasoning: "14m barrel draw is a >4 sigma event. Cushing below 22m is dangerously low — physical squeezes become likely. Refinery demand at record highs consumes crude directly. This is a structural shift back to tightness.",
                expectedEffect: "5-6% spike. This type of draw creates multi-day momentum.",
                principle: "SIGMA EVENTS — The larger the statistical surprise, the stronger and more durable the price move. 4+ sigma events deserve maximum conviction.",
                riskNote: "Cover the short first (stop the bleeding), then go long."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 300],
            frequency: 15,
            pool: [
                "Genscape reports Cushing tank levels steady",
                "Pipeline maintenance scheduled on DAPL — no impact expected",
                "API membership data shows minor seasonal patterns",
                "Midcontinent refinery runs in line with 5-year average",
                "PADD 3 imports from Mexico unchanged at 650k bbl/d",
                "Canadian heavy crude differentials stable at -$14.50",
                "US crude production steady at 13.2m bbl/d — EIA estimate",
                "Offshore GOM production returning after scheduled maintenance",
                "Crude quality mix shifting slightly toward medium sour",
                "Strategic Petroleum Reserve levels unchanged at 350m barrels",
                "Rail movements of crude from Bakken stable quarter-over-quarter",
                "Tank farms report normal seasonal outflows"
            ]
        }
    ]
};

export default scenario8;
