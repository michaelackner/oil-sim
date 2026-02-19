/**
 * Signal vs Noise — Headline Classification Training Module
 *
 * Presents headlines one at a time. The player must classify each as:
 *   ✅ SIGNAL (will move price) — then choose direction (Bullish / Bearish)
 *   ❌ NOISE  (no meaningful impact)
 *
 * Sources headlines from ALL scenario pools (impact events + noise events)
 * plus additional tricky "trap" headlines designed to test common mistakes.
 *
 * TRICK CATEGORIES we test:
 *   1. Noise dressed as news       — sounds important but no price impact
 *   2. Consensus-match data        — data releases that match expectations
 *   3. Counterintuitive impacts    — headlines where the obvious direction is WRONG
 *   4. Magnitude traps             — sounds big but is tiny relative to global market
 *   5. Misleading urgency          — dramatic language, insignificant event
 *   6. Red herrings                — about a related market, not crude oil
 *   7. Stale information           — "confirms" something already priced in
 */

const TRICK_CATEGORIES = {
    NOISE_AS_NEWS: {
        name: 'Noise Dressed as News',
        icon: '📰',
        description: 'Headline looks authoritative but contains zero actionable information. Rig counts unchanged, seasonal averages met, routine operations.',
        lesson: 'Just because it\'s on the news feed doesn\'t mean it matters. Most headlines in oil trading are filler.',
    },
    CONSENSUS_MATCH: {
        name: 'Consensus Match',
        icon: '🎯',
        description: 'Data release that matches market expectations exactly. No surprise = no information = no trade.',
        lesson: 'Markets price consensus BEFORE the data. Only SURPRISES create edge. In-line data is noise.',
    },
    COUNTERINTUITIVE: {
        name: 'Counterintuitive Impact',
        icon: '🔄',
        description: 'The obvious direction is WRONG. Hurricanes shutting refineries are BEARISH for crude (less demand). Sanctions on buyers are BEARISH. Think supply chain.',
        lesson: 'The mark of a great trader: understanding second-order effects. Always ask "who buys crude and what happens to them?"',
    },
    MAGNITUDE_TRAP: {
        name: 'Magnitude Trap',
        icon: '📏',
        description: 'Headline sounds dramatic but the actual barrels involved are tiny relative to global supply/demand (~100m bbl/d).',
        lesson: 'Always convert headlines to bbl/d and compare to global supply of ~100m bbl/d. If it\'s less than 0.5%, it\'s probably noise.',
    },
    MISLEADING_URGENCY: {
        name: 'Misleading Urgency',
        icon: '🚨',
        description: 'BREAKING! URGENT! — dramatic language on a non-event. Designed to trigger emotional trading.',
        lesson: 'Urgency of language ≠ importance of event. "BREAKING" is a formatting choice, not an indicator of price impact.',
    },
    RED_HERRING: {
        name: 'Red Herring',
        icon: '🐟',
        description: 'About a related market (natural gas, metals, equities) or a tangential metric that doesn\'t move crude oil prices.',
        lesson: 'Stay focused on crude oil fundamentals. Natural gas, gasoline, and metals have their own supply/demand. Cross-market correlations are unreliable.',
    },
    STALE_INFO: {
        name: 'Already Priced In',
        icon: '⏰',
        description: 'Confirms something the market already knows. Satellite confirming what was announced, agencies reiterating forecasts, scheduled maintenance starting on schedule.',
        lesson: '"Buy the rumour, sell the fact." Once information is public, it\'s in the price. Confirmation of known information has minimal impact.',
    },
    REAL_SIGNAL: {
        name: 'Real Signal',
        icon: '⚡',
        description: 'A genuine surprise that changes the supply/demand balance. New information the market didn\'t have.',
        lesson: 'Real signals have: (1) NEW information, (2) material quantity (>0.5% of supply/demand), (3) surprise factor vs consensus.',
    },
};

/**
 * Each headline entry has:
 *   headline: string — the news headline
 *   detail: string — additional context
 *   isSignal: boolean — true = moves price, false = noise
 *   direction: 1 | -1 | 0 — bullish, bearish, or neutral
 *   trickCategory: string — key into TRICK_CATEGORIES
 *   explanation: string — why this is signal or noise
 *   difficulty: 1-3 — 1=easy, 2=medium, 3=hard
 */
const HEADLINE_BANK = [
    // =========================================================
    // NOISE DRESSED AS NEWS (obvious once you know the pattern)
    // =========================================================
    {
        headline: "Baker Hughes: US oil rig count unchanged at 481",
        detail: "Weekly rotary rig report shows no change from prior week.",
        isSignal: false,
        direction: 0,
        trickCategory: 'NOISE_AS_NEWS',
        explanation: 'Rig count unchanged = zero information. Rig counts only matter when they change significantly (±20+). A flat reading is pure noise.',
        difficulty: 1,
    },
    {
        headline: "North Sea Forties pipeline operating normally",
        detail: "No disruptions reported. Flows at scheduled capacity.",
        isSignal: false,
        direction: 0,
        trickCategory: 'NOISE_AS_NEWS',
        explanation: '"Operating normally" is the default state. You don\'t trade normality. Only DISRUPTIONS to this pipeline would be a signal.',
        difficulty: 1,
    },
    {
        headline: "Kazakhstan CPC blend exports steady at 1.4m bbl/d",
        detail: "Caspian Pipeline Consortium flows at normal rates.",
        isSignal: false,
        direction: 0,
        trickCategory: 'NOISE_AS_NEWS',
        explanation: '"Steady" exports = status quo. No change = no trade. 1.4m bbl/d is only relevant if it CHANGES.',
        difficulty: 1,
    },
    {
        headline: "ICE Brent open interest unchanged week-on-week",
        detail: "Futures market positioning stable across all contract months.",
        isSignal: false,
        direction: 0,
        trickCategory: 'NOISE_AS_NEWS',
        explanation: 'Positioning data is relevant when it changes dramatically (e.g. record short-covering). No change = market in equilibrium.',
        difficulty: 1,
    },
    {
        headline: "Nigerian Forcados loadings on schedule",
        detail: "Monthly crude loading program proceeding as planned.",
        isSignal: false,
        direction: 0,
        trickCategory: 'NOISE_AS_NEWS',
        explanation: 'On-schedule exports are the baseline expectation. Only delays or cancellations would create a trade signal.',
        difficulty: 1,
    },
    {
        headline: "US refinery utilization at 92.1% — seasonal norm",
        detail: "Refiners operating at typical winter throughput levels.",
        isSignal: false,
        direction: 0,
        trickCategory: 'NOISE_AS_NEWS',
        explanation: '"Seasonal norm" tells you this is exactly expected. No surprise = no signal. Only significant deviations (below 85% or above 96%) matter.',
        difficulty: 1,
    },
    {
        headline: "Oman OSP set at Brent minus $0.40 for next month",
        detail: "Official selling price in line with market expectations.",
        isSignal: false,
        direction: 0,
        trickCategory: 'NOISE_AS_NEWS',
        explanation: 'OSP matching expectations = no information. OSPs only create signals when they deviate significantly from the formula price.',
        difficulty: 2,
    },

    // =========================================================
    // CONSENSUS MATCH — data that sounds important but = expectations
    // =========================================================
    {
        headline: "EIA weekly crude inventories draw of 0.8m barrels (consensus: -1.2m)",
        detail: "Slightly less bullish than expected. Gasoline stocks build 1.5m barrels.",
        isSignal: false,
        direction: 0,
        trickCategory: 'CONSENSUS_MATCH',
        explanation: 'The miss was only 0.4m barrels in a 500m barrel inventory system — that\'s 0.08%. Statistically insignificant. The price move will be <0.5% and will reverse.',
        difficulty: 2,
    },
    {
        headline: "US jobs report at 175k — in line with expectations",
        detail: "Unemployment at 3.9%. Wage growth moderating. No surprises for energy markets.",
        isSignal: false,
        direction: 0,
        trickCategory: 'CONSENSUS_MATCH',
        explanation: 'Jobs data matching consensus has zero information value for oil. The market ALREADY priced 175k. You\'d be paying spread for no edge.',
        difficulty: 1,
    },
    {
        headline: "OPEC+ JMMC meeting concludes with no policy changes",
        detail: "Committee reaffirms existing quotas. Next meeting scheduled for Q3.",
        isSignal: false,
        direction: 0,
        trickCategory: 'CONSENSUS_MATCH',
        explanation: 'No change in policy when no change was expected = zero information. The temptation is to read stability as bullish or bearish — resist it.',
        difficulty: 2,
    },
    {
        headline: "China imports 11.2m bbl/d — in line with seasonal average",
        detail: "Monthly crude import data shows normal purchasing patterns.",
        isSignal: false,
        direction: 0,
        trickCategory: 'CONSENSUS_MATCH',
        explanation: '"In line with seasonal average" is the definition of no surprise. Only significant deviations (±10%+) from seasonal norms create a trade signal.',
        difficulty: 1,
    },
    {
        headline: "IEA monthly report reiterates demand growth forecast at 1.2m bbl/d",
        detail: "Agency maintains previous outlook. No revision to supply or demand estimates.",
        isSignal: false,
        direction: 0,
        trickCategory: 'STALE_INFO',
        explanation: '"Reiterates" = no new information. Forecast revisions move markets. Forecast confirmations do not.',
        difficulty: 2,
    },
    {
        headline: "API: Crude stocks draw 0.5m barrels",
        detail: "American Petroleum Institute weekly report shows modest draw.",
        isSignal: false,
        direction: 0,
        trickCategory: 'CONSENSUS_MATCH',
        explanation: '0.5m barrel draw is microscopic (0.1% of inventory). API is also a private estimate, not official government data. Even EIA draws need to be 3m+ to be meaningful.',
        difficulty: 2,
    },

    // =========================================================
    // COUNTERINTUITIVE — direction is opposite to what you'd think
    // =========================================================
    {
        headline: "Hurricane upgraded to Category 4 — direct hit expected on refining corridor",
        detail: "Port Arthur and Lake Charles refineries begin shutdowns. 2.5m bbl/d capacity offline.",
        isSignal: true,
        direction: -1,
        trickCategory: 'COUNTERINTUITIVE',
        explanation: 'THIS IS THE #1 TRAP. Hurricanes hitting REFINERIES are BEARISH for crude, not bullish. Refineries BUY crude — if they shut down, crude demand evaporates. 2.5m bbl/d of refining capacity = 2.5m bbl/d LESS crude purchasing.',
        difficulty: 3,
    },
    {
        headline: "OPEC+ compliance drops to 60% — Iraq and Kazakhstan overproducing",
        detail: "Joint Ministerial Committee warns of 'serious consequences' for non-compliance.",
        isSignal: true,
        direction: -1,
        trickCategory: 'COUNTERINTUITIVE',
        explanation: 'Low compliance means members are PRODUCING MORE than their quotas — more supply = bearish. Don\'t confuse the WARNING (sounds like action) with the actual impact (overproduction).',
        difficulty: 2,
    },
    {
        headline: "Gulf platforms restart production — 70% capacity back online",
        detail: "Operators confirm minimal structural damage to offshore infrastructure.",
        isSignal: true,
        direction: -1,
        trickCategory: 'COUNTERINTUITIVE',
        explanation: 'After a hurricane, production restarting while refineries are STILL offline is BEARISH. More crude coming with nowhere to process it. The supply-demand imbalance widens.',
        difficulty: 3,
    },
    {
        headline: "US shale producers begin shutting in unprofitable wells",
        detail: "Permian Basin operators announce $5B capex cuts. Rig count expected to fall 15%.",
        isSignal: true,
        direction: 1,
        trickCategory: 'COUNTERINTUITIVE',
        explanation: 'Supply destruction is BULLISH, not bearish. When producers shut wells, future supply decreases. This is the market self-correcting and finding a price floor.',
        difficulty: 2,
    },
    {
        headline: "US crude inventories spike 12m barrels as refining demand destroyed",
        detail: "EIA: crude stockpiles at 3-year high. Refinery utilization drops to 72%.",
        isSignal: true,
        direction: -1,
        trickCategory: 'COUNTERINTUITIVE',
        explanation: 'A 12m barrel build is massive (normal is ±3m). BUT the nuance is WHY — refineries can\'t process the crude due to hurricane damage. This is bearish because crude is piling up with no outlet.',
        difficulty: 3,
    },

    // =========================================================
    // MAGNITUDE TRAPS — sounds big, is small
    // =========================================================
    {
        headline: "Libya civil war flare-up shuts Sharara oilfield (300k bbl/d)",
        detail: "Armed militia seizes control of pipeline. Exports from Zawia port suspended.",
        isSignal: true,
        direction: 1,
        trickCategory: 'MAGNITUDE_TRAP',
        explanation: '300k bbl/d is only 0.3% of global supply. Libyan outages also tend to resolve quickly. This is a small, temporary signal — SIZE SMALL. The "civil war" language makes it sound bigger than it is.',
        difficulty: 2,
    },
    {
        headline: "India's MRPL refinery maintenance extends by 3 days",
        detail: "Mangalore refinery processing delayed. Will impact 300k bbl/d capacity.",
        isSignal: false,
        direction: 0,
        trickCategory: 'MAGNITUDE_TRAP',
        explanation: '300k bbl/d for 3 days = 0.9m barrels total impact in a 100m/day market. This is 0.3% — meaningless noise. Routine maintenance does not move markets.',
        difficulty: 2,
    },
    {
        headline: "North Sea production outage at Johansens field extends 2 days",
        detail: "Maintenance delayed by weather. Estimated loss: 80k bbl/d for 2 additional days.",
        isSignal: false,
        direction: 0,
        trickCategory: 'MAGNITUDE_TRAP',
        explanation: '80k bbl/d for 2 days = 160k barrels total. That\'s 0.16% of a single day\'s global consumption. The word "outage" makes it sound alarming — the actual impact is zero.',
        difficulty: 1,
    },
    {
        headline: "CFTC: Money managers reduce net longs by 2%",
        detail: "Crude oil managed money positions show slight 2% decrease in net length.",
        isSignal: false,
        direction: 0,
        trickCategory: 'MAGNITUDE_TRAP',
        explanation: '2% change in positioning is within normal weekly fluctuation. Only 10%+ weekly changes indicate meaningful repositioning. This is statistical noise.',
        difficulty: 2,
    },
    {
        headline: "Baker Hughes: US oil rig count falls by 3 to 479",
        detail: "Modest decline in drilling activity. Permian Basin unchanged.",
        isSignal: false,
        direction: 0,
        trickCategory: 'MAGNITUDE_TRAP',
        explanation: '3 rigs out of 479 is a 0.6% change. Rig count changes of <10 are statistically insignificant. The total is also near recent averages — no trend change.',
        difficulty: 1,
    },

    // =========================================================
    // MISLEADING URGENCY — dramatic language, insignificant event
    // =========================================================
    {
        headline: "BREAKING: Dollar index (DXY) flat at 104.2",
        detail: "Greenback unchanged ahead of Federal Reserve minutes release.",
        isSignal: false,
        direction: 0,
        trickCategory: 'MISLEADING_URGENCY',
        explanation: '"BREAKING" on a flat reading! Dollar unchanged = no information for oil. Even when DXY moves, the oil correlation is weak and unreliable intraday.',
        difficulty: 1,
    },
    {
        headline: "URGENT: SPR release under consideration but no decision yet",
        detail: "White House officials discuss options for Strategic Petroleum Reserve.",
        isSignal: false,
        direction: 0,
        trickCategory: 'MISLEADING_URGENCY',
        explanation: '"Under consideration but no decision" = nothing has happened. This is pre-announcement speculation. Only actual SPR release announcements move prices.',
        difficulty: 2,
    },
    {
        headline: "FLASH: EIA revises US production estimate up by 200k bbl/d",
        detail: "Monthly revision adjusts prior estimates for Permian Basin methodology change.",
        isSignal: false,
        direction: 0,
        trickCategory: 'MISLEADING_URGENCY',
        explanation: '"FLASH" on a methodological revision! This isn\'t new production — it\'s a statistical adjustment of past estimates. The barrels were always being produced; the model just counted them differently.',
        difficulty: 3,
    },
    {
        headline: "ALERT: Brent-WTI spread narrows to $3.80",
        detail: "Transatlantic crude differential tightening on improved pipeline flows.",
        isSignal: false,
        direction: 0,
        trickCategory: 'MISLEADING_URGENCY',
        explanation: '"ALERT" for a completely normal spread movement. The Brent-WTI differential fluctuates between $2-6 routinely. $3.80 is mid-range. This is noise.',
        difficulty: 2,
    },

    // =========================================================
    // RED HERRINGS — related markets, not crude oil
    // =========================================================
    {
        headline: "Natural gas prices spike 8% on Gulf supply disruption",
        detail: "Henry Hub futures surge. LNG export facilities unaffected.",
        isSignal: false,
        direction: 0,
        trickCategory: 'RED_HERRING',
        explanation: 'Natural gas and crude oil have different supply chains. Gas prices spiking does NOT mean crude will spike. The temptation is to trade "energy broadly" — don\'t.',
        difficulty: 2,
    },
    {
        headline: "Gasoline futures surge to $2.85/gal amid refinery shutdowns",
        detail: "RBOB gasoline on NYMEX hits multi-month high on supply concerns.",
        isSignal: false,
        direction: 0,
        trickCategory: 'RED_HERRING',
        explanation: 'Gasoline surging while refineries shut is actually BEARISH for crude (refineries buy less crude). This is a product market signal, not a crude signal. In fact, it confirms the bearish thesis.',
        difficulty: 3,
    },
    {
        headline: "Copper prices drop 4% on demand concerns",
        detail: "LME copper falls on China property sector weakness. Industrial metals broadly lower.",
        isSignal: false,
        direction: 0,
        trickCategory: 'RED_HERRING',
        explanation: 'Copper is an industrial metal, not an energy commodity. While both respond to China demand, copper\'s correlation with crude is weak and unreliable intraday. Trade your market.',
        difficulty: 2,
    },
    {
        headline: "LNG spot prices crash to $2/MMBtu on weak industrial demand",
        detail: "Asian LNG prices at multi-year lows. European TTF also weak.",
        isSignal: false,
        direction: 0,
        trickCategory: 'RED_HERRING',
        explanation: 'LNG (natural gas) has its own supply-demand fundamentals completely separate from crude oil. Cheap gas doesn\'t make crude cheaper or more expensive.',
        difficulty: 2,
    },
    {
        headline: "Insurance losses estimated at $15B for energy sector",
        detail: "Lloyd's of London estimates hurricane damage claims across oil and gas assets.",
        isSignal: false,
        direction: 0,
        trickCategory: 'RED_HERRING',
        explanation: 'Insurance losses are a financial metric, not a physical supply/demand signal. $15B in insurance claims tells you nothing about how many barrels are flowing. Stay focused on bbl/d.',
        difficulty: 2,
    },

    // =========================================================
    // STALE INFORMATION — already priced in
    // =========================================================
    {
        headline: "Satellite data confirms Saudi production drop of 1.8m bbl/d",
        detail: "Tanker tracking shows significant reduction in Saudi exports from Ras Tanura.",
        isSignal: true,
        direction: 1,
        trickCategory: 'STALE_INFO',
        explanation: 'Compliance CONFIRMATION is marginally bullish but the big move was on the CUT ANNOUNCEMENT. Satellite data confirming what was already announced is incrementally positive but NOT a big signal. Most of this is priced in.',
        difficulty: 3,
    },
    {
        headline: "IMF maintains global growth forecast at 2.9%",
        detail: "International Monetary Fund semi-annual outlook unchanged from prior report.",
        isSignal: false,
        direction: 0,
        trickCategory: 'STALE_INFO',
        explanation: '"Maintains forecast" = no new information. The previous 2.9% forecast was already priced. Only REVISIONS to forecasts are signals.',
        difficulty: 1,
    },
    {
        headline: "Libyan output stable at 1.1m bbl/d",
        detail: "Production continues at recent levels despite political tensions.",
        isSignal: false,
        direction: 0,
        trickCategory: 'STALE_INFO',
        explanation: '"Stable" output = the market already knows this. Despite "political tensions" being mentioned, no actual disruption occurred. Stability is not a signal.',
        difficulty: 1,
    },
    {
        headline: "Marathon Petroleum Galveston Bay refinery operating normally",
        detail: "No impact from regional weather system. Full throughput maintained.",
        isSignal: false,
        direction: 0,
        trickCategory: 'STALE_INFO',
        explanation: '"Operating normally" during a weather event sounds reassuring but it\'s the default state. The market doesn\'t reprice when expected normality continues.',
        difficulty: 1,
    },
    {
        headline: "US strategic reserve at 347m barrels — near 40-year low",
        detail: "SPR levels remain depleted following 2022-23 releases. No new purchases announced.",
        isSignal: false,
        direction: 0,
        trickCategory: 'STALE_INFO',
        explanation: 'SPR at 40-year low is OLD NEWS. It\'s been at this level for months. The market priced this long ago. Only new RELEASES or new PURCHASES would be a signal.',
        difficulty: 2,
    },

    // =========================================================
    // REAL SIGNALS — genuinely price-moving events
    // =========================================================
    {
        headline: "OPEC+ talks collapse: Saudi Arabia announces output boost of 2m bbl/d",
        detail: "Saudi Aramco to raise production immediately. 'The era of cuts is over.'",
        isSignal: true,
        direction: -1,
        trickCategory: 'REAL_SIGNAL',
        explanation: '2m bbl/d is 2% of global supply — MASSIVE. Saudi flooding the market intentionally is the most bearish OPEC event possible. "Immediately" means no delay. This is the real deal.',
        difficulty: 1,
    },
    {
        headline: "Iran threatens to close Strait of Hormuz if strikes continue",
        detail: "IRGC Navy commander: 'Any further aggression will be met with closure of vital waterways.'",
        isSignal: true,
        direction: 1,
        trickCategory: 'REAL_SIGNAL',
        explanation: 'Strait of Hormuz carries 21m bbl/d — 20% of global supply. Even a THREAT of closure commands a risk premium. This is a major bullish catalyst.',
        difficulty: 1,
    },
    {
        headline: "China GDP growth slows to 3.2% — worst in 3 decades",
        detail: "NBS data far below 5.0% target. Property sector collapse deepens.",
        isSignal: true,
        direction: -1,
        trickCategory: 'REAL_SIGNAL',
        explanation: 'China uses 16m bbl/d of oil. GDP at 3.2% vs 5.0% target = demand destruction of potentially 1-2m bbl/d. This is a structural demand shock, not a one-quarter blip.',
        difficulty: 1,
    },
    {
        headline: "China announces $1 trillion stimulus: infrastructure + EV subsidies",
        detail: "PBoC cuts rates, State Council approves massive fiscal package.",
        isSignal: true,
        direction: 1,
        trickCategory: 'REAL_SIGNAL',
        explanation: '$1 trillion in infrastructure = concrete, steel, diesel demand. This is real physical demand creation. Fiscal stimulus > monetary policy for oil demand.',
        difficulty: 1,
    },
    {
        headline: "Iran seizes oil tanker in Strait of Hormuz",
        detail: "Marshall Islands-flagged VLCC seized by IRGC Navy. Crew of 25 aboard.",
        isSignal: true,
        direction: 1,
        trickCategory: 'REAL_SIGNAL',
        explanation: 'PHYSICAL action, not just words. Tanker seizure proves Iran will disrupt shipping. Insurance premiums spike, tankers reroute. This is far more impactful than verbal threats.',
        difficulty: 1,
    },
    {
        headline: "WHO declares new respiratory virus a Public Health Emergency",
        detail: "Novel pathogen spreading rapidly across Asia. Air travel restrictions expected.",
        isSignal: true,
        direction: -1,
        trickCategory: 'REAL_SIGNAL',
        explanation: 'Pandemic declaration by WHO is one of the most powerful demand destruction catalysts. Air travel = jet fuel = 8% of oil demand. Travel bans directly destroy demand.',
        difficulty: 1,
    },
    {
        headline: "Red Sea attacks intensify — Houthi drones hit commercial tanker",
        detail: "Major shipping lines reroute via Cape of Good Hope. Freight costs spike 40%.",
        isSignal: true,
        direction: 1,
        trickCategory: 'REAL_SIGNAL',
        explanation: 'Red Sea carries 10% of global oil trade. Rerouting via Cape of Good Hope adds 10-14 days — effectively reducing available supply for weeks. Physical disruption, sustained impact.',
        difficulty: 1,
    },
    {
        headline: "OPEC+ emergency deal: Historic 3m bbl/d production cut agreed",
        detail: "Deepest cuts in OPEC history. Compliance monitoring strengthened.",
        isSignal: true,
        direction: 1,
        trickCategory: 'REAL_SIGNAL',
        explanation: '3m bbl/d cut = 3% of global supply removed. "Historic" is correct — this is the largest coordinated cut ever. Massive bullish signal.',
        difficulty: 1,
    },
    {
        headline: "IEA slashes 2024 oil demand growth forecast by 500k bbl/d",
        detail: "Global demand now expected at just 700k bbl/d growth. 'Clear signs of deceleration.'",
        isSignal: true,
        direction: -1,
        trickCategory: 'REAL_SIGNAL',
        explanation: 'IEA CUTTING (not reiterating!) their forecast by 500k bbl/d is significant. Agency revisions trigger algorithmic selling and fund rebalancing. The word "slashes" is key — it\'s a revision, not a reiteration.',
        difficulty: 2,
    },
    {
        headline: "US Fed cuts rates by 50bps in emergency action",
        detail: "Powell: 'We are acting decisively to support economic growth.'",
        isSignal: true,
        direction: 1,
        trickCategory: 'REAL_SIGNAL',
        explanation: 'Emergency rate cut = policymakers are scared. Bullish for oil via: (1) weaker dollar, (2) lower borrowing costs, (3) signal effect of more stimulus to come.',
        difficulty: 2,
    },

    // =========================================================
    // TRICKY MIXED HEADLINES (hardest to classify)
    // =========================================================
    {
        headline: "Floating storage bookings surge as contango deepens",
        detail: "VLCCs booked for storage at record rates. Front-month spread at -$4.50.",
        isSignal: false,
        direction: 0,
        trickCategory: 'RED_HERRING',
        explanation: 'Floating storage increasing SOUNDS bearish, but it\'s a symptom, not a cause. It reflects the oversupply already priced in. The contango structure is already in the futures curve. This is the market functioning, not new information.',
        difficulty: 3,
    },
    {
        headline: "Hedge funds build record short positions in crude futures",
        detail: "CFTC commitment of traders shows speculative shorts at all-time high.",
        isSignal: false,
        direction: 0,
        trickCategory: 'STALE_INFO',
        explanation: 'CFTC data is released with a 3-day lag — these positions were built LAST week. By the time you see this, the positions are old news. Also, record shorts can actually be BULLISH (short squeeze potential).',
        difficulty: 3,
    },
    {
        headline: "Goldman Sachs lowers Brent forecast to $60/bbl for Q3",
        detail: "Investment bank revises price target downward citing demand concerns.",
        isSignal: false,
        direction: 0,
        trickCategory: 'MISLEADING_URGENCY',
        explanation: 'Bank forecasts are opinions, not facts. Goldman changes their oil target frequently. Banks forecast where prices ARE GOING, not where they are. By the time you read this, it\'s priced in by Goldman\'s own trading desk.',
        difficulty: 3,
    },
    {
        headline: "European manufacturing PMI hits 44.1 — recession fears mount",
        detail: "Germany and France lead contraction. Industrial diesel demand drops 5% y/y.",
        isSignal: true,
        direction: -1,
        trickCategory: 'REAL_SIGNAL',
        explanation: 'PMI at 44.1 is DEEP contraction (below 50). Industrial diesel demand down 5% y/y is PHYSICAL demand destruction — real barrels disappearing. The combination of leading indicator (PMI) + hard data (diesel demand) = strong bearish signal.',
        difficulty: 2,
    },
    {
        headline: "Canadian oil sands producers shut in 1m bbl/d of high-cost output",
        detail: "Suncor and CNRL announce temporary suspensions of mining operations.",
        isSignal: false,
        direction: 0,
        trickCategory: 'STALE_INFO',
        explanation: 'In a crash scenario, supply destruction is EXPECTED and already partially priced. The market anticipated high-cost producers shutting in. This confirms the thesis but doesn\'t add new information.',
        difficulty: 3,
    },
    {
        headline: "Vaccine breakthrough — major pharma announces 95% efficacy",
        detail: "Emergency use authorization expected within weeks. Markets surge on recovery hopes.",
        isSignal: true,
        direction: 1,
        trickCategory: 'REAL_SIGNAL',
        explanation: 'Vaccine = demand recovery catalyst. 95% efficacy means lockdowns will end, air travel resumes, driving recovers. This directly reverses the pandemic demand destruction thesis. Massive bullish signal.',
        difficulty: 1,
    },
    {
        headline: "India crude imports rise to 5.0m bbl/d on refining expansion",
        detail: "New Jamnagar-area refining capacity absorbing more crude feedstock.",
        isSignal: false,
        direction: 0,
        trickCategory: 'NOISE_AS_NEWS',
        explanation: 'India\'s import growth was already factored into the market given known refinery expansion schedules. This is expected growth, not a surprise. Without a deviation from forecast, there\'s no trade.',
        difficulty: 2,
    },
    {
        headline: "VLCC freight rates collapse on weak demand for tonnage",
        detail: "Supertanker day rates fall to $15k/day — lowest since 2018.",
        isSignal: false,
        direction: 0,
        trickCategory: 'RED_HERRING',
        explanation: 'Tanker rates are a shipping market metric. Low rates actually make crude transportation CHEAPER, which is marginally bullish for crude demand, not bearish. Don\'t confuse weak tanker demand with weak crude demand.',
        difficulty: 3,
    },
    {
        headline: "US announces $2 trillion economic relief package",
        detail: "Congress passes historic fiscal spending bill targeting consumer and business support.",
        isSignal: false,
        direction: 0,
        trickCategory: 'MAGNITUDE_TRAP',
        explanation: 'This SOUNDS massive, but it\'s general fiscal policy targeting consumers and businesses, not direct energy demand. The oil demand impact is indirect and delayed by months. In a crisis, the immediate demand destruction far outweighs any future stimulus effect.',
        difficulty: 3,
    },
    {
        headline: "Petrochemical demand holds relatively stable amid crisis",
        detail: "Naphtha and ethane feedstock demand supported by packaging and medical plastic needs.",
        isSignal: false,
        direction: 0,
        trickCategory: 'STALE_INFO',
        explanation: 'Petrochemicals are ~15% of oil demand and are the most resilient segment during crises (packaging, medical supplies). "Relatively stable" is expected — this isn\'t new information.',
        difficulty: 2,
    },
    {
        headline: "Norway voluntary cut of 250k bbl/d to support market",
        detail: "Non-OPEC producer joins supply management effort. Historically rare.",
        isSignal: false,
        direction: 0,
        trickCategory: 'MAGNITUDE_TRAP',
        explanation: '250k bbl/d is only 0.25% of global supply. Even though Norway acting is "historically rare" (which sounds significant), the actual barrels are tiny. The headline importance exceeds the actual impact.',
        difficulty: 3,
    },
    {
        headline: "Physical crude differentials collapse — 20+ grades below $0",
        detail: "Spot market shows severe oversupply with discounts across all basins.",
        isSignal: false,
        direction: 0,
        trickCategory: 'STALE_INFO',
        explanation: 'In a crash, physical crude differentials collapsing is a SYMPTOM of the oversupply already priced. The futures market already reflects this weakness. This is lagging confirmation, not a new signal.',
        difficulty: 3,
    },
];


/**
 * Shuffle and optionally filter headlines by difficulty level.
 * Returns a new array.
 */
function getTrainingSet(options = {}) {
    const { count = 20, difficulty = null, shuffle = true } = options;

    let pool = [...HEADLINE_BANK];

    if (difficulty) {
        pool = pool.filter(h => h.difficulty <= difficulty);
    }

    if (shuffle) {
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
    }

    return pool.slice(0, Math.min(count, pool.length));
}

export { TRICK_CATEGORIES, HEADLINE_BANK, getTrainingSet };
