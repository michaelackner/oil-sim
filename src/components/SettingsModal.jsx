import React from 'react';
import useCareerStore, { THEMES } from '../state/careerStore';

export default function SettingsModal({ onClose }) {
    const { activeTheme, unlockedThemes, bankroll, unlockTheme, setActiveTheme, soundEnabled, toggleSound } = useCareerStore();

    const handleUnlock = (theme) => {
        if (bankroll >= theme.price) {
            unlockTheme(theme.id);
        }
    };

    return (
        <div className="settings-overlay" onClick={onClose}>
            <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
                <button className="settings-close" onClick={onClose}>✕</button>
                <h2>Settings</h2>

                <div className="settings-section">
                    <h3>Sounds</h3>
                    <div className="audio-toggle">
                        <span>Audio Feedback</span>
                        <button
                            className={`toggle-btn ${soundEnabled ? 'active' : ''}`}
                            onClick={toggleSound}
                        >
                            {soundEnabled ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>

                <div className="settings-section">
                    <h3>Visual Themes</h3>
                    <div className="themes-grid">
                        {THEMES.map(theme => {
                            const isUnlocked = unlockedThemes.includes(theme.id);
                            const isActive = activeTheme === theme.id;
                            const canAfford = bankroll >= theme.price;

                            return (
                                <div key={theme.id} className={`theme-card ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}>
                                    <div className="theme-header">
                                        <span className="theme-name">{theme.name}</span>
                                        {isActive && <span className="theme-badge">ACTIVE</span>}
                                    </div>
                                    <div className="theme-price">
                                        {isUnlocked ? 'Owned' : `$${theme.price.toLocaleString()}`}
                                    </div>
                                    <div className="theme-actions">
                                        {isUnlocked ? (
                                            <button
                                                className="theme-btn select"
                                                onClick={() => setActiveTheme(theme.id)}
                                                disabled={isActive}
                                            >
                                                {isActive ? 'Current' : 'Select'}
                                            </button>
                                        ) : (
                                            <button
                                                className="theme-btn unlock"
                                                onClick={() => handleUnlock(theme)}
                                                disabled={!canAfford}
                                            >
                                                {canAfford ? 'Unlock' : 'Insufficient Funds'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
