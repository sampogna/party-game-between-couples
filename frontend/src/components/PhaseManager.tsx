import { useGameStore } from '../stores/gameStore';
import { PreparationPhase } from './PreparationPhase';
import { GamePhaseValues } from '../types';

export function PhaseManager() {
  const { gamePhase, timeRemaining, game, room, playerId } = useGameStore();

  if (!gamePhase || !game || !room) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  const currentPlayer = room.players.find(p => p.id === playerId);
  const isSaboteur = currentPlayer?.role === 'SABOTEUR';
  const theme = isSaboteur ? game.themes.saboteur : game.themes.honest;

  // Formata o tempo restante em mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPhaseContent = () => {
    switch (gamePhase) {
      case GamePhaseValues.LOBBY:
        return (
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Sala de Espera</h3>
            <p className="text-gray-600">Aguardando o host iniciar o jogo...</p>
            <p className="text-sm text-gray-500 mt-2">
              Jogadores: {room.players.length}
            </p>
          </div>
        );

      case GamePhaseValues.PREPARATION:
        return <PreparationPhase />;

      case GamePhaseValues.DRAWING:
        return (
          <div className="text-center p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Tema:</p>
                <p className="text-lg font-semibold text-gray-800">{theme}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Tempo restante:</p>
                <p className="text-2xl font-bold text-blue-600">{formatTime(timeRemaining)}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Rodada {game.round} de {game.maxRounds}
            </p>
          </div>
        );

      case GamePhaseValues.VOTING:
        return (
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Fase de Votação</h3>
            <p className="text-gray-600 mb-4">Vote em quem você acha que é o sabotador!</p>
            {timeRemaining > 0 && (
              <div>
                <p className="text-sm text-gray-500">Tempo restante:</p>
                <p className="text-3xl font-bold text-purple-600">{formatTime(timeRemaining)}</p>
              </div>
            )}
          </div>
        );

      case GamePhaseValues.RESULTS:
        return (
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Resultados</h3>
            <p className="text-gray-600">Processando votos...</p>
          </div>
        );

      case GamePhaseValues.GAME_OVER:
        return (
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Fim de Jogo</h3>
            <p className="text-gray-600">Obrigado por jogar!</p>
            <p className="text-sm text-gray-500 mt-2">
              {game.round} rodadas completadas
            </p>
          </div>
        );

      default:
        return (
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">Fase desconhecida</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderPhaseContent()}
    </div>
  );
}
