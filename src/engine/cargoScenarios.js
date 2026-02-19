/**
 * cargoScenarios.js
 *
 * 8 progressive scenarios for the cargo hedging game.
 * Each teaches a different aspect of physical oil cargo risk management.
 * hedgePosition: 'long' = player owns the cargo, sell futures to hedge
 *                'short' = player sold cargo forward, buy futures to hedge
 */

// Helper: month boundaries map simulation days to named months.
// Each scenario spans ~60 trading days across 3-4 months.

export const cargoScenarios = [
    // ─── SCENARIO 1: The Basics ─────────────────────────────────
    {
        id: 'cargo-1',
        name: 'The Basics',
        difficulty: 'Easy',
        hedgePosition: 'long', // Owns cargo → sell futures
        description: 'Your first cargo. Learn to calculate lots, pick the right month, and place a simple hedge.',
        objective: 'Construct a textbook hedge for a straightforward Brent cargo with no complications.',
        keyLessons: [
            'Volume ÷ 1,000 = lots',
            'Long physical → sell futures to hedge',
            'Match hedge month to your pricing period',
        ],
        cargo: {
            grade: 'Brent Crude (Forties Blend)',
            volume: 500000,
            origin: 'Hound Point, North Sea',
            destination: 'Rotterdam',
            blDay: 30,
            pricingDays: 5,
            pricingType: 'around',
        },
        curve: {
            basePrice: 78.50,
            monthSpread: 0.20, // Mild contango
            months: 5,
            volatility: 0.65,
            monthLabels: ['Feb', 'Mar', 'Apr', 'May', 'Jun'],
        },
        monthBoundaries: {
            'Feb': [1, 20],
            'Mar': [21, 42],
            'Apr': [43, 63],
            'May': [64, 84],
            'Jun': [85, 105],
        },
        events: [], // No BL shifts — pure hedge construction exercise
        totalDays: 45,
        hedgeDirection: -1, // Player should SELL futures (short hedge)
        correctMonth: 'Mar',
        correctLots: 500,
        scoring: {
            lotsWeight: 0.25,
            monthWeight: 0.25,
            directionWeight: 0.25,
            effectivenessWeight: 0.25,
        },
    },

    // ─── SCENARIO 2: The Delay ──────────────────────────────────
    {
        id: 'cargo-2',
        name: 'The Delay',
        difficulty: 'Medium',
        hedgePosition: 'long',
        description: 'Your vessel is delayed. The BL date shifts, and your hedge lands in the wrong month. Time to roll.',
        objective: 'Construct the initial hedge, then roll it when the BL date shifts across a month boundary.',
        keyLessons: [
            'BL date shifts change your pricing window',
            'If pricing moves to a new month, you must roll',
            'Roll cost = spread × lots × 1,000 bbl',
        ],
        cargo: {
            grade: 'Brent Crude (Forties Blend)',
            volume: 600000,
            origin: 'Sullom Voe, Shetland',
            destination: 'Wilhelmshaven, Germany',
            blDay: 40, // Close to month boundary
            pricingDays: 5,
            pricingType: 'around',
        },
        curve: {
            basePrice: 82.00,
            monthSpread: 0.25, // Contango
            months: 5,
            volatility: 0.75,
            monthLabels: ['Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        monthBoundaries: {
            'Mar': [1, 21],
            'Apr': [22, 43],
            'May': [44, 65],
            'Jun': [66, 86],
            'Jul': [87, 107],
        },
        events: [
            {
                triggerDay: 15,
                headline: 'Vessel delayed — engine maintenance required at Sullom Voe',
                detail: 'The tanker assigned to your cargo requires unscheduled engine repairs. Loading pushed back 5 days.',
                blShiftDays: 5, // BL moves from day 40 to day 45 → pricing crosses into May
                icon: '🔧',
            },
        ],
        totalDays: 55,
        hedgeDirection: -1,
        correctMonth: 'Apr',
        correctLots: 600,
        scoring: {
            lotsWeight: 0.15,
            monthWeight: 0.20,
            directionWeight: 0.15,
            rollWeight: 0.25,
            effectivenessWeight: 0.25,
        },
    },

    // ─── SCENARIO 3: Contango Trap ──────────────────────────────
    {
        id: 'cargo-3',
        name: 'Contango Trap',
        difficulty: 'Medium-Hard',
        hedgePosition: 'long',
        description: 'A steep contango market makes rolling expensive. Time your roll carefully to minimize costs.',
        objective: 'Hedge and roll in a market where contango means rolling forward costs real money.',
        keyLessons: [
            'In contango, rolling costs money (buy cheap, sell dear)',
            'Timing the roll matters — spreads fluctuate',
            'Consider the trade-off: roll now or risk being unhedged',
        ],
        cargo: {
            grade: 'Brent Crude (BFOET Basket)',
            volume: 700000,
            origin: 'Mongstad, Norway',
            destination: 'Jamnagar, India',
            blDay: 38,
            pricingDays: 5,
            pricingType: 'around',
        },
        curve: {
            basePrice: 75.00,
            monthSpread: 0.85, // STEEP contango — rolling is expensive
            months: 5,
            volatility: 0.90,
            monthLabels: ['Apr', 'May', 'Jun', 'Jul', 'Aug'],
        },
        monthBoundaries: {
            'Apr': [1, 20],
            'May': [21, 42],
            'Jun': [43, 64],
            'Jul': [65, 85],
            'Aug': [86, 106],
        },
        events: [
            {
                triggerDay: 12,
                headline: 'Port congestion at Mongstad — loading window pushed back 8 days',
                detail: 'Multiple vessels queuing at Mongstad terminal. Your loading slot moved from Mar 18 to Mar 26.',
                blShiftDays: 8, // BL now day 46 → pricing straddles May/Jun boundary
                icon: '⚓',
            },
        ],
        totalDays: 58,
        hedgeDirection: -1,
        correctMonth: 'May',
        correctLots: 700,
        scoring: {
            lotsWeight: 0.10,
            monthWeight: 0.15,
            directionWeight: 0.10,
            rollWeight: 0.35,
            effectivenessWeight: 0.30,
        },
    },

    // ─── SCENARIO 4: Backwardation Gift ─────────────────────────
    {
        id: 'cargo-4',
        name: 'Backwardation Gift',
        difficulty: 'Hard',
        hedgePosition: 'long',
        description: 'Multiple delays in a backwardated market. Rolling actually earns money — but don\'t get complacent.',
        objective: 'Handle multiple BL shifts and rolls. Backwardation helps, but each roll is a decision point.',
        keyLessons: [
            'In backwardation, rolling forward earns money',
            'Multiple rolls compound — track your cumulative effect',
            'Don\'t assume the next roll will also be profitable',
        ],
        cargo: {
            grade: 'Brent Crude (Ekofisk)',
            volume: 500000,
            origin: 'Teesside, UK',
            destination: 'Sarroch, Sardinia',
            blDay: 35,
            pricingDays: 5,
            pricingType: 'around',
        },
        curve: {
            basePrice: 88.00,
            monthSpread: -0.60, // Backwardation — rolling earns money
            months: 6,
            volatility: 0.80,
            monthLabels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        },
        monthBoundaries: {
            'Mar': [1, 20],
            'Apr': [21, 42],
            'May': [43, 63],
            'Jun': [64, 84],
            'Jul': [85, 105],
            'Aug': [106, 126],
        },
        events: [
            {
                triggerDay: 10,
                headline: 'Weather delay — North Sea storms force 4-day postponement',
                detail: 'Force 9 gales in the North Sea. All loadings at Teesside suspended for 4 days.',
                blShiftDays: 4,
                icon: '🌊',
            },
            {
                triggerDay: 25,
                headline: 'Buyer requests additional 6-day deferment for tank availability',
                detail: 'Discharge port at Sarroch has tank capacity issues. Mutual agreement to delay loading.',
                blShiftDays: 6,
                icon: '🏭',
            },
        ],
        totalDays: 65,
        hedgeDirection: -1,
        correctMonth: 'Apr',
        correctLots: 500,
        scoring: {
            lotsWeight: 0.10,
            monthWeight: 0.10,
            directionWeight: 0.10,
            rollWeight: 0.35,
            effectivenessWeight: 0.35,
        },
    },

    // ─── SCENARIO 5: The Split Cargo ────────────────────────────
    {
        id: 'cargo-5',
        name: 'The Split Cargo',
        difficulty: 'Very Hard',
        hedgePosition: 'long',
        description: 'A massive cargo where the BL date shift puts your pricing window across TWO months. Split your hedge.',
        objective: 'Construct a split-month hedge weighted by pricing days in each month, then manage a roll.',
        keyLessons: [
            'When pricing straddles months, split your hedge proportionally',
            'E.g., 3 days in June + 2 days in July → 60% Jun lots, 40% Jul lots',
            'Track each leg separately — different months have different prices',
        ],
        cargo: {
            grade: 'Brent Crude (Troll)',
            volume: 1000000,
            origin: 'Mongstad, Norway',
            destination: 'Yeosu, South Korea',
            blDay: 42, // Right on month boundary
            pricingDays: 5,
            pricingType: 'around',
        },
        curve: {
            basePrice: 80.50,
            monthSpread: 0.35, // Moderate contango
            months: 6,
            volatility: 0.85,
            monthLabels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        },
        monthBoundaries: {
            'Apr': [1, 21],
            'May': [22, 43],
            'Jun': [44, 64],
            'Jul': [65, 85],
            'Aug': [86, 106],
            'Sep': [107, 127],
        },
        events: [
            {
                triggerDay: 18,
                headline: 'Cargo delayed 3 days — blending operations at Mongstad behind schedule',
                detail: 'Quality issues with the Troll crude blend require additional processing time.',
                blShiftDays: 3, // BL moves to day 45 → pricing is days 43-47, crossing May/Jun
                icon: '⚗️',
            },
        ],
        totalDays: 60,
        hedgeDirection: -1,
        correctMonth: 'May', // Initially, but after shift it splits
        correctLots: 1000,
        scoring: {
            lotsWeight: 0.10,
            monthWeight: 0.10,
            directionWeight: 0.10,
            rollWeight: 0.30,
            splitWeight: 0.15, // Bonus for correct split calculation
            effectivenessWeight: 0.25,
        },
    },

    // ─── SCENARIO 6: Short Squeeze ──────────────────────────────
    {
        id: 'cargo-6',
        name: 'Short Squeeze',
        difficulty: 'Medium',
        hedgePosition: 'short', // Sold cargo forward → buy futures
        description: 'You\'ve sold a cargo forward and need to lock in your purchase price. Buy futures to protect against rising prices.',
        objective: 'Buy futures to hedge a cargo you\'ve committed to deliver. If prices rise, your futures gain offsets higher purchase costs.',
        keyLessons: [
            'Short physical → BUY futures to hedge',
            'If you\'ve sold forward, rising prices hurt you',
            'A long hedge protects your purchase cost just like a short hedge protects your sale price',
        ],
        cargo: {
            grade: 'Brent Crude (Forties Blend)',
            volume: 400000,
            origin: 'Hound Point, North Sea',
            destination: 'Fos-sur-Mer, France',
            blDay: 32,
            pricingDays: 5,
            pricingType: 'around',
        },
        curve: {
            basePrice: 85.00,
            monthSpread: -0.45, // Backwardation
            months: 5,
            volatility: 0.70,
            monthLabels: ['Mar', 'Apr', 'May', 'Jun', 'Jul'],
        },
        monthBoundaries: {
            'Mar': [1, 22],
            'Apr': [23, 44],
            'May': [45, 66],
            'Jun': [67, 88],
            'Jul': [89, 110],
        },
        events: [
            {
                triggerDay: 14,
                headline: 'Refinery outage at Fos-sur-Mer — buyer requests 4-day delay',
                detail: 'A catalyst replacement at the refinery delays your delivery window. Mutual agreement to shift BL.',
                blShiftDays: 4,
                icon: '🏭',
            },
        ],
        totalDays: 48,
        hedgeDirection: 1, // Player should BUY futures (long hedge)
        correctMonth: 'Apr',
        correctLots: 400,
        scoring: {
            lotsWeight: 0.20,
            monthWeight: 0.20,
            directionWeight: 0.25,
            rollWeight: 0.15,
            effectivenessWeight: 0.20,
        },
    },

    // ─── SCENARIO 7: Contango Carry ─────────────────────────────
    {
        id: 'cargo-7',
        name: 'Contango Carry',
        difficulty: 'Hard',
        hedgePosition: 'long',
        description: 'A steep contango market where storage economics matter. Your cargo faces multiple delays pushing you deeper into contango.',
        objective: 'Navigate aggressive contango with compounding roll costs. Every delay means paying more to roll forward.',
        keyLessons: [
            'Contango steepness directly impacts roll costs',
            'Multiple rolls in contango compound losses — each roll eats P&L',
            'Sometimes it\'s cheaper to accept the wrong month than pay the roll spread',
        ],
        cargo: {
            grade: 'Brent Crude (Oseberg)',
            volume: 800000,
            origin: 'Sture, Norway',
            destination: 'Ningbo, China',
            blDay: 35,
            pricingDays: 5,
            pricingType: 'around',
        },
        curve: {
            basePrice: 72.00,
            monthSpread: 1.10, // Very steep contango — expensive rolls
            months: 6,
            volatility: 0.95,
            monthLabels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        },
        monthBoundaries: {
            'May': [1, 20],
            'Jun': [21, 42],
            'Jul': [43, 63],
            'Aug': [64, 84],
            'Sep': [85, 105],
            'Oct': [106, 126],
        },
        events: [
            {
                triggerDay: 10,
                headline: 'Suez Canal transit delay — vessel rerouted via Cape of Good Hope',
                detail: 'Security concerns in the Red Sea force a longer route. Loading delayed 6 days while replacement vessel is sourced.',
                blShiftDays: 6,
                icon: '🚢',
            },
            {
                triggerDay: 30,
                headline: 'Berthing congestion at Ningbo — discharge window pushed back 5 days',
                detail: 'Typhoon season backlog at Ningbo port. Your discharge slot moves back 5 days.',
                blShiftDays: 5,
                icon: '🌀',
            },
        ],
        totalDays: 65,
        hedgeDirection: -1,
        correctMonth: 'Jun',
        correctLots: 800,
        scoring: {
            lotsWeight: 0.10,
            monthWeight: 0.10,
            directionWeight: 0.10,
            rollWeight: 0.40,
            effectivenessWeight: 0.30,
        },
    },

    // ─── SCENARIO 8: The Perfect Storm ──────────────────────────
    {
        id: 'cargo-8',
        name: 'The Perfect Storm',
        difficulty: 'Very Hard',
        hedgePosition: 'short', // Sold cargo → buy futures
        description: 'You\'ve sold a cargo in a volatile market. Multiple BL shifts and a curve that flips from contango to backwardation.',
        objective: 'Buy futures to hedge a sold cargo through extreme volatility, managing rolls as the curve structure changes entirely.',
        keyLessons: [
            'Market structure can flip — contango today, backwardation tomorrow',
            'When the curve flips, roll economics reverse completely',
            'High volatility means large swings in unrealized P&L — stay disciplined',
        ],
        cargo: {
            grade: 'Brent Crude (BFOET Basket)',
            volume: 600000,
            origin: 'Mongstad, Norway',
            destination: 'Mailiao, Taiwan',
            blDay: 38,
            pricingDays: 5,
            pricingType: 'around',
        },
        curve: {
            basePrice: 90.00,
            monthSpread: 0.40, // Starts contango, but high vol will flip it
            months: 6,
            volatility: 1.40, // Very high — curve will swing dramatically
            monthLabels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
        },
        monthBoundaries: {
            'Jun': [1, 20],
            'Jul': [21, 42],
            'Aug': [43, 63],
            'Sep': [64, 84],
            'Oct': [85, 105],
            'Nov': [106, 126],
        },
        events: [
            {
                triggerDay: 8,
                headline: 'OPEC+ emergency meeting — production cut announced',
                detail: 'Unexpected 1.5 mmbbl/d production cut announced. Market volatility spikes and curve structure shifts.',
                blShiftDays: 3,
                icon: '🛢️',
            },
            {
                triggerDay: 22,
                headline: 'Terminal fire at Mongstad — loading operations suspended',
                detail: 'A fire in the loading arm area halts all operations. Repairs expected to take 7 days.',
                blShiftDays: 7,
                icon: '🔥',
            },
            {
                triggerDay: 38,
                headline: 'Typhoon warning — Taiwan ports closed for 3 days',
                detail: 'Super Typhoon approaching Mailiao. All port operations suspended until storm passes.',
                blShiftDays: 3,
                icon: '🌊',
            },
        ],
        totalDays: 70,
        hedgeDirection: 1, // BUY futures (short physical)
        correctMonth: 'Jul',
        correctLots: 600,
        scoring: {
            lotsWeight: 0.05,
            monthWeight: 0.10,
            directionWeight: 0.10,
            rollWeight: 0.40,
            effectivenessWeight: 0.35,
        },
    },
];

export function getCargoScenarioById(id) {
    return cargoScenarios.find(s => s.id === id);
}

export default cargoScenarios;
