import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import PlayerList from '../components/playerList';
import Notification from '../components/notification';

const LobbyPage = () => {
  const { socket, player, lobby, setPlayer, setLobby } = useGame();
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(null);

  useEffect(() =>{
    socket.on('playerExited', (message) => {
      setMessage(message);
    });

    socket.on('startGame', () => {
      setCountdown(3);
    });

    return () => {
      socket.off('playerExited');
      socket.off('startGame');
    };
  });

  useEffect(() =>{
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
    else if (countdown === 0) {
      socket.emit('countdownFinished', lobby.id);
      setCountdown(null);
    }
  }, [countdown]);


  const exitLobby = () => {
    setLobby(null);
    setPlayer(null);
    socket.emit('exitLobby');
  };

  const handleReady = () => {
    socket.emit('playerReady', lobby.id);
  };

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-purple-800 mb-2">Game Lobby</h1>
        
        {/* Lobby Code */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="bg-gray-100 px-4 py-2 rounded text-lg font-mono">
            {lobby.id}
          </div>
        </div>
        {/* Notification Message */}
        {message && (
        <Notification message={message} setMessage={setMessage} />
      )}
        
        {/* Player List */}
        <PlayerList player={player} lobby={lobby} />

         {/* Countdown */}
         {countdown > 0 && (
          <div className="text-center text-lg font-bold text-red-600 mt-4">
            Game starting in {countdown}...
          </div>
        )}

        {/* Game Controls */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => exitLobby()}
            disabled={player.ready}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
          >
            Leave Lobby
          </button>
          
            <button
              onClick={handleReady}
              disabled={lobby.players.length < 2 || player.ready}
              className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors ${
                (lobby.players.length < 2 || player.ready) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {!player.ready ? 'Ready' : 'Waiting for other players to ready...'}
            </button>
        </div>
        {lobby.players.length < 2 &&(
          <div className="mt-4 text-amber-600 text-sm text-center">
            Need at least 2 players to play. Share your lobby code with friends to play together
          </div>
        )}
      </div>
      
      <div className="mt-6 text-gray-600 text-sm max-w-md text-center">
        <h3 className="font-bold mb-1">How to Play</h3>
        <p>Use the four numbers and arithmetic operations (+, -, ×, ÷) to make exactly 24. 
        Solve cards quickly to attack opponents and be the last mathematician standing!</p>
      </div>
    </div>
  );
};

export default LobbyPage;