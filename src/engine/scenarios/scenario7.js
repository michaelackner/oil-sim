const scenario7 = {
    id: "scenario_random_walk",
    name: "Random Walk",
    description: "No major events — just noise headlines and normal price drift. Tests your discipline to not overtrade when there's no edge. The hardest scenario for most traders.",
    difficulty: "Calibration",
    startPrice: 77.00,
    totalTicks: 280,
    strategyOverview: `The counterintuitive truth: the BEST strategy here is to barely trade. This scenario has no meaningful events — just noise. The expected P&L from random trading is NEGATIVE (you pay the spread on every trade). The perfect score comes from recognising that there's NO EDGE and staying flat. The trading firms that run these simulations are specifically testing whether you can resist the urge to trade when there's nothing to trade. Discipline IS the skill.`,
    events: [
        {
            tick: 60,
            headline: "EIA weekly crude inventories draw of 0.8m barrels (consensus: -1.2m)",
            detail: "Slightly less bullish than expected. Gasoline stocks build 1.5m barrels.",
            category: "data",
            impact: { direction: -1, immediatePct: 0.005, driftPct: 0.003, driftDecayTicks: 15, volatilityMultiplier: 1.05, noiseAmplifier: 1.02 },
            strategy: {
                action: "DO NOTHING — stay flat",
                reasoning: "The draw was 0.8m vs consensus of -1.2m. That's a 0.4m miss. In a 500m bbl inventory system, this is NOISE. The price move will be <0.5%. Trading costs (spread) will eat any potential profit. This is a trap for overtraders.",
                expectedEffect: "Minimal — maybe 0.3-0.5% move that reverses within 10 ticks.",
                principle: "SIGNAL vs NOISE — Not everything that moves prices is tradeable. A 0.4m barrel miss on a weekly EIA report is statistically insignificant. The spread you pay to enter and exit (~$0.04 x 1000 bbl = $40/lot) costs more than the expected profit.",
                riskNote: "If you trade this, you're paying spread for no edge. The expected value is negative."
            }
        },
        {
            tick: 140,
            headline: "OPEC+ JMMC meeting concludes with no policy changes",
            detail: "Committee reaffirms existing quotas. Next meeting scheduled for Q3.",
            category: "opec",
            impact: { direction: 0, immediatePct: 0.002, driftPct: 0.001, driftDecayTicks: 10, volatilityMultiplier: 1.02, noiseAmplifier: 1.01 },
            strategy: {
                action: "DO NOTHING — stay flat",
                reasoning: "No change = no trade. The market expected no change and got no change. Zero information value. This headline exists solely to tempt overtraders into opening positions.",
                expectedEffect: "Essentially zero. Price will continue its random walk.",
                principle: "NON-EVENTS — 'No change in policy' is not a trading signal. It confirms the status quo. The temptation is to interpret stability as either bullish or bearish — resist this urge.",
                riskNote: "Your edge in this scenario is measured by how FEW trades you make, not how many."
            }
        },
        {
            tick: 220,
            headline: "US jobs report at 175k — in line with expectations",
            detail: "Unemployment at 3.9%. Wage growth moderating. No surprises for energy markets.",
            category: "data",
            impact: { direction: 1, immediatePct: 0.004, driftPct: 0.002, driftDecayTicks: 12, volatilityMultiplier: 1.03, noiseAmplifier: 1.02 },
            strategy: {
                action: "DO NOTHING — stay flat",
                reasoning: "In-line data = no information. The market already priced 175k. There is no trade here. The marginal bullish impact (~0.3%) is smaller than the bid-ask spread cost of a round trip.",
                expectedEffect: "Negligible. Random noise in the price action.",
                principle: "CONSENSUS MATCHES = NO TRADE — When data matches consensus, there is zero informational edge. Only trade when data SURPRISES. The bigger the surprise vs consensus, the bigger the edge.",
                riskNote: "If you've made 0 trades in this scenario, you're outperforming 90% of traders. Seriously."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 280],
            frequency: 12,
            pool: [
                "Baker Hughes: US oil rig count unchanged at 481",
                "Brent-WTI spread steady at $4.10",
                "China imports 11.2m bbl/d — in line with seasonal average",
                "North Sea Forties pipeline operating normally",
                "ICE Brent open interest unchanged w/w",
                "CFTC: Money managers reduce net longs by 2%",
                "US refinery utilization at 92.1% — seasonal norm",
                "API: Crude stocks draw 0.5m barrels",
                "India's MRPL refinery maintenance extends by 3 days",
                "Dollar index flat — awaiting Fed minutes",
                "European gasoil stocks at comfortable seasonal levels",
                "Nigerian Forcados loadings on schedule",
                "Kazakhstan CPC blend exports steady at 1.4m bbl/d",
                "Singapore middle distillate stocks up slightly",
                "Brazilian Tupi field output stable at 850k bbl/d",
                "Oman OSP set at Brent -$0.40 for next month",
                "VLCC rates firm slightly on West Africa-East routes",
                "South Korea's crude imports rise 2% m/m — restocking"
            ]
        }
    ]
};

export default scenario7;
