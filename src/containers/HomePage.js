import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';

const HomePage = () => {
  const {setPlayer, socket, setLobby } = useGame();
  
  const [name, setName] = useState('');
  const [lobbyId, setLobbyId] = useState('');
  const [error, setError] = useState('');
  
    useEffect(() =>{
        socket.on('lobbyJoined', (lobby, player) => {
            setLobby(lobby);
            setPlayer(player);
        });

        socket.on('lobbyNotFound', (message) => {
            setError(message);
        });

        socket.on('lobbyFull', (message) => {
            setError(message);
        });

        socket.on('lobbyInGame', (message) => {
                setError(message);
         });

        return () => {
            socket.off('lobbyJoined');
            socket.off('lobbyNotFound');
            socket.off('lobbyFull');
            socket.off('lobbyInGame');
          };
        });

  const createLobby = () => {
    if (!name.trim()) {
        setError('Please enter your name first');
        return;
      }
    socket.emit('createLobby', name);
  };
  
  const joinLobby = () => {
    if (!name.trim()) {
        setError('Please enter your name first');
        return;
    }
      
    if (!lobbyId.trim()) {
        setError('Please enter a lobby code');
        return;
    }
    socket.emit('joinLobby', lobbyId, name);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-purple-800 mb-6">24 KO</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            maxLength={15}
          />
        </div>
        
        <div className="flex flex-col gap-4 mb-6">
          <button
            onClick={createLobby}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
          >
            Create New Game
          </button>
          
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lobby-code">
              Join with Code
            </label>
            <div className="flex gap-2">
              <input
                id="lobby-code"
                type="text"
                value={lobbyId}
                onChange={(e) => setLobbyId(e.target.value)}
                placeholder="Enter lobby code"
                className="shadow appearance-none border rounded flex-grow py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={joinLobby}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 text-sm">
          <p>A twist on the classic 24 game! Solve problems, attack opponents, be the last one standing!</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;