import { useState, useEffect } from 'react';
import useGameStore from './state/gameStore.js';
import useCareerStore from './state/careerStore.js';
import ScenarioMenu from './components/ScenarioMenu.jsx';
import PriceChart from './components/PriceChart.jsx';
import NewsFeed from './components/NewsFeed.jsx';
import TradingPanel from './components/TradingPanel.jsx';
import PositionTracker from './components/PositionTracker.jsx';
import MarketDataBar from './components/MarketDataBar.jsx';
import ScoreReport from './components/ScoreReport.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import TradingGuide from './components/TradingGuide.jsx';
import Tutorial from './components/Tutorial.jsx';
import StrategyReview from './components/StrategyReview.jsx';
import EventPopup from './components/EventPopup.jsx';
import MomentumMeter from './components/MomentumMeter.jsx';
import SignalNoiseTrainer from './components/SignalNoiseTrainer.jsx';
import CargoHedgeGame from './components/CargoHedgeGame.jsx';
import FuturesGame from './components/FuturesGame.jsx';
import CrackSpreadGame from './components/CrackSpreadGame.jsx';

function LiveTimer() {
  const startTime = useGameStore(s => s.startTime);
  const gameStatus = useGameStore(s => s.gameStatus);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!startTime || gameStatus === 'finished') return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 200);

    return () => clearInterval(interval);
  }, [startTime, gameStatus]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <span className="timer-badge">
      ⏱ {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </span>
  );
}

function App() {
  const gameStatus = useGameStore(s => s.gameStatus);
  const currentScenario = useGameStore(s => s.currentScenario);
  const currentTick = useGameStore(s => s.currentTick);
  const pendingEvent = useGameStore(s => s.pendingEvent);
  const gameMode = useGameStore(s => s.gameMode);

  const activeTheme = useCareerStore(s => s.activeTheme);

  useEffect(() => {
    document.body.classList.remove('theme-default', 'theme-retro', 'theme-cyberpunk', 'theme-bloomberg');
    document.body.classList.add(`theme-${activeTheme}`);
  }, [activeTheme]);

  const [showGuide, setShowGuide] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showStrategyReview, setShowStrategyReview] = useState(false);
  const [showTrainer, setShowTrainer] = useState(false);
  const [showCargoGame, setShowCargoGame] = useState(false);
  const [showFuturesGame, setShowFuturesGame] = useState(false);
  const [showCrackGame, setShowCrackGame] = useState(false);

  // Show Trading Principles Guide
  if (showGuide) {
    return <TradingGuide onBack={() => setShowGuide(false)} />;
  }

  // Show Signal vs Noise Trainer
  if (showTrainer) {
    return <SignalNoiseTrainer onBack={() => setShowTrainer(false)} />;
  }

  // Show Cargo Hedging Game
  if (showCargoGame) {
    return <CargoHedgeGame onBack={() => setShowCargoGame(false)} />;
  }

  // Show Futures Curve Game
  if (showFuturesGame) {
    return <FuturesGame onBack={() => setShowFuturesGame(false)} />;
  }

  // Show Crack Spread Game
  if (showCrackGame) {
    return <CrackSpreadGame onBack={() => setShowCrackGame(false)} />;
  }

  // Show menu
  if (gameStatus === 'menu') {
    return (
      <>
        <ScenarioMenu
          onTutorial={() => setShowTutorial(true)}
          onGuide={() => setShowGuide(true)}
          onTrainer={() => setShowTrainer(true)}
          onCargoGame={() => setShowCargoGame(true)}
          onFuturesGame={() => setShowFuturesGame(true)}
          onCrackGame={() => setShowCrackGame(true)}
        />
        {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
      </>
    );
  }

  const totalTicks = currentScenario?.totalTicks || 300;

  return (
    <div className="terminal-container">
      {/* Header */}
      <div className="terminal-header">
        <div className="logo">
          OilSim
          <span>Terminal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mode indicator */}
          <span className={`mode-indicator ${gameMode}`}>
            {gameMode === 'learning' ? '🎓 Learning' : '⚡ Trading'}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--cyan)' }}>
            {currentScenario?.name}
          </span>
          <span className="round-badge">
            Tick {currentTick} / {totalTicks}
          </span>
          {/* Live timer for trading mode */}
          {gameMode === 'trading' && <LiveTimer />}
        </div>
      </div>

      {/* Main Grid */}
      <div className="terminal-body">
        <ErrorBoundary>
          <PriceChart />
        </ErrorBoundary>
        <NewsFeed />
        <TradingPanel />
        <PositionTracker />
        <MomentumMeter />
      </div>

      {/* Footer */}
      <MarketDataBar />

      {/* Event Popup — appears when impact event fires */}
      {pendingEvent && <EventPopup />}

      {/* Score Report Modal */}
      {gameStatus === 'finished' && !pendingEvent && !showStrategyReview && (
        <ScoreReport onReviewStrategy={() => setShowStrategyReview(true)} />
      )}

      {/* Strategy Review Modal */}
      {showStrategyReview && (
        <StrategyReview onClose={() => setShowStrategyReview(false)} />
      )}

      {/* Signature */}
      <div className="author-signature">
        Built by Michael L
      </div>
    </div>
  );
}

export default App;
