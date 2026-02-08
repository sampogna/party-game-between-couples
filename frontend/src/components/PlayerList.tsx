import type { Player } from '../types';

interface PlayerListProps {
  players: Player[];
  currentPlayerId: string;
}

export function PlayerList({ players, currentPlayerId }: PlayerListProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <span className="text-2xl">👥</span>
        Jogadores ({players.length})
      </h3>
      
      <div className="space-y-2">
        {players.map((player) => (
          <div
            key={player.id}
            className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
              player.id === currentPlayerId
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
              {player.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {player.name}
                {player.id === currentPlayerId && (
                  <span className="ml-2 text-xs text-purple-600">(Você)</span>
                )}
              </p>
              {player.isHost && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  Host
                </span>
              )}
            </div>
            
            <div className={`w-3 h-3 rounded-full ${
              player.socketId ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
        ))}
      </div>
      
      {players.length < 3 && (
        <p className="mt-4 text-sm text-gray-500 text-center">
          Mínimo 3 jogadores recomendados
        </p>
      )}
    </div>
  );
}
