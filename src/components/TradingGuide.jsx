import { useState } from 'react';

const PRINCIPLES = [
    {
        id: 'fundamentals',
        title: 'Oil Market Fundamentals',
        icon: '🛢️',
        sections: [
            {
                heading: 'Supply & Demand Basics',
                content: `Global oil demand is ~100 million barrels per day (bbl/d). Supply comes from OPEC (~30%), US shale (~13%), Russia (~10%), and dozens of other producers. Price is set at the MARGIN — even a 1-2% imbalance (1-2m bbl/d) causes huge price swings because oil storage is limited.

**Key numbers to know:**
• Global demand: ~100m bbl/d
• OPEC production: ~27-30m bbl/d
• US production: ~13m bbl/d
• Russia: ~10m bbl/d
• Strategic Petroleum Reserve: ~350m barrels
• Global commercial storage: ~4-5 billion barrels`
            },
            {
                heading: 'Brent vs WTI',
                content: `**Brent Crude** (traded on ICE) is the global benchmark — 80% of physical oil is priced off Brent. It reflects waterborne, international crude supply/demand.

**WTI** (traded on NYMEX) is the US benchmark — reflects inland US supply/demand, particularly in Cushing, Oklahoma.

The Brent-WTI spread typically ranges from $2-6/bbl. When US production surges, WTI weakens vs Brent. When global markets tighten, Brent strengthens.

**In this simulation, we trade Brent.**`
            },
            {
                heading: 'What Moves Oil Prices?',
                content: `From MOST to LEAST impactful:

1. **OPEC decisions** — Production cuts or increases directly change supply
2. **Geopolitical events** — Wars, sanctions, pipeline attacks near chokepoints
3. **Demand shocks** — Recessions, pandemics, or booms in major consumers
4. **Inventory data** — Weekly EIA/API storage reports
5. **US dollar movements** — Oil trades in USD; stronger dollar = weaker oil
6. **Weather** — Hurricanes (Gulf), cold winters (heating oil)
7. **Shipping disruptions** — Chokepoint attacks, canal closures
8. **Speculative positioning** — Hedge fund flows (managed money net longs)`
            }
        ]
    },
    {
        id: 'opec',
        title: 'OPEC & Producer Strategy',
        icon: '🏛️',
        sections: [
            {
                heading: 'How OPEC Works',
                content: `OPEC+ is a cartel of 23 oil-producing nations led by Saudi Arabia, with non-OPEC partner Russia. They set production quotas to manage supply and, by extension, price.

**Key OPEC vocabulary:**
• **Production cut** → Bullish (less supply)
• **Production increase** → Bearish (more supply)
• **OSP (Official Selling Price)** → Saudi's price to buyers; cut = they want to sell more
• **Compliance** → How well members follow quotas (rarely 100%)
• **JMMC** → Joint Ministerial Monitoring Committee (meets monthly)
• **Voluntary cuts** → Deeper than agreed — very bullish signal`
            },
            {
                heading: 'Saudi Arabia Is The Key Player',
                content: `Saudi Arabia is the "swing producer" — they have 2-3m bbl/d of spare capacity. When Saudi:

• **Cuts production** → Extremely bullish. They absorb the sacrifice for the cartel.
• **Increases production** → Extremely bearish. Signals price war.
• **Cuts OSP** → Bearish. They're trying to sell more oil by discounting.
• **Says "market stability"** → Dovish. They want to cooperate.
• **Says "market share"** → Hawkish. They want to flood and compete.

**Saudi can produce at ~$3/bbl cost**. US shale needs $40-60/bbl. In a price war, Saudi always wins eventually.`
            },
            {
                heading: 'Cheating & Compliance',
                content: `OPEC members routinely produce above their quotas. The main cheaters:

• **Iraq** — Always overproduces by 200-400k bbl/d
• **Kazakhstan** — Regularly exceeds quota by 100-200k bbl/d
• **Nigeria** — Underproduces (can't even reach quota due to infrastructure)
• **UAE** — Demands higher baseline quota as price for cooperation

Saudi Arabia compensates by cutting more than its share. When compliance drops below 70%, markets get bearish. When Saudi threatens consequences, markets stabilise.`
            }
        ]
    },
    {
        id: 'geopolitics',
        title: 'Geopolitical Risk',
        icon: '⚔️',
        sections: [
            {
                heading: 'Critical Chokepoints',
                content: `Oil flows through narrow waterways that can be disrupted:

**Strait of Hormuz** — 21m bbl/d (20% of global supply)
→ Iran can threaten closure. Any military action here = massive oil spike.

**Bab el-Mandeb / Red Sea** — 7m bbl/d
→ Houthi attacks reroute ships via Cape of Good Hope (+10-14 days)

**Suez Canal** — 1-2m bbl/d + 10% of global trade
→ Blockages (Ever Given 2021) disrupt flows for weeks

**Strait of Malacca** — 16m bbl/d
→ China's oil import lifeline. Any disruption here is geopolitical crisis.

**Turkish Straits (Bosphorus)** — 3m bbl/d
→ Critical for Russian/Kazakh crude exports to Mediterranean.`
            },
            {
                heading: 'Geopolitical Playbook',
                content: `**Verbal threat** → 1-2% move, fades in hours
**Military posturing (deployments)** → 2-3% move, fades in days
**Actual military action** → 3-5% spike, sustains for days/weeks
**Physical infrastructure damage** → 5-10% spike, sustains until repair
**Sanctions (new, with teeth)** → 2-3% over weeks (slow burn)
**Sanctions (paper tiger)** → <1% move, market discounts immediately

**Key rule: PHYSICAL actions > VERBAL threats.** Always.

The market prices in risk premium for ongoing conflicts. The premium unwinds when diplomatic resolution occurs — which is why buying on war and selling on peace works.`
            },
            {
                heading: 'Sanctions',
                content: `Sanctions on oil producers reduce effective supply:

• **Russian sanctions** (post-2022): Created $60 price cap, shadow fleet, rerouted 3m+ bbl/d. Market adapted — impact was smaller than expected.
• **Iranian sanctions**: Reduced exports from 2.5m to ~1.5m bbl/d. But China buys heavily via "gray market."
• **Venezuelan sanctions**: Reduced output from 3m to ~700k bbl/d. Massive long-term impact.

**Key insight:** Sanctions take TIME to bite. The announcement move is often smaller than the cumulative impact over months. Don't overtrade the announcement.`
            }
        ]
    },
    {
        id: 'risk',
        title: 'Risk Management',
        icon: '🛡️',
        sections: [
            {
                heading: 'Position Sizing',
                content: `**The #1 skill in trading is position sizing, not direction.**

Rules for this simulation:
• **Low conviction** (ambiguous signal): 1-3 lots
• **Medium conviction** (one clear signal): 5 lots
• **High conviction** (multiple signals aligned): 8-10 lots
• **Maximum conviction** (rare, convergence): 10 lots

**The mistake 90% of traders make:** Equal sizing on every trade. A 1-lot trade on noise + a 10-lot trade on conviction will massively outperform 10 x 5-lot trades.`
            },
            {
                heading: 'Value at Risk (VAR)',
                content: `VAR estimates your maximum potential loss over a time horizon at a given confidence level. In this simulation:

• **VAR limit:** $5,000
• **Calculation:** Based on position size × price × historical volatility
• **If you breach VAR:** Your trade gets rejected. Flatten first.

Real trading firms enforce VAR limits strictly. Getting stopped out by VAR is worse than taking a loss voluntarily — it means you lost control of your risk.

**Pro tip:** Keep VAR usage below 80% so you have room for high-conviction opportunistic trades.`
            },
            {
                heading: 'Max Drawdown',
                content: `Max drawdown = the largest peak-to-trough decline in your equity. It measures your WORST experience.

• **<$500** → Excellent risk management
• **$500–$1,500** → Acceptable
• **$1,500–$3,000** → High risk, but may be justified for Black Swan
• **>$3,000** → Poor risk management, likely gambler

**Recovery time matters.** A $1,000 drawdown takes $1,000 profit to recover — but psychologically it feels like you need $2,000. This is why drawdown tolerance is the hardest skill.`
            }
        ]
    },
    {
        id: 'data',
        title: 'Key Data Releases',
        icon: '📊',
        sections: [
            {
                heading: 'Weekly Data',
                content: `**EIA Weekly Petroleum Status Report** (Wednesday 10:30 ET)
The most important scheduled data release in oil. Reports:
• Crude inventories (builds = bearish, draws = bullish)
• Gasoline/distillate inventories
• Refinery utilization rates
• Production estimates

**API Report** (Tuesday 4:30 ET) — Industry estimate, released day before EIA. Serves as a preview.

**How to trade:** Compare actual to consensus. A +5m barrel build vs consensus of +1m is VERY bearish. A -3m draw vs consensus of -1m is moderately bullish. The SURPRISE is what moves prices.`
            },
            {
                heading: 'Monthly Data',
                content: `**OPEC Monthly Oil Market Report** — OPEC's own demand/supply estimates. They always overestimate demand.
**IEA Oil Market Report** — More objective. Western-aligned. They often underestimate demand.
**EIA Short-Term Energy Outlook (STEO)** — US government estimates. Best for US production data.

**Relative credibility:** IEA > EIA > OPEC (OPEC talks its own book).

**Chinese customs data** — Monthly import volumes. Physical evidence of demand. 11m+ bbl/d = strong. <10m = weak.`
            },
            {
                heading: 'Physical Market Indicators',
                content: `**Contango vs Backwardation:**
• **Backwardation** (near-month > far-month) → Tight market, draw inventories, BULLISH
• **Contango** (far-month > near-month) → Oversupplied, builds in storage, BEARISH
• **Super contango** (>$5/bbl spread) → Market in crisis, storage almost full

**Crack spreads** = Refinery profit margin = Product price - Crude price
• Widening cracks = Strong product demand, refiners buying more crude = BULLISH
• Negative cracks = Refiners losing money, will cut crude purchases = BEARISH

**Freight rates:**
• Rising VLCC rates = Strong physical demand for oil transportation = BULLISH
• Collapsing rates = Weak physical flows = BEARISH`
            }
        ]
    },
    {
        id: 'psychology',
        title: 'Trading Psychology',
        icon: '🧠',
        sections: [
            {
                heading: 'Cognitive Biases to Avoid',
                content: `**Anchoring** — Don't anchor to your entry price. The market doesn't care where you got in.

**Confirmation bias** — Don't seek news that confirms your position. Actively look for the OPPOSITE case.

**Loss aversion** — Losses feel 2x worse than gains feel good. This makes you hold losers too long and cut winners too short. Force yourself to do the opposite.

**Overtrading** — The itch to always be in a position. The Random Walk scenario exists to teach this. Sometimes the best trade is no trade.

**Recency bias** — The last event isn't always the most important. A bullish event after 3 bearish ones doesn't mean the trend has reversed.`
            },
            {
                heading: 'Assessment Day Tips',
                content: `What commodity trading firms are ACTUALLY testing:

1. **Speed of reaction** — Can you process news and trade within 5-10 seconds?
2. **Directional accuracy** — Do you get the direction right more than 60% of the time?
3. **Risk management** — Do you survive drawdowns without blowing up?
4. **Signal vs noise** — Can you ignore irrelevant headlines?
5. **Position sizing** — Do you size big on high-conviction, small on low?
6. **Reversal ability** — Can you flip from long to short without ego?
7. **Discipline** — Do you NOT trade when there's no edge?

**The scoring weights in this simulation mirror what firms actually value.**`
            },
            {
                heading: 'Common Mistakes',
                content: `**Mistake 1: Trading every headline**
Not every headline is actionable. If the impact is <1%, the spread cost kills your edge.

**Mistake 2: Equal position sizing**
Putting 5 lots on every trade means you're treating noise and signal equally. Size 1-lot on noise, 10-lot on conviction.

**Mistake 3: Not reversing**
The hardest trade is going from short to long (or vice versa). But the biggest profit opportunities require reversal. Practice this.

**Mistake 4: Ignoring second-order effects**
Hurricanes → NOT always bullish for crude (refinery shutdown = less demand). Think about WHO buys crude and what affects THEM.

**Mistake 5: Panicking on drawdowns**
A temporary $500 drawdown in the Black Swan scenario is expected. If your thesis is intact, hold the position.`
            }
        ]
    }
];

export default function TradingGuide({ onBack }) {
    const [activeSection, setActiveSection] = useState(PRINCIPLES[0].id);
    const activePrinciple = PRINCIPLES.find(p => p.id === activeSection);

    return (
        <div className="guide-container">
            <div className="guide-header">
                <button className="guide-back-btn" onClick={onBack}>← Back to Menu</button>
                <h1 className="guide-title">📖 Oil Trading Principles</h1>
                <p className="guide-subtitle">Everything you need to know to trade crude oil</p>
            </div>

            <div className="guide-layout">
                {/* Sidebar Navigation */}
                <nav className="guide-nav">
                    {PRINCIPLES.map(p => (
                        <button
                            key={p.id}
                            className={`guide-nav-item ${activeSection === p.id ? 'active' : ''}`}
                            onClick={() => setActiveSection(p.id)}
                        >
                            <span className="guide-nav-icon">{p.icon}</span>
                            <span>{p.title}</span>
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className="guide-content">
                    <h2 className="guide-section-title">
                        {activePrinciple.icon} {activePrinciple.title}
                    </h2>
                    {activePrinciple.sections.map((section, i) => (
                        <div key={i} className="guide-block">
                            <h3 className="guide-block-heading">{section.heading}</h3>
                            <div className="guide-block-content">
                                {section.content.split('\n\n').map((para, j) => (
                                    <p key={j} dangerouslySetInnerHTML={{
                                        __html: para
                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                            .replace(/\n/g, '<br/>')
                                            .replace(/•/g, '<span class="bullet">•</span>')
                                            .replace(/→/g, '<span class="arrow">→</span>')
                                    }} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
