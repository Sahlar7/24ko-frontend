import React, {useEffect} from "react";
import { Heart, Zap, User } from "lucide-react";

const PlayersStatus = ({ lobby, player }) => {

    useEffect(() => {
        
    });

    return(
        <div className="bg-white rounded-xl shadow-md p-4 order-2 lg:order-1">
            <h2 className="text-lg font-semibold mb-3 text-gray-700">Players</h2>
            
            {lobby.players.map((p) => (
              <div 
                key={p.socketId} 
                className={`p-3 mb-2 rounded-lg ${
                  p.socketId === player.socketId ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                } ${!p.isAlive ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className={p.socketId === player.socketId ? 'text-blue-500' : 'text-gray-500'} />
                  <span className="font-medium">{p.name}</span>
                  {!p.isAlive && <span className="text-xs text-red-500 ml-auto">(Eliminated)</span>}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Heart size={14} className="text-red-500" />
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 rounded-full" 
                        style={{ width: `${p.health}%` }}
                      />
                    </div>
                    <span className="text-xs ml-1">{p.health}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-purple-600">
                    <Zap size={14} />
                    <span className="text-xs">{p.solvedCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
    );
};
export default PlayersStatus;