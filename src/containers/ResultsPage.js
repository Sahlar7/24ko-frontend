// src/containers/ResultsPage.js
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { Trophy, Medal, Star, ArrowRight, Heart, Zap, User } from 'lucide-react';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const { gameResults, player, resetGame } = useGame();
  
  // Redirect if no game results
  useEffect(() => {
    if (!gameResults || !gameResults.playerStats || gameResults.playerStats.length === 0) {
      navigate('/');
    }
  }, [gameResults, navigate]);

  // Handle starting a new game
  const handlePlayAgain = () => {
    resetGame();
    navigate('/');
  };
  
  if (!gameResults || !gameResults.playerStats || gameResults.playerStats.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Sort players by rank (winner first)
  const sortedPlayers = [...gameResults.playerStats].sort((a, b) => a.rank - b.rank);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800 mb-2">Game Results</h1>
          <p className="text-gray-600">Math battle completed!</p>
        </div>
        
        {/* Winner Section */}
        {gameResults.winner && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-6 mb-8 text-center">
            <div className="inline-flex justify-center items-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
              <Trophy size={32} className="text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold mb-1">
              {gameResults.winner.id === player.id ? 'You Won!' : `${gameResults.winner.name} Won!`}
            </h2>
            <p className="text-gray-600">
              with {gameResults.winner.solvedCount} cards solved
            </p>
          </div>
        )}
        
        {/* Players Ranking */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Player Ranking</h3>
          
          {sortedPlayers.map((p, index) => (
            <div 
              key={p.id}
              className={`flex items-center p-4 mb-2 rounded-lg ${
                p.id === player.id ? 'bg-blue-50' : 'bg-gray-50'
              }`}
            >
              {/* Rank */}
              <div className="flex items-center justify-center w-8 h-8 rounded-full mr-3 text-white font-bold"
                style={{ 
                  backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#A0AEC0' 
                }}
              >
                {index + 1}
              </div>
              
              {/* Player Info */}
              <div className="flex-1">
                <div className="flex items-center">
                  <User size={16} className={p.id === player.id ? 'text-blue-500' : 'text-gray-500'} />
                  <span className="font-medium ml-2">{p.name}</span>
                  {p.id === player.id && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">You</span>
                  )}
                </div>
              </div>
              
              {/* Player Stats */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Heart size={16} className="text-red-500" />
                  <span className="text-sm">{p.health}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Zap size={16} className="text-purple-600" />
                  <span className="text-sm">{p.solvedCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handlePlayAgain}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-sm flex items-center gap-2"
          >
            Play Again <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;