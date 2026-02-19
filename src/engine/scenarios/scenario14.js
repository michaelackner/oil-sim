const scenario14 = {
    id: "scenario_dollar_macro",
    name: "Dollar Wrecking Ball",
    description: "The Federal Reserve's rate decisions drive the US dollar, which inversely correlates with oil prices. Navigate rate hikes, dovish pivots, and the macro-oil nexus.",
    difficulty: "Hard",
    startPrice: 77.00,
    totalTicks: 330,
    strategyOverview: `Oil is priced in US dollars. When the dollar strengthens, oil becomes more expensive for non-US buyers, reducing demand at the margin. Historically, a 1% move in the Dollar Index (DXY) correlates with a ~0.5-1% inverse move in crude. Rate decisions by the Fed are the primary driver of the dollar. The challenge: macro moves are slower and grindier than supply shocks. You need patience and the ability to distinguish between real macro regime shifts and noise in economic data.`,
    events: [
        {
            tick: 20,
            headline: "Fed raises rates 50bps — hawkish surprise above consensus 25bps",
            detail: "Powell cites persistent inflation. Dot plot signals two more hikes this year. Dollar Index surges 1.2%. 10-year Treasury yield at 4.85%.",
            category: "macro",
            impact: { direction: -1, immediatePct: 0.025, driftPct: 0.015, driftDecayTicks: 40, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "SELL 5 lots",
                reasoning: "Hawkish surprise = stronger dollar = crude negative. A 50bps hike when 25bps was expected is a significant surprise. The dollar will strengthen further as the market reprices the rate path. Oil faces headwinds from both stronger dollar AND demand slowdown from tighter monetary conditions.",
                expectedEffect: "2-3% crude decline over 30-40 ticks. Macro moves grind, they don't crash.",
                principle: "FED HAWKISH SURPRISE — Unexpected rate moves matter more than expected ones. The surprise is what drives the dollar and oil. Always compare the actual decision to consensus expectations.",
                riskNote: "Macro shorts require patience. Don't scalp a macro thesis."
            }
        },
        {
            tick: 70,
            headline: "ISM Manufacturing PMI drops to 46.2 — contraction deepening",
            detail: "New orders sub-component at 42.1. Employment declining. Prices paid easing. Second consecutive month of deepening contraction.",
            category: "data",
            impact: { direction: -1, immediatePct: 0.015, driftPct: 0.01, driftDecayTicks: 30, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
            strategy: {
                action: "HOLD SHORT — add 2 lots",
                reasoning: "PMI below 50 = manufacturing contraction. Below 46 = significant contraction. Manufacturing uses diesel and heavy fuels. Weak manufacturing = weak industrial oil demand. This ALSO suggests the Fed rate hikes are working → more dollar strength ahead.",
                expectedEffect: "1-1.5% additional decline. Demand weakness building.",
                principle: "PMI AND OIL DEMAND — Manufacturing PMI is a leading indicator for industrial oil demand. Sub-46 readings historically correlate with 1-2% demand growth deceleration.",
                riskNote: "Confluence of strong dollar + weak manufacturing = high-conviction short."
            }
        },
        {
            tick: 125,
            headline: "US CPI comes in hot at 4.2% — above 3.8% consensus",
            detail: "Core CPI 3.9% vs 3.5% expected. Shelter costs persistent. Services inflation sticky. Market prices out rate cuts entirely for this year.",
            category: "data",
            impact: { direction: -1, immediatePct: 0.02, driftPct: 0.012, driftDecayTicks: 35, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "HOLD SHORT",
                reasoning: "Hot CPI = rates staying higher for longer = stronger dollar for longer. Oil negative. The market pricing out rate cuts means the dollar headwind persists. This extends the timeline of your bearish thesis.",
                expectedEffect: "1.5-2% decline. Dollar strengthens further.",
                principle: "INFLATION → RATES → DOLLAR → OIL — Follow the chain. Higher inflation → higher rates → stronger dollar → weaker oil. Each CPI print updates the market's rate expectations.",
                riskNote: "Your short is well-supported by the macro regime. Hold."
            }
        },
        {
            tick: 190,
            headline: "OPEC+ announces surprise 1.5m bbl/d voluntary cuts led by Saudi Arabia",
            detail: "Response to falling prices. Saudi cuts 1m bbl/d unilaterally. UAE, Kuwait contribute rest. Effective next month.",
            category: "opec",
            impact: { direction: 1, immediatePct: 0.045, driftPct: 0.03, driftDecayTicks: 55, volatilityMultiplier: 1.7, noiseAmplifier: 1.4 },
            strategy: {
                action: "COVER SHORT (buy back all positions)",
                reasoning: "OPEC supply cuts overpower macro headwinds in the short term. 1.5m bbl/d is ~1.5% of global supply. Even with a strong dollar, physical tightening from OPEC cuts lifts prices. Macro vs. supply forces: supply wins in the near term.",
                expectedEffect: "4-5% spike. OPEC cuts are the most reliable bullish catalyst in oil.",
                principle: "SUPPLY TRUMPS MACRO (SHORT TERM) — In a tug of war between macro bearishness and physical supply tightening, supply usually wins in week-to-month timeframes. Macro wins over quarters.",
                riskNote: "Critical to cover quickly. Don't fight OPEC with a macro thesis."
            }
        },
        {
            tick: 250,
            headline: "Fed signals potential rate cuts — Powell mentions 'dual mandate' balance shifting",
            detail: "FOMC minutes show growing discussion of rate cuts. Three members dissented hawkish. Dollar Index drops 0.8%. Markets price 75% chance of cut in September.",
            category: "macro",
            impact: { direction: 1, immediatePct: 0.025, driftPct: 0.02, driftDecayTicks: 40, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "GO LONG 5 lots",
                reasoning: "The macro regime is pivoting. Rate cuts = weaker dollar = bullish oil. Combined with OPEC cuts still in effect, you have both supply tightening AND dollar weakening. This is the strongest setup in the scenario.",
                expectedEffect: "2-3% rally. Dollar weakening lifts all commodity prices.",
                principle: "MACRO PIVOT — Fed rate cycle inflections are the most powerful macro signals. When the Fed pivots from hiking to cutting, the dollar trend reverses, lifting commodities broadly.",
                riskNote: "High conviction. Macro + supply alignment is rare and powerful."
            }
        },
        {
            tick: 305,
            headline: "Monthly jobs report shows surprise 350k nonfarm payrolls — double expectations",
            detail: "Unemployment drops to 3.5%. Wage growth 4.2%. Market reprices cut expectations. Dollar rallies. 'Hot labor market makes September cut unlikely.'",
            category: "data",
            impact: { direction: -1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 30, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "SELL to FLATTEN — close all positions",
                reasoning: "Hot jobs data reverses the dovish pivot narrative. If cuts are delayed, the dollar strengthens again. Near end of scenario — take profits on the long, don't try to ride it through uncertain macro data. Clean exit.",
                expectedEffect: "1.5-2% drop. Macro uncertainty returns.",
                principle: "DATA DEPENDENCE — In a data-dependent Fed regime, EVERY major economic release can shift the narrative. Monthly jobs and CPI are the two most market-moving data points.",
                riskNote: "Flatten. Don't hold directional risk through uncertain macro moments at end of scenario."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 330],
            frequency: 15,
            pool: [
                "ECB keeps rates unchanged at quarterly meeting",
                "Chinese PMI inches up to 50.2 from 49.8 — marginal expansion",
                "Bank of Japan maintains yield curve control policy",
                "US consumer confidence index at 101.3 — in line with expectations",
                "Atlanta Fed GDPNow tracker estimates 2.3% Q3 growth",
                "Treasury 2-10 spread inverts further — mixed recession signal",
                "Copper prices firm 1.5% on China infrastructure spending plans",
                "Gold touches $2,100 briefly on safe-haven flows",
                "Euro-dollar exchange rate stable at 1.0785",
                "Brazilian real weakens 0.5% against dollar on fiscal concerns",
                "Indian crude import bill rises on stronger dollar — RBI intervenes",
                "Commodity trading advisors report record short positioning in crude",
                "Morgan Stanley revises oil price forecast down $5 to $75 for year-end",
                "Goldman Sachs maintains $85 year-end call — supply tightness thesis"
            ]
        }
    ]
};

export default scenario14;
