import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useSocket } from '../contexts/SocketContext';

export function Header() {
  const { playerName, room, reset } = useGameStore();
  const { isConnected } = useSocket();
  const navigate = useNavigate();

  const handleLeave = () => {
    reset();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-purple-600">Art Sabotage</h1>
            {room && (
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                Sala: {room.code}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {playerName && (
              <span className="text-gray-600">
                Olá, <span className="font-semibold">{playerName}</span>
              </span>
            )}
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-500">
                {isConnected ? 'Online' : 'Offline'}
              </span>
            </div>

            {room && (
              <button
                onClick={handleLeave}
                className="text-red-600 hover:text-red-800 font-medium text-sm"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
