const scenario6 = {
    id: "scenario_black_swan",
    name: "Black Swan",
    description: "A pandemic-scale event triggers massive demand destruction and OPEC collapse. Extreme scenario testing maximum drawdown tolerance and recovery trading.",
    difficulty: "Very Hard",
    startPrice: 85.00,
    totalTicks: 380,
    strategyOverview: `The hardest scenario in OilSim. A cascading crisis with multiple phases: (1) initial demand shock, (2) OPEC collapse making it worse, (3) storage crisis, (4) coordinated policy response, (5) recovery. The key skill is SURVIVAL — managing your drawdown so you still have capital to trade the recovery. Many traders get wiped out during the crash and can't participate in the rally. Risk management IS the strategy.`,
    events: [
        {
            tick: 15,
            headline: "WHO declares new respiratory virus a Public Health Emergency",
            detail: "Novel pathogen spreading rapidly across Asia. Air travel restrictions expected.",
            category: "demand",
            impact: { direction: -1, immediatePct: 0.04, driftPct: 0.03, driftDecayTicks: 60, volatilityMultiplier: 2.0, noiseAmplifier: 1.8 },
            strategy: {
                action: "SHORT 5 lots (moderate, not maximum)",
                reasoning: "Pandemic = demand shock. Air travel = jet fuel (largest source of oil demand growth). But the severity is unclear — SIZE MODERATELY. The 2020 playbook: prices can fall 60%+ from here.",
                expectedEffect: "3-4% drop. The market begins pricing pandemic risk but is uncertain about severity.",
                principle: "PANDEMIC DEMAND DESTRUCTION — Transportation fuel is ~60% of oil demand. Lockdowns/travel bans directly destroy jet fuel, gasoline, and diesel demand. The impact is non-linear — it accelerates as restrictions spread.",
                riskNote: "MODERATE SIZE. You need to survive a potential 60%+ drawdown on longs. If you're short, you need to avoid covering too early."
            }
        },
        {
            tick: 50,
            headline: "Global air travel plunges 40% — jet fuel demand collapses",
            detail: "Major airlines cancel international routes. Jet fuel crack spread goes negative.",
            category: "demand",
            impact: { direction: -1, immediatePct: 0.06, driftPct: 0.04, driftDecayTicks: 70, volatilityMultiplier: 2.5, noiseAmplifier: 2.2 },
            strategy: {
                action: "ADD to short — sell 5 more lots",
                reasoning: "Jet fuel demand collapse confirmed. 40% drop in air travel = ~3m bbl/d of demand destruction immediately. Negative crack spread means refiners are LOSING MONEY making jet fuel. This is unprecedented.",
                expectedEffect: "5-6% crash. This is the acceleration phase. The market is now pricing a severe demand shock.",
                principle: "JET FUEL DEMAND — Jet fuel is ~8% of oil demand but 100% of incremental demand growth in normal times. When air travel collapses, it wipes out the entire demand growth narrative.",
                riskNote: "You should be near VAR limit on shorts. The crash has more to come (OPEC collapse next)."
            }
        },
        {
            tick: 90,
            headline: "Saudi-Russia price war erupts — both flood the market",
            detail: "OPEC+ deal collapses entirely. Saudi slashes OSP by $8/bbl. Russia refuses cuts.",
            category: "opec",
            impact: { direction: -1, immediatePct: 0.08, driftPct: 0.05, driftDecayTicks: 80, volatilityMultiplier: 3.0, noiseAmplifier: 2.5 },
            strategy: {
                action: "HOLD shorts — this is the capitulation phase",
                reasoning: "Demand destruction + intentional supply flooding = worst possible combination for oil prices. Saudi slashing OSP by $8/bbl is economic warfare — they're trying to bankrupt Russia and US shale simultaneously. Prices can go MUCH lower.",
                expectedEffect: "7-8% crash in one move. This is the single biggest event. Combined demand shock + supply flood = oil market apocalypse.",
                principle: "DOUBLE WHAMMY — When demand destruction and supply flooding happen simultaneously, the price impact is multiplicative, not additive. This is the 'nuclear winter' for oil markets.",
                riskNote: "Your shorts are massively profitable. You may need to reduce to stay within VAR limits as prices fall (VAR is price-based)."
            }
        },
        {
            tick: 140,
            headline: "Global storage nearing capacity — floating storage hits 200m barrels",
            detail: "Onshore tank farms at 95% utilization. Contango deepens to $15/bbl.",
            category: "supply",
            impact: { direction: -1, immediatePct: 0.05, driftPct: 0.03, driftDecayTicks: 50, volatilityMultiplier: 2.0, noiseAmplifier: 1.8 },
            strategy: {
                action: "TAKE PARTIAL PROFIT — cover 5 lots (half your short)",
                reasoning: "Storage full = prices can go NEGATIVE (it happened in April 2020 for WTI). But this is also the point of maximum pessimism. The harder it gets to store, the closer we are to forced production shut-ins, which is the floor.",
                expectedEffect: "4-5% drop. But this is the BOTTOM zone. Start planning your reversal.",
                principle: "STORAGE CAPACITY — When storage fills, producers literally cannot sell their oil. They must shut wells or accept negative prices. This is the ultimate floor signal — maximum bearishness = reversal incoming.",
                riskNote: "TAKE PROFIT. The easy short money is done. Storage crisis triggers policy responses (next event). Don't be the last bear."
            }
        },
        {
            tick: 195,
            headline: "US president brokers historic OPEC+ deal — 10m bbl/d cut agreed",
            detail: "Largest production cut in history. G20 nations pledge additional 5m bbl/d support.",
            category: "opec",
            impact: { direction: 1, immediatePct: 0.07, driftPct: 0.05, driftDecayTicks: 80, volatilityMultiplier: 2.5, noiseAmplifier: 2.0 },
            strategy: {
                action: "COVER ALL remaining shorts, GO LONG 5-8 lots",
                reasoning: "10m bbl/d is the largest cut in OPEC history (10x normal cuts). Combined with G20 support, this is a coordinated global policy response. The market is being forcibly rebalanced. This is your reversal signal.",
                expectedEffect: "6-7% rally. The crash floor is in. Prices will recover over weeks as the cut takes effect.",
                principle: "COORDINATED POLICY RESPONSE — When the problem is so severe that governments, central banks, AND OPEC respond simultaneously, it marks the bottom. The power of coordinated action cannot be underestimated.",
                riskNote: "Reverse with conviction. The policy bazooka is too large to fight. Even if you're sceptical about compliance, the market will rally on the announcement."
            }
        },
        {
            tick: 245,
            headline: "Vaccine breakthrough — major pharma announces 95% efficacy",
            detail: "Emergency use authorization expected within weeks. Markets surge on recovery hopes.",
            category: "demand",
            impact: { direction: 1, immediatePct: 0.06, driftPct: 0.04, driftDecayTicks: 70, volatilityMultiplier: 2.0, noiseAmplifier: 1.8 },
            strategy: {
                action: "ADD to long — build toward maximum position",
                reasoning: "Vaccine = demand recovery catalyst. This isn't just sentiment — it means air travel, driving, industrial activity will all recover. The demand destruction thesis from event 1 is now reversing. Combined with massive OPEC cuts, the market is heading into deficit.",
                expectedEffect: "5-6% rally. The recovery narrative takes hold. Demand recovery + supply cuts = deficit.",
                principle: "DEMAND RECOVERY — The reversal of a demand shock is as powerful as the shock itself. Vaccines, reopenings, and pent-up demand create a recovery that can be FASTER than the decline.",
                riskNote: "Maximum conviction long. The vaccine + OPEC cuts = deficit. Add to winners."
            }
        },
        {
            tick: 300,
            headline: "China fully reopens economy — crude imports surge to 12m bbl/d",
            detail: "Pent-up demand drives fossil fuel consumption to new highs. Refineries at max capacity.",
            category: "demand",
            impact: { direction: 1, immediatePct: 0.04, driftPct: 0.03, driftDecayTicks: 55, volatilityMultiplier: 1.6, noiseAmplifier: 1.4 },
            strategy: {
                action: "HOLD long, begin planning exit",
                reasoning: "China imports at 12m bbl/d confirms the recovery is real and physical. Combined with OPEC cuts still in place, the market is in deficit. But the easy recovery gains are made — the market is repricing quickly.",
                expectedEffect: "3-4% rally. The recovery is priced increasingly efficiently. Take profits on rips.",
                principle: "RECOVERY TRADING — In recovery, buy dips and take profits on rallies. The V-shape is steepest at the bottom. As prices normalise, the gains per tick shrink.",
                riskNote: "Start reducing your long. The recovery trade is mature. Don't hold through the tapering of OPEC cuts (next event)."
            }
        },
        {
            tick: 350,
            headline: "OPEC+ begins tapering cuts — gradual 2m bbl/d restoration over 6 months",
            detail: "Measured approach to avoid oversupply. Baseline adjustments for UAE and Iraq.",
            category: "opec",
            impact: { direction: -1, immediatePct: 0.02, driftPct: 0.015, driftDecayTicks: 35, volatilityMultiplier: 1.3, noiseAmplifier: 1.1 },
            strategy: {
                action: "FLATTEN — close all positions",
                reasoning: "OPEC adding supply back is the signal that the recovery is mature. Gradual tapering is not bearish, but it caps upside. Close your long and count your P&L. This was the hardest scenario — surviving the crash and trading the recovery.",
                expectedEffect: "Small 1-2% dip. OPEC tapering is a mild bearish signal but mostly neutral given demand recovery.",
                principle: "OPEC TAPERING — When OPEC starts restoring production, it signals the crisis is over. Bull markets don't end on tapering — but the explosive phase is over.",
                riskNote: "Close everything. The complete trade cycle: short the crash → survive the storage crisis → reverse long on policy response → ride vaccine recovery → exit on tapering."
            }
        }
    ],
    noiseEvents: [
        {
            tickRange: [0, 380],
            frequency: 14,
            pool: [
                "WTI front-month settles at historic low",
                "Tanker day rates collapse as chartering demand evaporates",
                "US announces $2 trillion economic relief package",
                "Global refinery throughput drops to 65% utilization",
                "Strategic reserve purchases at $35/bbl authorized by Congress",
                "Petrochemical demand holds relatively stable amid crisis",
                "Canadian oil sands producers shut in 1m bbl/d of high-cost output",
                "IEA: April demand down 29m bbl/d year-on-year",
                "Hedge funds build record short positions in crude futures",
                "Physical crude differentials collapse — 20+ grades below $0",
                "LNG spot prices crash to $2/MMBtu on weak industrial demand",
                "Norway voluntary cut of 250k bbl/d to support market"
            ]
        }
    ]
};

export default scenario6;
