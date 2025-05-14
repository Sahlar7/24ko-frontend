// src/containers/GamePage.js
import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { Shield, X } from 'lucide-react';
import PlayersStatus from '../components/playersStatus';

const GamePage = () => {
  const {socket, player, lobby} = useGame();
  
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', or ''
  const [currentCard, setCurrentCard] = useState([3, 5, 7, 9]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  


  useEffect(() => {
    if (timerInterval) clearInterval(timerInterval); 
    setElapsedTime(0);
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000); 
    setTimerInterval(interval);

    return () => clearInterval(interval); 
  }, [currentCard]);

  const calculateDamage = (time) => {
    const decay = Math.exp(-time/10);
    return Math.max(Math.floor(40 * decay), 5);
  }


  
  const submitSolution = () => {
    if (!inputValue.trim()) {
      setMessage('Please enter a solution');
      setMessageType('error');
      return;
    }

    const allowedOperations = ['+', '-', '*', '/', '(', ')'];

    const inputNumbers = inputValue.match(/\d+/g)?.map(Number) || [];
    const inputOperations = inputValue.match(/[+\-*/()]/g) || [];

    const isValidNumbers =
      inputNumbers.length === currentCard.length &&
      inputNumbers.every((num) => currentCard.includes(num)) &&
      currentCard.every((num) => inputNumbers.includes(num));

    const isValidOperations = inputOperations.every((op) =>
      allowedOperations.includes(op)
    );

    if (!isValidNumbers || !isValidOperations) {
      setMessage('Invalid solution. Use only the given numbers and allowed operations.');
      setMessageType('error');
      return;
    }

    try {
      // Evaluate the input string
      const result = new Function(`return (${inputValue})`)();

      // Check if the result equals 24
      if (result === 24) {
        setInputValue('');
        setMessage('Correct! You solved it!');
        setMessageType('success');
        const damage = calculateDamage(elapsedTime);
        setCurrentCard([3, 5, 7, 9]);
        socket.emit('playerSolved', lobby.id, damage);

        // Clear success message after 1.5 seconds
        setTimeout(() => {
          setMessage('');
          setMessageType('');
        }, 1500);
      } else {
        setMessage(`Incorrect! Your result is ${result}, not 24.`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Invalid expression. Please check your input.');
      setMessageType('error');
    }
  };
  
  // Handle keypress events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitSolution();
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-3xl">
        {/* Game Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-800">24KO</h1>
        </div>
        
        {/* Game Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Players */}
          <PlayersStatus player={player} lobby={lobby} />
        
          {/* Middle Column - Game Area */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 order-1 lg:order-2">
            <div className="flex flex-col items-center">
              {/* Current Card */}
              <div className="flex justify-center gap-3 mb-8">
                {currentCard.map((num, index) => (
                  <div 
                    key={index} 
                    className="w-16 h-20 flex items-center justify-center bg-purple-100 rounded-lg shadow-sm text-2xl font-bold text-purple-800"
                  >
                    {num}
                  </div>
                ))}
              </div>
              
              {/* Instructions */}
              <div className="text-center mb-6 text-gray-600">
                <p>Use these numbers and operations (+, -, ×, ÷) to make exactly 24</p>
              </div>
              
              {/* Input form */}
              <div className="w-full max-w-md">
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. (8+4)*(2+1)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button 
                    onClick={submitSolution}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
                  >
                    Submit
                  </button>
                </div>
                
                {/* Message */}
                <div 
                  className={`text-center py-2 rounded-md ${
                    messageType === 'success' ? 'text-green-600 bg-green-50' : 
                    messageType === 'error' ? 'text-red-600 bg-red-50' : ''
                  } ${message ? 'opacity-100' : 'opacity-0'} transition-opacity`}
                >
                  {message}
                </div>
              </div>

              {/* Operations Help */}
              <div className="mt-8 grid grid-cols-4 gap-2">
                {['+', '-', '×', '÷', '(', ')', '*', '/'].map((op, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(prev => prev + (op === '×' ? '*' : op === '÷' ? '/' : op))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md text-lg font-medium transition-colors"
                  >
                    {op}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setInputValue('')}
                className="mt-2 text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
              >
                <X size={14} /> Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;