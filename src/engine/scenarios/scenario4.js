const scenario4 = {
    id: "scenario_demand_shock",
    name: "Demand Shock",
    description: "China's economy slows sharply, dragging global oil demand down. Practice patience holding shorts and recognising turning points in a demand-led selloff.",
    difficulty: "Medium-Hard",
    startPrice: 80.00,
    totalTicks: 330,
    strategyOverview: `Demand shocks are slower and more sustained than supply shocks. Prices grind lower over weeks, not crash overnight. The perfect strategy requires PATIENCE — hold shorts through noise, don't take profits too early, and wait for genuine demand recovery signals (stimulus, PMI rebound) before reversing. The trap is buying every dip in a structural downtrend.`,
    events: [
        {
            tick: 18,
            headline: "China GDP growth slows to 3.2% — worst in 3 decades",
            detail: "NBS data far below 5.0% target. Property sector collapse deepens. PMI contracts.",
            category: "demand",
            impact: { direction: -1, immediatePct: 0.035, driftPct: 0.025, driftDecayTicks: 55, volatilityMultiplier: 1.7, noiseAmplifier: 1.4 },
            strategy: {
                action: "SHORT 5-8 lots",
                reasoning: "China consumes ~16m bbl/d of oil (~16% of global demand). GDP at 3.2% vs 5.0% target means the economy is in much worse shape than expected. Property sector = construction = diesel demand collapse. This is not a one-quarter blip — it's structural.",
                expectedEffect: "3-4% drop with sustained drift lower. Demand shocks move slower but last longer than supply shocks.",
                principle: "DEMAND SHOCK DYNAMICS — Supply shocks are sudden and V-shaped. Demand shocks are gradual and L/U-shaped. When the world's largest oil importer slows, it affects every grade, every route, every refiner.",
                riskNote: "Size at 5-8 lots (not max). Demand shocks unfold over weeks — you need staying power. Don't let short-term bounces shake you out."
            }
        },
        {
            tick: 55,
            headline: "European manufacturing PMI hits 44.1 — recession fears mount",
            detail: "Germany and France lead contraction. Industrial diesel demand drops 5% y/y.",
            category: "demand",
            impact: { direction: -1, immediatePct: 0.025, driftPct: 0.02, driftDecayTicks: 45, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
            strategy: {
                action: "ADD to short (sell 3-5 more lots)",
                reasoning: "China weakness + European recession = GLOBAL demand problem. PMI below 44 is deep contraction — this isn't a soft patch, it's a recession. Industrial diesel demand falling 5% y/y is massive.",
                expectedEffect: "2-3% drop. The demand weakness is spreading from China to Europe. Markets start pricing a global recession.",
                principle: "PMI AS A LEADING INDICATOR — Manufacturing PMI is the single best leading indicator for industrial oil demand (diesel, fuel oil). Below 50 = contraction. Below 45 = severe. Always compare to consensus.",
                riskNote: "Your short is building. The key risk is policy response (central bank cuts, government stimulus). Watch for those signals."
            }
        },
        {
            tick: 95,
            headline: "IEA slashes 2024 oil demand growth forecast by 500k bbl/d",
            detail: "Global demand growth now expected at just 700k bbl/d. 'Clear signs of deceleration.'",
            category: "demand",
            impact: { direction: -1, immediatePct: 0.03, driftPct: 0.02, driftDecayTicks: 50, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "HOLD short position with confidence",
                reasoning: "IEA cutting forecasts validates your thesis with institutional authority. 500k bbl/d downgrade is enormous — it means global demand growth is halving. The major agencies (IEA, OPEC, EIA) don't cut forecasts lightly.",
                expectedEffect: "2-3% drop. Agency forecast revisions trigger algorithmic selling and investor rebalancing.",
                principle: "AGENCY FORECASTS — IEA/OPEC/EIA forecast revisions move markets because they trigger portfolio rebalancing. Large downgrades create cascading sell orders as funds adjust models.",
                riskNote: "Three bearish events in a row — the market is getting oversold. Start watching for reversal catalysts. Don't add new shorts here."
            }
        },
        {
            tick: 140,
            headline: "US Fed cuts rates by 50bps in emergency action",
            detail: "Powell: 'We are acting decisively to support economic growth.' Markets mixed.",
            category: "policy",
            impact: { direction: 1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "TAKE PARTIAL PROFIT — cover 3 lots to reduce short",
                reasoning: "Emergency rate cut = policymakers are scared. This is the FIRST reversal signal. Rate cuts weaken the dollar (bullish for oil), lower borrowing costs (supports economic activity), and signal more stimulus is coming. But 50bps alone won't fix a demand shock.",
                expectedEffect: "Small 1-2% bounce. The market is watching for more policy action. Rate cuts are necessary but not sufficient for a demand recovery.",
                principle: "MONETARY POLICY — Rate cuts are the early signal of policy reversal. They're bullish for oil via three channels: (1) weaker dollar, (2) lower financing costs, (3) signal effect of more to come.",
                riskNote: "Reduce but don't flatten. One rate cut doesn't reverse a structural demand shock. Wait for fiscal stimulus (government spending)."
            }
        },
        {
            tick: 190,
            headline: "China announces $1 trillion stimulus: infrastructure + EV subsidies",
            detail: "PBoC cuts rates, State Council approves massive fiscal package. 'Whatever it takes.'",
            category: "demand",
            impact: { direction: 1, immediatePct: 0.045, driftPct: 0.03, driftDecayTicks: 60, volatilityMultiplier: 1.8, noiseAmplifier: 1.5 },
            strategy: {
                action: "COVER remaining short, GO LONG 5-8 lots",
                reasoning: "'Whatever it takes' from China = this is the turning point. $1 trillion in infrastructure spending means concrete, steel, diesel. Massive. This is the fiscal bazooka that changes the demand trajectory. Combined with US rate cuts, the macro picture is shifting.",
                expectedEffect: "4-5% rally. This is the biggest upward move in the scenario. The market reprices from 'recession' to 'recovery.'",
                principle: "FISCAL STIMULUS > MONETARY POLICY — Central bank rate cuts are a signal. Government spending is real demand. '$1 trillion in infrastructure' = concrete physical demand for diesel, fuel oil, bitumen. THIS is the reversal trigger.",
                riskNote: "This is the high-conviction reversal. If you've been holding shorts through the demand destruction, the stimulus is your cue to flip. The hardest trade is going long after a prolonged selloff."
            }
        },
        {
            tick: 240,
            headline: "China PMI rebounds to 52.1 — first expansion in 6 months",
            detail: "New orders surge on stimulus spending. Crude imports rise 8% m/m.",
            category: "demand",
            impact: { direction: 1, immediatePct: 0.03, driftPct: 0.02, driftDecayTicks: 45, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "HOLD long, consider adding 3 lots",
                reasoning: "PMI above 50 = expansion. 52.1 from deep contraction is a powerful signal. And crude imports rising 8% m/m is PHYSICAL evidence of demand recovery — not just sentiment, but actual barrels moving.",
                expectedEffect: "2-3% rally. Hard data confirming the stimulus is working. The demand recovery thesis is validated.",
                principle: "DATA CONFIRMATION — The most powerful bullish signal is when hard data (import volumes, refinery runs) confirms the stimulus thesis. Sentiment indicators (PMI) first, then physical import data. Both moving = high conviction.",
                riskNote: "Your long is working. Start thinking about taking profit before the scenario ends."
            }
        },
        {
            tick: 300,
            headline: "OPEC+ confirms no change to production targets amid demand recovery",
            detail: "Basket price stabilizes. Saudi minister: 'The market is rebalancing.'",
            category: "opec",
            impact: { direction: 1, immediatePct: 0.015, driftPct: 0.01, driftDecayTicks: 30, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
            strategy: {
                action: "FLATTEN — sell all longs to close position",
                reasoning: "OPEC maintaining cuts while demand recovers = bullish, but this is near the end. Lock in your P&L. The best trade was: short the demand shock, reverse on China stimulus, ride the recovery.",
                expectedEffect: "Small 1-2% drift higher. Market stabilising as OPEC stays disciplined.",
                principle: "OPEC DISCIPLINE — When OPEC maintains cuts during a recovery, it accelerates rebalancing. Supply restraint + demand recovery = deficit. But don't be greedy near the end of a trade.",
                riskNote: "Close everything. Count your P&L. The full trade cycle: short on weakness → partial cover on rate cut → reverse on stimulus → ride recovery → flatten."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 330],
            frequency: 17,
            pool: [
                "India crude imports rise to 5.0m bbl/d on refining expansion",
                "US consumer confidence falls to 14-month low",
                "Copper prices drop 4% on demand concerns",
                "EIA: US commercial crude stocks draw 2.1m barrels",
                "VLCC freight rates steady on Atlantic routes",
                "Nigeria Bonny Light loading delays extend to 5 days",
                "IMF maintains global growth forecast at 2.9%",
                "South Korean refining margins hit 6-month low",
                "Libyan output stable at 1.1m bbl/d",
                "US strategic reserve at 347m barrels — near 40-year low"
            ]
        }
    ]
};

export default scenario4;
