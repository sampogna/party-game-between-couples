interface PhaseIndicatorProps {
  phase: string;
}

export function PhaseIndicator({ phase }: PhaseIndicatorProps) {
  const phases = [
    { id: 'LOBBY', label: 'Sala de Espera', color: 'bg-gray-500' },
    { id: 'PREPARATION', label: 'Preparação', color: 'bg-yellow-500' },
    { id: 'DRAWING', label: 'Desenhando', color: 'bg-blue-500' },
    { id: 'VOTING', label: 'Votação', color: 'bg-purple-500' },
    { id: 'RESULTS', label: 'Resultados', color: 'bg-green-500' },
    { id: 'GAME_OVER', label: 'Fim de Jogo', color: 'bg-red-500' },
  ];

  const currentPhase = phases.find(p => p.id === phase) || phases[0];

  return (
    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm">
      <div className={`w-3 h-3 rounded-full ${currentPhase.color} animate-pulse`} />
      <span className="font-medium text-gray-800">{currentPhase.label}</span>
    </div>
  );
}
