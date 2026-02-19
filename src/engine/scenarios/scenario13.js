const scenario13 = {
    id: "scenario_refinery_turnaround",
    name: "Turnaround Season",
    description: "Spring refinery maintenance season creates predictable crude demand drops and product price spikes. Navigate seasonal patterns, unplanned outages, and the transition from maintenance to driving season demand.",
    difficulty: "Medium",
    startPrice: 73.00,
    totalTicks: 310,
    strategyOverview: `Every year, refineries shut down for planned maintenance (turnaround) in spring and autumn. During turnaround season, crude demand drops ~1-2m bbl/d as refineries stop buying. Crude stocks build. But as turnarounds end, refineries ramp up aggressively for driving season, pulling crude stocks down. The best traders anticipate the seasonal cycle and position ahead of the crowd. The complication: unplanned outages during or after turnaround can extend the demand weakness.`,
    events: [
        {
            tick: 15,
            headline: "US refinery utilization drops to 85.3% — lowest since January as turnaround season begins",
            detail: "ExxonMobil Baytown, Marathon Galveston Bay, and Valero Port Arthur all beginning planned maintenance. Combined 1.4m bbl/d capacity offline for 4-6 weeks.",
            category: "data",
            impact: { direction: -1, immediatePct: 0.015, driftPct: 0.012, driftDecayTicks: 40, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
            strategy: {
                action: "SELL 3-5 lots (short crude)",
                reasoning: "Turnaround season = less crude demand from refineries. 1.4m bbl/d offline for 4-6 weeks means crude will build in storage. This is a known seasonal pattern — the question is whether the market has already priced it in.",
                expectedEffect: "Gradual 1-1.5% decline over next 30-40 ticks. Turnaround-driven weakness grinds, doesn't crash.",
                principle: "SEASONAL PATTERNS — Turnaround season (March-May, Sept-Oct) reliably reduces crude demand. But because it's predictable, the price impact is often muted. The edge comes from trading the SIZE of the turnaround vs expectations.",
                riskNote: "This is a grind, not a crash. Size for a patient trade, not a quick scalp."
            }
        },
        {
            tick: 55,
            headline: "Crude inventories build 6.2m barrels — fourth consecutive weekly build",
            detail: "Cushing hub stocks at 38m barrels, up from 31m seven weeks ago. Refinery inputs at 14.8m bbl/d vs seasonal 5-year average of 15.5m.",
            category: "data",
            impact: { direction: -1, immediatePct: 0.018, driftPct: 0.01, driftDecayTicks: 30, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
            strategy: {
                action: "HOLD SHORT — consider adding 2 lots",
                reasoning: "Four consecutive builds confirm the seasonal thesis. Cushing up 7m barrels in 7 weeks is textbook turnaround-season accumulation. The trade is working. Don't take profits yet — the turnaround peak hasn't happened.",
                expectedEffect: "Another 1-2% grind lower. Builds are expected but the magnitude matters.",
                principle: "TREND CONFIRMATION — When data consistently confirms your thesis across multiple weeks, it validates holding. Don't second-guess a working position on a single datapoint.",
                riskNote: "The risk is a surprise early turnaround completion. Watch utilization data."
            }
        },
        {
            tick: 110,
            headline: "Fire at Phillips 66 Sweeny refinery — unit shutdown extends maintenance by 3 weeks",
            detail: "Crude unit fire during restart after planned maintenance. 247k bbl/d facility. Safety inspection required. No injuries reported.",
            category: "supply",
            impact: { direction: -1, immediatePct: 0.01, driftPct: 0.008, driftDecayTicks: 25, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "HOLD SHORT",
                reasoning: "Unplanned extension of maintenance = even LESS crude demand for even LONGER. This is doubly bearish crude: the refinery won't be buying crude for another 3 weeks beyond plan. Some traders mistakenly go long on 'refinery fire' headlines. Remember: refinery outage = reduced crude demand.",
                expectedEffect: "Slight additional crude weakness. The marginal barrel of crude demand just disappeared for 3 more weeks.",
                principle: "REFINERY OUTAGE DIRECTION — Unplanned refinery outages during turnaround EXTEND the crude-bearish period. More offline refining = more crude building in storage.",
                riskNote: "Your short is well-positioned. Patience."
            }
        },
        {
            tick: 170,
            headline: "Baytown and Galveston Bay refineries complete maintenance — restarting units",
            detail: "ExxonMobil confirms successful turnaround completion. Crude units running at reduced rates, expected to reach full capacity in 10 days.",
            category: "supply",
            impact: { direction: 1, immediatePct: 0.015, driftPct: 0.01, driftDecayTicks: 30, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
            strategy: {
                action: "COVER 3 lots (begin taking profits on short)",
                reasoning: "Two major refineries restarting = crude demand coming back. 800k+ bbl/d of crude purchasing reactivating. The turnaround trough is passing. Start covering your short — the seasonal pattern is shifting from build to draw.",
                expectedEffect: "1-1.5% bounce. The tide is turning from seasonal weakness to seasonal strength.",
                principle: "SEASONAL TURN — The transition from turnaround completion to driving season ramp-up is one of the most reliable seasonal bullish patterns in crude oil. Position for it ahead of consensus.",
                riskNote: "Don't hold shorts too long into the transition. The driving season ramp can be powerful."
            }
        },
        {
            tick: 220,
            headline: "Refinery utilization surges to 93.1% — highest in 6 months as driving season approaches",
            detail: "Refineries pulling maximum crude. Gasoline production ramp underway. Memorial Day demand expectations strong. Crude inputs at 16.8m bbl/d.",
            category: "data",
            impact: { direction: 1, immediatePct: 0.03, driftPct: 0.02, driftDecayTicks: 45, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "CLOSE remaining short, GO LONG 5-8 lots",
                reasoning: "93% utilization = refineries at full power, consuming maximum crude. 16.8m bbl/d crude input is enormous. Crude stocks will now draw sharply. This is the seasonal reversal point — the game shifts from oversupply to tightness.",
                expectedEffect: "2.5-3% rally. The seasonal reversal is the strongest signal in the cycle.",
                principle: "DRIVING SEASON RAMP — May-August US gasoline demand creates a predictable pull on crude. Refineries need ~2% more crude throughput vs spring. This draws down the storage built during turnaround.",
                riskNote: "This is a high-conviction seasonal long. Size up."
            }
        },
        {
            tick: 280,
            headline: "Gasoline demand disappoints — Memorial Day travel 4% below forecast",
            detail: "AAA reports lower domestic travel. Pump prices remain elevated. Consumer confidence data soft. Gasoline crack spreads narrow.",
            category: "data",
            impact: { direction: -1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "SELL to FLATTEN",
                reasoning: "Driving season demand disappointment is a clear signal to exit. If gasoline demand is weak, refineries will reduce throughput, buying less crude. The seasonal bull thesis depends on strong demand — weak demand invalidates it. Book profits and go flat.",
                expectedEffect: "2% drop. Seasonal expectations deflating.",
                principle: "THESIS INVALIDATION — When the data contradicts your thesis, exit. A seasonal long based on driving demand doesn't work if driving demand disappoints. No ego in trading.",
                riskNote: "Flatten cleanly. The seasonal cycle has disappointed."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 310],
            frequency: 14,
            pool: [
                "Canadian oil sands maintenance schedules announced — routine spring work",
                "Gulf Coast crude delivery schedules operating within normal range",
                "WTI-Brent spread narrows 20 cents — seasonal compression",
                "ANS crude differentials firm on West Coast refinery demand",
                "Railcar crude movements from Bakken show normal seasonal patterns",
                "Strategic Petroleum Reserve releases paused — no change",
                "LOOP terminal crude receipts steady at 1.2m bbl/d",
                "Crude quality mix at Cushing shifts slightly toward light sweet",
                "Mexican Maya crude exports to US stable at 500k bbl/d",
                "Colonial Pipeline operating at full capacity — no issues",
                "Baker Hughes US rig count unchanged at 485 oil rigs",
                "Permian crude production at 6.1m bbl/d — marginal growth steady"
            ]
        }
    ]
};

export default scenario13;
