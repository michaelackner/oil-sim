// ─── 6-Dimension Competency Scoring Framework ──────────────────────
// Dimensions: Understanding, Execution, Organisation, Strategic, Analytical, (Interpersonal placeholder)
// Each dimension scored 1–5. Weighted composite gives overall %.

const DIMENSION_WEIGHTS = {
    understanding: 0.20,
    execution: 0.15,
    organisation: 0.15,
    interpersonal: 0.10,
    strategic: 0.20,
    analytical: 0.20,
};

// ── Helpers ──
function clamp(v, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, v)); }
function lerp(v, lo, hi) { return clamp((v - lo) / (hi - lo)); }
function score1to5(pct) { return Math.round(1 + clamp(pct) * 4); }

function calculateTradePnLs(trades, priceHistory) {
    const pnls = [];
    for (let i = 0; i < trades.length; i++) {
        const trade = trades[i];
        const futurePrice = i < trades.length - 1
            ? trades[i + 1].price
            : (priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].price : trade.price);
        const direction = trade.side === 'buy' ? 1 : -1;
        pnls.push(direction * (futurePrice - trade.price) * trade.lots * 1000);
    }
    return pnls;
}

function calculateSharpe(trades, priceHistory) {
    if (trades.length < 2) return 0;
    const pnls = calculateTradePnLs(trades, priceHistory);
    const mean = pnls.reduce((a, b) => a + b, 0) / pnls.length;
    const variance = pnls.reduce((s, p) => s + (p - mean) ** 2, 0) / pnls.length;
    const std = Math.sqrt(variance);
    if (std === 0) return 0;
    return (mean / std) * Math.sqrt(252);
}

// ── 1. UNDERSTANDING ──
// Did the player trade in the right direction after real events?
function scoreUnderstanding(trades, newsItems) {
    const impactEvents = newsItems.filter(n => !n.isNoise && n.impact && n.impact.direction !== 0);
    if (impactEvents.length === 0) return { score: 3, details: { correct: 0, total: 0, accuracy: 0 } };

    let correct = 0;
    let responded = 0;

    for (const event of impactEvents) {
        const nextTrade = trades.find(t => t.tick > event.tick && t.tick < event.tick + 15);
        if (!nextTrade) continue;
        responded++;
        const tradeDir = nextTrade.side === 'buy' ? 1 : -1;
        if (tradeDir === event.impact.direction) correct++;
    }

    const accuracy = responded > 0 ? correct / responded : 0;
    // Also penalise for missing events entirely
    const responseRate = impactEvents.length > 0 ? responded / impactEvents.length : 0;
    const combined = accuracy * 0.7 + responseRate * 0.3;

    return {
        score: score1to5(combined),
        details: {
            correct,
            total: impactEvents.length,
            responded,
            accuracy: Math.round(accuracy * 100),
            responseRate: Math.round(responseRate * 100),
        },
    };
}

// ── 2. EXECUTION ──
// Reaction speed + position sizing appropriateness
function scoreExecution(trades, newsItems, priceHistory) {
    const impactEvents = newsItems.filter(n => !n.isNoise && n.impact);
    if (trades.length === 0) return { score: 1, details: { avgReaction: 'N/A', sizingConsistency: 0 } };

    // Reaction time (lower = better, perfect = 1-2 ticks)
    const reactionTimes = impactEvents.map(event => {
        const next = trades.find(t => t.tick > event.tick && t.tick < event.tick + 20);
        return next ? next.tick - event.tick : null;
    }).filter(Boolean);

    const avgReaction = reactionTimes.length > 0
        ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
        : 15;
    const reactionScore = lerp(15 - avgReaction, 0, 12); // 3 ticks = perfect

    // Sizing consistency: variance of lot sizes (lower variance = more disciplined)
    const lotSizes = trades.map(t => t.lots);
    const avgLots = lotSizes.reduce((a, b) => a + b, 0) / lotSizes.length;
    const sizeVariance = lotSizes.reduce((s, l) => s + (l - avgLots) ** 2, 0) / lotSizes.length;
    const coeffVariation = avgLots > 0 ? Math.sqrt(sizeVariance) / avgLots : 1;
    // Some variation is good (conviction sizing), too much = erratic
    const sizingScore = lerp(1.5 - coeffVariation, 0, 1.2);

    const combined = reactionScore * 0.6 + sizingScore * 0.4;

    return {
        score: score1to5(combined),
        details: {
            avgReaction: reactionTimes.length > 0 ? Math.round(avgReaction * 10) / 10 : 'N/A',
            sizingConsistency: Math.round(sizingScore * 100),
        },
    };
}

// ── 3. ORGANISATION ──
// Risk management: drawdown control, VAR adherence, position concentration
function scoreOrganisation(gameState) {
    const { trades, maxDrawdown, varBreaches, realisedPnL, unrealisedPnL, priceHistory, position } = gameState;
    const totalPnL = realisedPnL + unrealisedPnL;

    // Drawdown severity (relative to peak P&L or starting capital)
    const drawdownPct = Math.abs(maxDrawdown) / (Math.max(Math.abs(totalPnL), 10000) + 10000);
    const drawdownScore = lerp(1 - drawdownPct, 0, 1);

    // VAR breaches (0 = perfect)
    const varScore = clamp(1 - (varBreaches || 0) * 0.25);

    // Drawdown recovery: after losing trades, did they reduce size?
    let recoveryScore = 0.5;
    if (trades.length >= 4) {
        const pnls = calculateTradePnLs(trades, priceHistory);
        let goodRecoveries = 0;
        let totalRecoveries = 0;
        for (let i = 2; i < trades.length; i++) {
            if (pnls[i - 1] < 0 && pnls[i - 2] < 0) {
                totalRecoveries++;
                if (trades[i].lots <= trades[i - 1].lots) goodRecoveries++;
            }
        }
        if (totalRecoveries > 0) recoveryScore = clamp(goodRecoveries / totalRecoveries);
    }

    // End-of-game position: did they flatten near the end?
    const flatAtEnd = position === 0 ? 1 : 0.3;

    const combined = drawdownScore * 0.35 + varScore * 0.25 + recoveryScore * 0.2 + flatAtEnd * 0.2;

    return {
        score: score1to5(combined),
        details: {
            drawdownScore: Math.round(drawdownScore * 100),
            varBreaches: varBreaches || 0,
            flatAtEnd: position === 0,
        },
    };
}

// ── 4. INTERPERSONAL ──
// In solo simulation, scored based on event popup interactions (did they engage with strategy annotations?)
function scoreInterpersonal(gameState) {
    // Proxy: did the player read/engage with all event popups? Did they trade DURING the popup (shows engagement)?
    const { newsItems, trades } = gameState;
    const impactEvents = newsItems.filter(n => !n.isNoise && n.impact);
    if (impactEvents.length === 0) return { score: 3, details: { engagement: 'N/A' } };

    // Players who trade near event popups are engaging with the content
    let engaged = 0;
    for (const event of impactEvents) {
        const nearbyTrade = trades.find(t => t.tick >= event.tick && t.tick <= event.tick + 20);
        if (nearbyTrade) engaged++;
    }
    const engagementRate = engaged / impactEvents.length;
    // Moderate engagement is best — too little = not participating, but we can't fully assess without multiplayer
    const adjusted = Math.min(engagementRate * 1.3, 1);

    return {
        score: score1to5(adjusted * 0.7 + 0.3), // floor of 3 since solo
        details: { engagement: Math.round(engagementRate * 100) },
    };
}

// ── 5. STRATEGIC ──
// Holding period, spread awareness, end-game management
function scoreStrategic(trades, priceHistory, totalTicks) {
    if (trades.length < 2) return { score: 1, details: { avgHolding: 0, endGameRisk: 'N/A' } };

    // Average holding period (longer = more strategic, up to a point)
    const holdingPeriods = [];
    for (let i = 1; i < trades.length; i++) {
        holdingPeriods.push(trades[i].tick - trades[i - 1].tick);
    }
    const avgHolding = holdingPeriods.reduce((a, b) => a + b, 0) / holdingPeriods.length;
    // Ideal holding is 15-40 ticks (not scalping, not ignoring)
    const holdScore = avgHolding < 5 ? 0.2 : avgHolding < 15 ? 0.5 : avgHolding < 50 ? 1.0 : 0.7;

    // Regime adaptation: did sizing change after major price shifts?
    let adaptationScore = 0.5;
    if (priceHistory.length > 50 && trades.length > 3) {
        const midPoint = Math.floor(priceHistory.length / 2);
        const firstHalfVol = calcVolatility(priceHistory.slice(0, midPoint));
        const secondHalfVol = calcVolatility(priceHistory.slice(midPoint));
        const volChange = Math.abs(secondHalfVol - firstHalfVol) / Math.max(firstHalfVol, 0.001);

        if (volChange > 0.3) {
            // Vol changed significantly — check if sizing adapted
            const midTrade = Math.floor(trades.length / 2);
            const firstAvgSize = trades.slice(0, midTrade).reduce((s, t) => s + t.lots, 0) / midTrade;
            const secondAvgSize = trades.slice(midTrade).reduce((s, t) => s + t.lots, 0) / Math.max(trades.length - midTrade, 1);
            // Size should decrease when vol increases
            if (secondHalfVol > firstHalfVol && secondAvgSize < firstAvgSize) adaptationScore = 0.9;
            else if (secondHalfVol < firstHalfVol && secondAvgSize > firstAvgSize) adaptationScore = 0.8;
        }
    }

    // End-game awareness: do they reduce risk in final 20% of scenario?
    const lastQuarterTick = totalTicks * 0.8;
    const lastQuarterTrades = trades.filter(t => t.tick > lastQuarterTick);
    const earlyTrades = trades.filter(t => t.tick <= lastQuarterTick);
    let endGameScore = 0.5;
    if (lastQuarterTrades.length > 0 && earlyTrades.length > 0) {
        const lastAvgSize = lastQuarterTrades.reduce((s, t) => s + t.lots, 0) / lastQuarterTrades.length;
        const earlyAvgSize = earlyTrades.reduce((s, t) => s + t.lots, 0) / earlyTrades.length;
        if (lastAvgSize <= earlyAvgSize) endGameScore = 0.8;
    }

    const combined = holdScore * 0.4 + adaptationScore * 0.3 + endGameScore * 0.3;

    return {
        score: score1to5(combined),
        details: {
            avgHolding: Math.round(avgHolding),
            adaptationScore: Math.round(adaptationScore * 100),
            endGameScore: Math.round(endGameScore * 100),
        },
    };
}

function calcVolatility(priceHistory) {
    if (priceHistory.length < 2) return 0;
    const returns = [];
    for (let i = 1; i < priceHistory.length; i++) {
        returns.push(Math.abs(priceHistory[i].price - priceHistory[i - 1].price) / priceHistory[i - 1].price);
    }
    return returns.reduce((a, b) => a + b, 0) / returns.length;
}

// ── 6. ANALYTICAL ──
// P&L quality, pattern learning, self-awareness (proxied by consistency improvement)
function scoreAnalytical(trades, priceHistory, newsItems) {
    if (trades.length < 2) return { score: 1, details: { sharpe: 0, learningCurve: 'N/A' } };

    // Sharpe ratio quality
    const sharpe = calculateSharpe(trades, priceHistory);
    const sharpeScore = lerp(sharpe, -0.5, 2.5);

    // Learning curve: do responses to similar events improve?
    const impactEvents = newsItems.filter(n => !n.isNoise && n.impact && n.impact.direction !== 0);
    let learningScore = 0.5;
    if (impactEvents.length >= 3) {
        const errors = impactEvents.map(event => {
            const next = trades.find(t => t.tick > event.tick && t.tick < event.tick + 15);
            if (!next) return 1; // missed = max error
            const dir = next.side === 'buy' ? 1 : -1;
            return dir === event.impact.direction ? 0 : 1;
        });
        // Check if errors decrease over time
        const firstHalf = errors.slice(0, Math.ceil(errors.length / 2));
        const secondHalf = errors.slice(Math.ceil(errors.length / 2));
        const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
        const secondAvg = secondHalf.length > 0 ? secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length : firstAvg;
        if (secondAvg < firstAvg) learningScore = 0.9;
        else if (secondAvg === firstAvg) learningScore = 0.5;
        else learningScore = 0.2;
    }

    // Win rate quality
    const pnls = calculateTradePnLs(trades, priceHistory);
    const wins = pnls.filter(p => p > 0).length;
    const winRate = pnls.length > 0 ? wins / pnls.length : 0;
    const winRateScore = lerp(winRate, 0.3, 0.7);

    const combined = sharpeScore * 0.4 + learningScore * 0.3 + winRateScore * 0.3;

    return {
        score: score1to5(combined),
        details: {
            sharpe: Math.round(sharpe * 100) / 100,
            learningCurve: Math.round(learningScore * 100),
            winRate: Math.round(winRate * 100),
        },
    };
}

// ── MAIN ──
export function calculateScore(gameState) {
    const { trades, realisedPnL, unrealisedPnL, maxDrawdown, priceHistory, newsItems, varBreaches } = gameState;
    const totalTicks = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1].tick : 300;

    const totalPnL = realisedPnL + unrealisedPnL;
    const totalTrades = trades.length;
    const pnls = calculateTradePnLs(trades, priceHistory);
    const winRate = totalTrades > 0 ? pnls.filter(p => p > 0).length / totalTrades : 0;
    const sharpe = calculateSharpe(trades, priceHistory);

    // Calculate impact event response metrics (legacy compat)
    const impactEvents = newsItems.filter(n => !n.isNoise && n.impact);
    const reactionTimes = impactEvents.map(event => {
        const next = trades.find(t => t.tick > event.tick && t.tick < event.tick + 15);
        return next ? next.tick - event.tick : null;
    }).filter(Boolean);
    const avgReactionTicks = reactionTimes.length > 0
        ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length
        : Infinity;
    const correctDirs = impactEvents.map(event => {
        const next = trades.find(t => t.tick > event.tick && t.tick < event.tick + 15);
        if (!next) return null;
        return (next.side === 'buy' ? 1 : -1) === event.impact.direction ? 1 : 0;
    }).filter(x => x !== null);
    const directionAccuracy = correctDirs.length > 0 ? correctDirs.reduce((a, b) => a + b, 0) / correctDirs.length : 0;

    // ── Dimension scores ──
    const understanding = scoreUnderstanding(trades, newsItems);
    const execution = scoreExecution(trades, newsItems, priceHistory);
    const organisation = scoreOrganisation(gameState);
    const interpersonal = scoreInterpersonal(gameState);
    const strategic = scoreStrategic(trades, priceHistory, totalTicks);
    const analytical = scoreAnalytical(trades, priceHistory, newsItems);

    const dimensions = {
        understanding,
        execution,
        organisation,
        interpersonal,
        strategic,
        analytical,
    };

    // Weighted composite (0–100)
    const compositeScore = Math.round(
        (understanding.score * DIMENSION_WEIGHTS.understanding +
            execution.score * DIMENSION_WEIGHTS.execution +
            organisation.score * DIMENSION_WEIGHTS.organisation +
            interpersonal.score * DIMENSION_WEIGHTS.interpersonal +
            strategic.score * DIMENSION_WEIGHTS.strategic +
            analytical.score * DIMENSION_WEIGHTS.analytical) / 5 * 100
    );

    // Letter grade from composite
    const grade = compositeScore >= 85 ? 'A' : compositeScore >= 70 ? 'B' : compositeScore >= 55 ? 'C' : compositeScore >= 40 ? 'D' : 'F';

    return {
        // Composite
        compositeScore,
        grade,
        dimensions,

        // Legacy flat metrics (backward compat)
        totalPnL: Math.round(totalPnL),
        realisedPnL: Math.round(realisedPnL),
        unrealisedPnL: Math.round(unrealisedPnL),
        sharpeRatio: Math.round(sharpe * 100) / 100,
        winRate: Math.round(winRate * 1000) / 10,
        totalTrades,
        avgReactionTicks: avgReactionTicks === Infinity ? 'N/A' : Math.round(avgReactionTicks * 10) / 10,
        directionAccuracy: Math.round(directionAccuracy * 1000) / 10,
        maxDrawdown: Math.round(maxDrawdown),
        varBreaches: varBreaches || 0,
    };
}
