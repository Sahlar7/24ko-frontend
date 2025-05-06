import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';


const socket = io(process.env.SERVER_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });
  

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [player, setPlayer] = useState(null);
  const [lobby, setLobby] = useState(null);
  const [card, setCard] = useState(null);
  
  const [gameResults, setGameResults] = useState({
    winner: null,
    playerStats: []
  });


  useEffect(() => {
    socket.on('lobbyJoined', (lobby, player) => {
      setLobby(lobby);
      setPlayer(player);
    });
    
    socket.on('updateLobby', (lobby) => {
        setLobby(lobby);
    });

    socket.on('updatePlayer', (player) => {
        setPlayer(player);
    });

    

    
    return () => {
      socket.off('lobbyJoined');
      socket.off('updateLobby');
      socket.off('updatePlayer');
    };
  });
  
  const createLobby = (name) => {
    const lobbyId = Math.random().toString(36).substring(2, 9);
    socket.emit('createLobby', lobbyId, name);
  };
  
  const joinLobby = (lobbyId, name) => {
    socket.emit('joinLobby', lobbyId, name);
  };
  
  const validateCard = (card) => {
    
  };
 
  const generateCard = () => {
    
  };

 
  
  const submitSolution = (equation) => {
    
  };
  
  
  return (
    <GameContext.Provider value={{
      player,
      setPlayer,
      lobby,
      setLobby,
      createLobby,
      joinLobby,
      submitSolution,
    }}>
      {children}
    </GameContext.Provider>
  );
};