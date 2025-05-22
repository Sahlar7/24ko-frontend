// src/containers/GamePage.js
import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { X } from 'lucide-react';
import PlayersStatus from '../components/playersStatus';

const GamePage = () => {
  const {socket, player, lobby} = useGame();
  
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', or ''
  const [currentCard, setCurrentCard] = useState(generateCard());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (countdown >= 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  })

  useEffect(() => {
    socket.on('playerDied', () => {
      setGameOver(true);
      setTimeout(() => setGameOver(false), 3000);
    });
    return () =>{
      socket.off('playerDied');
    }
  })
  


  useEffect(() => {
    if (timerInterval) clearInterval(timerInterval); 
    setElapsedTime(0);
    const interval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000); 
    setTimerInterval(interval);

    return () => clearInterval(interval); 
  }, [currentCard]);

  function validateCard(card) {
    const permutations = getAllPermutations(card);
    
    const operators = ['+', '-', '*', '/'];
    
    for (const perm of permutations) {
      for (const op1 of operators) {
        for (const op2 of operators) {
          for (const op3 of operators) {
            
            // Case 1: ((a op1 b) op2 c) op3 d
            const val1 = applyOp(applyOp(applyOp(perm[0], op1, perm[1]), op2, perm[2]), op3, perm[3]);
            if (Math.abs(val1 - 24) < 0.0001) {
              console.log(`Found a valid combination: ${perm[0]} ${op1} ${perm[1]} ${op2} ${perm[2]} ${op3} ${perm[3]}`);
              return true;
            }
            
            // Case 2: (a op1 b) op2 (c op3 d)
            const val2 = applyOp(applyOp(perm[0], op1, perm[1]), op2, applyOp(perm[2], op3, perm[3]));
            if (Math.abs(val2 - 24) < 0.0001) {
              console.log(`Found a valid combination: ${perm[0]} ${op1} ${perm[1]} ${op2} ${perm[2]} ${op3} ${perm[3]}`);
              return true;
            }
            
            // Case 3: a op1 ((b op2 c) op3 d)
            const val3 = applyOp(perm[0], op1, applyOp(applyOp(perm[1], op2, perm[2]), op3, perm[3]));
            if (Math.abs(val3 - 24) < 0.0001) {
              console.log(`Found a valid combination: ${perm[0]} ${op1} ${perm[1]} ${op2} ${perm[2]} ${op3} ${perm[3]}`);
              return true;
            }
            
            // Case 4: a op1 (b op2 (c op3 d))
            const val4 = applyOp(perm[0], op1, applyOp(perm[1], op2, applyOp(perm[2], op3, perm[3])));
            if (Math.abs(val4 - 24) < 0.0001) {
              console.log(`Found a valid combination: ${perm[0]} ${op1} ${perm[1]} ${op2} ${perm[2]} ${op3} ${perm[3]}`);
              return true;
            }
              
            
            // Case 5: (a op1 (b op2 c)) op3 d
            const val5 = applyOp(applyOp(perm[0], op1, applyOp(perm[1], op2, perm[2])), op3, perm[3]);
            if (Math.abs(val5 - 24) < 0.0001) {
              console.log(`Found a valid combination: ${perm[0]} ${op1} ${perm[1]} ${op2} ${perm[2]} ${op3} ${perm[3]}`);
              return true;
            }
          }
        }
      }
    }
    
    return false;
  }

  function applyOp(a, op, b) {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : NaN;
      default: return NaN;
    }
}

function getAllPermutations(arr) {
  const result = [];
  
  function permute(arr, m = []) {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        const current = arr.slice();
        const next = current.splice(i, 1);
        permute(current, m.concat(next));
      }
    }
  }
  
  permute(arr);
  return result;
}
  function generateCard() {
    let tries = 0;
    const defaultCards = [
      [3, 5, 7, 9],
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [2, 4, 6, 8],
      [1, 3, 5, 7],
    ]
    while (tries < 100) {
      const newCard = [];
      for (let i = 0; i < 4; i++) {
        const randomNum = Math.floor(Math.random() * 15) + 1;
        newCard.push(randomNum);
      }
      if (validateCard(newCard)) {
        return newCard;
      }
      tries++;
    }
    // If no valid card is found, fallback to a default card
    const randomIndex = Math.floor(Math.random() * defaultCards.length);
    return defaultCards[randomIndex];
  }

  const calculateDamage = (time) => {
    const decay = Math.exp(-0.2 * time/10);
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
        setCurrentCard(generateCard());
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
      {/* Game Over Popup */}
      {gameOver && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Game Over</h2>
            <p className="text-lg text-gray-700">You have been eliminated!</p>
          </div>
        </div>
      )}
      {gameOver && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-green-600 mb-4">Finished!</h2>
          </div>
        </div>
      )}
      <div className="w-full max-w-3xl">
      {countdown > -1 ? (
      <>
      {/* Countdown */}
        {countdown > 0 && (
          <div className="text-center text-lg font-bold text-red-600 mt-4">
            {countdown}
          </div>
        )}
        {countdown === 0 && (
          <div className="text-center text-lg font-bold text-green-600 mt-4">
            Game Start!
          </div>
        )}
      </>
    ) :(
      <>
    
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
                    disabled = {player.isAlive === false}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. (8+4)*(2+1)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button 
                    disabled = {!inputValue.trim() || player.isAlive === false}
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
                    disabled = {player.isAlive === false}
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
        </>
        )}
      </div>
    </div>
  );
};

export default GamePage;