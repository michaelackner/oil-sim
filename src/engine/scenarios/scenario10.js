const scenario10 = {
    id: "scenario_sanctions_regime",
    name: "Sanctions Whipsaw",
    description: "Oil sanctions on a major producer create supply uncertainty. Navigate diplomatic announcements, waivers, secondary sanctions, and shadow fleet dynamics.",
    difficulty: "Very Hard",
    startPrice: 81.00,
    totalTicks: 360,
    strategyOverview: `Sanctions scenarios require understanding POLITICAL risk, not just market mechanics. Prices respond to CREDIBILITY of enforcement, not the headline itself. The key insight: sanctions are rarely fully enforced. Waivers, shadow fleets, and diplomatic deals mean announced cuts ≠ actual supply losses. The best traders discount headlines by enforcement probability and trade the gap between market expectation and likely reality.`,
    events: [
        {
            tick: 20,
            headline: "US announces comprehensive oil sanctions on Venezuela — effective in 90 days",
            detail: "All crude imports banned. Chevron exemption expected but not confirmed. 700k bbl/d at risk.",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.03, driftPct: 0.02, driftDecayTicks: 45, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
            strategy: {
                action: "BUY 5 lots (moderate conviction)",
                reasoning: "700k bbl/d sanction sounds significant, but history shows Venezuela sanctions are only ~50% enforced. India and China often continue purchases. Chevron waiver is likely. Trade the headline but discount for enforcement reality.",
                expectedEffect: "2-3% initial spike, but likely fades as waivers emerge.",
                principle: "SANCTIONS DISCOUNT — Never take sanctions at face value. Discount by historical enforcement rate. Announced sanctions ≠ actual supply reduction.",
                riskNote: "Only 5 lots — low conviction because enforcement is uncertain."
            }
        },
        {
            tick: 70,
            headline: "Chevron granted 6-month Venezuela waiver — can continue operations",
            detail: "Chevron's Petropiar JV production of 200k bbl/d continues. Other US companies not exempted.",
            category: "policy",
            impact: { direction: -1, immediatePct: 0.015, driftPct: 0.01, driftDecayTicks: 25, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
            strategy: {
                action: "SELL 3 lots (trim long)",
                reasoning: "Chevron waiver reduces the effective sanction from 700k to ~500k bbl/d. This is the enforcement discount in action. Take some profit — the sanction is now less severe than headline suggests.",
                expectedEffect: "1-1.5% dip. Market recalibrates the actual supply impact downward.",
                principle: "WAIVERS = SANCTION EROSION — Every waiver reduces the bite. Track cumulative waivers to estimate true supply impact.",
                riskNote: "Keep some long exposure — sanctions still remove ~500k bbl/d."
            }
        },
        {
            tick: 120,
            headline: "BREAKING: EU proposes oil sanctions on Russia — price cap at $60/bbl",
            detail: "Ban on Russian crude imports to EU. G7 price cap mechanism to allow third-country purchases below threshold.",
            category: "geopolitical",
            impact: { direction: 1, immediatePct: 0.05, driftPct: 0.035, driftDecayTicks: 60, volatilityMultiplier: 2.0, noiseAmplifier: 1.6 },
            strategy: {
                action: "BUY aggressively — 8-10 lots",
                reasoning: "Russian sanctions are MUCH more significant than Venezuela. Russia exports ~5m bbl/d of crude. Even partial enforcement removes 1-2m bbl/d — that's a genuine supply shock. The price cap mechanism creates complexity but doesn't eliminate the impact.",
                expectedEffect: "4-5% spike. Russia sanctions are systemically important.",
                principle: "SCALE MATTERS — Venezuela (700k) vs Russia (5m). The market impact scales with the volume threatened. Russian sanctions are order-of-magnitude more important.",
                riskNote: "This is high conviction. The volume at risk is enormous."
            }
        },
        {
            tick: 180,
            headline: "India triples Russian crude imports — discount of $30/bbl to Brent",
            detail: "Indian refiners Reliance and IOCL buy 1.8m bbl/d of Russian crude at heavy discount via shadow fleet.",
            category: "supply",
            impact: { direction: -1, immediatePct: 0.03, driftPct: 0.02, driftDecayTicks: 45, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
            strategy: {
                action: "SELL 5 lots — reduce long",
                reasoning: "India absorbing Russian crude means the barrels aren't actually removed from the global market — they're rerouted. The Brent premium over Russian Urals widens, but global supply is less affected than headlines suggest. This is the sanctions discount in action again.",
                expectedEffect: "2-3% drop. Market recalibrates downward as Russian supply finds new homes.",
                principle: "REROUTING vs REMOVAL — Sanctions that cause rerouting (Russia to India) are less impactful than sanctions that cause true removal (storage constraints). Track where the barrels actually go.",
                riskNote: "Don't fully exit — the Brent premium over discounted Russian crude supports Brent prices."
            }
        },
        {
            tick: 230,
            headline: "US Treasury announces secondary sanctions on shadow fleet tankers",
            detail: "15 tankers sanctioned. Ship-tracking shows shadow fleet now using 'dark' AIS. Insurance and flagging complications increase.",
            category: "policy",
            impact: { direction: 1, immediatePct: 0.025, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
            strategy: {
                action: "BUY 3-5 lots (increase long)",
                reasoning: "Secondary sanctions on the shadow fleet increase the COST of Russian rerouting. Insurance becomes harder to obtain, shipping rates spike, and some Indian refiners may reduce purchases to avoid secondary sanctions exposure. This partially reverses the India rerouting effect.",
                expectedEffect: "2% rally. Shadow fleet disruption is incrementally bullish.",
                principle: "SECONDARY SANCTIONS — The enforcement mechanism matters as much as the primary sanction. Secondary sanctions that target banking, insurance, and shipping are the teeth of the regime.",
                riskNote: "Shadow fleet adaptation is fast — don't overweight this."
            }
        },
        {
            tick: 290,
            headline: "Diplomatic breakthrough: US eases Venezuela sanctions in exchange for election guarantees",
            detail: "Chevron and other companies can resume full operations. Venezuelan production expected to rise to 900k bbl/d within 6 months.",
            category: "geopolitical",
            impact: { direction: -1, immediatePct: 0.035, driftPct: 0.025, driftDecayTicks: 50, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
            strategy: {
                action: "SELL to FLATTEN — close all positions",
                reasoning: "Venezuela sanctions lifted = 200-300k bbl/d additional supply coming online. Near end of scenario — time to crystallise P&L. The net effect of this scenario is: some sanctions stick (Russia), some don't (Venezuela). Being flat here books your profits cleanly.",
                expectedEffect: "3% drop on additional supply expectations.",
                principle: "SANCTION LIFECYCLE — Sanctions are imposed, eroded by waivers, circumvented by rerouting, sometimes lifted entirely. The full lifecycle creates trading opportunities at each stage.",
                riskNote: "Flatten cleanly. This is the end game."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 360],
            frequency: 16,
            pool: [
                "OFAC issues clarification on allowed humanitarian oil transactions",
                "Iranian crude exports reportedly steady via Oman blending",
                "Sanctions-compliant tanker rates firm — West Africa to Europe",
                "Ship-tracking firm reports no change in Russian Urals liftings",
                "Turkey's Dortyol terminal receives stable Kurdish crude flows",
                "Compliance firms report increased KYC costs for oil traders",
                "Nigerian Bonny Light differentials stable — no sanctions impact",
                "Greek tanker owners seek clarity on Russian price cap enforcement",
                "Malaysian crude re-exports unchanged — origin blending continues",
                "Libya exports unaffected by sanctions dynamics — separate conflict risks",
                "IEA notes sanctions creating 'two-tier' global crude market",
                "Asian spot premiums for non-sanctioned grades firm moderately",
                "Baltic Exchange: clean tanker rates ease on seasonal patterns",
                "Nord Stream pipeline flows remain at zero — gas market separate"
            ]
        }
    ]
};

export default scenario10;
