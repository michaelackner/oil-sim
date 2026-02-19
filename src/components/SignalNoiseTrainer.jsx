import { useState, useCallback, useMemo, useEffect } from 'react';
import { TRICK_CATEGORIES, getTrainingSet } from '../engine/headlineBank.js';

/**
 * Signal vs Noise Training Module
 *
 * A quiz-like drill where the player reads headlines and classifies them
 * as Signal (will move price) or Noise (no impact).
 * If they choose Signal, they must also choose direction (Bullish / Bearish).
 */
export default function SignalNoiseTrainer({ onBack }) {
    const [difficulty, setDifficulty] = useState(null);   // null = picker, 1-3 = training
    const [headlines, setHeadlines] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [phase, setPhase] = useState('classify');         // 'classify' | 'direction' | 'feedback'
    const [answer, setAnswer] = useState(null);             // { isSignal, direction }
    const [results, setResults] = useState([]);             // { correct, trickCategory, ... }
    const [showSummary, setShowSummary] = useState(false);
    const [streak, setStreak] = useState(0);
    const [bestStreak, setBestStreak] = useState(0);

    const startTraining = useCallback((diff) => {
        const count = diff === 1 ? 15 : diff === 2 ? 20 : 25;
        setHeadlines(getTrainingSet({ count, difficulty: diff }));
        setDifficulty(diff);
        setCurrentIndex(0);
        setPhase('classify');
        setAnswer(null);
        setResults([]);
        setShowSummary(false);
        setStreak(0);
        setBestStreak(0);
    }, []);

    const current = headlines[currentIndex];

    // Handle keyboard shortcuts
    useEffect(() => {
        if (!current || showSummary) return;

        const handleKey = (e) => {
            if (phase === 'classify') {
                if (e.key === 's' || e.key === 'S') handleClassify(true);
                if (e.key === 'n' || e.key === 'N') handleClassify(false);
            } else if (phase === 'direction') {
                if (e.key === 'b' || e.key === 'B') handleDirection(1);
                if (e.key === 's' || e.key === 'S') handleDirection(-1);
            } else if (phase === 'feedback') {
                if (e.key === 'Enter' || e.key === ' ') handleNext();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    });

    const handleClassify = useCallback((isSignal) => {
        if (isSignal) {
            setAnswer({ isSignal: true, direction: null });
            setPhase('direction');
        } else {
            // Classified as noise — check immediately
            const correct = !current.isSignal;
            const result = {
                headline: current.headline,
                correct,
                playerSaidSignal: false,
                playerDirection: 0,
                actualIsSignal: current.isSignal,
                actualDirection: current.direction,
                trickCategory: current.trickCategory,
                explanation: current.explanation,
                difficulty: current.difficulty,
            };
            setAnswer({ isSignal: false, direction: 0 });
            setResults(prev => [...prev, result]);
            if (correct) {
                setStreak(s => {
                    const next = s + 1;
                    setBestStreak(b => Math.max(b, next));
                    return next;
                });
            } else {
                setStreak(0);
            }
            setPhase('feedback');
        }
    }, [current]);

    const handleDirection = useCallback((dir) => {
        const correct = current.isSignal && dir === current.direction;
        const result = {
            headline: current.headline,
            correct,
            playerSaidSignal: true,
            playerDirection: dir,
            actualIsSignal: current.isSignal,
            actualDirection: current.direction,
            trickCategory: current.trickCategory,
            explanation: current.explanation,
            difficulty: current.difficulty,
        };
        setAnswer(prev => ({ ...prev, direction: dir }));
        setResults(prev => [...prev, result]);
        if (correct) {
            setStreak(s => {
                const next = s + 1;
                setBestStreak(b => Math.max(b, next));
                return next;
            });
        } else {
            setStreak(0);
        }
        setPhase('feedback');
    }, [current]);

    const handleNext = useCallback(() => {
        if (currentIndex + 1 >= headlines.length) {
            setShowSummary(true);
        } else {
            setCurrentIndex(i => i + 1);
            setPhase('classify');
            setAnswer(null);
        }
    }, [currentIndex, headlines.length]);

    // Compute stats
    const stats = useMemo(() => {
        if (results.length === 0) return null;
        const correct = results.filter(r => r.correct).length;
        const total = results.length;
        const pct = Math.round((correct / total) * 100);

        // By trick category
        const byCat = {};
        results.forEach(r => {
            if (!byCat[r.trickCategory]) byCat[r.trickCategory] = { correct: 0, total: 0 };
            byCat[r.trickCategory].total++;
            if (r.correct) byCat[r.trickCategory].correct++;
        });

        // Worst categories
        const catEntries = Object.entries(byCat)
            .map(([key, v]) => ({ key, ...v, pct: Math.round((v.correct / v.total) * 100) }))
            .sort((a, b) => a.pct - b.pct);

        // By difficulty
        const byDiff = { 1: { correct: 0, total: 0 }, 2: { correct: 0, total: 0 }, 3: { correct: 0, total: 0 } };
        results.forEach(r => {
            byDiff[r.difficulty].total++;
            if (r.correct) byDiff[r.difficulty].correct++;
        });

        return { correct, total, pct, byCat: catEntries, byDiff, bestStreak };
    }, [results, bestStreak]);

    // === DIFFICULTY PICKER ===
    if (difficulty === null) {
        return (
            <div className="snt-container">
                <div className="snt-header">
                    <button className="snt-back-btn" onClick={onBack}>← Back to Menu</button>
                    <h1 className="snt-title">🎯 Signal vs. Noise</h1>
                    <p className="snt-subtitle">
                        Can you tell real market-moving events from noise?<br />
                        The simulator's news feed mixes genuine signals with tricks designed to make you overtrade.
                    </p>
                </div>

                <div className="snt-trick-overview">
                    <h2>The 7 Tricks That Catch Traders</h2>
                    <div className="snt-trick-grid">
                        {Object.entries(TRICK_CATEGORIES).filter(([k]) => k !== 'REAL_SIGNAL').map(([key, cat]) => (
                            <div key={key} className="snt-trick-card">
                                <div className="snt-trick-icon">{cat.icon}</div>
                                <div className="snt-trick-name">{cat.name}</div>
                                <div className="snt-trick-desc">{cat.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="snt-difficulty-section">
                    <h2>Choose Difficulty</h2>
                    <div className="snt-diff-cards">
                        <div className="snt-diff-card easy" onClick={() => startTraining(1)}>
                            <div className="snt-diff-level">🟢 Easy</div>
                            <div className="snt-diff-detail">15 headlines · Easy-to-spot noise</div>
                            <div className="snt-diff-hint">Good for learning the categories</div>
                        </div>
                        <div className="snt-diff-card medium" onClick={() => startTraining(2)}>
                            <div className="snt-diff-level">🟡 Medium</div>
                            <div className="snt-diff-detail">20 headlines · Ambiguous data releases</div>
                            <div className="snt-diff-hint">Tests magnitude awareness and consensus</div>
                        </div>
                        <div className="snt-diff-card hard" onClick={() => startTraining(3)}>
                            <div className="snt-diff-level">🔴 Hard</div>
                            <div className="snt-diff-detail">25 headlines · Counterintuitive traps</div>
                            <div className="snt-diff-hint">Includes 2nd-order effects and stale info</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // === SUMMARY SCREEN ===
    if (showSummary && stats) {
        const grade = stats.pct >= 90 ? 'A+' : stats.pct >= 80 ? 'A' : stats.pct >= 70 ? 'B' : stats.pct >= 60 ? 'C' : stats.pct >= 50 ? 'D' : 'F';
        const gradeClass = stats.pct >= 80 ? 'grade-a' : stats.pct >= 60 ? 'grade-b' : 'grade-f';

        return (
            <div className="snt-container">
                <div className="snt-summary">
                    <h1 className="snt-summary-title">Training Complete</h1>

                    <div className={`snt-grade-circle ${gradeClass}`}>
                        <span className="snt-grade-letter">{grade}</span>
                        <span className="snt-grade-pct">{stats.pct}%</span>
                    </div>

                    <div className="snt-summary-stats">
                        <div className="snt-summary-stat">
                            <span className="snt-ss-label">Correct</span>
                            <span className="snt-ss-value">{stats.correct} / {stats.total}</span>
                        </div>
                        <div className="snt-summary-stat">
                            <span className="snt-ss-label">Best Streak</span>
                            <span className="snt-ss-value">{stats.bestStreak} 🔥</span>
                        </div>
                    </div>

                    {/* Performance by trick category */}
                    <div className="snt-cat-breakdown">
                        <h3>Performance by Trick Type</h3>
                        {stats.byCat.map(cat => {
                            const catInfo = TRICK_CATEGORIES[cat.key];
                            const barPct = cat.total > 0 ? cat.pct : 0;
                            const barClass = barPct >= 80 ? 'bar-good' : barPct >= 50 ? 'bar-mid' : 'bar-bad';
                            return (
                                <div key={cat.key} className="snt-cat-row">
                                    <div className="snt-cat-info">
                                        <span>{catInfo?.icon} {catInfo?.name || cat.key}</span>
                                        <span>{cat.correct}/{cat.total} ({cat.pct}%)</span>
                                    </div>
                                    <div className="snt-cat-bar-bg">
                                        <div className={`snt-cat-bar-fill ${barClass}`} style={{ width: `${barPct}%` }} />
                                    </div>
                                    {cat.pct < 60 && catInfo && (
                                        <div className="snt-cat-lesson">💡 {catInfo.lesson}</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Missed headlines review */}
                    {results.filter(r => !r.correct).length > 0 && (
                        <div className="snt-missed-section">
                            <h3>Headlines You Missed</h3>
                            {results.filter(r => !r.correct).map((r, i) => (
                                <div key={i} className="snt-missed-item">
                                    <div className="snt-missed-headline">{r.headline}</div>
                                    <div className="snt-missed-answer">
                                        Correct: {r.actualIsSignal ? `⚡ SIGNAL (${r.actualDirection > 0 ? '▲ Bullish' : '▼ Bearish'})` : '❌ NOISE'}
                                    </div>
                                    <div className="snt-missed-explanation">{r.explanation}</div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="snt-summary-actions">
                        <button className="snt-btn primary" onClick={() => startTraining(difficulty)}>
                            🔄 Try Again
                        </button>
                        <button className="snt-btn secondary" onClick={() => setDifficulty(null)}>
                            Change Difficulty
                        </button>
                        <button className="snt-btn tertiary" onClick={onBack}>
                            ← Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!current) return null;

    // === TRAINING FLOW ===
    const isCorrect = results[currentIndex]?.correct;
    const catInfo = TRICK_CATEGORIES[current.trickCategory];
    const progress = ((currentIndex + 1) / headlines.length) * 100;

    return (
        <div className="snt-container">
            {/* Progress bar */}
            <div className="snt-progress-bar-bg">
                <div className="snt-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="snt-top-bar">
                <span className="snt-counter">{currentIndex + 1} / {headlines.length}</span>
                <span className="snt-streak-badge">
                    {streak > 0 ? `🔥 ${streak} streak` : ''}
                </span>
                <span className="snt-score-badge">
                    {results.filter(r => r.correct).length} / {results.length} correct
                </span>
            </div>

            {/* Headline Card */}
            <div className={`snt-headline-card ${phase === 'feedback' ? (isCorrect ? 'correct' : 'incorrect') : ''}`}>
                <div className="snt-headline-text">{current.headline}</div>
                <div className="snt-headline-detail">{current.detail}</div>
                {current.difficulty === 3 && <span className="snt-hard-badge">⚠ HARD</span>}
            </div>

            {/* === CLASSIFY PHASE === */}
            {phase === 'classify' && (
                <div className="snt-action-section">
                    <div className="snt-action-prompt">Will this headline move crude oil prices?</div>
                    <div className="snt-action-buttons">
                        <button className="snt-btn signal-btn" onClick={() => handleClassify(true)}>
                            <span className="snt-btn-icon">⚡</span>
                            <span className="snt-btn-label">SIGNAL</span>
                            <span className="snt-btn-hint">Press S</span>
                        </button>
                        <button className="snt-btn noise-btn" onClick={() => handleClassify(false)}>
                            <span className="snt-btn-icon">🔇</span>
                            <span className="snt-btn-label">NOISE</span>
                            <span className="snt-btn-hint">Press N</span>
                        </button>
                    </div>
                </div>
            )}

            {/* === DIRECTION PHASE === */}
            {phase === 'direction' && (
                <div className="snt-action-section">
                    <div className="snt-action-prompt">Which direction will it push prices?</div>
                    <div className="snt-action-buttons">
                        <button className="snt-btn bull-btn" onClick={() => handleDirection(1)}>
                            <span className="snt-btn-icon">▲</span>
                            <span className="snt-btn-label">BULLISH</span>
                            <span className="snt-btn-hint">Press B</span>
                        </button>
                        <button className="snt-btn bear-btn" onClick={() => handleDirection(-1)}>
                            <span className="snt-btn-icon">▼</span>
                            <span className="snt-btn-label">BEARISH</span>
                            <span className="snt-btn-hint">Press S</span>
                        </button>
                    </div>
                </div>
            )}

            {/* === FEEDBACK PHASE === */}
            {phase === 'feedback' && (
                <div className="snt-feedback-section">
                    {/* Result banner */}
                    <div className={`snt-result-banner ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? '✅ CORRECT' : '❌ WRONG'}
                    </div>

                    {/* Correct answer */}
                    <div className="snt-correct-answer">
                        <span className="snt-ca-label">Correct Answer:</span>
                        <span className={`snt-ca-value ${current.isSignal ? 'signal' : 'noise'}`}>
                            {current.isSignal
                                ? `⚡ SIGNAL — ${current.direction > 0 ? '▲ BULLISH' : '▼ BEARISH'}`
                                : '🔇 NOISE — No meaningful impact'
                            }
                        </span>
                    </div>

                    {/* Your answer */}
                    <div className="snt-your-answer">
                        <span className="snt-ya-label">Your Answer:</span>
                        <span className="snt-ya-value">
                            {answer.isSignal
                                ? `⚡ SIGNAL — ${answer.direction > 0 ? '▲ BULLISH' : '▼ BEARISH'}`
                                : '🔇 NOISE'
                            }
                        </span>
                    </div>

                    {/* Trick category */}
                    <div className="snt-trick-reveal">
                        <div className="snt-trick-tag">
                            <span>{catInfo?.icon}</span>
                            <span>{catInfo?.name}</span>
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="snt-explanation">
                        {current.explanation}
                    </div>

                    {/* Lesson */}
                    <div className="snt-lesson">
                        <span className="snt-lesson-label">💡 KEY LESSON</span>
                        <span className="snt-lesson-text">{catInfo?.lesson}</span>
                    </div>

                    <button className="snt-btn primary next-btn" onClick={handleNext}>
                        {currentIndex + 1 >= headlines.length ? '📊 See Results' : 'Next Headline →'}
                        <span className="snt-btn-hint">Press Enter</span>
                    </button>
                </div>
            )}
        </div>
    );
}
