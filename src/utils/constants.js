// Trading constants
export const LOT_SIZE = 1000;           // barrels per lot
export const TICK_VALUE = 10;           // $ per lot per $0.01 move
export const VAR_LIMIT = 50000;         // max VAR in dollars
export const DAILY_VOL_PCT = 0.02;      // ~2% daily vol for VAR calc
export const SPREAD_CENTS = 4;          // bid-ask spread in cents

// Simulation constants
export const TICKS_PER_ROUND = 300;     // ticks per simulation round
export const BASE_TICK_INTERVAL_MS = 500; // base speed (1x)
export const SPEED_MULTIPLIERS = {
    1: 1,
    2: 0.5,
    5: 0.2,
};

// Scoring weights
export const SCORING_WEIGHTS = {
    pnl: 0.30,
    sharpe: 0.20,
    directionAccuracy: 0.25,
    reactionSpeed: 0.15,
    riskDiscipline: 0.10,
};

// Price engine config
export const PRICE_CONFIG = {
    annualisedVol: 0.25,
    meanReversionSpeed: 0.02,
    minPrice: 20.00,
    maxPrice: 200.00,
    ticksPerDay: 100,
};

// Chart candle aggregation
export const TICKS_PER_CANDLE = 5;
