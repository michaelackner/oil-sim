export const gasoilScenarios = [
    {
        id: 'go_polar_vortex',
        name: 'The Beast from the East',
        assetType: 'gasoil',
        difficulty: 'Hard',
        description: 'A sudden, severe cold spell across Europe causes inland heating demand to surge dynamically. Navigate the violent tightness in prompt Gasoil.',
        contractSize: 100, // 1 lot = 100 Metric Tonnes
        numMonths: 3,
        months: ['Dec', 'Jan', 'Feb'],
        startPrice: 820.50, // Initial backwardation
        totalTicks: 545,
        disablePopups: true,
        monthlySpread: -2.00, // Base backwardation
        marketVolatility: 0.004, // Correct volatility scaling
        events: [
            {
                tick: 35,
                category: 'Weather',
                headline: 'Meteorologists Warn of "Polar Vortex" Splitting',
                detail: 'Models predict a historic freeze hitting Northwest Europe within 10 days. Heating oil distributors scramble to replenish tertiary stocks.',
                impact: { direction: 1, immediatePct: 0.03, driftPct: 0.02, frontWeight: 2.0, backWeight: 0.5, volatilityMultiplier: 1.5, noiseAmplifier: 1.5 },
                strategy: {
                    action: 'Buy Nov/Dec spread aggressively',
                    reasoning: 'Short-term demand spikes hit the prompt month hardest as physical shorts panic-buy to fulfill immediate delivery obligations.',
                    principle: 'Heating demand shocks tighten the front of the curve dramatically.'
                }
            },
            {
                tick: 105,
                category: 'Data',
                headline: 'ARA Gasoil Inventories Draw 1.5M Tons',
                detail: 'Independently held gasoil stocks in the Amsterdam-Rotterdam-Antwerp hub plunge as inland barges load at Maximum capacity.',
                impact: { direction: 1, immediatePct: 0.02, driftPct: 0.015, frontWeight: 1.6, backWeight: 0.8, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
                strategy: {
                    action: 'Add to Front Month Longs',
                    reasoning: 'Confirmation of physical market panic. The steep draws mean less buffer against the incoming freeze.',
                    principle: 'Inventory draws in a backwardated market accelerate the squeeze.'
                }
            },
            {
                tick: 175,
                category: 'Logistics',
                headline: 'Rhine River Freezes, Barge Traffic Halted',
                detail: 'Ice blocks on the Rhine River restrict the transport of Gasoil from ARA hubs into the German interior, causing local stock-outs.',
                impact: { direction: 1, immediatePct: 0.015, driftPct: 0.01, frontWeight: 1.2, backWeight: 0.4, volatilityMultiplier: 1.6, noiseAmplifier: 1.5 },
                strategy: {
                    action: 'Hold Length',
                    reasoning: 'While coastal storage might build slightly, the inland panic bids up prompt physical molecules to astronomical levels.',
                    principle: 'Severe logistics failures keep prompt premiums elevated.'
                }
            },
            {
                tick: 245,
                category: 'Supply',
                headline: 'Russian Winter Grade Export Delays',
                detail: 'Ice in the Baltic sea is delaying vital resupply cargoes heading to Rotterdam.',
                impact: { direction: 1, immediatePct: 0.025, driftPct: 0.01, frontWeight: 1.8, backWeight: 0.5, volatilityMultiplier: 1.4, noiseAmplifier: 1.3 },
                strategy: {
                    action: 'Maintain Length / Buy Dips',
                    reasoning: 'The perfect storm: high demand, no inland logistics, and delayed sea imports.',
                    principle: 'Compounding disruptions create super-backwardation.'
                }
            },
            {
                tick: 350, // Squeeze peak
                category: 'Physical',
                headline: 'Physical Squeeze at ARA Hub Peaks',
                detail: 'Prompt physical Gasoil loading at ARA is heavily bid up. Force majeures declared on several delivery contracts.',
                impact: { direction: 1, immediatePct: 0.04, driftPct: 0.02, frontWeight: 2.2, backWeight: 0.6, volatilityMultiplier: 1.8, noiseAmplifier: 1.6 },
                strategy: {
                    action: 'Hold length in Prompt, short the Back',
                    reasoning: 'When logistics fail, the molecules you have *now* are infinitely more valuable than molecules available next month.',
                    principle: 'Logistical bottlenecks exacerbate prompt premiums.'
                }
            },
            {
                tick: 455,
                category: 'Weather',
                headline: 'Mild Front Approaching; Vortex Breaks Down',
                detail: 'Forecasts shift warmer. The panic subsides as tertiary tanks are now full and heating demand projections crater.',
                impact: { direction: -1, immediatePct: 0.04, driftPct: 0.03, frontWeight: 2.5, backWeight: 0.8, volatilityMultiplier: 1.6, noiseAmplifier: 1.4 },
                strategy: {
                    action: 'Sell the front month heavily / Take Profits',
                    reasoning: 'The panic premium vanishes instantly when weather forecasts normalize. Physical longs will dump their expensive prompt cargoes.',
                    principle: 'Weather risk premiums deflate faster than they inflate once the forecast shifts.'
                }
            },
            {
                tick: 525,
                category: 'Supply',
                headline: 'Delayed Baltic Cargoes Arrive Simultaneously',
                detail: 'The ice clears, and 6 delayed tankers drop their load into ARA immediately as demand crashes.',
                impact: { direction: -1, immediatePct: 0.03, driftPct: 0.02, frontWeight: 1.8, backWeight: 0.9, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
                strategy: {
                    action: 'Go Short Prompt',
                    reasoning: 'The squeeze is officially over. Supply arrives just as demand dies, creating a massive localized glut that will crash the front month.',
                    principle: 'Delayed supplies arriving late to a broken squeeze accelerate the downside.'
                }
            }
        ],
        noiseEvents: [
            {
                tickRange: [0, 545],
                frequency: 68,
                pool: [
                    "German heating oil distributors quote 2-week delivery delay",
                    "Rotterdam barge rates spike to historical highs",
                    "ICE Gasoil open interest climbing in prompt month",
                    "UK natural gas prices surge, supporting distillate substitution",
                    "Refinery margins (crack spreads) blow out in Northwest Europe"
                ]
            }
        ]
    },
    {
        id: 'go_refinery_strike',
        name: 'French Refinery Strikes',
        assetType: 'gasoil',
        difficulty: 'Medium',
        description: 'Labor strikes across France threaten to take massive distillation and hydrotreating capacity offline, tightening the European Gasoil balance.',
        contractSize: 100,
        numMonths: 3,
        months: ['Oct', 'Nov', 'Dec'],
        startPrice: 750.00, // Slight initial contango
        totalTicks: 545,
        disablePopups: true,
        monthlySpread: 1.5,
        marketVolatility: 0.003,
        events: [
            {
                tick: 75,
                category: 'Geopolitics',
                headline: 'CGT Union Calls for Walkouts at TotalEnergies',
                detail: 'Workers cite inflation outstripping wages. Three major French refineries may halt operations if demands are not met by Friday.',
                impact: { direction: 1, immediatePct: 0.02, driftPct: 0.015, frontWeight: 1.5, backWeight: 0.7, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
                strategy: {
                    action: 'Buy the structure (Prompt over Forward)',
                    reasoning: 'Anticipated supply losses immediately pull the front of the Gasoil curve into backwardation as traders price in local shortages.',
                    principle: 'Refinery outages destroy crude demand but spike product prices.'
                }
            },
            {
                tick: 150,
                category: 'Supply',
                headline: 'Strikes Begin: 1.2M bpd Capacity Offline',
                detail: 'The strike is official. Distillate production in Northwest Europe plummets. Cargoes from the US Gulf Coast are chartered to backfill, but will take 14 days to arrive.',
                impact: { direction: 1, immediatePct: 0.03, driftPct: 0.02, frontWeight: 1.8, backWeight: 0.5, volatilityMultiplier: 1.5, noiseAmplifier: 1.4 },
                strategy: {
                    action: 'Hold the spread',
                    reasoning: 'The arbitrage window from the US is open, but the 14-day transit time means the prompt month remains extremely tight.',
                    principle: 'Arbitrage closing time equals the duration of the prompt squeeze.'
                },
                riskNote: 'Once US arbs arrive in the second month (Nov), the back of the curve will collapse.'
            },
            {
                tick: 225,
                category: 'Logistics',
                headline: 'French Strategic Petroleum Reserves Tapped',
                detail: 'Government authorizes release of gasoil from strategic reserves to prevent petrol stations running dry.',
                impact: { direction: -1, immediatePct: 0.015, driftPct: 0.01, frontWeight: 1.4, backWeight: 0.5, volatilityMultiplier: 1.2, noiseAmplifier: 1.2 },
                strategy: {
                    action: 'Reduce Longs Marginally',
                    reasoning: 'SPR releases apply temporary bearish pressure to the prompt curve, offering relief to the physical squeeze.',
                    principle: 'Government intervention softens the peaks of supply shocks.'
                }
            },
            {
                tick: 300,
                category: 'Supply',
                headline: 'Deteriorating Labor Talks Prolong Strike',
                detail: 'Union leaders walk away from the negotiation table. It is now feared the strike will last another 3 weeks.',
                impact: { direction: 1, immediatePct: 0.025, driftPct: 0.015, frontWeight: 1.5, backWeight: 1.2, volatilityMultiplier: 1.4, noiseAmplifier: 1.3 },
                strategy: {
                    action: 'Buy Back Months',
                    reasoning: 'A prolonged strike shifts the tightness further down the curve because the outage will persist into the next delivery cycle.',
                    principle: 'Duration of disruption dictates which part of the curve prices the premium.'
                }
            },
            {
                tick: 375,
                category: 'Data',
                headline: 'US Distillate Exports to Europe Hit Record',
                detail: 'PADD 3 refiners on the US Gulf Coast ramp up runs to capture the massive Transatlantic arbitrage, flooding ships headed to ARA.',
                impact: { direction: -1, immediatePct: 0.01, driftPct: 0.015, frontWeight: 0.8, backWeight: 1.8, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
                strategy: {
                    action: 'Sell Back Months (Nov/Dec)',
                    reasoning: 'The incoming armada of US diesel will hit Northwest Europe in 2 weeks, capping the backwardation in the forward months.',
                    principle: 'Wide arbs eventually cure the high prices that created them.'
                }
            },
            {
                tick: 450,
                category: 'Supply',
                headline: 'US Gulf Coast Diesel Armada Arrives',
                detail: 'A massive wave of imported Gasoil hits the ARA storage tanks just as the French government forces workers back to the refineries.',
                impact: { direction: -1, immediatePct: 0.035, driftPct: 0.025, frontWeight: 1.9, backWeight: 1.1, volatilityMultiplier: 1.5, noiseAmplifier: 1.4 },
                strategy: {
                    action: 'Sell the spread, go short outright',
                    reasoning: 'The combination of resumed local production and arriving imports completely floods the prompt market.',
                    principle: 'Oversupply resolving a shortage violently flips the curve back to contango.'
                }
            }
        ],
        noiseEvents: [
            {
                tickRange: [0, 545],
                frequency: 78,
                pool: [
                    "French petrol stations report 30% run-dry rates",
                    "European diesel crack spreads hit multi-year highs",
                    "US Gulf Coast to UK Continent freight rates double",
                    "TotalEnergies declares force majeure on domestic deliveries",
                    "Diesel imports from India via Suez Canal increase slightly"
                ]
            }
        ]
    },
    {
        id: 'go_rhine_drought',
        name: 'The Dry Rhine Squeeze',
        assetType: 'gasoil',
        difficulty: 'Medium-Hard',
        description: 'A historic summer drought leaves the Rhine River water levels critically low, preventing oil barges from reaching inland Germany and Switzerland. Trade the structural collapse.',
        contractSize: 100,
        numMonths: 3,
        months: ['Aug', 'Sep', 'Oct'],
        startPrice: 800.00,
        totalTicks: 545,
        disablePopups: true,
        monthlySpread: -5.00,
        marketVolatility: 0.0035,
        events: [
            {
                tick: 75,
                category: 'Logistics',
                headline: 'Kaub Chokepoint Drops Below 40cm',
                detail: 'Barges can now only load 20% of their maximum capacity to avoid running aground on the Rhine. Inland buyers are desperate.',
                impact: { direction: -1, immediatePct: 0.02, driftPct: 0.015, frontWeight: 1.8, backWeight: 0.4, volatilityMultiplier: 1.4, noiseAmplifier: 1.3 },
                strategy: {
                    action: 'Sell Prompt (ARA), Buy Forward',
                    reasoning: 'Because Gasoil cannot be shipped inland, it backs up in coastal storage (ARA). This stranded coastal supply crashes the prompt futures price (which prices at ARA), causing Contango.',
                    principle: 'Stranded supply at a pricing hub collapses the prompt curve, even if inland cash markets are spiking.'
                }
            },
            {
                tick: 150,
                category: 'Data',
                headline: 'Inland German Diesel Premiums Explode',
                detail: 'Munich and Stuttgart wholesale gasoil prices trade $50/MT above ICE Futures as physical scarcity takes hold.',
                impact: { direction: 1, immediatePct: 0.01, driftPct: 0.005, frontWeight: 0.5, backWeight: 0.5, volatilityMultiplier: 1.1, noiseAmplifier: 1.2 },
                strategy: {
                    action: 'Do Nothing (Hold Spread)',
                    reasoning: 'Inland premiums DO NOT lift the ICE futures contract, which prices at the coast. This is pure basis risk.',
                    principle: 'Understand your pricing hub. Inland scarcity equals coastal glut if the transport link is broken.'
                }
            },
            {
                tick: 225,
                category: 'Supply',
                headline: 'ARA Gasoil Storage Hits 95% Capacity',
                detail: 'The backlog of unsold barge material continues to fill Amsterdam-Rotterdam-Antwerp tanks. Storage costs are skyrocketing.',
                impact: { direction: -1, immediatePct: 0.03, driftPct: 0.02, frontWeight: 2.0, backWeight: 0.6, volatilityMultiplier: 1.5, noiseAmplifier: 1.4 },
                strategy: {
                    action: 'Aggressively sell prompt',
                    reasoning: 'When storage fills, prompt prices must fall deep enough into Contango to pay for floating storage or force refineries to cut runs.',
                    principle: 'Tank tops equal violent contango.'
                }
            },
            {
                tick: 300,
                category: 'Refining',
                headline: 'European Refineries Cut Distillate Runs',
                detail: 'Unable to sell their gasoil due to full tanks, major coastal refiners are dramatically cutting their throughput.',
                impact: { direction: 1, immediatePct: 0.02, driftPct: 0.015, frontWeight: 0.8, backWeight: 1.8, volatilityMultiplier: 1.3, noiseAmplifier: 1.2 },
                strategy: {
                    action: 'Buy the Back Months (Sep/Oct)',
                    reasoning: 'Run cuts today mean true structural supply tightness next month when the river eventually clears.',
                    principle: 'Run cuts to fix a prompt glut create a deferred deficit.'
                }
            },
            {
                tick: 375,
                category: 'Logistics',
                headline: 'Rail Freight Substitutes Secured',
                detail: 'Major distributors have secured block trains to move Gasoil from Rotterdam to Switzerland, bypassing the river.',
                impact: { direction: 1, immediatePct: 0.015, driftPct: 0.01, frontWeight: 1.4, backWeight: 0.5, volatilityMultiplier: 1.2, noiseAmplifier: 1.1 },
                strategy: {
                    action: 'Cover Prompt Shorts',
                    reasoning: 'Alternative logistics act as a relief valve, preventing total tank-tops at the coast and bleeding the artificial contango.',
                    principle: 'The market will always find a way to clear, even if it is expensive rail freight.'
                }
            },
            {
                tick: 450,
                category: 'Weather',
                headline: 'Torrential Alps Rain Forecast',
                detail: 'Heavy precipitation is finally modeled over the Rhine catchment area. Water levels are expected to normalize within 72 hours.',
                impact: { direction: 1, immediatePct: 0.035, driftPct: 0.025, frontWeight: 2.2, backWeight: 1.0, volatilityMultiplier: 1.6, noiseAmplifier: 1.5 },
                strategy: {
                    action: 'Cover shorts and buy the front',
                    reasoning: 'The stored barrels at the coast can finally move. The artificial contango vanishes as the logistical dam breaks.',
                    principle: 'Logistical fixes instantly erase stranded-supply discounts.'
                }
            }
        ],
        noiseEvents: [
            {
                tickRange: [0, 545],
                frequency: 93,
                pool: [
                    "Rhine water levels at Kaub remain at critical lows",
                    "Swiss government considers tapping emergency heating oil reserves",
                    "Barge operators impose 'low water surcharges' on all fixtures",
                    "German utility companies warn of winter supply chain issues",
                    "ARA independent storage operators report waiting lists for tank space"
                ]
            }
        ]
    }
];
