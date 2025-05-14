import React from 'react';
import HomePage from './containers/HomePage';
import LobbyPage from './containers/LobbyPage';
import GamePage from './containers/GamePage';
import ResultsPage from './containers/ResultsPage';
import { GameProvider } from './contexts/GameContext';
import { useGame } from './contexts/GameContext';

function Layout() {
  const {lobby} = useGame();
  return (
    <>
      {!lobby ? (
        <HomePage />
      ) : lobby.status === 'waiting' ? (
        <LobbyPage />
      ) : lobby.status === 'playing' ? (
        <GamePage />
      ) : (
        <ResultsPage />
      )}
    </>
      
  );
}

function App() {
  return(
    <GameProvider>  
      <Layout />
    </GameProvider>
  )
}

export default App;