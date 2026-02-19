const scenario12 = {
    id: "scenario_suez_disruption",
    name: "Red Sea Crisis",
    description: "Houthi attacks on commercial shipping force rerouting around the Cape of Good Hope. Trade the shipping disruption, its impact on crude flows, and the market's adaptation.",
    difficulty: "Hard",
    startPrice: 76.00,
    totalTicks: 340,
    strategyOverview: `Shipping disruptions are one of the most misunderstood events in oil trading. The Suez Canal/Red Sea route handles ~12% of global seaborne oil trade. Rerouting around Africa adds 10-14 days to voyages. The key insight: this doesn't REMOVE oil from the market — it DELAYS it. The price impact comes from (1) higher freight costs, (2) more tankers tied up on longer routes = tighter tanker supply, and (3) regional dislocation (Europe gets oil later, Asia may bid for closer barrels). The correct trade depends on understanding logistics, not just supply/demand.`,
    events: [
        {
            tick: 20,
            headline: "Houthi forces attack container ship in Bab el-Mandeb strait with anti-ship missile",
            detail: "Marshall Islands-flagged container vessel hit. Crew evacuated. US CENTCOM confirms attack. Second attack this week.",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.018, driftPct: 0.012, driftDecayTicks: 35, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "BUY 3-5 lots",
                reasoning: "Container ship attacks in the strait threaten all commercial shipping, including crude tankers. The pattern of escalation (second attack this week) suggests this isn't a one-off. Insurance costs will spike, making the route economically unviable.",
                expectedEffect: "1.5-2% rally. Market pricing in shipping risk premium.",
                principle: "CHOKEPOINT DISRUPTION — Bab el-Mandeb leads to the Suez Canal. ~7m bbl/d of oil transits this route. Attacks on ANY commercial vessel raise the risk premium for ALL vessels.",
                riskNote: "The key question is: will major tanker operators reroute? Watch for shipping company announcements."
            }
        },
        {
            tick: 55,
            headline: "Maersk, MSC, and BP suspend all Red Sea transit — rerouting via Cape of Good Hope",
            detail: "Major shipping lines halt Suez transit. Cape route adds 10-14 sailing days. Freight rates surge 250% on key routes.",
            category: "supply",
            impact: { direction: 1, immediatePct: 0.03, driftPct: 0.02, driftDecayTicks: 45, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
            strategy: {
                action: "ADD 5 lots (increase long)",
                reasoning: "BP pulling out = crude tankers rerouting, not just containers. The 10-14 day delay means barrels that were 2 weeks from delivery are now 4 weeks away. European refineries will face a supply gap in ~2 weeks. This is the actionable signal.",
                expectedEffect: "2.5-3% rally. Real supply disruption confirmed.",
                principle: "REROUTING = DELAY, NOT DISAPPEARANCE — Oil doesn't vanish. But the timing gap creates a temporary supply deficit in destination markets. Trade the timing premium, not a permanent loss.",
                riskNote: "This trade has a shelf life — once rerouted cargoes arrive, the premium fades."
            }
        },
        {
            tick: 100,
            headline: "US and UK launch joint airstrikes against Houthi missile sites in Yemen",
            detail: "Operation Poseidon Archer targets radar and missile storage. Pentagon: 'defensive action to protect freedom of navigation.'",
            category: "geopolitical",
            impact: { direction: -1, immediatePct: 0.015, driftPct: 0.01, driftDecayTicks: 30, volatilityMultiplier: 1.4, noiseAmplifier: 1.3 },
            strategy: {
                action: "SELL 3 lots (trim long position)",
                reasoning: "Counterintuitive: military strikes on Houthis are slightly BEARISH for oil. The market interprets strikes as 'the problem is being addressed.' If the Houthi threat is degraded, ships might return to the Red Sea sooner. However, Houthi capability is only partially degradable.",
                expectedEffect: "1-1.5% dip. Market briefly prices in hope of resolution.",
                principle: "MILITARY ACTION = HOPE OF RESOLUTION — When powerful nations intervene militarily against a disruptor, markets price in reduced future disruption. But this is often premature — asymmetric threats are hard to eliminate.",
                riskNote: "Don't sell everything. The Houthis have proven resilient. Strikes may not stop attacks."
            }
        },
        {
            tick: 155,
            headline: "Houthi drone strikes crude tanker Marlin Luanda — cargo catches fire",
            detail: "UK-flagged tanker carrying 80,000 tons of Russian naphtha hit in Gulf of Aden. Fire contained by crew. Vessel diverts to Djibouti.",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.035, driftPct: 0.02, driftDecayTicks: 40, volatilityMultiplier: 1.7, noiseAmplifier: 1.5 },
            strategy: {
                action: "BUY 5-8 lots (go aggressively long)",
                reasoning: "FIRST direct hit on a crude/oil products tanker. This escalation is critical — it proves Houthis are willing and able to hit oil-carrying vessels, not just containers. War risk insurance premiums will skyrocket. Even the ships that continued Red Sea transit will now reroute.",
                expectedEffect: "3-4% spike. This is the escalation the market feared.",
                principle: "ESCALATION LEVELS — Container ship attack → tanker attack → crude tanker hit → casualty/sinking. Each escalation step multiplies the insurance and risk premium. Watch for the pattern.",
                riskNote: "High conviction. The insurance market will respond within 24 hours."
            }
        },
        {
            tick: 210,
            headline: "European refinery crude deliveries 15% below schedule — stocks drawing rapidly",
            detail: "Rotterdam and ARA hub inventories fall below 5-year average. Refineries bidding aggressively for West African and US crude alternatives.",
            category: "data",
            impact: { direction: 1, immediatePct: 0.025, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "HOLD long position",
                reasoning: "This is the physical manifestation of the rerouting delay. The 10-14 day delay from Cape routing is now showing up in European inventory data. This validates the original trade thesis and means the supply premium holds longer.",
                expectedEffect: "2% further rally. Physical tightness confirms the thesis.",
                principle: "LAGGED IMPACT — Shipping disruptions take 2-4 weeks to show up in inventory data. When they do, it's confirming evidence for your position, not new information.",
                riskNote: "The question now is when do rerouted cargoes arrive and ease the tightness."
            }
        },
        {
            tick: 270,
            headline: "Rerouted tanker arrivals surge in European ports — inventory drawdown stabilizes",
            detail: "Cape route cargoes now arriving regularly. ARA stocks decline slows. Freight rates still elevated but off highs.",
            category: "supply",
            impact: { direction: -1, immediatePct: 0.025, driftPct: 0.02, driftDecayTicks: 45, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "SELL to FLATTEN — close all longs",
                reasoning: "The market has adapted to the new routing. The initial supply gap is filled. Freight rates are still high (Cape routing costs remain) but the acute shortage is over. The Brent premium should normalize even if Red Sea stays closed.",
                expectedEffect: "2-2.5% drop as adaptation removes the acute premium.",
                principle: "MARKET ADAPTATION — Markets adapt to disruptions faster than most traders expect. The initial shock premium erodes as supply chains adjust. The rerouting is now 'the new normal' and priced in.",
                riskNote: "Flatten cleanly. Residual geopolitical risk remains but the acute trade is over."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 340],
            frequency: 15,
            pool: [
                "Suez Canal Authority reports no change in toll pricing structure",
                "CMA CGM reroutes 3 additional vessels via Cape — standard precaution",
                "Egyptian canal revenue falls 40% — government seeks IMF support",
                "US Navy deploys additional destroyer to Gulf of Aden",
                "Iranian foreign minister denies involvement in Houthi actions",
                "Indian refineries secure alternative crude via east-of-Suez routes",
                "Somali piracy reports show no increase despite regional tensions",
                "Panama Canal restrictions ease slightly on improved rainfall",
                "Mediterranean clean tanker rates firm 8% on rerouting demand",
                "Saudi Aramco increases eastbound crude allocations to Asian buyers",
                "South African Saldanha Bay oil terminal reports increased vessel traffic",
                "UK P&I clubs revise Red Sea war risk zone boundaries",
                "Dubai Mercantile Exchange crude volumes up 12% on shipping uncertainty",
                "German strategic reserve drawdown of 200k barrels approved for refinery supply"
            ]
        }
    ]
};

export default scenario12;
