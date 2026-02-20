import { useState, useMemo } from 'react';
import { scenarios } from '../engine/scenarios/index.js';
import useGameStore from '../state/gameStore.js';
import useCareerStore, { LEVELS } from '../state/careerStore.js';
import CareerDashboard from './CareerDashboard.jsx';
import SettingsModal from './SettingsModal.jsx';
import { generateDailyScenario } from '../engine/scenarioGenerator.js';

export default function ScenarioMenu({ onTutorial, onGuide, onTrainer, onCargoGame, onFuturesGame, onCrackGame }) {
    const startGame = useGameStore(s => s.startGame);
    const { xp, level, title, bankroll, dailyChallenge } = useCareerStore();
    const [selectedScenario, setSelectedScenario] = useState(null);
    const [showCareer, setShowCareer] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    // Progression logic
    const nextLevel = LEVELS.find(l => l.level === level + 1);
    const currentLevel = LEVELS.find(l => l.level === level) || LEVELS[0];
    const prevXP = currentLevel.xp;
    const nextXP = nextLevel ? nextLevel.xp : xp;
    const progress = nextLevel ? ((xp - prevXP) / (nextXP - prevXP)) * 100 : 100;

    // Daily Challenge
    const dailyScenario = useMemo(() => generateDailyScenario(), []);
    const isDailyCompleted = dailyChallenge && dailyChallenge.lastDate === dailyScenario.dateString && dailyChallenge.completed;

    const getDifficultyClass = (diff) => {
        const d = diff.toLowerCase().replace(' ', '-');
        if (d === 'medium') return 'medium';
        if (d === 'medium-hard') return 'medium-hard';
        if (d === 'hard') return 'hard';
        if (d === 'very-hard' || d === 'very hard') return 'very-hard';
        if (d === 'calibration') return 'calibration';
        return 'medium';
    };

    const handleModeSelect = (mode) => {
        if (selectedScenario) {
            startGame(selectedScenario, mode);
            setSelectedScenario(null);
        }
    };

    const handleDailyStart = () => {
        if (!isDailyCompleted) {
            startGame(dailyScenario, 'trading');
        }
    };

    return (
        <div className="menu-container">
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
            {showCareer && <CareerDashboard onClose={() => setShowCareer(false)} />}

            <div className="menu-layout-grid">
                {/* LEFT COLUMN: GAME MODES & CAREER */}
                <div className="menu-main-col">

                    {/* Career Header */}
                    <div className="career-header">
                        <div className="ch-profile">
                            <div className="ch-rank-badge">{level}</div>
                            <div className="ch-info">
                                <div className="ch-title">{title}</div>
                                <div className="ch-xp-bar">
                                    <div className="ch-xp-fill" style={{ width: `${progress}%` }}></div>
                                </div>
                                <div className="ch-xp-text">{Math.floor(xp)} / {nextLevel?.xp || 'MAX'} XP</div>
                            </div>
                        </div>
                        <div className="ch-right">
                            <div className="ch-bankroll">
                                <div className="ch-label">Lifetime Bankroll</div>
                                <div className="ch-value">${bankroll.toLocaleString()}</div>
                            </div>
                            <div className="ch-actions">
                                <button className="ch-icon-btn" onClick={() => setShowSettings(true)} title="Settings">⚙️</button>
                                <button className="ch-view-btn" onClick={() => setShowCareer(true)}>My Career</button>
                            </div>
                        </div>
                    </div>

                    {/* Daily Challenge Card */}
                    <div className="daily-challenge-card">
                        <div className="dc-content">
                            <div className="dc-label">DAILY CHALLENGE • {dailyScenario.dateString}</div>
                            <h2 className="dc-title">{dailyScenario.name}</h2>
                            <div className="dc-meta">
                                <span>Risk: {dailyScenario.difficulty}</span>
                                <span>Reward: 1000 XP</span>
                            </div>
                        </div>
                        <div className="dc-action">
                            <button
                                className={`dc-play-btn ${isDailyCompleted ? 'completed' : ''}`}
                                onClick={handleDailyStart}
                                disabled={isDailyCompleted}
                            >
                                {isDailyCompleted ? 'COMPLETED' : 'PLAY NOW'}
                            </button>
                        </div>
                    </div>

                    <div className="section-divider">
                        <span>Trading Desks</span>
                    </div>

                    {/* Game Modes Grid */}
                    <div className="game-modes-grid vertical">
                        {/* Cargo */}
                        <div className="game-mode-card cargo" onClick={onCargoGame}>
                            <div className="gm-icon">⚓</div>
                            <div className="gm-info">
                                <h3>Cargo Hedging</h3>
                                <p>Manage physical freight & basis risk</p>
                            </div>
                            <div className="gm-arrow">→</div>
                        </div>

                        {/* Futures */}
                        <div className="game-mode-card futures" onClick={onFuturesGame}>
                            <div className="gm-icon">📊</div>
                            <div className="gm-info">
                                <h3>Futures Curve</h3>
                                <p>Trade backwardation & contango structure</p>
                            </div>
                            <div className="gm-arrow">→</div>
                        </div>

                        {/* Crack Spread */}
                        <div className="game-mode-card crack" onClick={onCrackGame}>
                            <div className="gm-icon">🔥</div>
                            <div className="gm-info">
                                <h3>Crack Spread</h3>
                                <p>Optimize refinery margins & product yields</p>
                            </div>
                            <div className="gm-arrow">→</div>
                        </div>
                    </div>

                    <div className="section-divider">
                        <span>Spot Trading Scenarios</span>
                    </div>

                    {/* Scenarios Grid */}
                    <div className="scenario-grid">
                        {scenarios.map((scenario) => (
                            <div
                                key={scenario.id}
                                className="scenario-card"
                                onClick={() => setSelectedScenario(scenario)}
                            >
                                <div className="card-header">
                                    <span className="card-name">{scenario.name}</span>
                                    <span className={`difficulty-badge ${getDifficultyClass(scenario.difficulty)}`}>
                                        {scenario.difficulty}
                                    </span>
                                </div>
                                <div className="card-description">{scenario.description}</div>
                                <div className="card-meta">
                                    <span>📊 {scenario.events.length} events</span>
                                    <span>⏱ {scenario.totalTicks} ticks</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: LEARNING TOOLS */}
                <div className="menu-sidebar-col">
                    <div className="sidebar-title">Academy</div>

                    <div className="learning-card tutorial" onClick={onTutorial}>
                        <div className="lc-icon">🎓</div>
                        <div className="lc-content">
                            <h3>How to Play</h3>
                            <p>Simulator basics</p>
                        </div>
                    </div>

                    <div className="learning-card principles" onClick={onGuide}>
                        <div className="lc-icon">📖</div>
                        <div className="lc-content">
                            <h3>Principles</h3>
                            <p>Core concepts</p>
                        </div>
                    </div>

                    <div className="learning-card trainer" onClick={onTrainer}>
                        <div className="lc-icon">🎯</div>
                        <div className="lc-content">
                            <h3>Signal vs Noise</h3>
                            <p>Identify trends</p>
                        </div>
                    </div>

                    <div className="sidebar-info">
                        <h4>About OilSim</h4>
                        <p>Bloomberg-style trading simulation designed for assessment practice.</p>
                        <p className="version">v1.2.0 • Gamification Update</p>
                    </div>
                </div>
            </div>

            {/* Mode Picker Overlay */}
            {selectedScenario && (
                <div className="mode-picker-overlay" onClick={() => setSelectedScenario(null)}>
                    <div className="mode-picker-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="mode-picker-close" onClick={() => setSelectedScenario(null)}>✕</button>
                        <div className="mode-picker-scenario">
                            <span className="mode-picker-scenario-name">{selectedScenario.name}</span>
                            <span className={`difficulty-badge ${getDifficultyClass(selectedScenario.difficulty)}`}>
                                {selectedScenario.difficulty}
                            </span>
                        </div>
                        <h2 className="mode-picker-title">Choose Your Mode</h2>

                        <div className="mode-picker-cards">
                            <div className="mode-card learning" onClick={() => handleModeSelect('learning')}>
                                <div className="mode-card-icon">🎓</div>
                                <div className="mode-card-name">Learning Mode</div>
                                <div className="mode-card-desc">
                                    No timer pressure. Game <strong>pauses</strong> on every news event.
                                    Make your trade, then get <strong>instant feedback</strong> showing
                                    the optimal strategy, reasoning, and trading principle.
                                </div>
                                <ul className="mode-card-features">
                                    <li>⏸ Auto-pause on events</li>
                                    <li>📖 Full strategy feedback</li>
                                    <li>🧠 Learn trading principles</li>
                                    <li>⏱ No time pressure</li>
                                </ul>
                                <div className="mode-card-badge">Recommended for beginners</div>
                            </div>

                            <div className="mode-card trading" onClick={() => handleModeSelect('trading')}>
                                <div className="mode-card-icon">⚡</div>
                                <div className="mode-card-name">Trading Mode</div>
                                <div className="mode-card-desc">
                                    Real-time <strong>timer</strong> tracks your decision speed.
                                    Events pause the game — trade fast, then resume.
                                    Your total time is part of your <strong>final score</strong>.
                                </div>
                                <ul className="mode-card-features">
                                    <li>⏱ Wall-clock timer</li>
                                    <li>⚡ Trade & go — no feedback</li>
                                    <li>📊 Time in final report</li>
                                    <li>🏆 Test your speed</li>
                                </ul>
                                <div className="mode-card-badge">Assessment simulation</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
