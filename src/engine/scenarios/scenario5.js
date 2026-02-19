const scenario5 = {
    id: "scenario_mixed_signals",
    name: "Mixed Signals",
    description: "Conflicting fundamentals create a whipsaw market. Bullish supply meets bearish demand meets OPEC uncertainty. Test your conviction and position management.",
    difficulty: "Hard",
    startPrice: 78.00,
    totalTicks: 340,
    strategyOverview: `This is the assessment scenario that separates good traders from great ones. Conflicting headlines create whipsaw — the key is SIZING. When you're uncertain, trade SMALL. When signals align (e.g., OPEC cuts + shipping disruption), trade BIG. The mistake is equal-sizing every trade regardless of conviction. Also: learn to sit on your hands when the signal is genuinely ambiguous.`,
    events: [
        {
            tick: 15,
            headline: "Libya civil war flare-up shuts Sharara oilfield (300k bbl/d)",
            detail: "Armed militia seizes control of pipeline. Exports from Zawia port suspended.",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.025, driftPct: 0.015, driftDecayTicks: 40, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
            strategy: {
                action: "BUY 3 lots (small position)",
                reasoning: "300k bbl/d is meaningful but not huge (~0.3% of global supply). Libyan outages are common and usually temporary. The risk premium is modest and may fade quickly.",
                expectedEffect: "2-3% rally, likely to fade within 20-30 ticks. Libyan disruptions are 'known unknowns' — the market discounts them quickly.",
                principle: "LIBYAN SUPPLY — Libya is the most volatile producer in the world. Outages happen constantly due to civil war. The market has learned to discount them — they rarely sustain rallies.",
                riskNote: "SMALL SIZE. This is not a high-conviction trade. Libya outages can resolve in days."
            }
        },
        {
            tick: 42,
            headline: "US GDP contracts 0.3% in Q2 — first negative quarter in 2 years",
            detail: "Bureau of Economic Analysis: consumer spending fell 1.2%. Recession debate intensifies.",
            category: "demand",
            impact: { direction: -1, immediatePct: 0.03, driftPct: 0.02, driftDecayTicks: 45, volatilityMultiplier: 1.6, noiseAmplifier: 1.4 },
            strategy: {
                action: "SELL long and go SHORT 3 lots",
                reasoning: "US GDP contraction outweighs Libyan outage. The US consumes 20m bbl/d — a recession there is far more impactful than 300k bbl/d of lost Libyan supply. Demand > supply in this trade.",
                expectedEffect: "3% drop. Recession fears dominate. The Libyan premium evaporates as demand concerns take over.",
                principle: "DEMAND vs SUPPLY WEIGHTING — Always compare the MAGNITUDE. 300k bbl/d supply loss vs potential 500k+ bbl/d demand decline from US recession. The bigger number wins.",
                riskNote: "Your conviction should be moderate. GDP data can be revised, and one quarter doesn't confirm a recession."
            }
        },
        {
            tick: 80,
            headline: "OPEC+ compliance drops to 60% — overproduction by Iraq and Kazakhstan",
            detail: "Joint Ministerial Committee warns of 'serious consequences' for non-compliance.",
            category: "opec",
            impact: { direction: -1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "HOLD short position (don't add)",
                reasoning: "OPEC cheating adds to the bearish picture but it's not a new theme. Iraq and Kazakhstan always cheat. The Warning will likely lead to increased compliance eventually.",
                expectedEffect: "Modest 1-2% dip. OPEC non-compliance is bearish but expected — the market partially discounts it.",
                principle: "OPEC COMPLIANCE — Track the gap between announced cuts and actual delivery. Iraq and Kazakhstan are serial cheaters. Saudi Arabia always compensates. The WARNING is the catalyst, not the cheating itself.",
                riskNote: "Don't pile on. Three bearish events doesn't mean the fourth will also be bearish. Mean reversion is real."
            }
        },
        {
            tick: 120,
            headline: "Red Sea attacks intensify — Houthi drones hit commercial tanker",
            detail: "Major shipping lines reroute via Cape of Good Hope. Freight costs spike 40%.",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.035, driftPct: 0.025, driftDecayTicks: 50, volatilityMultiplier: 1.7, noiseAmplifier: 1.5 },
            strategy: {
                action: "COVER short, GO LONG 5 lots",
                reasoning: "Red Sea disruption is a MAJOR supply catalyst. Rerouting via Cape of Good Hope adds 10-14 days to voyages = effective supply reduction of 2-3m bbl/d for weeks. Freight costs up 40% makes some trade routes uneconomic. This changes the whole calculus.",
                expectedEffect: "3-4% rally. Shipping disruptions are more sustained than production outages because they affect FLOW, not stock.",
                principle: "SHIPPING CHOKEPOINTS — Red Sea (Bab el-Mandeb) carries 10% of global oil trade. Rerouting via Cape of Good Hope creates: (1) effective supply delay, (2) higher freight costs, (3) tanker shortage. These are SUSTAINED bullish forces.",
                riskNote: "This is a genuine signal change. Increase position size. Red Sea disruptions last months, not days."
            }
        },
        {
            tick: 165,
            headline: "EIA: US crude production hits all-time high of 13.4m bbl/d",
            detail: "Permian Basin efficiency gains continue. DUC wells declining but output rising.",
            category: "supply",
            impact: { direction: -1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 40, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
            strategy: {
                action: "REDUCE long by 2 lots (trim, don't flip)",
                reasoning: "Record US production is bearish, but it's gradual and already partially priced in. Shale growth rate is slowing even though levels are high. The Red Sea disruption effect is larger and more sudden.",
                expectedEffect: "Small 1-2% dip. US production records create incremental selling but don't dominate the narrative.",
                principle: "US SHALE — Record production is bearish but the RATE OF CHANGE matters more than the level. If growth is decelerating (DUC wells declining), the bearish impact is limited.",
                riskNote: "Trim don't flip. The mixed signals mean small position adjustments, not wholesale reversals."
            }
        },
        {
            tick: 210,
            headline: "China Shandong teapot refineries boost imports to record levels",
            detail: "Discount Russian crude driving independent refinery purchases. Imports +12% y/y.",
            category: "demand",
            impact: { direction: 1, immediatePct: 0.025, driftPct: 0.02, driftDecayTicks: 40, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "ADD 3 lots to long",
                reasoning: "Chinese import demand surging contradicts the earlier recession narrative. The teapot refineries buying discount Russian crude means REAL demand is stronger than GDP data suggested. Physical flows > economic indicators.",
                expectedEffect: "2-3% rally. Physical crude demand from China's teapot sector is bullish for the entire barrel.",
                principle: "PHYSICAL vs PAPER — Import data (physical barrels) is more reliable than economic indicators (PMI, GDP). When ships are loading, that's real demand regardless of what economists say.",
                riskNote: "You're long and adding on bullish China data. This is the right side but be aware of the crosstrade — US recession vs China demand recovery."
            }
        },
        {
            tick: 255,
            headline: "OPEC+ surprise: deep voluntary cuts by Saudi Arabia and Russia",
            detail: "Combined 1.5m bbl/d voluntary reduction. Both nations pledge full compliance.",
            category: "opec",
            impact: { direction: 1, immediatePct: 0.04, driftPct: 0.03, driftDecayTicks: 55, volatilityMultiplier: 1.8, noiseAmplifier: 1.5 },
            strategy: {
                action: "INCREASE long to near-maximum position",
                reasoning: "Saudi + Russia voluntary cuts PLUS Red Sea disruption PLUS strong China demand = triple bullish convergence. This is the highest conviction point in the scenario. When 3 major factors align, SIZE UP.",
                expectedEffect: "3-4% rally. The market reprices to account for a tighter supply picture across multiple dimensions.",
                principle: "SIGNAL CONVERGENCE — The highest-conviction trades come when multiple independent factors align. Supply cut + shipping disruption + demand recovery = triple bullish. This is when you use your full VAR.",
                riskNote: "Near-max investment. The convergence of factors makes this a rare high-conviction opportunity."
            }
        },
        {
            tick: 300,
            headline: "US imposes new sanctions on Russian crude — tighter price cap enforcement",
            detail: "Treasury targets tanker insurers and traders. Shadow fleet operations disrupted.",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "TAKE PROFIT — flatten to close",
                reasoning: "Sanctions on Russian crude are incrementally bullish, but this is the end of the scenario. Lock in your gains. The lesson of this scenario: in mixed markets, the big money is made by identifying when signals CONVERGE.",
                expectedEffect: "Small 1-2% rally. Russian sanctions tighten the supply picture but the effect is gradual.",
                principle: "SANCTIONS — Tighter enforcement reduces effective supply of discounted Russian crude. The impact is slow (months) but persistent. In a tight market, even small incremental supply losses matter.",
                riskNote: "Close out. The lesson: in 'Mixed Signals,' the key was surviving the whipsaw (Libya → recession → OPEC cheating → Red Sea → convergence) with your capital intact to trade the high-conviction setup."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 340],
            frequency: 15,
            pool: [
                "Baker Hughes: US oil rig count falls by 3 to 479",
                "Brent-WTI spread narrows to $3.80",
                "IMF flags rising energy transition risks for oil demand",
                "Canadian TMX pipeline flows reach full capacity",
                "Norway's Johan Sverdrup field output stable at 755k bbl/d",
                "US driving season gasoline demand slightly below 5-year avg",
                "Crude oil managed money net longs drop 8% — CFTC",
                "Venezuela's PDVSA reports stable output at 800k bbl/d",
                "Turkish refiner Tupras cuts processing rates by 10%",
                "Guyana Stabroek block output ramps to 620k bbl/d",
                "Singapore onshore fuel oil stocks fall to 6-month low"
            ]
        }
    ]
};

export default scenario5;
