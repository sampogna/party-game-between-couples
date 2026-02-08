import { useCallback, useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { MainLayout, PlayerList, PhaseIndicator, GameCanvas, PhaseManager } from '../components';
import type { GameCanvasRef } from '../components/GameCanvas';
import { useSocket } from '../contexts/SocketContext';
import { useGameSocket } from '../hooks/useGameSocket';
import { GamePhaseValues } from '../types';

export function GamePage() {
  const { room, playerId, gamePhase } = useGameStore();
  const { socket, isConnected } = useSocket();
  const canvasRef = useRef<GameCanvasRef>(null);

  // Inicializa o hook de socket do jogo
  useGameSocket();

  // Armazena strokes remotos em progresso
  const remoteStrokesRef = useRef<Map<string, {
    points: { x: number; y: number }[];
    color: string;
    width: number;
  }>>(new Map());

  // Handlers para enviar strokes ao servidor
  const handleStrokeStart = useCallback((strokeId: string, point: { x: number; y: number }, color: string, width: number) => {
    if (!socket || !isConnected || !room) return;
    
    socket.emit('stroke:start', {
      roomCode: room.code,
      strokeId,
      point,
      color,
      width,
    });
  }, [socket, isConnected, room]);

  const handleStrokeContinue = useCallback((strokeId: string, point: { x: number; y: number }) => {
    if (!socket || !isConnected || !room) return;
    
    socket.emit('stroke:continue', {
      roomCode: room.code,
      strokeId,
      point,
    });
  }, [socket, isConnected, room]);

  const handleStrokeEnd = useCallback((strokeId: string) => {
    if (!socket || !isConnected || !room) return;
    
    socket.emit('stroke:end', {
      roomCode: room.code,
      strokeId,
    });
  }, [socket, isConnected, room]);

  const handleClearCanvas = useCallback(() => {
    if (!socket || !isConnected || !room) return;
    
    socket.emit('canvas:clear', {
      roomCode: room.code,
    });
  }, [socket, isConnected, room]);

  // Receber strokes de outros jogadores
  useEffect(() => {
    if (!socket || !room) return;

    // Handler para stroke:start de outros jogadores
    const handleRemoteStrokeStart = (data: {
      strokeId: string;
      playerId: string;
      point: { x: number; y: number };
      color: string;
      width: number;
    }) => {
      // Ignora strokes do próprio jogador
      if (data.playerId === playerId) return;
      
      // Inicia novo stroke remoto
      remoteStrokesRef.current.set(data.strokeId, {
        points: [data.point],
        color: data.color,
        width: data.width,
      });
    };

    // Handler para stroke:continue de outros jogadores
    const handleRemoteStrokeContinue = (data: {
      strokeId: string;
      playerId: string;
      point: { x: number; y: number };
    }) => {
      // Ignora strokes do próprio jogador
      if (data.playerId === playerId) return;
      
      const stroke = remoteStrokesRef.current.get(data.strokeId);
      if (stroke) {
        stroke.points.push(data.point);
      }
    };

    // Handler para stroke:end de outros jogadores
    const handleRemoteStrokeEnd = (data: {
      strokeId: string;
      playerId: string;
    }) => {
      // Ignora strokes do próprio jogador
      if (data.playerId === playerId) return;
      
      const stroke = remoteStrokesRef.current.get(data.strokeId);
      if (stroke && canvasRef.current) {
        // Desenha o stroke completo no canvas
        canvasRef.current.drawRemoteStroke(
          data.strokeId,
          stroke.points,
          stroke.color,
          stroke.width
        );
        // Remove o stroke da lista de strokes em progresso
        remoteStrokesRef.current.delete(data.strokeId);
      }
    };

    // Handler para canvas:clear
    const handleRemoteClearCanvas = (data: {
      playerId: string;
    }) => {
      // Não limpa se foi o próprio jogador que enviou
      if (data.playerId === playerId) return;
      
      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
    };

    // Registra os listeners
    socket.on('stroke:start', handleRemoteStrokeStart);
    socket.on('stroke:continue', handleRemoteStrokeContinue);
    socket.on('stroke:end', handleRemoteStrokeEnd);
    socket.on('canvas:clear', handleRemoteClearCanvas);

    // Cleanup
    return () => {
      socket.off('stroke:start', handleRemoteStrokeStart);
      socket.off('stroke:continue', handleRemoteStrokeContinue);
      socket.off('stroke:end', handleRemoteStrokeEnd);
      socket.off('canvas:clear', handleRemoteClearCanvas);
    };
  }, [socket, room, playerId]);

  if (!room) {
    return null;
  }

  // Verifica se está na fase de desenho para mostrar o canvas
  const isDrawingPhase = gamePhase === GamePhaseValues.DRAWING;

  return (
    <MainLayout>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <PlayerList players={room.players} currentPlayerId={playerId} />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Phase Indicator */}
          <div className="mb-4 flex justify-center">
            <PhaseIndicator phase={gamePhase || 'LOBBY'} />
          </div>

          {/* Phase Manager - mostra conteúdo específico da fase */}
          <div className="mb-6">
            <PhaseManager />
          </div>

          {/* Game Canvas - apenas na fase de desenho */}
          {isDrawingPhase && (
            <div className="flex justify-center">
              <GameCanvas
                ref={canvasRef}
                width={800}
                height={600}
                onStrokeStart={handleStrokeStart}
                onStrokeContinue={handleStrokeContinue}
                onStrokeEnd={handleStrokeEnd}
                onClearCanvas={handleClearCanvas}
              />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
