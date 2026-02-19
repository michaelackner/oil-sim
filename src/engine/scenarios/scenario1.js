const scenario1 = {
    id: "scenario_middle_east_crisis",
    name: "Middle East Escalation",
    description: "Tensions escalate between Iran and Israel, threatening Strait of Hormuz transit. Navigate supply fear spikes and diplomatic resolutions.",
    difficulty: "Medium",
    startPrice: 76.50,
    totalTicks: 320,
    strategyOverview: `This scenario tests your ability to trade geopolitical supply risk. The key pattern is: military escalation → supply fear premium → diplomatic resolution → premium unwind. The best traders buy early on genuine supply threats, take partial profits at peaks, and reverse short when de-escalation signals appear. Don't chase late moves — the biggest gains come from being positioned BEFORE the crowd reacts.`,
    events: [
        {
            tick: 15,
            headline: "BREAKING: Israeli jets strike targets near Iranian oil infrastructure",
            detail: "Reports of explosions near Kharg Island. No confirmed damage to export terminals.",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.04, driftPct: 0.02, driftDecayTicks: 40, volatilityMultiplier: 1.8, noiseAmplifier: 1.5 },
            strategy: {
                action: "BUY 5-10 lots immediately",
                reasoning: "Kharg Island handles ~90% of Iran's oil exports (3.5m bbl/d). Even unconfirmed damage near it creates massive supply risk premium. The market will spike on headline alone — positioning speed is critical.",
                expectedEffect: "Price jumps ~3-4% instantly, then drifts higher as traders digest Strait of Hormuz implications. Volatility increases sharply.",
                principle: "SUPPLY SHOCK — Military action near critical oil infrastructure always triggers a risk premium. Buy first, ask questions later.",
                riskNote: "Size moderately (5 lots). The strike may prove to be a non-event if no infrastructure is damaged."
            }
        },
        {
            tick: 45,
            headline: "Iran threatens to close Strait of Hormuz if strikes continue",
            detail: "IRGC Navy commander: 'Any further aggression will be met with closure of vital waterways.'",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.05, driftPct: 0.03, driftDecayTicks: 60, volatilityMultiplier: 2.0, noiseAmplifier: 1.8 },
            strategy: {
                action: "ADD 5 lots (increase long position)",
                reasoning: "Strait of Hormuz carries ~20% of global oil supply (21m bbl/d). A credible closure threat is the single most bullish event in oil markets. This is the 'nuclear option' for oil supply.",
                expectedEffect: "Another 4-5% spike. This is typically the peak of the initial fear trade. Consider your exit plan.",
                principle: "CHOKEPOINT RISK — Hormuz threats are the most potent bullish catalyst in oil. The key question is: is this a credible threat or posturing?",
                riskNote: "You should now be near your VAR limit. This is intentional — maximum conviction moments deserve maximum size. But plan your exit."
            }
        },
        {
            tick: 80,
            headline: "US releases 30 million barrels from Strategic Petroleum Reserve",
            detail: "White House: 'This release is to ensure stability in global oil markets.'",
            category: "policy",
            impact: { direction: -1, immediatePct: 0.015, driftPct: 0.01, driftDecayTicks: 30, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
            strategy: {
                action: "TAKE PARTIAL PROFIT — sell 3-5 lots to reduce long",
                reasoning: "SPR releases signal political intervention to cap prices. 30m barrels is ~1.5 days of US consumption — not huge, but it shows the US government is actively managing prices downward. This caps upside.",
                expectedEffect: "Modest 1-2% dip. SPR releases have limited physical impact but significant signalling effect — governments are price-sensitive.",
                principle: "POLICY RESPONSE — When governments intervene on oil prices, it signals a ceiling. SPR releases rarely crash prices but they cap rallies and shift sentiment.",
                riskNote: "Don't sell everything. The underlying geopolitical risk hasn't resolved — SPR releases are a bandaid, not a cure."
            }
        },
        {
            tick: 120,
            headline: "Satellite imagery shows no damage to Kharg Island oil terminals",
            detail: "Commercial satellite provider confirms export infrastructure intact.",
            category: "geopolitical",
            impact: { direction: -1, immediatePct: 0.03, driftPct: 0.02, driftDecayTicks: 50, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "SELL remaining long position, consider going SHORT 3-5 lots",
                reasoning: "This is the key turning point. 'No damage confirmed' removes the physical supply disruption thesis. The risk premium that was priced in now needs to unwind. Smart money gets out here.",
                expectedEffect: "Sharp 2-3% drop as the war premium deflates. Expect continuation lower as more traders accept the threat was overblown.",
                principle: "RISK PREMIUM UNWIND — When the feared event is confirmed to NOT have occurred, the risk premium unwinds rapidly. The market 'bought the rumour' and now 'sells the fact.'",
                riskNote: "Going short here is the contrarian move. Most retail traders will still be bullish on 'what if'. You need conviction in the satellite data."
            }
        },
        {
            tick: 160,
            headline: "OPEC+ emergency meeting: Members agree to boost output by 500k bbl/d",
            detail: "Saudi Arabia and UAE to lead output increase. Effective next month.",
            category: "opec",
            impact: { direction: -1, immediatePct: 0.025, driftPct: 0.015, driftDecayTicks: 45, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "ADD to SHORT position (sell 3-5 more lots)",
                reasoning: "OPEC+ output increase = more supply entering the market. 500k bbl/d is meaningful (~0.5% of global supply). Combined with de-escalation and SPR release, the bearish case is building.",
                expectedEffect: "2-3% drop. OPEC output increases are reliably bearish. The market prices in the additional barrels over the coming weeks.",
                principle: "OPEC SUPPLY INCREASE — More barrels from OPEC directly increases supply. The size matters: 500k is significant but not catastrophic. Always compare to global demand (~100m bbl/d).",
                riskNote: "Your short is now working. Trail your mental stop — if geopolitics re-escalate, you'll need to cover quickly."
            }
        },
        {
            tick: 200,
            headline: "Iran seizes oil tanker in Strait of Hormuz",
            detail: "Marshall Islands-flagged VLCC seized by IRGC Navy. Crew of 25 aboard.",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.06, driftPct: 0.04, driftDecayTicks: 70, volatilityMultiplier: 2.2, noiseAmplifier: 2.0 },
            strategy: {
                action: "COVER SHORT immediately (buy to close), then GO LONG 5-10 lots",
                reasoning: "Tanker seizure is a PHYSICAL act of aggression, not just rhetoric. This is far more serious than verbal threats. It proves Iran is willing to disrupt shipping — insurance costs will spike, tankers will reroute, effective supply shrinks.",
                expectedEffect: "Massive 5-6% spike. This is the biggest move in the scenario. Shipping insurance premiums will surge, rerouting adds 10+ days to voyages.",
                principle: "PHYSICAL DISRUPTION vs RHETORIC — Words move markets 2-3%. Physical actions (seizing ships, bombing infrastructure) move markets 5-10%. Always distinguish between threats and actions.",
                riskNote: "This is maximum stress. If you were short, you just took a big loss. The lesson: always have stops on geopolitical shorts. Cover first, then re-evaluate."
            }
        },
        {
            tick: 280,
            headline: "Diplomatic breakthrough: Iran agrees to release tanker after UN mediation",
            detail: "Strait of Hormuz reopened to all commercial traffic. Tensions de-escalating.",
            category: "geopolitical",
            impact: { direction: -1, immediatePct: 0.04, driftPct: 0.03, driftDecayTicks: 60, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
            strategy: {
                action: "SELL long position, FLATTEN to close the game",
                reasoning: "Diplomatic resolution = risk premium unwind (again). The tanker release + Hormuz reopening removes the acute supply disruption. Prices should return toward pre-crisis levels.",
                expectedEffect: "3-4% drop. The crisis premium that was rebuilt after the tanker seizure now deflates. Market normalises.",
                principle: "CRISIS RESOLUTION — Diplomatic breakthroughs after supply disruptions trigger sharp selloffs. The speed of unwind is proportional to the speed of the original rally.",
                riskNote: "This is near the end of the scenario. Flatten your position to lock in P&L. Don't leave risk on the table."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 320],
            frequency: 18,
            pool: [
                "US weekly rig count unchanged at 482",
                "China refinery throughput steady at 14.2m bbl/d",
                "Brent open interest rises 3.2% on ICE",
                "API reports modest crude draw of 1.1m barrels",
                "Nigerian production stable despite pipeline maintenance",
                "European gas prices ease on mild weather forecast",
                "Dollar index (DXY) flat at 104.2",
                "Baltic Dirty Tanker Index up 2.1% on rerouting costs",
                "IEA monthly report reiterates demand growth forecast at 1.2m bbl/d",
                "Permian Basin output hits new record of 6.1m bbl/d",
                "Japan crude imports fall 3% m/m on seasonal maintenance",
                "Indian refinery runs rise to 5.4m bbl/d"
            ]
        }
    ]
};

export default scenario1;
