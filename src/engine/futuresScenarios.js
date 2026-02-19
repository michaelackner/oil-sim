// ─── Futures Curve Trading Scenarios ──────────────────
// Each event has frontWeight / backWeight to control curve impact.
// frontWeight > backWeight = front months react more (steepening/backwardation)
// backWeight > frontWeight = back months react more (flattening)

export const futuresScenarios = [
    {
        id: 'ft_curve_basics',
        name: 'Curve Basics',
        description: 'A contango market with textbook supply/demand events. Learn how different parts of the curve react to news — front months vs back months.',
        difficulty: 'Easy',
        startPrice: 75.00,
        monthlySpread: 0.65,   // contango
        volatility: 0.0025,
        numMonths: 6,
        totalTicks: 250,
        months: ['Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25'],
        strategyOverview: 'This scenario introduces the forward curve. In contango, future months are priced higher than near months. Supply disruptions hit the front of the curve hardest (backwardation pressure). Demand concerns hit the back end hardest. Learn to pick the RIGHT month to trade, not just the right direction.',
        events: [
            {
                tick: 25,
                headline: "Unplanned pipeline outage cuts Brent loadings by 200k bbl/d for 2 weeks",
                detail: "Forties pipeline system shut for emergency repair. Prompt Brent physical cargoes repricing sharply.",
                category: "supply",
                impact: { direction: 1, immediatePct: 0.025, driftPct: 0.015, frontWeight: 1.8, backWeight: 0.4, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
                strategy: {
                    action: "BUY front month (M+1) — 5 lots",
                    reasoning: "A *short-term* pipeline outage affects *prompt* supply. Front months spike because physical barrels are needed NOW. Back months barely move because the pipeline will be fixed in 2 weeks. The curve should steepen (front rises more than back).",
                    expectedEffect: "M+1 rallies 2-3%, M+6 rallies only 0.5%. Contango narrows.",
                    principle: "SHORT-TERM SUPPLY DISRUPTION → FRONT MONTH — Temporary outages disproportionately affect the front of the curve.",
                    riskNote: "Front month position. The outage has a defined timeline — take profits when repairs are announced."
                }
            },
            {
                tick: 65,
                headline: "Pipeline repairs completed ahead of schedule — full flow restored",
                detail: "Forties pipeline back to 450k bbl/d capacity. Physical market normalising.",
                category: "supply",
                impact: { direction: -1, immediatePct: 0.02, driftPct: 0.01, frontWeight: 1.6, backWeight: 0.3, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
                strategy: {
                    action: "SELL M+1 — close front month long",
                    reasoning: "Pipeline restored = prompt supply pressure removed. Front month drops back. The contango should widen again as the near-term squeeze unwinds.",
                    expectedEffect: "M+1 drops 1.5-2%, back months barely change. Curve returns to normal contango.",
                    principle: "DISRUPTION RESOLVED → FRONT MONTH REVERSES — The front-month premium from the outage unwinds when supply returns.",
                    riskNote: "Close the front month long. Don't hold through a resolved disruption."
                }
            },
            {
                tick: 110,
                headline: "IEA raises global demand forecast by 500k bbl/d for second half of year",
                detail: "China's economic recovery stronger than expected. Asian jet fuel demand surging. Structural demand revision, not seasonal.",
                category: "data",
                impact: { direction: 1, immediatePct: 0.02, driftPct: 0.015, frontWeight: 0.5, backWeight: 1.6, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
                strategy: {
                    action: "BUY back months (M+4 to M+6) — 5 lots",
                    reasoning: "A STRUCTURAL demand revision for H2 affects *future* months more than prompt. When the IEA says demand will be 500k higher in 6 months, the back of the curve has to reprice upward. Front months already reflect current reality.",
                    expectedEffect: "M+5/M+6 rally 2%+, M+1 rallies only 0.5-1%. Contango steepens.",
                    principle: "STRUCTURAL DEMAND CHANGE → BACK MONTHS — Long-term demand forecasts move the back of the curve, not the front.",
                    riskNote: "Back-month positions are less volatile but have less liquidity. Size accordingly."
                }
            },
            {
                tick: 170,
                headline: "OPEC+ extends production cuts through Q3 — tighter than expected",
                detail: "Saudi Arabia rolls over 1m bbl/d voluntary cut. No increase until September at earliest.",
                category: "opec",
                impact: { direction: 1, immediatePct: 0.03, driftPct: 0.02, frontWeight: 1.3, backWeight: 0.8, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
                strategy: {
                    action: "BUY M+1 and M+2 — 5 lots each",
                    reasoning: "OPEC cuts tighten near-term supply. The front of the curve reacts more because OPEC cuts are effective NOW, not 6 months from now. However, back months also rise because the cut extends through Q3.",
                    expectedEffect: "Entire curve lifts 2-3%, but front months rally more. Contango narrows toward flat.",
                    principle: "OPEC CUTS → PARALLEL LIFT, FRONT-WEIGHTED — Cuts affect all months but especially prompt supply. Watch for contango narrowing as the sign the cuts are biting.",
                    riskNote: "Strong conviction. OPEC cuts are the clearest bullish signal in oil."
                }
            },
            {
                tick: 220,
                headline: "China PMI unexpectedly drops below 48 — deepening manufacturing contraction",
                detail: "Property sector drag worsening. Stimulus measures failing to boost industrial activity. Oil import growth slowing.",
                category: "data",
                impact: { direction: -1, immediatePct: 0.025, driftPct: 0.015, frontWeight: 0.6, backWeight: 1.5, volatilityMultiplier: 1.4, noiseAmplifier: 1.2 },
                strategy: {
                    action: "SELL back months (M+4 to M+6) — close positions",
                    reasoning: "China demand weakness undermines the IEA demand revision from earlier. Back months reprice downward because future demand is now in question. Front months are supported by OPEC cuts, so the front holds better.",
                    expectedEffect: "Back months drop 2-3%, front months only dip 1%. Contango compresses or flips to backwardation.",
                    principle: "DEMAND WEAKNESS → BACK MONTHS — Structural demand concerns crush the back of the curve while prompt supply tightness from OPEC keeps the front supported.",
                    riskNote: "Flatten back-month positions. The OPEC-front vs demand-back dynamic creates a complex curve."
                }
            }
        ],
        noiseEvents: [
            {
                tickRange: [0, 250],
                frequency: 13,
                pool: [
                    "North Sea loading programme for next month shows normal volumes",
                    "Brent quality mix steady — API gravity 38.5 average",
                    "ICE Brent futures open interest rises 2% — normal activity",
                    "Platts Dated Brent assessed at benchmark levels",
                    "LOOP terminal crude receipts unchanged week-over-week",
                    "Nigerian Bonny Light differentials firm 10 cents — seasonal",
                    "Tanker fixture: VLCC Arabian Gulf to China at WS 48",
                    "North Sea maintenance schedule published — routine summer work",
                    "CME NYMEX crude reporting normal margin levels",
                    "Dubai crude spot premium stable at $1.20 to futures"
                ]
            }
        ]
    },
    {
        id: 'ft_supply_squeeze',
        name: 'The Squeeze',
        description: 'A supply disruption escalates and flips the curve from contango to backwardation. Trade the front-month squeeze and manage the curve transition.',
        difficulty: 'Medium',
        startPrice: 78.00,
        monthlySpread: 0.45,
        volatility: 0.003,
        numMonths: 6,
        totalTicks: 280,
        months: ['Apr 25', 'May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25'],
        strategyOverview: 'Supply squeezes cause backwardation — when prompt prices exceed future prices because physical barrels are scarce NOW. The key skill is recognising when a disruption is severe enough to flip the curve, and trading the front-month premium aggressively. The trap is holding back-month longs during a front-month squeeze.',
        events: [
            {
                tick: 20,
                headline: "Kurdish pipeline shutdown after Turkey earthquake — 400k bbl/d offline",
                detail: "BTC pipeline damaged near Ceyhan terminal. Iraq Kurdistan crude exports halted. Geological assessment underway.",
                category: "supply",
                impact: { direction: 1, immediatePct: 0.03, driftPct: 0.02, frontWeight: 2.0, backWeight: 0.5, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
                strategy: {
                    action: "BUY M+1 aggressively — 8 lots",
                    reasoning: "400k bbl/d is significant. Earthquake damage is unpredictable — could be weeks or months. Front month is where the squeeze will be felt. Physical buyers will scramble for prompt barrels.",
                    expectedEffect: "M+1 jumps 3-4%, back months up only 1%. Contango starts narrowing rapidly.",
                    principle: "UNPLANNED INFRASTRUCTURE DAMAGE → MAXIMUM FRONT MONTH IMPACT — Earthquakes, unlike maintenance, have no defined repair timeline.",
                    riskNote: "Large front-month position. Monitor Turkish engineering assessments for repair timelines."
                }
            },
            {
                tick: 60,
                headline: "Turkey engineering assessment: BTC pipeline repairs will take 8-12 weeks minimum",
                detail: "Multiple pipeline sections need replacement. Ceyhan storage draining. Alternative export routes insufficient.",
                category: "supply",
                impact: { direction: 1, immediatePct: 0.035, driftPct: 0.025, frontWeight: 1.8, backWeight: 0.6, volatilityMultiplier: 1.6, noiseAmplifier: 1.4 },
                strategy: {
                    action: "HOLD M+1 long, BUY spread (long M+1 / short M+6) — add 5 lots",
                    reasoning: "8-12 weeks repair confirms this is a sustained disruption. The curve should now flip to backwardation. Trading the spread (long front / short back) profits from backwardation deepening even if flat price doesn't move much.",
                    expectedEffect: "Curve flips to backwardation. M+1 premium over M+6 widens to $2-3.",
                    principle: "SUSTAINED DISRUPTION → BACKWARDATION — When supply is tight for MONTHS not days, the entire curve structure changes. Trade the spread, not just flat price.",
                    riskNote: "Spread trade has lower risk than outright positions. The curve shape is your edge."
                }
            },
            {
                tick: 120,
                headline: "Ceyhan terminal crude stocks fall below operational minimums — force majeure on term contracts",
                detail: "Physical squeeze intensifies. Spot crude premiums for Mediterranean grades jump to $5+ over Dated Brent.",
                category: "supply",
                impact: { direction: 1, immediatePct: 0.04, driftPct: 0.02, frontWeight: 2.2, backWeight: 0.3, volatilityMultiplier: 1.8, noiseAmplifier: 1.5 },
                strategy: {
                    action: "HOLD long M+1 — maximum conviction",
                    reasoning: "Force majeure = physical market crisis. Buyers who NEED crude now will pay any price. The backwardation should deepen further. This is peak squeeze conditions.",
                    expectedEffect: "M+1 surges 4%+. Backwardation deepens. M+1 could trade $4-5 above M+6.",
                    principle: "PHYSICAL MARKET STRESS → EXTREME BACKWARDATION — Force majeure and stock depletion create non-linear price spikes in the front month.",
                    riskNote: "Peak squeeze conditions. Start planning your exit — squeezes end violently."
                }
            },
            {
                tick: 180,
                headline: "Emergency BTC pipeline bypass section operational — 200k bbl/d capacity restored",
                detail: "Partial flow restored through temporary bypass. Full repair still 4 weeks away but worst of squeeze over.",
                category: "supply",
                impact: { direction: -1, immediatePct: 0.035, driftPct: 0.02, frontWeight: 2.0, backWeight: 0.4, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
                strategy: {
                    action: "SELL M+1 — take all profits. Flatten spread.",
                    reasoning: "Partial restoration breaks the squeeze. 200k of 400k bbl/d back = the worst supply stress is over. Front month plunges as the physical premium collapses. Back months barely move because they never had much premium.",
                    expectedEffect: "M+1 drops 3-4%. Backwardation narrows sharply. Curve moving back toward contango.",
                    principle: "SQUEEZE BREAK → VIOLENT FRONT MONTH REVERSAL — When supply returns after a squeeze, the front month gives back gains faster than it made them. Don't be greedy.",
                    riskNote: "Exit immediately. Squeeze breaks are fast and violent."
                }
            },
            {
                tick: 240,
                headline: "Full BTC pipeline capacity restored — Kurdistan exports at pre-quake levels",
                detail: "All 400k bbl/d flowing. Ceyhan stocks rebuilding. Mediterranean crude market normalising.",
                category: "supply",
                impact: { direction: -1, immediatePct: 0.02, driftPct: 0.015, frontWeight: 1.4, backWeight: 0.6, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
                strategy: {
                    action: "SHORT M+1 — 3-5 lots (overshoot trade)",
                    reasoning: "Full restoration = return to pre-disruption supply levels. The front month may overshoot to the downside as the squeeze premium fully unwinds. Curve should return to contango.",
                    expectedEffect: "M+1 drops another 1.5-2%. Curve returns to normal contango.",
                    principle: "FULL RESOLUTION → OVERSHOOT — After a squeeze, markets often overshoot to the downside as physical cargoes that were delayed all arrive simultaneously.",
                    riskNote: "Small position. The overshoot trade is lower conviction than the squeeze itself."
                }
            }
        ],
        noiseEvents: [
            {
                tickRange: [0, 280],
                frequency: 14,
                pool: [
                    "Turkish Straits transit delays due to fog — routine seasonal event",
                    "Iraqi southern crude exports from Basrah stable at 3.3m bbl/d",
                    "Mediterranean refinery maintenance progressing on schedule",
                    "Egyptian SUMED pipeline utilisation at 65% — normal levels",
                    "CPC Blend crude loadings from Novorossiysk on schedule",
                    "Brent-Dubai EFS widens slightly — arbitrage flows adjusting",
                    "Oman crude OSP for next month set at $0.80 premium to DME",
                    "North African crude spot trades steady — no disruption premium",
                    "Black Sea crude export schedule unchanged",
                    "Turkish Petroleum confirms no impact to domestic production"
                ]
            }
        ]
    },
    {
        id: 'ft_storage_economics',
        name: 'Storage Play',
        description: 'A deepening contango creates a storage arbitrage opportunity. Understand when the curve structure pays for storage and when the trade breaks down.',
        difficulty: 'Hard',
        startPrice: 70.00,
        monthlySpread: 1.20,
        volatility: 0.003,
        numMonths: 6,
        totalTicks: 300,
        months: ['May 25', 'Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25'],
        strategyOverview: 'In deep contango, traders can profit by buying prompt crude (cheap), storing it, and selling forward (expensive). This "cash-and-carry" arbitrage defines the floor/ceiling for contango — it can only get as wide as the cost of storage. When contango exceeds storage cost (~$0.50/bbl/month), the arb is profitable. The key: trade the SPREAD, not just flat price.',
        events: [
            {
                tick: 20,
                headline: "OPEC+ abandons production quotas — each member free to produce at will",
                detail: "Saudi Arabia signals intention to regain market share. Output increase of 2m bbl/d expected within 3 months.",
                category: "opec",
                impact: { direction: -1, immediatePct: 0.05, driftPct: 0.03, frontWeight: 1.5, backWeight: 0.8, volatilityMultiplier: 1.8, noiseAmplifier: 1.5 },
                strategy: {
                    action: "SELL front months (M+1, M+2) — 5 lots each",
                    reasoning: "OPEC quota abandonment = massive supply increase. Front months get hit hardest because the supply arrives NOW. Contango will deepen as prompt crude floods the market and buyers defer purchases. This is the setup for a storage play.",
                    expectedEffect: "Entire curve drops 4-5%, front months drop 6-7%. Contango widens dramatically.",
                    principle: "SUPPLY FLOOD → DEEP CONTANGO — When supply overwhelms demand, prompt prices collapse and the curve goes into deep contango. Storage becomes the safety valve.",
                    riskNote: "Aggressive short. OPEC abandoning quotas is historically one of the most bearish events in oil."
                }
            },
            {
                tick: 70,
                headline: "Cushing crude stocks surge 8m barrels in one week — approaching tank tops",
                detail: "Storage utilisation at 85%. Contango at $1.50/month, exceeding storage cost of $0.50/month. Floating storage bookings accelerating.",
                category: "data",
                impact: { direction: -1, immediatePct: 0.025, driftPct: 0.015, frontWeight: 1.8, backWeight: 0.3, volatilityMultiplier: 1.4, noiseAmplifier: 1.3 },
                strategy: {
                    action: "BUY spread: long M+1 / short M+6 — or just cover M+1 short",
                    reasoning: "Contango at $1.50/month when storage costs $0.50 means the storage arb is hugely profitable. Traders will buy prompt crude and store it, which SUPPORTS front month prices. The contango should stop widening from here because the arb caps it.",
                    expectedEffect: "Front month stabilise. Contango stops widening. Spread trade profits as contango narrows.",
                    principle: "STORAGE ARB CAPS CONTANGO — Contango can only exceed storage cost temporarily. When arb traders step in, they buy prompt (supporting the front) and sell deferred (capping the back).",
                    riskNote: "This is a spread trade. Profit comes from contango narrowing, not flat price direction."
                }
            },
            {
                tick: 140,
                headline: "Saudi Arabia slashes OSP to Asia by $5/bbl — aggressive market share grab",
                detail: "Record discounts to attract Asian buyers. Saudi output reaches 11.5m bbl/d. Global oversupply estimated at 2.5m bbl/d.",
                category: "supply",
                impact: { direction: -1, immediatePct: 0.04, driftPct: 0.02, frontWeight: 1.6, backWeight: 0.7, volatilityMultiplier: 1.6, noiseAmplifier: 1.4 },
                strategy: {
                    action: "SELL M+1 — 5 lots (re-enter short)",
                    reasoning: "Saudi price cuts to gain market share intensify the oversupply. This overwhelms the storage arb — if storage fills up, there's no floor for contango. Watch Cushing utilisation — if it approaches tank tops, the contango structure breaks and front month can collapse.",
                    expectedEffect: "Front months drop 3-4%. Contango re-widens. Storage stress intensifies.",
                    principle: "TANK TOP RISK — When storage approaches maximum capacity, the contango doesn't just widen — it can become infinite. If there's nowhere to put the oil, prompt prices must fall until demand matches supply.",
                    riskNote: "This is the dangerous phase. Tank top risk creates non-linear downside."
                }
            },
            {
                tick: 200,
                headline: "Saudi Arabia signals willingness to discuss emergency production cuts",
                detail: "Energy minister says 'current prices are unacceptable.' Contacts initiated with Russia and UAE. Meeting within 2 weeks.",
                category: "opec",
                impact: { direction: 1, immediatePct: 0.035, driftPct: 0.025, frontWeight: 1.0, backWeight: 1.0, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
                strategy: {
                    action: "COVER all shorts. BUY M+3 and M+4 — 5 lots",
                    reasoning: "OPEC cutting discussion reverses the oversupply thesis. Buy the MIDDLE of the curve — not the front (still physical oversupply) and not the back (uncertain long-term). The middle benefits most from an OPEC cut that takes effect in 2-3 months.",
                    expectedEffect: "Parallel curve lift of 3%. Middle months outperform. Contango starts narrowing.",
                    principle: "OPEC U-TURN → BUY THE BELLY — When OPEC reverses from flooding to cutting, the middle of the curve benefits most. Front is still oversupplied, back is uncertain, but the belly aligns with cut timing.",
                    riskNote: "OPEC talk ≠ OPEC action. Size moderately until cuts are confirmed."
                }
            },
            {
                tick: 260,
                headline: "OPEC+ agrees emergency 3m bbl/d cut — largest in history",
                detail: "Record cut effective immediately. Saudi unilateral 1.5m, Russia 500k, UAE 500k, others 500k. Full compliance monitoring via tanker tracking.",
                category: "opec",
                impact: { direction: 1, immediatePct: 0.06, driftPct: 0.035, frontWeight: 1.4, backWeight: 0.9, volatilityMultiplier: 1.8, noiseAmplifier: 1.5 },
                strategy: {
                    action: "HOLD long belly positions. ADD M+1 long — 5 lots",
                    reasoning: "3m bbl/d cut is ENORMOUS — it swings the balance from 2.5m surplus to 0.5m deficit. Front months should now rally hard as the prompt oversupply is being directly addressed. The entire contango structure should collapse.",
                    expectedEffect: "Curve rallies 5-6%. Contango collapses. Front months surge most as physical tightness expected.",
                    principle: "RECORD OPEC CUTS → REGIME CHANGE — The curve structure flips from contango to flat/backwardation. This is a multi-month trend change, not a one-day event.",
                    riskNote: "High conviction. Don't sell too early — record cuts have multi-week impact."
                }
            }
        ],
        noiseEvents: [
            {
                tickRange: [0, 300],
                frequency: 15,
                pool: [
                    "Crude tank farm capacity expansion project in Fujairah progressing",
                    "VLCC time-charter rates stable — no floating storage booking surge",
                    "Saldanha Bay terminal utilisation steady at 60%",
                    "Cushing tank gauge reports show minimal week-over-week change",
                    "WTI Midland crude delivered stable at +$0.50 premium",
                    "US Gulf Coast PADD 3 crude stocks within seasonal range",
                    "Louisiana offshore crude delivery schedules normal",
                    "Shell reports usual crude trading book positioning",
                    "Vitol books 3 Suezmax tankers for West Africa loadings — routine",
                    "Trafigura storage lease at Rotterdam renewed at previous rate",
                    "EIA weekly petroleum report shows marginal changes only",
                    "Indian crude import volumes tracking budget estimates"
                ]
            }
        ]
    },
    {
        id: 'ft_curve_flip',
        name: 'Curve Flip',
        description: 'The market transitions from backwardation to contango as demand weakens. Navigate the structural shift and profit from spread changes across the curve.',
        difficulty: 'Very Hard',
        startPrice: 85.00,
        monthlySpread: -0.70,
        volatility: 0.0035,
        numMonths: 6,
        totalTicks: 320,
        months: ['Jun 25', 'Jul 25', 'Aug 25', 'Sep 25', 'Oct 25', 'Nov 25'],
        strategyOverview: 'This scenario starts in backwardation (front > back) and transitions to contango — the most complex curve dynamic. Backwardation signals tight physical markets; the flip to contango signals the market is loosening. The key skill: recognising the inflection point and reversing your spread position. Most traders get caught holding the wrong curve position through the flip.',
        events: [
            {
                tick: 25,
                headline: "US Strategic Petroleum Reserve releases 30m barrels over 2 months",
                detail: "Emergency release to combat high prices. 500k bbl/d hitting the market immediately. All released from Gulf Coast storage sites.",
                category: "policy",
                impact: { direction: -1, immediatePct: 0.03, driftPct: 0.02, frontWeight: 1.7, backWeight: 0.4, volatilityMultiplier: 1.4, noiseAmplifier: 1.3 },
                strategy: {
                    action: "SELL front months (M+1, M+2) — 5 lots each",
                    reasoning: "SPR releases hit PROMPT supply immediately. 500k bbl/d is significant — it partially offsets the tightness causing backwardation. Front months should drop most, narrowing the backwardation.",
                    expectedEffect: "Front months drop 3%, back months drop 0.5-1%. Backwardation narrows from -$0.70/month toward -$0.30/month.",
                    principle: "SPR RELEASE → FRONT MONTH BEARISH — Strategic reserves are prompt physical supply. They hit the front of the curve directly.",
                    riskNote: "Short front months into SPR release. The timing is known and supply is guaranteed."
                }
            },
            {
                tick: 80,
                headline: "China reduces crude import quotas for independent refineries by 20%",
                detail: "Teapot refineries face 1.2m bbl/d reduction in allowed imports. Industrial slowdown and environmental policy driving decision.",
                category: "data",
                impact: { direction: -1, immediatePct: 0.035, driftPct: 0.025, frontWeight: 0.7, backWeight: 1.6, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
                strategy: {
                    action: "SELL back months (M+4, M+5, M+6) — 5 lots each",
                    reasoning: "Import quota cuts are a STRUCTURAL demand reduction. 1.2m bbl/d is ~1.2% of global demand. Back months reprice downward because this policy affects future demand, not today's. The combination of SPR (front bearish) and China policy (back bearish) is flattening the entire curve.",
                    expectedEffect: "Back months drop 3-4%. Curve shifting from backwardation toward flat.",
                    principle: "STRUCTURAL DEMAND CUT → BACK MONTHS — Policy decisions that reduce future demand hit the deferred contracts hardest.",
                    riskNote: "The curve is in transition. Watch for the contango inflection."
                }
            },
            {
                tick: 140,
                headline: "IEA monthly report: global supply now exceeds demand by 800k bbl/d",
                detail: "First surplus since 2020. US production growth + SPR release + OPEC non-compliance creating structural oversupply.",
                category: "data",
                impact: { direction: -1, immediatePct: 0.025, driftPct: 0.015, frontWeight: 1.3, backWeight: 0.9, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
                strategy: {
                    action: "VERIFY: has the curve flipped to contango yet? If still in backwardation, add shorts",
                    reasoning: "800k bbl/d surplus is the confirmation that the market has structurally loosened. The curve should flip from backwardation to contango as inventories build. If it hasn't flipped yet, it will soon.",
                    expectedEffect: "Continued curve flattening. The inflection from backwardation to contango happens here.",
                    principle: "SURPLUS CONFIRMATION → CURVE FLIP IMMINENT — When supply exceeds demand structurally, contango is inevitable. Storage starts filling, carrying costs define the curve shape.",
                    riskNote: "The flip itself is the trading signal. Watch the M+1 vs M+2 spread cross from negative to positive."
                }
            },
            {
                tick: 210,
                headline: "Cushing stocks build 5m barrels in two weeks — contango widens to $0.60/month",
                detail: "Curve has flipped. Storage economics now in play. Traders booking tank space at Cushing and Gulf Coast.",
                category: "data",
                impact: { direction: -1, immediatePct: 0.02, driftPct: 0.012, frontWeight: 1.5, backWeight: 0.5, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
                strategy: {
                    action: "CLOSE back-month shorts. Shift to SPREAD: short M+1 / long M+6 (sell contango)",
                    reasoning: "Now that the curve is in contango, the trade is different. Contango at $0.60/month when storage costs $0.50 is near equilibrium. The arb capping contango at ~$0.60 means selling the spread (short front, long back) won't work much further. Consider buying the spread if contango feels too wide.",
                    expectedEffect: "Contango stabilises near storage cost. Flat price may stabilise too.",
                    principle: "CONTANGO EQUILIBRIUM — Once contango reaches storage cost, it's self-limiting. The arb trade (buy spot, store, sell forward) caps the spread. Trade the reversion toward equilibrium.",
                    riskNote: "Transition from directional trading to spread trading. Different risk profile."
                }
            },
            {
                tick: 280,
                headline: "OPEC announces surprise 1m bbl/d cut — effective immediately",
                detail: "Saudi Arabia responding to price collapse. Voluntary cuts plus pressure on UAE and Iraq. Market caught offside.",
                category: "opec",
                impact: { direction: 1, immediatePct: 0.04, driftPct: 0.025, frontWeight: 1.4, backWeight: 0.8, volatilityMultiplier: 1.6, noiseAmplifier: 1.4 },
                strategy: {
                    action: "BUY M+1 — 5 lots. FLATTEN all other positions",
                    reasoning: "OPEC cut lifts the entire curve but especially front months. Contango should narrow. Near end of scenario — take profits on shorts, buy the dip in front month, and flatten everything to lock in P&L.",
                    expectedEffect: "Curve rallies 3-4%. Contango narrows. Front months lead.",
                    principle: "OPEC INTERVENTION → CURVE NORMALISATION — OPEC cuts are the reset button. They narrow contango and can push back toward backwardation if sustained.",
                    riskNote: "Near end of scenario. Flatten and book profits. Don't start a new thesis with 40 ticks remaining."
                }
            }
        ],
        noiseEvents: [
            {
                tickRange: [0, 320],
                frequency: 14,
                pool: [
                    "WTI-Brent spread stable at -$3.50 — no change in transatlantic flows",
                    "Cushing tank utilisation surveys show normal seasonal changes",
                    "ICE Brent options skew slightly bearish — puts bid over calls",
                    "Commodity index rebalancing flow: minor buying expected",
                    "North Sea crude loadings for July within seasonal average",
                    "Indian crude imports steady — refinery runs at 100%",
                    "Norway Ekofisk crude quality steady at 39.2 API",
                    "Baltic Exchange dirty tanker rates ease 3% — seasonal softening",
                    "US midstream companies report normal pipeline utilisation",
                    "Korean refiners maintain term contract liftings with Saudi Aramco",
                    "Oman Oil Company maintains steady output at 1m bbl/d",
                    "Egyptian EGPC sets August crude allocation unchanged"
                ]
            }
        ]
    },
    {
        id: 'ft_super_contango',
        name: 'Super Contango',
        description: 'A market flooded with oil. Storage is filling up. Contango is so steep it pays for storage. Can you trade the "cash and carry" arbitrage?',
        difficulty: 'Hard',
        startPrice: 65.00,
        monthlySpread: 1.50,
        volatility: 0.004,
        numMonths: 6,
        totalTicks: 300,
        months: ['Sep 25', 'Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26'],
        strategyOverview: 'In "Super Contango", the future price is much higher than the spot price because the market is oversupplied. The spread must be wide enough to cover storage costs (approx $0.50/bbl/mo). If it widens further, it is risk-free profit for those with storage. Watch for storage capacity limits!',
        events: [
            {
                tick: 20,
                headline: "OPEC+ completely dissolves production quotas - free for all",
                detail: "Saudi Arabia and Russia announce full production. 3m bbl/d hitting the market.",
                category: "opec",
                impact: { direction: -1, immediatePct: 0.08, driftPct: 0.04, frontWeight: 2.0, backWeight: 0.5, volatilityMultiplier: 2.0, noiseAmplifier: 1.5 },
                strategy: {
                    action: "SELL M+1 aggressive. BUY M+6 (Spread trade)",
                    reasoning: "Massive oversupply crushes the frontend. Backend holds value better. The contango will explode to $2.00+.",
                    expectedEffect: "M+1 crashes $5. Spread widens massively.",
                    principle: "SUPPLY SHOCK -> SUPER CONTANGO",
                    riskNote: "Front month can go to zero in extreme storage full scenarios."
                }
            },
            {
                tick: 100,
                headline: "Global storage utilisation hits 98% - Tank Tops in sight",
                detail: "Traders scrambling for any remaining storage. VLCC rates soaring as ships used for floating storage.",
                category: "data",
                impact: { direction: -1, immediatePct: 0.05, driftPct: 0.02, frontWeight: 2.5, backWeight: 0.2, volatilityMultiplier: 2.5, noiseAmplifier: 1.8 },
                strategy: {
                    action: "SELL M+1. DO NOT HOLD LONG POSITIONS.",
                    reasoning: "If storage is full, prompt oil is worthless. M+1 can disconnect from reality.",
                    expectedEffect: "M+1 capitulation. Contango widens to $4-5.",
                    principle: "TANK TOPS -> DISCONNECTED FRONT MONTH",
                    riskNote: "Extremely dangerous to be long M+1."
                }
            },
            {
                tick: 200,
                headline: "Emergency coordinated production cutannounced by G20 + OPEC",
                detail: "Global leaders intervene to stabilise market. 5m bbl/d cut.",
                category: "policy",
                impact: { direction: 1, immediatePct: 0.10, driftPct: 0.05, frontWeight: 1.5, backWeight: 1.2, volatilityMultiplier: 1.8, noiseAmplifier: 1.4 },
                strategy: {
                    action: "BUY M+1 and M+2. CLOSE shorts.",
                    reasoning: "The bottom is in. Intervention stops the freefall. Curve will flatten.",
                    expectedEffect: "Violent rally. M+1 leads recovery.",
                    principle: "POLICY INTERVENTION -> SHORT SQUEEZE",
                    riskNote: "V-shaped recovery likely."
                }
            }
        ],
        noiseEvents: [{ tickRange: [0, 300], frequency: 10, pool: ["Storage rates rising", "Tanker availability low", "Refinery runs cut"] }]
    },
    {
        id: 'ft_backwardation_trap',
        name: 'Backwardation Trap',
        description: 'The market looks tight (backwardated), but is it real? Signals are mixed. Don\'t get trapped buying the peak.',
        difficulty: 'Very Hard',
        startPrice: 92.00,
        monthlySpread: -0.80,
        volatility: 0.005,
        numMonths: 6,
        totalTicks: 320,
        months: ['Dec 25', 'Jan 26', 'Feb 26', 'Mar 26', 'Apr 26', 'May 26'],
        strategyOverview: 'Backwardation usually means "buy", but here it might be a trap. Supply is returning, but data is lagging. Watch for the "flip" signal.',
        events: [
            {
                tick: 30,
                headline: "Rumours of peace talks in major oil producing region",
                detail: "Geopolitical risk premium fading?",
                category: "geopol",
                impact: { direction: -1, immediatePct: 0.02, driftPct: 0.01, frontWeight: 1.2, backWeight: 0.8, volatilityMultiplier: 1.2, noiseAmplifier: 1.5 },
                strategy: {
                    action: "REDUCE long exposure.",
                    reasoning: "Backwardation relies on scarcity. Peace = supply returns.",
                    expectedEffect: "Curve flattens slightly.",
                    principle: "GEOPOLITICAL RISK FADE -> FLATTENING",
                    riskNote: "Rumours can be false."
                }
            },
            {
                tick: 120,
                headline: "Major pipeline unexpectedly restarts 2 weeks early",
                detail: "Supply flood hitting the hub immediately.",
                category: "supply",
                impact: { direction: -1, immediatePct: 0.04, driftPct: 0.02, frontWeight: 1.8, backWeight: 0.4, volatilityMultiplier: 1.5, noiseAmplifier: 1.3 },
                strategy: {
                    action: "SELL M+1 aggressive. BUY M+3.",
                    reasoning: "The scarcity is gone. The trap has sprung. Front month premium collapses.",
                    expectedEffect: "M+1 drops sharply. Backwardation flips to slight contango.",
                    principle: "SUPPLY SURPRISE -> BACKWARDATION COLLAPSE",
                    riskNote: "Fast move."
                }
            },
            {
                tick: 220,
                headline: "Confirmed: Peace treaty signed. Sanctions lifted.",
                detail: "1.5m bbl/d returning closer to market.",
                category: "geopol",
                impact: { direction: -1, immediatePct: 0.03, driftPct: 0.02, frontWeight: 1.0, backWeight: 1.5, volatilityMultiplier: 1.3, noiseAmplifier: 1.1 },
                strategy: {
                    action: "SELL back months.",
                    reasoning: "Structural supply return depresses the whole curve long term.",
                    expectedEffect: "Entire curve shifts down.",
                    principle: "STRUCTURAL SUPPLY RETURN -> BEARISH CURVE",
                    riskNote: "Trend change."
                }
            }
        ],
        noiseEvents: [{ tickRange: [0, 320], frequency: 12, pool: ["Diplomats sighting", "Pipeline testing", "Cargo loading"] }]
    }
];
