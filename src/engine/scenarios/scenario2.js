const scenario2 = {
    id: "scenario_opec_price_war",
    name: "OPEC Price War",
    description: "Surprise production increase triggers a price crash. Navigate the collapse, catch the reversal, and manage drawdown through emergency OPEC cuts.",
    difficulty: "Hard",
    startPrice: 82.00,
    totalTicks: 350,
    strategyOverview: `This is the hardest scenario type: a fast crash followed by a reversal. The perfect strategy is: go short aggressively on the OPEC collapse, take profits as the crash decelerates, then reverse long when you see supply destruction + demand stimulus signals. The trap is holding shorts too long and missing the reversal. Key skill: recognising capitulation signals and having the courage to reverse.`,
    events: [
        {
            tick: 20,
            headline: "OPEC+ talks collapse: Saudi Arabia announces output boost of 2m bbl/d",
            detail: "Saudi Aramco to raise production immediately. Prince Abdulaziz: 'The era of cuts is over.'",
            category: "opec",
            impact: { direction: -1, immediatePct: 0.07, driftPct: 0.05, driftDecayTicks: 80, volatilityMultiplier: 2.5, noiseAmplifier: 2.0 },
            strategy: {
                action: "SHORT 10 lots immediately (maximum conviction)",
                reasoning: "Saudi Arabia flooding the market is the most bearish OPEC event possible. 2m bbl/d is ~2% of global supply — enormous. The 'era of cuts is over' signals a sustained policy shift, not a one-off. This is 2020 price war redux.",
                expectedEffect: "Immediate 6-7% crash, with sustained drift lower for days. The market needs to reprice the entire supply curve.",
                principle: "OPEC PRICE WAR — When Saudi Arabia intentionally floods the market, it's the most bearish catalyst in oil. They have the lowest production costs (~$3/bbl) and can sustain $30 oil. Others cannot.",
                riskNote: "Go maximum short. This is a high-conviction trade. The risk is that OPEC reverses quickly, but the initial move will be violent regardless."
            }
        },
        {
            tick: 55,
            headline: "UAE follows Saudi lead: raises output by 500k bbl/d",
            detail: "Abu Dhabi seeking to maximize market share. ADNOC ramps Murban production.",
            category: "opec",
            impact: { direction: -1, immediatePct: 0.04, driftPct: 0.03, driftDecayTicks: 50, volatilityMultiplier: 1.8, noiseAmplifier: 1.5 },
            strategy: {
                action: "HOLD short position, add 5 lots if VAR allows",
                reasoning: "UAE joining Saudi confirms this is a coordinated market share grab, not a bluff. Combined 2.5m bbl/d additional supply is overwhelming. The selloff has legs.",
                expectedEffect: "Another 3-4% drop. Cascade effect as other producers panic about market share.",
                principle: "FOLLOW-THROUGH — When a second major producer confirms the bearish thesis, it validates the trade. Cascading OPEC defections are extremely bearish.",
                riskNote: "Your short is very profitable now. Consider taking 20-30% off to lock in gains — nothing falls in a straight line."
            }
        },
        {
            tick: 100,
            headline: "US shale producers begin shutting in unprofitable wells",
            detail: "Permian Basin operators announce $5B capex cuts. Rig count expected to fall 15%.",
            category: "supply",
            impact: { direction: 1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 40, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "TAKE PARTIAL PROFIT — cover 3-5 lots of short",
                reasoning: "Supply destruction is the first signal that the crash is having real-world consequences. When producers start shutting wells, it means the market is finding a floor. This is the early reversal signal.",
                expectedEffect: "Small bounce of 1-2%. Not a reversal yet, but a warning sign for shorts.",
                principle: "SUPPLY DESTRUCTION = FLOOR SIGNAL — When low prices cause producers to cut output, the market is self-correcting. This is the beginning of rebalancing. Start reducing short exposure.",
                riskNote: "Don't cover everything yet. Supply destruction takes months to materially affect production. But begin reducing risk."
            }
        },
        {
            tick: 140,
            headline: "China announces $500B stimulus package targeting infrastructure",
            detail: "State Council approves massive spending program. Diesel demand expected to surge.",
            category: "demand",
            impact: { direction: 1, immediatePct: 0.03, driftPct: 0.02, driftDecayTicks: 45, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "COVER remaining short, go FLAT or start building a LONG 3-5 lots",
                reasoning: "Supply destruction (previous event) + demand stimulus (this event) = both sides of the equation are now turning bullish. This is the classic V-reversal setup. China stimulus = more diesel, more jet fuel, more crude demand.",
                expectedEffect: "2-3% bounce. The reversal is starting. Combined with shale shut-ins, the supply-demand balance is shifting.",
                principle: "DEMAND STIMULUS — Government spending programs in major consuming nations (China, US) increase real oil demand. Infrastructure = diesel. Stimulus in a crash = reversal catalyst.",
                riskNote: "This is the hard trade — going long after being short in a crash requires psychological flexibility. The best traders can reverse without ego."
            }
        },
        {
            tick: 190,
            headline: "Saudi Arabia signals willingness to return to negotiations",
            detail: "Crown Prince MBS: 'Market stability serves everyone's interest.' Seen as olive branch.",
            category: "opec",
            impact: { direction: 1, immediatePct: 0.035, driftPct: 0.025, driftDecayTicks: 50, volatilityMultiplier: 1.6, noiseAmplifier: 1.3 },
            strategy: {
                action: "ADD to LONG position (buy 5 more lots)",
                reasoning: "Saudi signalling a return to negotiations = the price war is ending. 'Market stability serves everyone' is OPEC code for 'we're ready to cut again.' The reversal is confirmed.",
                expectedEffect: "3-4% rally. The market is now repricing from 'oversupply forever' to 'cuts are coming.'",
                principle: "OPEC RHETORIC SHIFT — Pay close attention to Saudi diplomatic language. Phrases like 'market stability', 'constructive dialogue', 'all options on the table' signal policy reversal.",
                riskNote: "Build your long position here. The risk is Saudi is bluffing, but the market will trade the headline regardless."
            }
        },
        {
            tick: 240,
            headline: "OPEC+ emergency deal: Historic 3m bbl/d production cut agreed",
            detail: "Deepest cuts in OPEC history. Compliance monitoring strengthened. Markets rally.",
            category: "opec",
            impact: { direction: 1, immediatePct: 0.06, driftPct: 0.04, driftDecayTicks: 70, volatilityMultiplier: 2.0, noiseAmplifier: 1.8 },
            strategy: {
                action: "HOLD long position through the rally",
                reasoning: "3m bbl/d cut is historic (largest ever). This doesn't just reverse the price war — it takes the market into deficit. The cut is so large that prices should recover most of the crash.",
                expectedEffect: "Massive 5-6% rally. This confirms the reversal thesis. Prices should continue higher as the cut takes effect.",
                principle: "OPEC EMERGENCY CUTS — The larger the cut, the more bullish the signal. Historic cuts create supply deficits. The market always underestimates OPEC compliance in the first few months.",
                riskNote: "Your long is now well in profit. Consider taking some off — the easy money is made. The market will consolidate as it digests the new supply picture."
            }
        },
        {
            tick: 310,
            headline: "Satellite data confirms Saudi production drop of 1.8m bbl/d",
            detail: "Tanker tracking shows significant reduction in Saudi exports from Ras Tanura.",
            category: "supply",
            impact: { direction: 1, immediatePct: 0.025, driftPct: 0.02, driftDecayTicks: 40, volatilityMultiplier: 1.3, noiseAmplifier: 1.1 },
            strategy: {
                action: "TAKE FINAL PROFIT — sell to flatten position before end",
                reasoning: "Satellite confirmation of actual compliance is bullish, but it's late in the scenario. Lock in your gains. The trade thesis has played out — crash, reversal, recovery.",
                expectedEffect: "Small 2% rally. Compliance confirmation is a modest positive since the market already priced in the cut.",
                principle: "COMPLIANCE VERIFICATION — Independent data (satellite, tanker tracking) confirming OPEC cuts is incrementally bullish. But the biggest move happens on the announcement, not the verification.",
                riskNote: "Flatten here. You've completed the full trade cycle: short the crash, reverse long on stimulus + negotiation, ride the recovery."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 350],
            frequency: 16,
            pool: [
                "Goldman Sachs lowers Brent forecast to $60/bbl for Q3",
                "Hedge funds cut net long positions by 12% on ICE",
                "US gasoline demand steady at 9.1m bbl/d",
                "European refining margins collapse to 18-month low",
                "Russian Urals discount to Brent widens to $8/bbl",
                "Floating storage bookings surge as contango deepens",
                "EIA revises US production estimate up by 200k bbl/d",
                "VLCC freight rates collapse on weak demand for tonnage",
                "Brazil pre-salt output reaches new record of 3.8m bbl/d",
                "North Sea production outage at Johansens field extends 2 days"
            ]
        }
    ]
};

export default scenario2;
