const scenario3 = {
    id: "scenario_hurricane_season",
    name: "Hurricane Season",
    description: "A major hurricane threatens Gulf of Mexico production and refining. Understand the second-order effects of crude vs. product disruptions.",
    difficulty: "Medium",
    startPrice: 74.00,
    totalTicks: 300,
    strategyOverview: `This scenario teaches the most commonly misunderstood dynamic in oil trading: hurricanes are NOT always bullish for crude. A hurricane that shuts refineries DESTROYS crude demand (refineries buy crude). If more refining capacity goes offline than production, crude actually FALLS while gasoline/diesel surge. The perfect trader understands these second-order effects and trades accordingly.`,
    events: [
        {
            tick: 20,
            headline: "Tropical storm forms in Gulf of Mexico, tracking toward Louisiana coast",
            detail: "NHC forecasts Category 2 hurricane by landfall. Offshore platforms begin evacuations.",
            category: "weather",
            impact: { direction: 1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "BUY 3-5 lots (small initial position)",
                reasoning: "Gulf of Mexico produces ~1.8m bbl/d of crude. A storm heading toward production platforms is initially bullish for crude prices. But keep the position SMALL — the trade gets complicated when refineries are involved.",
                expectedEffect: "Modest 1-2% rally on supply disruption fears. This is the 'obvious' trade — everyone buys.",
                principle: "WEATHER RISK — Initial hurricane response is always to buy crude on supply disruption fears. But the SMART trade is to watch WHERE the storm hits (production vs. refining).",
                riskNote: "Small position. Hurricanes are the most over-traded and mis-traded events in oil. Wait for clarity on the storm path."
            }
        },
        {
            tick: 50,
            headline: "Hurricane upgraded to Category 4 — direct hit expected on refining corridor",
            detail: "Port Arthur and Lake Charles refineries begin shutdowns. 2.5m bbl/d capacity offline.",
            category: "weather",
            impact: { direction: -1, immediatePct: 0.025, driftPct: 0.02, driftDecayTicks: 40, volatilityMultiplier: 1.6, noiseAmplifier: 1.4 },
            strategy: {
                action: "SELL long position, go SHORT 5 lots",
                reasoning: "THIS IS THE KEY INSIGHT: Refineries going offline = LESS demand for crude oil. 2.5m bbl/d of refining capacity shutting down means 2.5m bbl/d LESS crude purchasing. Crude builds in storage, prices fall. Meanwhile, gasoline prices spike (fewer refineries making it).",
                expectedEffect: "Counterintuitive 2-3% DROP in crude, while gasoline/diesel would surge (not traded here). Crude vs. product divergence.",
                principle: "REFINERY SHUTDOWN = BEARISH CRUDE — This is the #1 mistake new oil traders make. Refineries are the BUYERS of crude. When they shut, crude demand drops. Think of the supply CHAIN, not just supply.",
                riskNote: "This is the high-skill trade. Most assessment candidates get this wrong. If you buy crude here, you fail the test."
            }
        },
        {
            tick: 75,
            headline: "Gulf offshore production shut-in reaches 1.7m bbl/d",
            detail: "BSEE reports 91% of Gulf production offline. Supply disruption confirmed.",
            category: "supply",
            impact: { direction: 1, immediatePct: 0.04, driftPct: 0.025, driftDecayTicks: 50, volatilityMultiplier: 1.8, noiseAmplifier: 1.5 },
            strategy: {
                action: "COVER short, go LONG 5 lots",
                reasoning: "Now BOTH supply AND demand are disrupted. 1.7m bbl/d production loss is close to the 2.5m refining loss. The net effect is ambiguous, but the market focuses on the supply headline. More importantly, production shut-ins can last longer than refinery repairs.",
                expectedEffect: "3-4% rally as the market focuses on supply loss. The magnitude of shut-in is enormous — 91% of Gulf production.",
                principle: "NET BALANCE — When both supply and demand are disrupted, compare the magnitudes. Here, 1.7m supply loss vs 2.5m demand loss → technically net bearish, but the market trades the supply headline.",
                riskNote: "The market often misprices these situations. You're trading market REACTION, not fundamental reality."
            }
        },
        {
            tick: 110,
            headline: "Hurricane makes landfall as Cat 3 — refineries sustain flooding damage",
            detail: "Motiva Port Arthur (600k bbl/d) and Citgo Lake Charles report major flooding.",
            category: "weather",
            impact: { direction: -1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
            strategy: {
                action: "SELL 3-5 lots to reduce long or go short",
                reasoning: "Flooding damage to refineries means LONGER shutdowns. Production platforms restart in days (they evacuate, then return). Refineries with flood damage take WEEKS to months. So crude demand stays depressed while supply recovers.",
                expectedEffect: "1-2% drop. Refinery damage extends the imbalance period — too much crude, not enough refining to process it.",
                principle: "RECOVERY TIMELINE — Production restarts faster than refinery repairs. After a hurricane, the supply-demand imbalance shifts bearish for crude as production returns but refineries stay offline.",
                riskNote: "This is a nuanced trade. The magnitude depends on the severity of damage assessments in coming days."
            }
        },
        {
            tick: 150,
            headline: "US crude inventories spike 12m barrels as refining demand destroyed",
            detail: "EIA: crude stockpiles at 3-year high. Refinery utilization drops to 72%.",
            category: "data",
            impact: { direction: -1, immediatePct: 0.03, driftPct: 0.02, driftDecayTicks: 45, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "ADD to short position (sell 3-5 lots)",
                reasoning: "The data confirms the thesis: crude is piling up in storage because refineries can't process it. 12m barrel build is massive (normal is ±3m). 72% utilization is crisis-level low. Physical crude is getting trapped.",
                expectedEffect: "2-3% drop. Inventory data is hard evidence of the supply-demand imbalance.",
                principle: "INVENTORY DATA — Weekly EIA data is the most important scheduled data release in oil trading. Surprise builds = bearish, draws = bullish. The SIZE of the surprise matters — compare to consensus.",
                riskNote: "The short trade is validated by data. But watch for refinery restart announcements — that's the reversal signal."
            }
        },
        {
            tick: 200,
            headline: "Gulf platforms restart production — 70% capacity back online",
            detail: "Operators confirm minimal structural damage. Full restoration expected in 2 weeks.",
            category: "supply",
            impact: { direction: -1, immediatePct: 0.015, driftPct: 0.01, driftDecayTicks: 30, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
            strategy: {
                action: "HOLD short position",
                reasoning: "Production returning while refineries are still offline WIDENS the imbalance. More crude coming with nowhere to go. This confirms the bearish thesis — the supply glut gets worse before it gets better.",
                expectedEffect: "Small 1-2% dip. The market understands that more supply with less processing capacity = bearish.",
                principle: "SUPPLY RECOVERY — When offshore production returns but downstream (refining) capacity doesn't, the crude market gets heavier. Watch refinery restarts as the key catalyst.",
                riskNote: "Stay patient on the short. The reversal signal is refinery restarts, which will come next."
            }
        },
        {
            tick: 250,
            headline: "Refinery restarts begin — Motiva Port Arthur back at 50% capacity",
            detail: "Refining demand for crude returning. Crack spreads normalize.",
            category: "supply",
            impact: { direction: 1, immediatePct: 0.025, driftPct: 0.02, driftDecayTicks: 40, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "COVER short, go LONG 3-5 lots",
                reasoning: "THIS is the reversal signal. Refineries restarting = crude demand recovering. The 12m barrel inventory glut will start to be drawn down. Plus, refiners will scramble to catch up on lost production, potentially buying more crude than normal.",
                expectedEffect: "2-3% rally. Crack spread normalising means refiners are profitable again and will increase crude purchases.",
                principle: "REFINERY RESTART = BULLISH CRUDE — When downstream capacity comes back, crude demand surges. Refiners often over-buy to replenish depleted product inventories. This creates a 'catch-up' demand spike.",
                riskNote: "Lock in short profits and go long for the recovery rally. Flatten before the end of the scenario."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 300],
            frequency: 20,
            pool: [
                "LOOP crude terminal resumes limited operations",
                "Colonial Pipeline flows unaffected by storm",
                "SPR release under consideration but no decision yet",
                "Insurance losses estimated at $15B for energy sector",
                "Natural gas prices spike 8% on Gulf supply disruption",
                "Gasoline futures surge to $2.85/gal",
                "Mexico's Pemex reports normal Gulf output",
                "US weekly jobless claims unchanged at 215k",
                "Marathon Petroleum Galveston Bay refinery operating normally",
                "EIA short-term outlook maintains 2024 demand at 100.5m bbl/d"
            ]
        }
    ]
};

export default scenario3;
