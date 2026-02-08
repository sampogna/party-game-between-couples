import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { Button, Input } from '../components';

export function NameInputPage() {
  const [name, setName] = useState('');
  const { setPlayerName } = useGameStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      return;
    }
    setPlayerName(name.trim());
    navigate('/menu');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Art Sabotage
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Desenhe, sabote, descubra!
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Digite seu nome"
            maxLength={20}
            autoFocus
            helperText="Mínimo 2 caracteres"
          />

          <Button
            type="submit"
            disabled={name.trim().length < 2}
            fullWidth
            size="lg"
          >
            Continuar
          </Button>
        </form>
      </div>
    </div>
  );
}
