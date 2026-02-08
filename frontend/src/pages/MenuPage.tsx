import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { useSocket } from '../contexts/SocketContext';
import { Button, Input } from '../components';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function MenuPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { playerName, setError } = useGameStore();
  const { joinRoom } = useSocket();
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao criar sala');
      }

      const data = await response.json();
      
      // Join the room via WebSocket
      joinRoom(data.code, playerName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar sala');
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Digite o código da sala');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/rooms/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          roomCode: roomCode.trim().toUpperCase(), 
          playerName 
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao entrar na sala');
      }

      const data = await response.json();
      
      // Join the room via WebSocket
      joinRoom(data.code, playerName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar na sala');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Bem-vindo, {playerName}!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Crie uma sala ou entre em uma existente
        </p>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'create'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Criar Sala
          </button>
          <button
            onClick={() => setActiveTab('join')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'join'
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Entrar
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'create' ? (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Crie uma nova sala e convide seus amigos para jogar!
              </p>
              <Button
                onClick={handleCreateRoom}
                isLoading={isLoading}
                fullWidth
                size="lg"
              >
                Criar Nova Sala
              </Button>
            </div>
          ) : (
            <div>
              <Input
                label="Código da Sala"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Ex: ABC123"
                maxLength={6}
                helperText="Digite o código de 6 caracteres"
              />
              <Button
                onClick={handleJoinRoom}
                isLoading={isLoading}
                disabled={roomCode.trim().length !== 6}
                fullWidth
                size="lg"
                variant="secondary"
              >
                Entrar na Sala
              </Button>
            </div>
          )}
        </div>

        <Button
          onClick={() => navigate('/')}
          variant="outline"
          fullWidth
          size="sm"
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}
