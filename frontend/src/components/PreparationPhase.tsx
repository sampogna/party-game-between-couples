import { useGameStore } from '../stores/gameStore';
import { CountdownTimer } from './CountdownTimer';

export function PreparationPhase() {
  const { game, room, playerId, timeRemaining } = useGameStore();

  if (!game || !room) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  const currentPlayer = room.players.find(p => p.id === playerId);
  const isSaboteur = currentPlayer?.role === 'SABOTEUR';
  const theme = isSaboteur ? game.themes.saboteur : game.themes.honest;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header da fase */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Fase de Preparação</h2>
        <p className="text-gray-600">Prepare-se para a rodada {game.round} de {game.maxRounds}</p>
      </div>

      {/* Card de Papel */}
      <div className={`mb-6 p-8 rounded-2xl border-2 shadow-lg transform transition-all duration-500 hover:scale-105 ${
        isSaboteur 
          ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300' 
          : 'bg-gradient-to-br from-green-50 to-green-100 border-green-300'
      }`}>
        <div className="text-center">
          <div className={`text-6xl mb-4 ${isSaboteur ? 'animate-pulse' : ''}`}>
            {isSaboteur ? '🕵️' : '🎨'}
          </div>
          <p className="text-sm text-gray-600 uppercase tracking-wider font-semibold mb-2">
            Seu Papel
          </p>
          <h3 className={`text-4xl font-bold mb-4 ${
            isSaboteur ? 'text-red-600' : 'text-green-600'
          }`}>
            {isSaboteur ? 'Sabotador' : 'Artista'}
          </h3>
          <p className={`text-lg ${isSaboteur ? 'text-red-700' : 'text-green-700'}`}>
            {isSaboteur 
              ? 'Você deve desenhar algo diferente do tema sem ser descoberto!'
              : 'Você deve desenhar o tema corretamente!'
            }
          </p>
        </div>
      </div>

      {/* Card de Tema */}
      <div className="mb-8 p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg">
        <div className="text-center">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-sm text-gray-600 uppercase tracking-wider font-semibold mb-2">
            {isSaboteur ? 'Seu Tema Secreto' : 'Tema para Desenhar'}
          </p>
          <h3 className="text-3xl font-bold text-gray-800 mb-4">
            {theme}
          </h3>
          <p className="text-gray-600">
            {isSaboteur 
              ? 'Desenhe isso de forma sutil para não levantar suspeitas!'
              : 'Desenhe exatamente isso para ganhar pontos!'
            }
          </p>
        </div>
      </div>

      {/* Timer */}
      {timeRemaining > 0 && (
        <div className="mb-6">
          <CountdownTimer 
            seconds={timeRemaining} 
            className="p-6 bg-white rounded-xl shadow-md"
          />
        </div>
      )}

      {/* Dicas */}
      <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">💡</span> Dicas
        </h4>
        <ul className="space-y-2 text-gray-600">
          {isSaboteur ? (
            <>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">•</span>
                Seja discreto, não desenhe algo muito óbvio
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">•</span>
                Tente confundir os outros jogadores
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">•</span>
                Observe como os artistas estão desenhando
              </li>
            </>
          ) : (
            <>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                Desenhe de forma clara e objetiva
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                Preste atenção em quem está desenhando diferente
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-green-500">•</span>
                Trabalhe em equipe para identificar o sabotador
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
