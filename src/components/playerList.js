import React from 'react';
import { User, Crown } from 'lucide-react';
const PlayerList = ({player, lobby}) => {
    return(
        <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-3 text-gray-700">Players ({lobby.players.length})</h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    {lobby.players.map((p, index) => (
                      <div key={index} className="flex items-center gap-3 py-2 border-b last:border-b-0 border-gray-200">
                        <User size={18} className="text-gray-500" />
                        <span className="font-medium">{p.name}</span>
                        {p.ready && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded ml-auto">Ready</span>}
                        {!p.ready && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded ml-auto">Not Ready</span>}
                        {p.socketId === player.socketId && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">You</span>
                        )}
                      </div>
                    ))}
                    
                    {/* Add placeholder players to show capacity */}
                    {Array(8 - lobby.players.length).fill(0).map((_, index) => (
                      <div key={`empty-${index}`} className="flex items-center gap-3 py-2 border-b last:border-b-0 border-gray-200 text-gray-400 italic">
                        <User size={18} className="text-gray-300" />
                        <span>Waiting for player...</span>
                      </div>
                    ))}
                  </div>
                </div>
    );
};

export default PlayerList;
