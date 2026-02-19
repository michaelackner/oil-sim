import { useState } from 'react';

const TUTORIAL_STEPS = [
    {
        title: 'Welcome to OilSim',
        icon: '🛢️',
        content: `OilSim is a Bloomberg-style oil trading simulation designed to prepare you for commodity trading firm assessments (Vitol, Trafigura, Glencore, BP, Shell Trading).

You'll trade **Brent Crude Oil** in real-time, reacting to news events, managing risk, and maximising P&L.

**How it works:**
• A scenario plays out over 280-380 ticks
• News events fire at specific moments
• You buy/sell oil contracts (1,000 barrels each)
• Your P&L, risk metrics, and trade quality are scored`,
        highlight: null
    },
    {
        title: 'The Price Chart',
        icon: '📊',
        content: `The **Price Chart** (top-left panel) shows Brent crude price as **candlestick bars**.

Each candle represents 5 ticks of price action:
• **Green candle** = Price went UP during that period
• **Red candle** = Price went DOWN

**Markers on the chart:**
• **▲ Green arrow** = Your BUY trade
• **▼ Red arrow** = Your SELL trade
• **● Circle** = A news event fired

Watch for price acceleration after news events — that's your trading signal.`,
        highlight: 'chart'
    },
    {
        title: 'The News Feed',
        icon: '📰',
        content: `The **News Feed** (top-right panel) shows headlines as they fire.

**Two types of news:**
1. **Impact events** — These MOVE prices. They have a category badge:
   • 🟠 GEOPOLITICAL — Wars, sanctions, attacks
   • 🔵 OPEC — Production decisions
   • 🟢 SUPPLY — Production outages, pipeline issues
   • 🟡 DEMAND — Economic data, consumption changes
   • 🔴 WEATHER — Hurricanes, extreme weather
   • ⚪ POLICY — Government actions, SPR releases

2. **Noise events** — These look real but DON'T move prices. Your job is to ignore them.

**The key skill:** Distinguish signal from noise. Not every headline is tradeable.`,
        highlight: 'news'
    },
    {
        title: 'Trading Panel',
        icon: '⚡',
        content: `The **Trading Panel** (bottom-left) is your execution desk.

**Buttons:**
• **Buy 1 / 5 / 10** — Go long (profit if price rises)
• **Sell 1 / 5 / 10** — Go short (profit if price falls)
• **Flatten** — Close entire position instantly

**Keyboard shortcuts (critical for speed!):**
• **B** = Buy 1 lot  |  **Shift+B** = Buy 5  |  **Ctrl+B** = Buy 10
• **S** = Sell 1 lot  |  **Shift+S** = Sell 5  |  **Ctrl+S** = Sell 10
• **F** = Flatten position
• **Space** = Pause/Resume
• **1/2/3** = Set speed (1x, 2x, 5x)

**Practice the keyboard shortcuts — they're essential for assessment day.** Real trading desks never use mouse to execute.`,
        highlight: 'trading'
    },
    {
        title: 'Position & Risk Tracker',
        icon: '📋',
        content: `The **Position Tracker** (bottom-right) shows your current exposure:

• **Net Position** — Your lot size and direction (LONG/SHORT/FLAT)
• **Avg Entry** — Your average buy/sell price
• **Unrealised P&L** — Profit/loss on open position (changes with price)
• **Realised P&L** — Locked-in profit from closed trades
• **Total P&L** — Sum of realised + unrealised

**Risk Metrics:**
• **VAR Used** — Your Value at Risk gauge. If it hits 100%, no new trades allowed.
• **Max DD** — Maximum drawdown (largest peak-to-trough equity decline)

Keep VAR below 80% to maintain flexibility for high-conviction trades.`,
        highlight: 'position'
    },
    {
        title: 'The Market Data Bar',
        icon: '📡',
        content: `The **bottom bar** shows real-time market data:

• **Brent price** (bid/ask) — the prices you can trade at
• **WTI price** — derived from Brent (for reference)
• **Spread** — Brent-WTI difference
• **Speed controls** — 1x, 2x, 5x simulation speed
• **Pause button** — Freezes time (useful for thinking)
• **Progress** — How far through the scenario you are

**Pro tip:** Use **Space** to pause when a big headline drops. Read it carefully, decide your trade, then resume and execute immediately.`,
        highlight: 'market'
    },
    {
        title: 'Scoring & Strategy Review',
        icon: '🏆',
        content: `After each scenario, you receive a **Score Report** with:

• **Letter Grade** (A-F) based on weighted metrics
• **Total P&L** — Did you make money?
• **Sharpe Ratio** — Risk-adjusted returns (>1.0 is good, >2.0 is excellent)
• **Win Rate** — % of trades that were profitable
• **Reaction Time** — How fast you traded after news events
• **Directional Accuracy** — Did you buy/sell in the right direction?
• **Max Drawdown** — Your worst moment
• **Trade Log** — Every trade you made

**New! Strategy Review** — After each game, you can view the **optimal strategy** for every event: what the perfect trade was, why, and what trading principle it demonstrates.

This is the most valuable learning tool — study it after every game.`,
        highlight: null
    },
    {
        title: 'Exiting Your Position',
        icon: '🚪',
        content: `Knowing **when and how to exit** is just as important as the entry. Many beginners focus on buying — the real skill is closing.

**3 ways to exit a position:**

• **Flatten All** — Press **F** or click the FLATTEN ALL button. Closes your entire position instantly at the current market price. Use when you want to be completely flat.

• **Partial Exit** — Trade the opposite direction in smaller size. If you're **LONG 10**, press **⇧S** (Sell 5) to close half and ride the rest. This locks in profit while keeping upside.

• **Reverse Through Zero** — Sell MORE than your position. If you're **LONG 5**, Sell 10 to flip to **SHORT 5**. Use when the market direction changes sharply.

**Via Event Popup (Learning Mode):**
When an event fires, the popup shows a **⚡ Flatten Position** button. This is your fastest way to exit during a news event.

**Pro tip:** After a big winning trade, always ask yourself: "Would I enter this trade NOW at this price?" If not, it's time to exit.`,
        highlight: 'trading'
    },
    {
        title: 'Optimal Exit Timing',
        icon: '⏰',
        content: `The best traders follow these exit principles:

**1. Exit Before the Reversal, Not After**
• Geopolitical spikes (Iran attacks, sanctions) spike fast then FADE
• The optimal play: buy the headline, exit within 20-50 ticks as fear premium decays
• Don't wait for the perfect top — capture 70-80% of the move

**2. Take Profits at Event Exhaustion**
• If Event A is bullish and Event B confirms it → RIDE the position
• If the next event is counter-directional → FLATTEN or REDUCE
• Learning Mode feedback tells you when flattening is optimal

**3. Watch Your Unrealised P&L**
• A large unrealised profit (+$50,000+) that you don't lock in can vanish
• Consider partial exits: sell half to bank profit, hold the rest
• Max Drawdown in your score penalises you for giving back gains

**4. The End-of-Simulation Trap**
• When the sim ends, open positions are marked-to-market
• **Flatten 30-50 ticks before the end** (watch Tick X/Y in the header)
• This is the #1 mistake beginners make — holding through the final ticks

**5. VAR Is Your Guardrail**
• Keep VAR below 60-70% to have room for high-conviction trades
• If VAR hits 100%, you CAN'T trade — you're stuck until you reduce`,
        highlight: 'position'
    },
    {
        title: 'Learning vs Trading Mode',
        icon: '🎮',
        content: `OilSim has two game modes — choose when you click a scenario:

**🎓 Learning Mode (Recommended First)**
• **No timer** — take all the time you need
• Game **auto-pauses** when impact events fire
• After every trade, you see **instant feedback**:
  → ✅/❌ Grade on your decision
  → The optimal trade and why
  → Expected price effect
  → The trading principle it demonstrates
  → Risk warnings
• Use this mode to study each event type and build intuition

**⚡ Trading Mode (Assessment Simulation)**
• A **live stopwatch** tracks your total time
• Events still pause the game, but when you trade the popup dismisses **immediately** — no feedback
• Your completion time is part of your **final score report**
• Simulates the time pressure of a real commodity desk assessment

**Recommended approach:**
1. Play each scenario in **Learning Mode** first — study all the feedback
2. Once you understand the events, replay in **Trading Mode** to test your speed
3. Compare your completion times across attempts — try to beat your best`,
        highlight: null
    },
    {
        title: 'Ready to Trade!',
        icon: '🚀',
        content: `**Recommended learning path:**

1. **Start with "Random Walk"** — Learn the interface with no pressure
2. **Play "Middle East Escalation"** in 🎓 Learning Mode — study the feedback
3. **Try "Hurricane Season"** — Learn the refinery-vs-production trick
4. **Attempt "Demand Shock"** — Practice patience and exit timing
5. **Challenge "Mixed Signals"** — Test conviction under uncertainty
6. **Replay favourites in ⚡ Trading Mode** — Race the clock
7. **Try "OPEC Price War"** — Practice crash trading and reversals
8. **Face "Black Swan"** — The ultimate test

**Key exit habits to build:**
• Always flatten before end-of-sim (watch the tick counter)
• Take partial profits — don't go for the perfect top
• Use **F** to flatten instantly when direction reverses
• Review the Strategy Review after every game — study the exits

**Before each scenario**, read the Trading Principles guide (📖 button).
**After each scenario**, study the Strategy Review to learn from your decisions.

Good luck — and remember: the best traders aren't the most active, they're the most disciplined. 🛢️`,
        highlight: null
    }
];

export default function Tutorial({ onClose }) {
    const [step, setStep] = useState(0);
    const current = TUTORIAL_STEPS[step];
    const isLast = step === TUTORIAL_STEPS.length - 1;
    const isFirst = step === 0;

    return (
        <div className="tutorial-overlay">
            <div className="tutorial-modal">
                <button className="tutorial-close" onClick={onClose}>✕</button>

                {/* Progress dots */}
                <div className="tutorial-progress">
                    {TUTORIAL_STEPS.map((_, i) => (
                        <div
                            key={i}
                            className={`tutorial-dot ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}
                            onClick={() => setStep(i)}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="tutorial-content">
                    <div className="tutorial-icon">{current.icon}</div>
                    <h2 className="tutorial-title">{current.title}</h2>
                    <div className="tutorial-body">
                        {current.content.split('\n\n').map((para, j) => (
                            <p key={j} dangerouslySetInnerHTML={{
                                __html: para
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/\n/g, '<br/>')
                                    .replace(/•/g, '<span class="bullet">•</span>')
                            }} />
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="tutorial-nav">
                    <button
                        className="tutorial-btn secondary"
                        onClick={() => setStep(s => s - 1)}
                        disabled={isFirst}
                    >
                        ← Previous
                    </button>
                    <span className="tutorial-step-counter">{step + 1} / {TUTORIAL_STEPS.length}</span>
                    {isLast ? (
                        <button className="tutorial-btn primary" onClick={onClose}>
                            Start Trading →
                        </button>
                    ) : (
                        <button className="tutorial-btn primary" onClick={() => setStep(s => s + 1)}>
                            Next →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
