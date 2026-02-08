import { useEffect, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useGameStore } from '../stores/gameStore';
import type { GamePhase, Room, Game } from '../types';

export function useGameSocket() {
  const { socket } = useSocket();
  const {
    room,
    setRoom,
    setGame,
    setGamePhase,
    setTimeRemaining,
    updateGameFromRoom,
    playerId,
  } = useGameStore();

  // Handler para quando o jogo inicia
  const handleGameStarted = useCallback((data: { room: Room; game: Game }) => {
    console.log('🎮 Game started:', data);
    setRoom(data.room);
    setGame(data.game);
    setGamePhase(data.game.phase);
  }, [setRoom, setGame, setGamePhase]);

  // Handler para mudança de fase
  const handlePhaseChange = useCallback((data: {
    phase: GamePhase;
    timeRemaining: number;
    game: Game;
    room: Room;
  }) => {
    console.log('🔄 Phase changed:', data);
    setGamePhase(data.phase);
    setTimeRemaining(data.timeRemaining);
    setGame(data.game);
    setRoom(data.room);
  }, [setGamePhase, setTimeRemaining, setGame, setRoom]);

  // Handler para atualização de timer
  const handleTimerUpdate = useCallback((data: { timeRemaining: number }) => {
    setTimeRemaining(data.timeRemaining);
  }, [setTimeRemaining]);

  // Handler para atualização da sala
  const handleRoomUpdate = useCallback((data: { room: Room }) => {
    console.log('🏠 Room updated:', data);
    updateGameFromRoom(data.room);
  }, [updateGameFromRoom]);

  // Handler para quando um jogador entra na sala
  const handlePlayerJoined = useCallback((data: { room: Room; player: { id: string; name: string } }) => {
    console.log('👤 Player joined:', data);
    updateGameFromRoom(data.room);
  }, [updateGameFromRoom]);

  // Handler para quando um jogador sai da sala
  const handlePlayerLeft = useCallback((data: { room: Room; playerId: string }) => {
    console.log('👋 Player left:', data);
    updateGameFromRoom(data.room);
  }, [updateGameFromRoom]);

  // Configura os listeners de socket
  useEffect(() => {
    if (!socket) return;

    // Registra os listeners
    socket.on('game:started', handleGameStarted);
    socket.on('game:phaseChange', handlePhaseChange);
    socket.on('game:timerUpdate', handleTimerUpdate);
    socket.on('room:update', handleRoomUpdate);
    socket.on('room:playerJoined', handlePlayerJoined);
    socket.on('room:playerLeft', handlePlayerLeft);

    // Cleanup
    return () => {
      socket.off('game:started', handleGameStarted);
      socket.off('game:phaseChange', handlePhaseChange);
      socket.off('game:timerUpdate', handleTimerUpdate);
      socket.off('room:update', handleRoomUpdate);
      socket.off('room:playerJoined', handlePlayerJoined);
      socket.off('room:playerLeft', handlePlayerLeft);
    };
  }, [
    socket,
    handleGameStarted,
    handlePhaseChange,
    handleTimerUpdate,
    handleRoomUpdate,
    handlePlayerJoined,
    handlePlayerLeft,
  ]);

  return {
    socket,
    room,
    playerId,
  };
}
