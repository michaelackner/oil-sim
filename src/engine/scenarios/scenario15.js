const scenario15 = {
    id: "scenario_shale_response",
    name: "Shale Treadmill",
    description: "US shale producers respond to price signals with a lag. High prices attract drilling, and new supply eventually caps the rally. Trade the feedback loop between price, rigs, and production.",
    difficulty: "Medium",
    startPrice: 82.00,
    totalTicks: 300,
    strategyOverview: `US shale production is the 'swing producer' of global oil. When prices rise above ~$65-70 WTI, shale operators ramp drilling. But there's a 4-6 month lag from rig → well completion → production. The market often overshoots in both directions: rallies too far on tightness (ignoring shale response) and sells off too much on shale growth (ignoring decline rates). The key insight: shale production is a treadmill — operators must drill constantly just to maintain output because shale wells decline 50-70% in year one.`,
    events: [
        {
            tick: 20,
            headline: "WTI crude rises above $85 — Permian Basin operators signal increased capital spending",
            detail: "Pioneer Natural Resources, Diamondback Energy raise 2025 capex by 15%. Rig count expected to increase. Break-even costs at $55-60 WTI.",
            category: "supply",
            impact: { direction: -1, immediatePct: 0.008, driftPct: 0.005, driftDecayTicks: 25, volatilityMultiplier: 1.1, noiseAmplifier: 1.05 },
            strategy: {
                action: "SMALL SHORT — 2-3 lots only",
                reasoning: "Capex announcements signal future supply, but production won't arrive for 4-6 months. The market slightly overreacts to capex announcements. The correct play is very small — the supply response is real but distant.",
                expectedEffect: "Minor 0.5-1% dip. The market knows shale will respond but the timing is uncertain.",
                principle: "SHALE RESPONSE LAG — Capital spending → rig mobilization → drilling → completion → production. This chain takes 4-6 months. Don't trade distant supply as if it's immediate.",
                riskNote: "Tiny position. This is a patient trade about future supply, not today's market."
            }
        },
        {
            tick: 60,
            headline: "Baker Hughes rig count jumps 12 to 497 — largest weekly increase in 8 months",
            detail: "Permian Basin adds 8 rigs. Eagle Ford adds 3. DJ Basin adds 1. Operators responding to $85+ crude prices.",
            category: "data",
            impact: { direction: -1, immediatePct: 0.012, driftPct: 0.008, driftDecayTicks: 30, volatilityMultiplier: 1.15, noiseAmplifier: 1.1 },
            strategy: {
                action: "HOLD SHORT — small additional add if comfortable",
                reasoning: "Rig count confirmation of capex plans. 12-rig jump is significant. But remember: rigs don't produce oil. Wells need to be drilled, completed, and connected to pipelines. The production response is still months away.",
                expectedEffect: "1% decline. Rig counts are a leading indicator but with a long lag.",
                principle: "RIGS ≠ PRODUCTION — Rig count is a VERY leading indicator. Each rig produces new wells in ~30 days, but wells take another 60-90 days for completion and hookup. Don't confuse rig activity with barrels.",
                riskNote: "Patient trade. The thesis takes months to fully play out."
            }
        },
        {
            tick: 115,
            headline: "OPEC monthly report raises non-OPEC supply growth forecast by 200k bbl/d for 2025",
            detail: "US shale production revised higher. Brazil, Guyana also contributing. Total non-OPEC growth now at 1.8m bbl/d. OPEC market share concerns resurface.",
            category: "data",
            impact: { direction: -1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "ADD 3 lots to SHORT (increase conviction)",
                reasoning: "OPEC itself raising non-OPEC supply forecasts is significant — they're acknowledging the shale response. 1.8m bbl/d non-OPEC growth vs ~1m bbl/d demand growth = market loosening. This changes the medium-term balance.",
                expectedEffect: "2% decline. OPEC supply revisions are closely watched by the market.",
                principle: "SUPPLY GROWTH vs DEMAND GROWTH — If non-OPEC supply grows faster than demand, the market loosens. This forces OPEC to either cut production (bullish) or defend market share (bearish).",
                riskNote: "The thesis is strengthening. But watch for OPEC's response — they may cut to offset."
            }
        },
        {
            tick: 175,
            headline: "EIA monthly production data: US crude output hits record 13.5m bbl/d",
            detail: "Permian production at 6.3m bbl/d. Completion crews working overtime. Well productivity improvements offsetting decline rates.",
            category: "data",
            impact: { direction: -1, immediatePct: 0.025, driftPct: 0.018, driftDecayTicks: 40, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "HOLD SHORT — peak conviction",
                reasoning: "Record production is the ultimate confirmation of the shale response thesis. The rigs added 4-6 months ago are now producing barrels. 13.5m bbl/d is a massive number (~13.5% of global supply). The market cannot easily absorb this growth.",
                expectedEffect: "2-3% decline. Record production is a clear bearish signal.",
                principle: "LAGGED CONFIRMATION — The rig-to-production pipeline finally delivers barrels. This is the payoff for patient positioning. Production data is the most lagging but most reliable supply indicator.",
                riskNote: "Maximum short position. But start planning your exit — every consensus trade eventually reverses."
            }
        },
        {
            tick: 230,
            headline: "Permian pipeline capacity constraint emerging — crude stuck in Midland",
            detail: "WTI Midland-Cushing spread widens to -$3.50. Takeaway capacity at 95% utilization. DUC well connections being delayed. Production growth expected to slow.",
            category: "supply",
            impact: { direction: 1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "COVER 3 lots (partial profit take)",
                reasoning: "Pipeline constraints cap shale growth. If production can't get to market, it doesn't matter how many wells are drilled. The Midland discount to Cushing widens, meaning Permian crude is stranded. This is a physical bottleneck that limits the bearish thesis.",
                expectedEffect: "1.5-2% bounce. The market recognizes growth limits.",
                principle: "INFRASTRUCTURE CONSTRAINTS — Shale production growth is limited by pipeline takeaway capacity, water disposal, and completion crew availability. These physical limits cap the supply response even when economics are favorable.",
                riskNote: "Start scaling out. The easy money in the short is made."
            }
        },
        {
            tick: 270,
            headline: "Q3 earnings: shale producers announce capital discipline — flat to reduced drilling plans",
            detail: "Investor pressure for returns over growth. Dividend hikes and buybacks prioritized. Pioneer CEO: 'We're not going back to drill-baby-drill.'",
            category: "supply",
            impact: { direction: 1, immediatePct: 0.025, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "COVER remaining short — go FLAT",
                reasoning: "Capital discipline = production growth slowing. If operators prioritize returns to shareholders over drilling, the supply response is capped. This removes the bearish thesis. The market will now reprice for lower growth.",
                expectedEffect: "2% rally. Capital discipline signals peak growth.",
                principle: "CAPITAL DISCIPLINE CYCLE — Shale goes through cycles: high prices → more drilling → oversupply → prices drop → capital discipline → less drilling → tightening → repeat. Recognizing where you are in the cycle is key.",
                riskNote: "Flatten. The shale supply thesis has played out. Time for a new read."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 300],
            frequency: 14,
            pool: [
                "Halliburton reports stable fracking fleet utilization at 85%",
                "Midcontinent crude quality survey shows stable API gravity at 41.2",
                "Oklahoma Corporation Commission approves new disposal well permits",
                "North Dakota Bakken production steady at 1.15m bbl/d",
                "Colorado regulatory changes add 3 weeks to Wattenberg permitting process",
                "ProPetro Holding gains completion crew contract in Delaware Basin",
                "STACK/SCOOP play economics marginal at current strip pricing",
                "Rystad Energy: US shale break-evens average $58 WTI across basins",
                "Frac sand demand stable — prices unchanged at $35/ton delivered",
                "Midstream MLP earnings beat expectations on higher throughput volumes",
                "Federal lease sale in New Mexico draws strong bids — $42m total",
                "DUC count falls by 18 to 4,340 — backlog declining steadily"
            ]
        }
    ]
};

export default scenario15;
