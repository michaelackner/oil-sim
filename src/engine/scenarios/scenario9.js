const scenario9 = {
    id: "scenario_contango_play",
    name: "Contango Collapse",
    description: "A deep contango market structure signals oversupply. Trade the curve structure, not just flat price. Navigate storage economics and time spread convergence.",
    difficulty: "Hard",
    startPrice: 72.00,
    totalTicks: 340,
    strategyOverview: `Strategic traders don't just trade flat price — they understand the forward curve. This scenario features a market in deep contango (future prices > spot), which screams oversupply and storage-play economics. The best strategy involves trading the spread: buy near (cheap) and sell far (expensive) when you expect the contango to narrow. Key skills: term structure analysis, spread trading, and patience.`,
    events: [
        {
            tick: 20,
            headline: "Floating storage reaches 150m barrels — highest since 2020 pandemic",
            detail: "VLCCs being used as floating storage as contango covers storage costs. 12-month spread at $8.50.",
            category: "supply",
            impact: { direction: -1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 40, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "SELL 3-5 lots (short front month)",
                reasoning: "Record floating storage confirms structural oversupply. In contango, the market is telling you there's too much oil NOW but future expectations are higher. The front contract (spot) drops most as supply pressure is immediate.",
                expectedEffect: "Gradual 1-2% decline. Contango markets grind — they don't crash.",
                principle: "CONTANGO = OVERSUPPLY — When the forward curve slopes upward, it means the market is paying you to store oil. This only happens when there's more supply than immediate demand.",
                riskNote: "Contango shorts are low-conviction — the carry cost works against you. Size small."
            }
        },
        {
            tick: 70,
            headline: "OPEC+ signals willingness to cut production in upcoming meeting",
            detail: "Saudi Energy Minister hints at 'necessary market rebalancing.' Russia supportive.",
            category: "opec",
            impact: { direction: 1, immediatePct: 0.03, driftPct: 0.02, driftDecayTicks: 50, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "COVER SHORT (buy back), remain flat",
                reasoning: "OPEC cut signals are the primary catalyst for contango narrowing. If they cut production, front-month supply decreases, spot prices rise, and the contango narrows. Don't fight OPEC.",
                expectedEffect: "2-3% rally in spot. The curve should start flattening (contango narrowing).",
                principle: "CURVE STRUCTURE SHIFT — OPEC cuts lift the front of the curve more than the back. This narrows contango. If you were short contango, the trade is now reversing.",
                riskNote: "Wait for confirmation of actual cuts before going aggressively long."
            }
        },
        {
            tick: 130,
            headline: "OPEC+ announces 2m bbl/d production cut — larger than expected",
            detail: "Saudi Arabia to shoulder 1m bbl/d alone. Effective immediately. Compliance monitoring strengthened.",
            category: "opec",
            impact: { direction: 1, immediatePct: 0.06, driftPct: 0.04, driftDecayTicks: 70, volatilityMultiplier: 1.8, noiseAmplifier: 1.5 },
            strategy: {
                action: "GO LONG 8-10 lots aggressively",
                reasoning: "2m bbl/d cut is massive (~2% of global supply). Saudi taking 1m alone shows maximum commitment. Contango should collapse as excess supply is removed. This is the regime change moment.",
                expectedEffect: "5-6% spike. Contango should narrow from $8.50 to $3-4 as oversupply thesis breaks.",
                principle: "REGIME CHANGE — Large OPEC cuts fundamentally change the supply picture. The market shifts from oversupply to balanced/deficit. This flips the entire trading thesis. Strategic traders recognise regime changes and reposition aggressively.",
                riskNote: "This is a high-conviction event. Size up to your VAR limit."
            }
        },
        {
            tick: 200,
            headline: "Floating storage begins to unwind — 30m barrels released in two weeks",
            detail: "Contango has narrowed enough that storing oil is no longer profitable. Ships returning to normal trade routes.",
            category: "supply",
            impact: { direction: -1, immediatePct: 0.02, driftPct: 0.01, driftDecayTicks: 30, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
            strategy: {
                action: "TAKE PARTIAL PROFIT — sell 3-5 lots",
                reasoning: "Storage unwind means 30m barrels of physical crude entering the market. This creates temporary supply pressure even in a cutting environment. The smart move is to trim on strength, not chase the top.",
                expectedEffect: "1-2% pullback. Storage unwind is a headwind but not a trend reversal.",
                principle: "SUPPLY OVERHANG — Even in a bullish regime, physical supply releases create countertrends. Don't confuse a tactical pullback with a trend reversal.",
                riskNote: "Keep core long position. This dip should be bought."
            }
        },
        {
            tick: 260,
            headline: "IEA raises demand forecast — global deficit now expected at 1.5m bbl/d",
            detail: "China stimulus driving Asian demand. US driving season strong. Market in structural deficit.",
            category: "data",
            impact: { direction: 1, immediatePct: 0.035, driftPct: 0.02, driftDecayTicks: 45, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
            strategy: {
                action: "RE-ADD to long position — buy 5 lots",
                reasoning: "IEA deficit confirmation + China stimulus = bullish demand catalyst. Combined with OPEC cuts (supply down) and rising demand (demand up), the market is structurally tight. This confirms the regime change from contango to potential backwardation.",
                expectedEffect: "3-4% rally. The curve should now be flat or in mild backwardation.",
                principle: "CONFIRMING SIGNALS — Multiple independent bullish signals (supply cut + demand rise) create high-conviction setups. This is when you increase size.",
                riskNote: "Near the end of scenario — consider your exit plan."
            }
        },
        {
            tick: 310,
            headline: "Russia signals it may not comply with full OPEC+ cut quota",
            detail: "Russian output only reduced by 300k bbl/d vs. agreed 500k. Budget pressures cited.",
            category: "opec",
            impact: { direction: -1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "FLATTEN position — sell all remaining lots",
                reasoning: "Near end of scenario. Russian non-compliance introduces doubt about the durability of cuts. The smart trade is to book profits and reduce risk as the simulation winds down. Don't let a winning trade become a losing one.",
                expectedEffect: "1-2% dip. Not catastrophic, but a warning sign.",
                principle: "END-GAME MANAGEMENT — As time runs out (in simulation or in real life before settlement), reducing risk protects profits. A disciplined exit preserves P&L.",
                riskNote: "Exit cleanly. Don't get greedy near the end."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 340],
            frequency: 16,
            pool: [
                "Time spread analytics show seasonal contango narrowing expected",
                "Tank utilization at Saldanha Bay steady at 75%",
                "Brent CFD structure remains in contango through M+6",
                "Physical Dated Brent assessed at -$0.60 to front-month futures",
                "North Sea BFOET loadings stable for next month",
                "Indian strategic reserve purchases paused — capacity full",
                "EIA Short-Term Energy Outlook largely unchanged",
                "LNG cargo diversions to Europe stable — no incremental demand for crude substitution",
                "Brazilian pre-salt output rising gradually — 3.8m bbl/d",
                "Dubai-Oman spread unchanged — Asian demand indicators stable",
                "European refinery margins compressed on weak gasoline demand",
                "Permian takeaway capacity adequate — no bottlenecks"
            ]
        }
    ]
};

export default scenario9;
