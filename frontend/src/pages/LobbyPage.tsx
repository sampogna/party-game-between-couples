import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useSocket } from '../contexts/SocketContext';
import { PlayerList, Button } from '../components';

export function LobbyPage() {
  const { room, playerId, reset } = useGameStore();
  const { leaveRoom, isConnected } = useSocket();
  const navigate = useNavigate();

  const handleLeaveRoom = () => {
    if (room) {
      leaveRoom(room.code);
    }
    reset();
    navigate('/');
  };

  const handleCopyCode = () => {
    if (room) {
      navigator.clipboard.writeText(room.code);
    }
  };

  if (!room) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Sala de Espera</h2>
              <p className="text-gray-600">Aguardando outros jogadores...</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-lg px-4 py-2">
                <span className="text-sm text-gray-600">Código: </span>
                <span className="font-mono font-bold text-lg tracking-widest">
                  {room.code}
                </span>
              </div>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                size="sm"
              >
                Copiar
              </Button>
            </div>
          </div>
          
          {/* Connection Status */}
          <div className="mt-4 flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Players List */}
          <PlayerList players={room.players} currentPlayerId={playerId} />
          
          {/* Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Ações</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Como jogar:</strong>
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                  <li>Um jogador será o sabotador</li>
                  <li>Os outros jogadores tentarão adivinhar quem é</li>
                  <li>Desenhe baseado no tema recebido</li>
                  <li>O sabotador tem um tema diferente!</li>
                </ul>
              </div>
              
              <Button
                onClick={handleLeaveRoom}
                variant="danger"
                fullWidth
              >
                Sair da Sala
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
