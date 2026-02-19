import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const ACHIEVEMENTS = [
    { id: 'first_trade', name: 'First Steps', desc: 'Complete your first trading scenario', xp: 500, icon: '🐣' },
    { id: 'profitable', name: 'In the Black', desc: 'Finish a scenario with positive P&L', xp: 1000, icon: '📈' },
    { id: 'shark', name: 'Loan Shark', desc: 'Amass $1,000,000 bankroll', xp: 5000, icon: '🦈' },
    { id: 'risk_manager', name: 'Risk Manager', desc: 'Complete 5 scenarios', xp: 3000, icon: '🛡️' },
    { id: 'oil_baron', name: 'Oil Baron', desc: 'Reach Level 10 (Legend)', xp: 10000, icon: '👑' }
];

export const LEVELS = [
    { level: 1, xp: 0, title: 'Junior Analyst' },
    { level: 2, xp: 1000, title: 'Junior Analyst II' },
    { level: 3, xp: 2500, title: 'Junior Analyst III' },
    { level: 4, xp: 5000, title: 'Associate Trader' }, // Unlocks Futures
    { level: 5, xp: 8000, title: 'Associate Trader II' },
    { level: 6, xp: 12000, title: 'Senior Trader' }, // Unlocks Crack Spread
    { level: 7, xp: 18000, title: 'Senior Trader II' },
    { level: 8, xp: 25000, title: 'Head of Desk' }, // Unlocks Hard Scenarios
    { level: 9, xp: 35000, title: 'Oil Tycoon' }, // Unlocks Themes
    { level: 10, xp: 50000, title: 'Legend' },
];

export const THEMES = [
    { id: 'default', name: 'Standard (Dark Blue)', price: 0, unlocked: true },
    { id: 'retro', name: 'Retro Terminal (Green)', price: 50000, unlocked: false },
    { id: 'cyberpunk', name: 'Cyberpunk (Neon)', price: 100000, unlocked: false },
    { id: 'bloomberg', name: 'Institutional (Light)', price: 250000, unlocked: false },
];

const useCareerStore = create(
    persist(
        (set, get) => ({
            // Persistent State
            xp: 0,
            level: 1,
            title: 'Junior Analyst',
            bankroll: 100000, // Starting capital
            totalPnL: 0,
            totalTrades: 0,
            simulationsRun: 0,
            scenariosCompleted: [], // List of IDs
            achievements: [], // List of IDs
            unlockedThemes: ['default'],

            activeTheme: 'default',
            soundEnabled: true,
            dailyChallenge: { lastDate: null, completed: false },

            // Actions
            addXp: (amount) => {
                const currentXp = get().xp + amount;
                // Check level up
                const nextLevel = LEVELS.slice().reverse().find(l => currentXp >= l.xp) || LEVELS[0];
                const currentLevel = get().level;

                set({ xp: currentXp, level: nextLevel.level, title: nextLevel.title });

                if (nextLevel.level > currentLevel) {
                    return { leveledUp: true, newLevel: nextLevel.level, newTitle: nextLevel.title };
                }
                return { leveledUp: false };
            },

            recordSession: (pnl, tradeCount, scenarioId) => {
                const state = get();
                const newBankroll = state.bankroll + pnl;
                const newTotalPnL = state.totalPnL + pnl;
                const newTotalTrades = state.totalTrades + tradeCount;
                const newSimulationsRun = state.simulationsRun + 1;
                const newScenariosCompleted = state.scenariosCompleted.includes(scenarioId)
                    ? state.scenariosCompleted
                    : [...state.scenariosCompleted, scenarioId];

                set({
                    bankroll: newBankroll,
                    totalPnL: newTotalPnL,
                    totalTrades: newTotalTrades,
                    simulationsRun: newSimulationsRun,
                    scenariosCompleted: newScenariosCompleted
                });

                // Daily Challenge Logic
                if (scenarioId && scenarioId.startsWith('daily-')) {
                    const dateStr = scenarioId.split('daily-')[1]; // daily-YYYY-MM-DD
                    const today = new Date().toISOString().split('T')[0];
                    const dailyState = state.dailyChallenge || { lastDate: null, completed: false };

                    if (dateStr === today && (!dailyState.completed || dailyState.lastDate !== today)) {
                        // First completion today
                        get().addXp(1000); // Bonus XP
                        set({ dailyChallenge: { lastDate: today, completed: true } });
                    }
                }

                // Check achievements after updating stats
                get().checkAchievements();
            },

            checkAchievements: () => {
                const state = get();
                const currentAchievements = state.achievements || [];
                const newlyUnlocked = [];

                ACHIEVEMENTS.forEach(ach => {
                    if (currentAchievements.includes(ach.id)) return;

                    let unlocked = false;
                    if (ach.id === 'first_trade' && state.simulationsRun > 0) unlocked = true;
                    if (ach.id === 'profitable' && state.totalPnL > 0) unlocked = true;
                    if (ach.id === 'shark' && state.bankroll >= 1000000) unlocked = true;
                    if (ach.id === 'risk_manager' && state.simulationsRun >= 5) unlocked = true;
                    if (ach.id === 'oil_baron' && state.level >= 10) unlocked = true;

                    if (unlocked) {
                        newlyUnlocked.push(ach.id);
                        // Bonus XP for achievement
                        get().addXp(ach.xp);
                    }
                });

                if (newlyUnlocked.length > 0) {
                    set({ achievements: [...currentAchievements, ...newlyUnlocked] });
                }
            },

            unlockTheme: (themeId) => {
                const state = get();
                const theme = THEMES.find(t => t.id === themeId);
                if (!theme) return false;
                if (state.unlockedThemes.includes(themeId)) return true;

                if (state.bankroll >= theme.price) {
                    set({
                        bankroll: state.bankroll - theme.price,
                        unlockedThemes: [...state.unlockedThemes, themeId]
                    });
                    return true;
                }
                return false;
            },

            setActiveTheme: (themeId) => {
                if (get().unlockedThemes.includes(themeId)) {
                    set({ activeTheme: themeId });
                    // Here we'd typically update CSS variables or dispatch a global event
                }
            },

            toggleSound: () => set(state => ({ soundEnabled: !state.soundEnabled })),

            resetCareer: () => {
                set({
                    xp: 0,
                    level: 1,
                    title: 'Junior Analyst',
                    bankroll: 100000,
                    totalPnL: 0,
                    totalTrades: 0,
                    simulationsRun: 0,
                    scenariosCompleted: [],
                    achievements: [],
                    unlockedThemes: ['default'],
                    activeTheme: 'default'
                });
            }
        }),
        {
            name: 'oilsim-career-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        }
    )
);

export default useCareerStore;
