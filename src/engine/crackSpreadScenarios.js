// ─── Crack Spread Trading Scenarios ───────────────────
// Each event specifies per-product impacts { crude, gasoline, diesel }.
// This creates the spread dynamics — events affect products differently.
//
// BUY crack  = you profit when the crack WIDENS  (products up vs crude)
// SELL crack = you profit when the crack NARROWS (crude up vs products)

export const crackSpreadScenarios = [
    {
        id: 'cs_basics',
        name: 'Refinery Economics 101',
        description: 'Learn how crack spreads work. A refinery buys crude and sells gasoline + diesel. Events that shut refineries widen cracks. Events that flood crude narrow them.',
        difficulty: 'Easy',
        crudePrice: 75.00,
        gasolinePrice: 105.00,   // ~$2.50/gal × 42
        dieselPrice: 112.00,     // ~$2.67/gal × 42
        volatility: 0.0025,
        totalTicks: 250,
        strategyOverview: 'The crack spread is the refining margin — the price of products minus the price of crude. Refiners are naturally LONG the crack. Supply disruptions to refineries WIDEN cracks (less product supply). Crude gluts NARROW cracks (cheaper feedstock but similar product prices). Learn which side offers the opportunity.',
        events: [
            {
                tick: 25,
                headline: "Explosion at Baytown refinery — 250k bbl/d capacity shut for weeks",
                detail: "ExxonMobil's largest US refinery suffers major fire. OSHA investigation launched. Products supply from Gulf Coast reduced immediately.",
                category: "supply",
                impact: {
                    crude: { direction: -1, immediatePct: 0.01, driftPct: 0.005 },
                    gasoline: { direction: 1, immediatePct: 0.035, driftPct: 0.02 },
                    diesel: { direction: 1, immediatePct: 0.025, driftPct: 0.015 },
                    volatilityMultiplier: 1.5, noiseAmplifier: 1.3,
                },
                strategy: {
                    action: "BUY gasoline crack — 5 lots",
                    reasoning: "A refinery outage REDUCES product supply while INCREASING crude availability (the refinery was consuming crude, now it's not). This is the textbook crack-widening event. Gasoline is hit harder than diesel because this refinery is a major gasoline producer.",
                    expectedEffect: "Gasoline crack widens $3-5/bbl. Diesel crack widens $2-3/bbl. Crude may actually dip slightly.",
                    principle: "REFINERY OUTAGE → BUY THE CRACK — Less refining capacity = less product supply = wider margins for remaining refiners.",
                    riskNote: "Strong crack widening event. Watch for repair timeline news — cracks narrow when the refinery restarts."
                }
            },
            {
                tick: 70,
                headline: "Baytown refinery partially restarts — 100k bbl/d of 250k back online",
                detail: "Gasoline unit operational. Diesel hydrotreater still down for repairs. Full restart in 3-4 weeks.",
                category: "supply",
                impact: {
                    crude: { direction: 1, immediatePct: 0.005, driftPct: 0.003 },
                    gasoline: { direction: -1, immediatePct: 0.025, driftPct: 0.012 },
                    diesel: { direction: -1, immediatePct: 0.008, driftPct: 0.005 },
                    volatilityMultiplier: 1.2, noiseAmplifier: 1.1,
                },
                strategy: {
                    action: "TAKE PROFIT on gasoline crack. HOLD diesel crack if you have it.",
                    reasoning: "Partial restart means gasoline supply is recovering. The gasoline crack should start narrowing. But notice diesel is STILL tight because the hydrotreater is still down — the diesel crack should hold or even widen further.",
                    expectedEffect: "Gasoline crack narrows $2-3/bbl. Diesel crack barely moves — still tight.",
                    principle: "PARTIAL RESTART → SELECTIVE IMPACT — Different product units restart at different times. The crack that narrows depends on WHICH unit comes back.",
                    riskNote: "Product-specific analysis matters. Don't treat all cracks the same."
                }
            },
            {
                tick: 120,
                headline: "OPEC+ announces surprise 1.5m bbl/d production cut effective immediately",
                detail: "Saudi Arabia volunteers 1m unilateral cut. Russia and UAE each cut 250k. Crude market tightens sharply.",
                category: "opec",
                impact: {
                    crude: { direction: 1, immediatePct: 0.04, driftPct: 0.025 },
                    gasoline: { direction: 1, immediatePct: 0.02, driftPct: 0.012 },
                    diesel: { direction: 1, immediatePct: 0.018, driftPct: 0.01 },
                    volatilityMultiplier: 1.5, noiseAmplifier: 1.3,
                },
                strategy: {
                    action: "SELL the 3-2-1 crack — 5 lots",
                    reasoning: "OPEC cuts make crude MORE expensive as a feedstock. Products rise too (energy is more expensive overall) but not as much as crude. The result: cracks NARROW because refining margins get squeezed. This is the 'feedstock cost' dynamic.",
                    expectedEffect: "Crude rallies 4%. Products rally only 2%. Cracks narrow $1.50-2/bbl.",
                    principle: "CRUDE RALLY → CRACKS NARROW — When crude rises due to supply cuts, products follow but with a lag. The feedstock cost increase squeezes refining margins.",
                    riskNote: "Medium conviction. Products may catch up to crude over time, so don't hold the short crack too long."
                }
            },
            {
                tick: 170,
                headline: "US driving season demand surges — gasoline consumption hits 9.5m bbl/d record",
                detail: "Memorial Day weekend sees record travel. Gasoline inventories draw 4m barrels in one week. Wholesale gasoline prices jump.",
                category: "data",
                impact: {
                    crude: { direction: 1, immediatePct: 0.01, driftPct: 0.005 },
                    gasoline: { direction: 1, immediatePct: 0.04, driftPct: 0.025 },
                    diesel: { direction: -1, immediatePct: 0.005, driftPct: 0.003 },
                    volatilityMultiplier: 1.3, noiseAmplifier: 1.2,
                },
                strategy: {
                    action: "BUY gasoline crack — 5 lots. Consider SELLING diesel crack.",
                    reasoning: "Driving season demand is overwhelmingly GASOLINE. Diesel demand actually softens in summer (construction/trucking steady but not growing). This creates a DIVERGENCE between gas and diesel cracks — the gas-diesel spread widens.",
                    expectedEffect: "Gasoline crack widens $3-4/bbl. Diesel crack flat or narrows slightly.",
                    principle: "SEASONAL DEMAND → PRODUCT-SPECIFIC CRACK — Summer = gasoline. Winter = heating oil/diesel. Seasonal patterns are the most predictable crack spread driver.",
                    riskNote: "Seasonal trade. Well-understood pattern. The risk is that driving season demand disappoints expectations."
                }
            },
            {
                tick: 220,
                headline: "China PMI collapses to 44 — signals deep recession, diesel demand plummets",
                detail: "Manufacturing output crashing. Trucking activity down 15% month-over-month. Global diesel demand outlook slashed by 400k bbl/d.",
                category: "data",
                impact: {
                    crude: { direction: -1, immediatePct: 0.03, driftPct: 0.015 },
                    gasoline: { direction: -1, immediatePct: 0.02, driftPct: 0.01 },
                    diesel: { direction: -1, immediatePct: 0.045, driftPct: 0.025 },
                    volatilityMultiplier: 1.6, noiseAmplifier: 1.4,
                },
                strategy: {
                    action: "SELL diesel crack — 5 lots. Close gasoline crack longs.",
                    reasoning: "Diesel demand is tied to INDUSTRIAL ACTIVITY. A Chinese recession crushes diesel/gasoil demand. Diesel drops more than crude because the demand destruction is diesel-specific. Gasoline also falls but less — consumers still drive even in recessions.",
                    expectedEffect: "Diesel crack narrows $4-5/bbl. Gasoline crack narrows $1-2/bbl. The diesel-gasoline gap compresses.",
                    principle: "RECESSION → DIESEL CRACK COLLAPSES — Diesel is the industrial fuel. Recessions hit diesel demand disproportionately, crushing the diesel crack.",
                    riskNote: "Strong conviction on diesel weakness. Gasoline more defensive — don't over-short the gasoline crack."
                }
            }
        ],
        noiseEvents: [
            {
                tickRange: [0, 250],
                frequency: 12,
                pool: [
                    "Colonial Pipeline flows normal — no supply issues to East Coast",
                    "NYMEX RBOB front-month open interest steady",
                    "Gulf Coast refinery utilisation at 92% — seasonal average",
                    "EIA weekly petroleum status report: minor stock changes only",
                    "Ethanol blending rates unchanged — RIN credit prices flat",
                    "NYH gasoline barge trades at normal crack differentials",
                    "European gasoil ARA stocks at seasonal levels",
                    "Singapore middle distillate inventories within range",
                    "US Gulf Coast ULSD export arb to Europe marginal",
                    "PADD 2 (Midwest) gasoline stocks tracking 5-year average"
                ]
            }
        ]
    },
    {
        id: 'cs_hurricane',
        name: 'Hurricane Season',
        description: 'A major hurricane threatens Gulf Coast refineries. Trade the crack spread through the storm cycle — formation, landfall, shutdown, damage assessment, and restart.',
        difficulty: 'Medium',
        crudePrice: 78.00,
        gasolinePrice: 108.00,
        dieselPrice: 115.00,
        volatility: 0.003,
        totalTicks: 280,
        strategyOverview: 'Hurricanes are the ultimate crack spread event. Gulf Coast refineries (50% of US capacity) shut ahead of storms. Products spike as supply vanishes. Crude can fall if offshore production is less affected. The key: TIMING — cracks spike before landfall on shutdown news, then either crash (no damage) or stay elevated (damage confirmed). The biggest mistake is buying cracks AFTER the spike.',
        events: [
            {
                tick: 20,
                headline: "Tropical Storm forms in Gulf of Mexico — forecast models show potential Cat 3+ hurricane",
                detail: "NHC tracking system. 60% chance of major hurricane. Cone of uncertainty covers Houston-Beaumont refinery corridor. 5-day forecast.",
                category: "weather",
                impact: {
                    crude: { direction: -1, immediatePct: 0.008, driftPct: 0.005 },
                    gasoline: { direction: 1, immediatePct: 0.02, driftPct: 0.012 },
                    diesel: { direction: 1, immediatePct: 0.015, driftPct: 0.01 },
                    volatilityMultiplier: 1.4, noiseAmplifier: 1.3,
                },
                strategy: {
                    action: "BUY gasoline crack — 5 lots (early positioning)",
                    reasoning: "The FORECAST CONE is what matters. If it covers the Houston-Beaumont corridor (Baytown, Deer Park, Port Arthur, Lake Charles), that's 3+ million bbl/d of refining. Even before landfall, refineries start shutting 72 hours early. The crack starts moving NOW.",
                    expectedEffect: "Gasoline crack up $1-2/bbl on the forecast alone. More to come if track confirms.",
                    principle: "HURRICANE THREAT → EARLY CRACK BUYING — Cracks move on the FORECAST, not the landfall. By the time the hurricane hits, the move is priced in. Buy on the cone, sell on the landfall.",
                    riskNote: "The storm could turn or dissipate. Size moderately — add on confirmation."
                }
            },
            {
                tick: 60,
                headline: "Hurricane upgraded to Category 4 — direct path to Port Arthur. Mandatory evacuations ordered.",
                detail: "Motiva (600k bbl/d), Valero (335k bbl/d), Total (225k bbl/d) all announcing precautionary shutdowns. 1.2m bbl/d of refining going offline.",
                category: "weather",
                impact: {
                    crude: { direction: -1, immediatePct: 0.015, driftPct: 0.01 },
                    gasoline: { direction: 1, immediatePct: 0.05, driftPct: 0.03 },
                    diesel: { direction: 1, immediatePct: 0.04, driftPct: 0.025 },
                    volatilityMultiplier: 1.8, noiseAmplifier: 1.5,
                },
                strategy: {
                    action: "HOLD gasoline crack. ADD diesel crack — 5 lots.",
                    reasoning: "1.2m bbl/d of shutdown confirmations = massive product supply loss. Crude actually FALLS because the refineries that consume crude are shut. This is the crack-widening sweet spot. Diesel cracks now joining gasoline because industrial products are also affected.",
                    expectedEffect: "Gasoline crack spikes $5-7/bbl from pre-storm. Diesel crack widens $4-5/bbl.",
                    principle: "CONFIRMED SHUTDOWNS → MAXIMUM CRACK IMPACT — The shutdown announcement IS the event. Once refineries confirm closure, the product supply reduction is known. The crack spike should be at or near its peak.",
                    riskNote: "IMPORTANT: Consider your exit. If the storm passes quickly with minimal damage, cracks will crash back. Watch for 'all clear' signals."
                }
            },
            {
                tick: 110,
                headline: "Hurricane makes landfall at Port Arthur as Cat 3 — significant flooding but refineries designed for wind",
                detail: "Flooding is the key risk, not wind. Power outages across Southeast Texas. Damage still being assessed. Restart timeline: minimum 2-3 weeks.",
                category: "weather",
                impact: {
                    crude: { direction: 1, immediatePct: 0.01, driftPct: 0.005 },
                    gasoline: { direction: 1, immediatePct: 0.015, driftPct: 0.01 },
                    diesel: { direction: 1, immediatePct: 0.012, driftPct: 0.008 },
                    volatilityMultiplier: 1.4, noiseAmplifier: 1.3,
                },
                strategy: {
                    action: "HOLD positions. Start planning partial exit on restarts.",
                    reasoning: "Landfall with flooding = extended shutdown. 2-3 week timeline means products stay tight. BUT — the crack is already wide from pre-storm positioning. The incremental upside from here is limited. Smart traders started selling cracks to latecomers at the peak.",
                    expectedEffect: "Cracks hold near highs. Marginal widening of $1-2 from here.",
                    principle: "POST-LANDFALL → DIMINISHING RETURNS — The crack spike happens BEFORE and DURING the storm. After landfall, the supply disruption is known and priced. Risk/reward shifts to the downside.",
                    riskNote: "Planning exit. The restart news will crash cracks fast."
                }
            },
            {
                tick: 170,
                headline: "Motiva Port Arthur begins restart — first 200k bbl/d expected within 48 hours",
                detail: "Power restored. Flooding receded. Motiva is the largest, and typically the first to restart. Other refineries 1-2 weeks behind.",
                category: "supply",
                impact: {
                    crude: { direction: 1, immediatePct: 0.01, driftPct: 0.005 },
                    gasoline: { direction: -1, immediatePct: 0.035, driftPct: 0.02 },
                    diesel: { direction: -1, immediatePct: 0.03, driftPct: 0.015 },
                    volatilityMultiplier: 1.3, noiseAmplifier: 1.2,
                },
                strategy: {
                    action: "SELL gasoline crack — close all long positions. Sell diesel crack too.",
                    reasoning: "Motiva is the bellwether. When the biggest refinery restarts, the market knows all others will follow within weeks. Cracks CRASH on restart news — the product supply shortage is ending. This is the 'sell the news' moment.",
                    expectedEffect: "Gasoline crack narrows $4-5/bbl from peak. Diesel crack narrows $3-4/bbl.",
                    principle: "FIRST RESTART → SELL THE CRACK — Hurricane crack trades are ROUND TRIPS. Buy on the forecast, sell on the restart. Holding through the restart is the most common mistake.",
                    riskNote: "Exit immediately. Cracks can give back 80% of the storm premium in the first week of restarts."
                }
            },
            {
                tick: 230,
                headline: "All Gulf Coast refineries back to full operations — utilisation rates normalise to 93%",
                detail: "Industry assessment: $2.3B total damage but no permanent capacity loss. Product supply fully recovered. Stocks rebuilding.",
                category: "supply",
                impact: {
                    crude: { direction: 1, immediatePct: 0.008, driftPct: 0.005 },
                    gasoline: { direction: -1, immediatePct: 0.02, driftPct: 0.01 },
                    diesel: { direction: -1, immediatePct: 0.015, driftPct: 0.008 },
                    volatilityMultiplier: 1.1, noiseAmplifier: 1.1,
                },
                strategy: {
                    action: "SHORT gasoline crack — 3 lots (overshoot trade)",
                    reasoning: "Full restart + stock rebuilding = cracks overshoot to the downside temporarily. Refineries run at max rates to rebuild inventory, producing MORE product than normal. This temporarily pushes cracks below pre-storm levels.",
                    expectedEffect: "Cracks settle $1-2/bbl BELOW pre-storm levels as refineries over-produce to fill tanks.",
                    principle: "POST-STORM OVERSUPPLY → CRACKS TEMPORARILY BELOW NORMAL — Refineries over-produce after hurricanes to rebuild stocks. This creates a SHORT-lived window where cracks are abnormally narrow.",
                    riskNote: "Small position. The overshoot is temporary — cracks will normalise within weeks."
                }
            }
        ],
        noiseEvents: [
            {
                tickRange: [0, 280],
                frequency: 13,
                pool: [
                    "Atlantic SST (sea surface temperatures) running above average for the season",
                    "MET office reports no additional tropical formation in the next 5 days",
                    "Coast Guard reopens Houston Ship Channel for limited traffic",
                    "Strategic Petroleum Reserve caverns in Gulf Coast report no damage",
                    "Colonial Pipeline operating at reduced pressure — precautionary",
                    "PADD 1 (East Coast) gasoline imports from Europe increase 30%",
                    "New York Harbor gasoline premium widens $0.05/gal — import pull",
                    "Mexican Gulf of Mexico crude production unaffected by storm track",
                    "Power restoration crews report 60% of refinery corridor back on grid",
                    "Marathon Galveston refinery reports minor flooding — no structural damage"
                ]
            }
        ]
    },
    {
        id: 'cs_driving_season',
        name: 'Driving Season',
        description: 'Navigate the seasonal refinery turnaround → driving season demand → summer peak cycle. Gasoline and diesel cracks diverge as seasonal demand patterns play out.',
        difficulty: 'Medium-Hard',
        crudePrice: 72.00,
        gasolinePrice: 97.00,
        dieselPrice: 108.00,
        volatility: 0.0028,
        totalTicks: 300,
        strategyOverview: 'The crack spread has a well-known seasonal pattern: Spring turnarounds tighten product supply (wider cracks) → Summer driving season peaks gasoline cracks → Fall shoulder season compresses cracks → Winter diesel/heating oil cracks widen. The edge is in TIMING the transitions and understanding which product leads at each stage.',
        events: [
            {
                tick: 25,
                headline: "Spring refinery turnaround season begins — 2.5m bbl/d of US capacity goes into maintenance",
                detail: "BP Whiting, Marathon Garyville, Valero Memphis major turnarounds. Largest turnaround season in 3 years as refiners address deferred maintenance.",
                category: "supply",
                impact: {
                    crude: { direction: -1, immediatePct: 0.015, driftPct: 0.008 },
                    gasoline: { direction: 1, immediatePct: 0.03, driftPct: 0.018 },
                    diesel: { direction: 1, immediatePct: 0.02, driftPct: 0.012 },
                    volatilityMultiplier: 1.3, noiseAmplifier: 1.2,
                },
                strategy: {
                    action: "BUY 3-2-1 crack — 5 lots",
                    reasoning: "Spring turnarounds REDUCE product supply while crude demand FALLS (refineries are the crude buyers). Both effects widen cracks. The 3-2-1 is the best instrument here because both gasoline AND diesel tighten during turnarounds.",
                    expectedEffect: "3-2-1 crack widens $2-3/bbl. Both products firm vs crude.",
                    principle: "TURNAROUND SEASON → WIDER CRACKS — Scheduled maintenance reduces refining capacity, tightening product supply. This is a PREDICTABLE, ANNUAL pattern.",
                    riskNote: "Turnarounds are scheduled and well-known. The market often pre-positions. The edge is in sizing — abnormally large turnaround seasons widen cracks more than expected."
                }
            },
            {
                tick: 75,
                headline: "EPA requires early summer gasoline specification switch — RVP change compresses supply",
                detail: "Summer-grade gasoline requirements kick in across the US. Refineries must produce lower-volatility gasoline. Effective supply reduced by blend constraints.",
                category: "policy",
                impact: {
                    crude: { direction: 0, immediatePct: 0, driftPct: 0 },
                    gasoline: { direction: 1, immediatePct: 0.025, driftPct: 0.015 },
                    diesel: { direction: -1, immediatePct: 0.005, driftPct: 0.003 },
                    volatilityMultiplier: 1.2, noiseAmplifier: 1.1,
                },
                strategy: {
                    action: "BUY gasoline crack. SELL diesel crack. (Gasoline/diesel crack spread trade)",
                    reasoning: "The RVP spec change is a GASOLINE-SPECIFIC event. It reduces effective gasoline supply without affecting diesel at all. This widens the gasoline crack while diesel cracks are unaffected or slightly soft. The PRODUCT SPREAD (gas vs diesel) is the trade here.",
                    expectedEffect: "Gasoline crack widens $2-3/bbl. Diesel crack unchanged. Gas-diesel gap widens.",
                    principle: "REGULATORY CONSTRAINTS → PRODUCT-SPECIFIC — Environmental regulations affect products differently. Summer gasoline specs tighten gas supply without affecting diesel.",
                    riskNote: "This is a well-known seasonal catalyst. The move may already be partially priced in."
                }
            },
            {
                tick: 140,
                headline: "Memorial Day travel record: AAA reports 44m Americans traveling by car — gasoline demand at 9.7m bbl/d",
                detail: "Record driving demand pulls gasoline stocks down rapidly. Gulf Coast gasoline inventories at 5-year lows. Spot gasoline premiums surge.",
                category: "data",
                impact: {
                    crude: { direction: 1, immediatePct: 0.012, driftPct: 0.008 },
                    gasoline: { direction: 1, immediatePct: 0.045, driftPct: 0.025 },
                    diesel: { direction: 1, immediatePct: 0.005, driftPct: 0.003 },
                    volatilityMultiplier: 1.4, noiseAmplifier: 1.2,
                },
                strategy: {
                    action: "HOLD gasoline crack — this is peak season. ADD if underweight.",
                    reasoning: "Record driving demand = peak gasoline crack territory. Gasoline cracks seasonally peak around July 4th. We're approaching the peak but still have 4-6 weeks of strong demand. The risk is being TOO early to sell.",
                    expectedEffect: "Gasoline crack potentially at seasonal highs: $35-40/bbl range.",
                    principle: "PEAK DRIVING DEMAND → PEAK GASOLINE CRACK — Gasoline cracks peak between Memorial Day and July 4th. This is the highest-conviction seasonal trade in energy.",
                    riskNote: "Don't be the last buyer. Gasoline cracks reverse FAST after the driving season peak."
                }
            },
            {
                tick: 210,
                headline: "Post-July 4th demand drop — gasoline consumption falls 500k bbl/d in 2 weeks",
                detail: "Back-to-school season approaching. Driving demand declining from peak. Refineries running at max to build winter diesel stocks. Gulf Coast gasoline stocks rebuilding.",
                category: "data",
                impact: {
                    crude: { direction: 1, immediatePct: 0.005, driftPct: 0.003 },
                    gasoline: { direction: -1, immediatePct: 0.04, driftPct: 0.02 },
                    diesel: { direction: 1, immediatePct: 0.015, driftPct: 0.01 },
                    volatilityMultiplier: 1.3, noiseAmplifier: 1.2,
                },
                strategy: {
                    action: "SELL gasoline crack — close all positions. SWITCH to BUY diesel crack.",
                    reasoning: "The seasonal transition is the trade. Gasoline cracks collapse post-July 4th as demand fades. Diesel cracks START widening because refineries are now building winter heating oil stocks — they yield more diesel, but winter demand will absorb it. The ROTATION from gasoline to diesel is the sophisticated play.",
                    expectedEffect: "Gasoline crack narrows $4-5/bbl in 3 weeks. Diesel crack starts widening.",
                    principle: "SEASONAL ROTATION → GAS TO DIESEL — The crack spread calendar: April-July = gasoline. October-March = diesel/heating oil. August-September = the transition zone where you switch.",
                    riskNote: "The gas-to-diesel rotation is well-known but the exact timing varies. Don't be early — wait for demand data confirmation."
                }
            },
            {
                tick: 265,
                headline: "Early cold snap across Northeast US — heating oil demand surges 3 weeks ahead of schedule",
                detail: "Temperatures 15°F below normal across the I-95 corridor. NYMEX heating oil futures rally. Diesel/heating oil stocks below 5-year average.",
                category: "weather",
                impact: {
                    crude: { direction: 1, immediatePct: 0.01, driftPct: 0.005 },
                    gasoline: { direction: -1, immediatePct: 0.005, driftPct: 0.003 },
                    diesel: { direction: 1, immediatePct: 0.04, driftPct: 0.025 },
                    volatilityMultiplier: 1.4, noiseAmplifier: 1.3,
                },
                strategy: {
                    action: "HOLD/ADD diesel crack long — 3-5 lots",
                    reasoning: "Heating oil and diesel are the SAME molecule (ULSD). Winter cold spells drive heating oil demand in the Northeast. The diesel crack should widen sharply. Meanwhile gasoline demand is at seasonal lows — the product divergence is at its maximum.",
                    expectedEffect: "Diesel crack widens $3-5/bbl. Gasoline crack flat or narrowing.",
                    principle: "WINTER COLD → DIESEL/HEATING OIL CRACK — Diesel = industrial demand + heating demand. In winter, the heating component adds significant demand, widening the diesel crack.",
                    riskNote: "Weather trades are high variance. Cold snaps can reverse quickly if forecasts change."
                }
            }
        ],
        noiseEvents: [
            {
                tickRange: [0, 300],
                frequency: 14,
                pool: [
                    "Baker Hughes US rig count unchanged week-over-week",
                    "RBOB futures contract rolls to next month smoothly",
                    "ULSD ARA (Amsterdam-Rotterdam-Antwerp) stocks within seasonal range",
                    "US refinery utilisation steady at 91% — no surprises",
                    "Ethanol blending requirements unchanged for Q3",
                    "Pipeline maintenance in Midwest — minor regional impact only",
                    "Asian gasoil cracks tracking global trends — no divergence",
                    "Mexican gasoline imports from US steady at 400k bbl/d",
                    "Propane/butane prices stable — no NGL complex impact on blending",
                    "Renewable diesel capacity addition on track for Q4 commissioning",
                    "Emissions credit (LCFS) prices flat — no change to biofuel economics",
                    "East Coast import cargoes arriving on schedule from Northwest Europe"
                ]
            }
        ]
    },
    {
        id: 'cs_margin_squeeze',
        name: 'Margin Squeeze',
        description: 'A perfect storm of rising crude costs and falling product demand crushes refining margins. Navigate the complex interplay of OPEC actions, demand destruction, and refinery responses.',
        difficulty: 'Hard',
        crudePrice: 82.00,
        gasolinePrice: 110.00,
        dieselPrice: 120.00,
        volatility: 0.003,
        totalTicks: 300,
        strategyOverview: 'In a margin squeeze, crude rises faster than products or products fall faster than crude — either way, the crack narrows. Refineries respond by cutting runs (processing less crude), which eventually tightens product supply and supports cracks. Understanding this feedback loop is key to timing. The turn usually comes from the refinery supply response.',
        events: [
            {
                tick: 25,
                headline: "OPEC+ surprise 2m bbl/d cut — largest since COVID. Crude surges.",
                detail: "Saudi Arabia drives the cut to support $90+ crude. No consultation with consumers. Crude bulls euphoric. Refiners alarmed — their feedstock just got more expensive.",
                category: "opec",
                impact: {
                    crude: { direction: 1, immediatePct: 0.06, driftPct: 0.035 },
                    gasoline: { direction: 1, immediatePct: 0.025, driftPct: 0.015 },
                    diesel: { direction: 1, immediatePct: 0.02, driftPct: 0.012 },
                    volatilityMultiplier: 1.6, noiseAmplifier: 1.4,
                },
                strategy: {
                    action: "SELL the 3-2-1 crack — 5 lots (short the crack)",
                    reasoning: "Crude is surging 6% while products are only up 2-2.5%. The CRACK IS NARROWING. OPEC cuts are classic crack-negative events because crude rises more than products. Refiners' feedstock costs just jumped but consumers won't pay proportionally more at the pump.",
                    expectedEffect: "3-2-1 crack narrows $3-4/bbl. Gasoline and diesel cracks both compress.",
                    principle: "OPEC CUT → SHORT THE CRACK — Supply-driven crude rallies almost always narrow cracks because crude is the input cost and products are the output. Feedstock costs rise faster than product revenue.",
                    riskNote: "Strong crack-narrowing setup. The risk: if crude eventually stabilises, products catch up and cracks recover."
                }
            },
            {
                tick: 80,
                headline: "Global recession fears intensify — Eurozone GDP contracts 0.3%, US PMI at 47",
                detail: "Demand destruction accelerating. Diesel demand down 300k bbl/d in OECD. Gasoline demand soft but more resilient than industrial fuels.",
                category: "data",
                impact: {
                    crude: { direction: -1, immediatePct: 0.025, driftPct: 0.015 },
                    gasoline: { direction: -1, immediatePct: 0.035, driftPct: 0.02 },
                    diesel: { direction: -1, immediatePct: 0.05, driftPct: 0.03 },
                    volatilityMultiplier: 1.5, noiseAmplifier: 1.3,
                },
                strategy: {
                    action: "SELL diesel crack — 5 lots. HOLD short 3-2-1 crack.",
                    reasoning: "Recession hits products HARDER than crude (OPEC is actively managing crude supply, nobody manages product supply). Diesel is the most vulnerable — it's the industrial fuel. Gasoline is more defensive because consumers still drive. The crack squeeze intensifies from the DEMAND side this time.",
                    expectedEffect: "Diesel crack narrows $4-5/bbl. Gasoline crack narrows $2-3/bbl.",
                    principle: "RECESSION → PRODUCTS FALL FASTER THAN CRUDE — In recessions, demand destruction hits products while OPEC supports crude. The crack gets squeezed from BOTH sides.",
                    riskNote: "The margin squeeze can go much further than you expect. Cracks can go negative in extreme scenarios."
                }
            },
            {
                tick: 140,
                headline: "US refineries respond: 800k bbl/d of crude processing capacity idle as margins go negative",
                detail: "Valero idles 200k bbl/d at Memphis. PBF Energy shuts Delaware City 180k bbl/d. Marathon cuts runs at Galveston Bay. Refiners refusing to process crude at a loss.",
                category: "supply",
                impact: {
                    crude: { direction: -1, immediatePct: 0.02, driftPct: 0.012 },
                    gasoline: { direction: 1, immediatePct: 0.025, driftPct: 0.015 },
                    diesel: { direction: 1, immediatePct: 0.02, driftPct: 0.012 },
                    volatilityMultiplier: 1.3, noiseAmplifier: 1.2,
                },
                strategy: {
                    action: "COVER short cracks. Consider switching to LONG the crack.",
                    reasoning: "THIS IS THE TURN SIGNAL. When refineries voluntarily shut (capacity idle), they reduce product supply AND reduce crude demand. This is the negative feedback loop that brings cracks back toward equilibrium. Less refining = tighter product supply = wider cracks. Less crude demand = weaker crude = wider cracks.",
                    expectedEffect: "Cracks stabilise and start widening from the bottom. Crude weakens further as demand disappears.",
                    principle: "REFINERY SHUTDOWNS → CRACK TROUGH — The refining industry has a natural circuit breaker: negative margins → run cuts → product tightening → margin recovery. The shutdown announcement IS the buy signal for cracks.",
                    riskNote: "The turn can be gradual. Don't expect immediate V-shaped recovery. Build position slowly."
                }
            },
            {
                tick: 200,
                headline: "US gasoline stocks draw 6m barrels in one week — lowest since 2014",
                detail: "Refinery run cuts went too far. Product supply now tight despite weak demand. Spot gasoline premiums surging in Gulf Coast and Northeast.",
                category: "data",
                impact: {
                    crude: { direction: -1, immediatePct: 0.005, driftPct: 0.003 },
                    gasoline: { direction: 1, immediatePct: 0.04, driftPct: 0.025 },
                    diesel: { direction: 1, immediatePct: 0.02, driftPct: 0.012 },
                    volatilityMultiplier: 1.4, noiseAmplifier: 1.2,
                },
                strategy: {
                    action: "BUY gasoline crack — 5 lots. ADD to long crack position.",
                    reasoning: "The refinery cuts created a PRODUCT SHORTAGE even though demand is weak. This is the classic margin cycle overshoot — refiners cut too much, products tighten, cracks spike. Gasoline is tighter than diesel because stocks started lower.",
                    expectedEffect: "Gasoline crack widens $4-5/bbl from trough. 3-2-1 crack recovering.",
                    principle: "SUPPLY OVERSHOOT → CRACK RECOVERY — The refining margin cycle oscillates: wide cracks → max runs → product glut → narrow cracks → run cuts → product tightness → wide cracks again.",
                    riskNote: "The cycle turn is confirmed. Cracks are recovering. The question is how far — depends on how quickly refineries restart."
                }
            },
            {
                tick: 260,
                headline: "Idled refineries announce restart plans — Valero Memphis back online in 2 weeks",
                detail: "Improved margins incentivise restarts. Industry expected to add back 500k+ bbl/d of processing within a month. Margin cycle normalising.",
                category: "supply",
                impact: {
                    crude: { direction: 1, immediatePct: 0.015, driftPct: 0.008 },
                    gasoline: { direction: -1, immediatePct: 0.02, driftPct: 0.012 },
                    diesel: { direction: -1, immediatePct: 0.015, driftPct: 0.008 },
                    volatilityMultiplier: 1.2, noiseAmplifier: 1.1,
                },
                strategy: {
                    action: "TAKE PROFIT on long cracks. Flatten to zero.",
                    reasoning: "Refinery restarts will WIDEN product supply again, pushing cracks back down. The margin cycle is mean-reverting. The crack recovery trade is now mature — take profits before the restart supply hits the market.",
                    expectedEffect: "Cracks start narrowing from recovery levels as product supply returns.",
                    principle: "RESTART ANNOUNCEMENT → CRACK CEILING — When refineries restart because margins recovered, the incremental product supply caps further crack widening. Book profits on the cycle turn.",
                    riskNote: "Clean exit. Lock in P&L from the full margin cycle. Don't get greedy on the last leg."
                }
            }
        ],
        noiseEvents: [
            {
                tickRange: [0, 300],
                frequency: 14,
                pool: [
                    "Valero Energy Q2 earnings call: management highlights challenging margin environment",
                    "Phillips 66 reports routine coker maintenance — no impact to guidance",
                    "CME NYMEX crack spread options volumes increase — hedging activity rising",
                    "Canadian heavy crude discounts widen slightly — WCS-WTI at -$15",
                    "US renewable diesel production steady at 100k bbl/d",
                    "Jet fuel demand recovery tracking airline capacity additions",
                    "Petrochemical naphtha margins stable — no diversion of refinery yields",
                    "US fuel exports to Latin America on seasonal average",
                    "PADD 5 (West Coast) refinery utilisation at 85% — normal",
                    "Asphalt demand seasonal — no impact to overall refinery economics",
                    "IMO marine fuel oil compliance costs stable",
                    "HollyFrontier reports smooth turnaround completion at Navajo refinery"
                ]
            }
        ]
    },
    {
        id: 'cs_refinery_catastrophe',
        name: 'Refinery Catastrophe',
        description: 'A massive explosion takes out a critical refining hub. Products fly, crude crashes. Can you trade the widening crack spread?',
        difficulty: 'Hard',
        crudePrice: 80.00,
        gasolinePrice: 110.00,
        dieselPrice: 115.00,
        volatility: 0.006,
        totalTicks: 280,
        strategyOverview: 'This is a "black swan" event for refiners. When a major refinery explodes, two things happen instantly: 1) Product supply vanishes (bullish products), and 2) Crude demand vanishes (bearish crude). This double-whammy causes the crack spread to explode wider.',
        events: [
            {
                tick: 20,
                headline: "Breaking News: Massive explosion at Jamnagar Refinery complex",
                detail: "World's largest refining hub reported on fire. 1.2M bbl/d capacity at risk.",
                category: "supply",
                impact: {
                    crude: { direction: -1, immediatePct: 0.04, driftPct: 0.02 },
                    gasoline: { direction: 1, immediatePct: 0.08, driftPct: 0.04 },
                    diesel: { direction: 1, immediatePct: 0.08, driftPct: 0.04 },
                    volatilityMultiplier: 3.0, noiseAmplifier: 2.0,
                },
                strategy: {
                    action: "BUY CRACK SPREAD - MAX SIZE",
                    reasoning: "1.2M bbl/d outage is catastrophic. Products will skyrocket. Crude will dump as it has nowhere to go.",
                    expectedEffect: "Crack widens by $10+.",
                    principle: "DISASTER -> MAX CRACK WIDENING",
                    riskNote: "Extreme volatility."
                }
            },
            {
                tick: 80,
                headline: "Fire contained but Critical Distillation Units destroyed",
                detail: "Engineers estimate 6 months minimum downtime. Structural damage severe.",
                category: "supply",
                impact: {
                    crude: { direction: -1, immediatePct: 0.02, driftPct: 0.01 },
                    gasoline: { direction: 1, immediatePct: 0.03, driftPct: 0.02 },
                    diesel: { direction: 1, immediatePct: 0.03, driftPct: 0.02 },
                    volatilityMultiplier: 2.0, noiseAmplifier: 1.5,
                },
                strategy: {
                    action: "HOLD LONG CRACK.",
                    reasoning: "Long duration outage confirmed. The tightness is here to stay.",
                    expectedEffect: "Crack stays historically wide.",
                    principle: "STRUCTURAL DAMAGE -> SUSTAINED PREMIUM",
                    riskNote: "Don't sell too early."
                }
            },
            {
                tick: 200,
                headline: "Emergency product exports authorised from Strategic Reserves",
                detail: "Governments releasing gasoline/diesel stocks to dampen price spike.",
                category: "policy",
                impact: {
                    crude: { direction: 0, immediatePct: 0, driftPct: 0 },
                    gasoline: { direction: -1, immediatePct: 0.04, driftPct: 0.02 },
                    diesel: { direction: -1, immediatePct: 0.04, driftPct: 0.02 },
                    volatilityMultiplier: 1.5, noiseAmplifier: 1.3,
                },
                strategy: {
                    action: "TAKE PROFIT on Crack.",
                    reasoning: "Government intervention provides the missing supply. The panic is over.",
                    expectedEffect: "Products drop, crack narrows from highs.",
                    principle: "STRATEGIC RELEASE -> CRACK NARROWING",
                    riskNote: "Good exit point."
                }
            }
        ],
        noiseEvents: [{ tickRange: [0, 280], frequency: 12, pool: ["Smoke seen for miles", "Port closed nearby", "Neighbouring units safe"] }]
    }
];
