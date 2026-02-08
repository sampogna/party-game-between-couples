import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { Button } from '../components';

export function HomePage() {
  const { playerName } = useGameStore();
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Bem-vindo ao Art Sabotage, {playerName}!
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Um jogo de desenho e dedução onde um jogador é o sabotador!
      </p>
      
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => navigate('/menu')}
          size="lg"
        >
          Jogar Agora
        </Button>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold mb-2">Desenhe</h3>
          <p className="text-gray-600">Desenhe baseado no tema que receber</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">🕵️</div>
          <h3 className="text-lg font-semibold mb-2">Descubra</h3>
          <p className="text-gray-600">Identifique quem está sabotando o desenho</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-4xl mb-4">🏆</div>
          <h3 className="text-lg font-semibold mb-2">Pontue</h3>
          <p className="text-gray-600">Acumule pontos e vença o jogo</p>
        </div>
      </div>
    </div>
  );
}
