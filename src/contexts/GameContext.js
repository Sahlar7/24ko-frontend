import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';



const GameContext = createContext();
const socket = io(process.env.REACT_APP_SERVER_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {

      
    socket.on('connect', () => {
        console.log('Connected to server:', socket.id);
    });
    socket.on('disconnect', () => {
        console.log('Disconnected from server:', socket.id);
    });
    socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
    });    

    const [player, setPlayer] = useState(null);
    const [lobby, setLobby] = useState(null); 


  useEffect(() => {
    socket.on('updateLobby', (lobby) => {
        setLobby(lobby);
        console.log('Lobby updated:', lobby);
    });

    socket.on('updatePlayer', (player) => {
        setPlayer(player);
        console.log('Player updated:', player);
    });
    
    return () => {
      socket.off('updateLobby');
      socket.off('updatePlayer');
    };
  });
  
  
  
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
      socket
    }}>
      {children}
    </GameContext.Provider>
  );
};