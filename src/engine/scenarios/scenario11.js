const scenario11 = {
    id: "scenario_libya_shutin",
    name: "Libyan Roulette",
    description: "Libya's fragile political situation creates recurring production outages. Navigate tribal blockades, eastern government shutdowns, and NOC restoration promises in Africa's most unpredictable producer.",
    difficulty: "Medium-Hard",
    startPrice: 78.50,
    totalTicks: 320,
    strategyOverview: `Libya is the most common source of unplanned supply disruptions in global oil markets. Output can swing between 300k and 1.2m bbl/d depending on which faction controls the oil terminals. The key challenge: Libyan shutdowns happen constantly, so the market has partially 'priced in' Libyan chaos. The correct response depends on whether THIS shutdown is larger/longer than what the market already expects. Overreacting to every Libyan headline is a classic rookie error.`,
    events: [
        {
            tick: 15,
            headline: "Armed group blockades Sharara oilfield — Libya's largest at 300k bbl/d",
            detail: "Tribal militia demands government payments. Force majeure declared by NOC. Similar blockade lasted 10 days in March.",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.015, driftPct: 0.01, driftDecayTicks: 30, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "BUY 3 lots (small position)",
                reasoning: "Sharara is 300k bbl/d — significant. But Libyan shutdowns happen 3-4 times per year, so the market partially discounts them. The 10-day reference in the detail is a clue this may be temporary. Trade small.",
                expectedEffect: "1-1.5% pop. Modest because the market has seen this movie before.",
                principle: "RECURRING DISRUPTIONS — Markets partially price in frequent disruptors. Libya, Nigeria, and Iraq Kurdistan all fall in this category. The premium is smaller each time it happens.",
                riskNote: "Small size. These blockades often resolve within a week."
            }
        },
        {
            tick: 45,
            headline: "Eastern Libyan government orders ALL oil exports halted from eastern terminals",
            detail: "Haftar-aligned government disputes revenue sharing. Es Sider, Ras Lanuf, Marsa el-Brega terminals affected. Additional 500k bbl/d at risk.",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.035, driftPct: 0.025, driftDecayTicks: 50, volatilityMultiplier: 1.6, noiseAmplifier: 1.4 },
            strategy: {
                action: "ADD 5 lots (increase long aggressively)",
                reasoning: "This is different from typical tribal blockades. An ALL-port shutdown by the eastern government removes ~800k bbl/d total (including Sharara). This is on the scale of a serious supply disruption. Revenue disputes between east/west are harder to resolve than tribal payments.",
                expectedEffect: "3-4% rally. This is a genuine supply shock at ~0.8% of global supply.",
                principle: "SCALE ESCALATION — Distinguish between a single-field blockade (noise-ish) and a full government-ordered shutdown (signal). The number of barrels offline determines the price impact.",
                riskNote: "Now exposed to resolution risk — if a deal is struck quickly, prices reverse."
            }
        },
        {
            tick: 90,
            headline: "NOC chairman says 'negotiations progressing well, exports to resume within days'",
            detail: "Meeting between Tripoli and Benghazi delegations ongoing in Cairo. UN envoy mediating.",
            category: "geopolitical",
            impact: { direction: -1, immediatePct: 0.012, driftPct: 0.008, driftDecayTicks: 25, volatilityMultiplier: 1.1, noiseAmplifier: 1.1 },
            strategy: {
                action: "HOLD — do not reduce yet",
                reasoning: "NOC 'optimism' is standard diplomatic language. They say this EVERY time. In previous Libyan shutdowns, 'resume within days' has often turned into weeks. Don't sell on NOC promises — wait for actual loadings to resume.",
                expectedEffect: "Slight 0.5-1% dip on the headline. But exports won't actually restart on a promise.",
                principle: "TALK vs ACTION — In Libyan politics, promises of resolution are cheap. Don't trade on promises. Wait for confirmed loadings/exports before reversing your position.",
                riskNote: "Hold your long. The market will test your patience here."
            }
        },
        {
            tick: 140,
            headline: "Tanker tracking shows first crude loadings at Es Sider in three weeks",
            detail: "Two Aframax tankers loading Libyan Es Sider crude. Ras Lanuf still blockaded. Partial resumption only.",
            category: "supply",
            impact: { direction: -1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "SELL 3 lots (partial profit take)",
                reasoning: "Tanker loadings = CONFIRMED physical exports, not promises. Es Sider resuming removes ~200k bbl/d of disruption. But Ras Lanuf is still shut, so ~500k remains offline. Take partial profits — the disruption is unwinding but not over.",
                expectedEffect: "1.5-2% pullback. Physical confirmation of exports is the real signal.",
                principle: "PHYSICAL CONFIRMATION > POLITICAL PROMISES — Tanker tracking data (AIS, Kpler, Vortexa) provides ground truth. Trade on physical flows, not diplomatic statements.",
                riskNote: "Keep some long exposure. Partial resumption means partial disruption remains."
            }
        },
        {
            tick: 200,
            headline: "Protesters storm Zueitina oil terminal — explosion reported near storage tanks",
            detail: "Fire visible from satellite imagery. Terminal handles 70k bbl/d of light sweet crude. Emergency response teams dispatched.",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.02, driftPct: 0.01, driftDecayTicks: 25, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
            strategy: {
                action: "SMALL BUY — 2 lots only",
                reasoning: "Zueitina is only 70k bbl/d — small in global terms. The explosion sounds dramatic but terminal fires are usually contained. However, it shows the security situation is deteriorating, which could delay full Libyan restoration.",
                expectedEffect: "1-2% spike on the dramatic headline, but the volume is small.",
                principle: "HEADLINE DRAMA vs BARREL IMPACT — Explosions and fires get attention, but always quantify the barrels at risk. 70k bbl/d is noise-level in a 100m bbl/d market.",
                riskNote: "Don't overreact to dramatic visuals. Size to the volume, not the headline."
            }
        },
        {
            tick: 250,
            headline: "Libya's Tripoli government agrees to revenue-sharing deal — all exports to resume",
            detail: "Central Bank mechanism for equitable distribution agreed. Haftar's eastern forces stand down. Full resumption expected within 72 hours.",
            category: "geopolitical",
            impact: { direction: -1, immediatePct: 0.03, driftPct: 0.02, driftDecayTicks: 40, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
            strategy: {
                action: "SELL all remaining long, consider SHORT 3 lots",
                reasoning: "Revenue-sharing deal with Central Bank mechanism is more credible than typical promises — it's a structural solution. With Haftar standing down, the blockade should end. Full resumption of 800k+ bbl/d is bearish. The supply premium built in should unwind.",
                expectedEffect: "2-3% drop as the Libyan premium unwinds.",
                principle: "STRUCTURAL vs TEMPORARY FIXES — A revenue-sharing mechanism is a durable solution. This is more credible than 'talks are progressing'. Trade the difference in resolution quality.",
                riskNote: "Near end of scenario. Clean exit. Libya will disrupt again eventually — but not today."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 320],
            frequency: 14,
            pool: [
                "Algeria increases Saharan Blend output by 15k bbl/d",
                "Mediterranean refinery margins firm on light sweet crude demand",
                "Egyptian crude imports from Libya remain at contracted levels",
                "Italian ENI reports normal operations at Libyan joint ventures",
                "North African gas pipeline flows stable through Tunisia",
                "Mediterranean tanker rates edge higher on Libya uncertainty",
                "Libyan dinar stable on parallel market despite political tensions",
                "NOC revenue report shows $2.4B in Q2 oil sales",
                "Chad-Libya border tensions flare over water rights dispute",
                "Malta registers 3 new tanker flagging requests from Libyan entities",
                "Sub-Saharan African oil output steady — Angola at 1.1m bbl/d",
                "Sicilian refinery ISAB processes increased Libyan light cargo"
            ]
        }
    ]
};

export default scenario11;
