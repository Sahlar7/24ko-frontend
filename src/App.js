import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './containers/HomePage';
import LobbyPage from './containers/LobbyPage';
import GamePage from './containers/GamePage';
import ResultsPage from './containers/ResultsPage';
import { GameProvider } from './contexts/GameContext';

function App() {
  return (
    <Router>
      <GameProvider>
        <div className="app bg-gradient-to-b from-purple-50 to-blue-100 min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/lobby/:lobbyId" element={<LobbyPage />} />
            <Route path="/game/:gameId" element={<GamePage />} />
            <Route path="/results/:gameId" element={<ResultsPage />} />
          </Routes>
        </div>
      </GameProvider>
    </Router>
  );
}

export default App;