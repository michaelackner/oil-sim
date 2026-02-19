import { useMemo } from 'react';
import useCareerStore, { LEVELS, ACHIEVEMENTS } from '../state/careerStore.js';

export default function CareerDashboard({ onClose }) {
    const {
        xp, level, title, bankroll,
        totalPnL, totalTrades, simulationsRun,
        achievements, resetCareer
    } = useCareerStore();

    const nextLevel = LEVELS.find(l => l.level === level + 1);
    const currentLevel = LEVELS.find(l => l.level === level) || LEVELS[0];
    const prevLevelXp = currentLevel.xp;
    const nextLevelXp = nextLevel ? nextLevel.xp : Math.max(xp + 1000, prevLevelXp + 50000); // Fallback

    // Calculate progress percentage
    // If max level, progress is 100%
    const progress = nextLevel
        ? Math.min(100, Math.max(0, ((xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100))
        : 100;

    return (
        <div className="career-overlay">
            <div className="career-modal">
                <button className="career-close-btn" onClick={onClose}>✕</button>

                <div className="career-header">
                    <div className="career-avatar-block">
                        <div className="career-avatar">{level >= 8 ? '🦁' : level >= 5 ? '🐺' : '🐣'}</div>
                        <div className="career-id">
                            <h2>{title}</h2>
                            <div className="career-rank">Level {level} Trader</div>
                        </div>
                    </div>
                    <div className="career-xp-block">
                        <div className="career-xp-label">
                            <span>XP: {xp.toLocaleString()}</span>
                            <span>{nextLevel ? `Next: ${nextLevelXp.toLocaleString()}` : 'MAX LEVEL'}</span>
                        </div>
                        <div className="career-xp-track">
                            <div className="career-xp-fill" style={{ width: `${progress}%` }} />
                        </div>
                    </div>
                </div>

                <div className="career-content-grid">
                    {/* Stats Column */}
                    <div className="career-card stats">
                        <h3>Career Stats</h3>
                        <div className="career-stat-list">
                            <div className="career-stat-row">
                                <span className="label">Bankroll</span>
                                <span className="value accent">${bankroll.toLocaleString()}</span>
                            </div>
                            <div className="career-stat-row">
                                <span className="label">Total P&L</span>
                                <span className={`value ${totalPnL >= 0 ? 'pos' : 'neg'}`}>
                                    ${totalPnL.toLocaleString()}
                                </span>
                            </div>
                            <div className="career-stat-row">
                                <span className="label">Total Trades</span>
                                <span className="value">{totalTrades}</span>
                            </div>
                            <div className="career-stat-row">
                                <span className="label">Simulations</span>
                                <span className="value">{simulationsRun}</span>
                            </div>
                            <div className="career-stat-row">
                                <span className="label">Avg P&L / Sim</span>
                                <span className={`value ${simulationsRun > 0 && (totalPnL / simulationsRun) >= 0 ? 'pos' : 'neg'}`}>
                                    {simulationsRun > 0 ? `$${(totalPnL / simulationsRun).toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '$0'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Achievements Column */}
                    <div className="career-card achievements">
                        <h3>Achievements</h3>
                        <div className="career-ach-list">
                            {ACHIEVEMENTS.map(ach => {
                                const isUnlocked = achievements.includes(ach.id); // In a real app, logic would unlock them
                                // For MVP, we simulate unlocking based on logic check or just rely on store state
                                // Since we haven't implemented achievement checking logic yet, these might all be locked.
                                // I'll fix checking logic in careerStore next.
                                return (
                                    <div key={ach.id} className={`career-ach-item ${isUnlocked ? 'unlocked' : 'locked'}`}>
                                        <div className="career-ach-icon">{ach.icon}</div>
                                        <div className="career-ach-info">
                                            <div className="career-ach-name">{ach.name}</div>
                                            <div className="career-ach-desc">{ach.desc}</div>
                                        </div>
                                        {isUnlocked && <div className="career-ach-check">✓</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="career-footer">
                    <button className="career-reset-btn" onClick={() => {
                        if (window.confirm('Reset ALL career progress? This cannot be undone.')) {
                            resetCareer();
                            onClose();
                        }
                    }}>Reset Career Progress</button>
                </div>
            </div>
        </div>
    );
}
