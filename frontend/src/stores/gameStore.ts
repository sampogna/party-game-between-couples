import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, Room, GameView, Game, GamePhase } from '../types';

interface GameState {
  playerName: string;
  playerId: string;
  room: Room | null;
  currentView: GameView;
  error: string | null;
  game: Game | null;
  gamePhase: GamePhase | null;
  timeRemaining: number;

  setPlayerName: (name: string) => void;
  setPlayerId: (id: string) => void;
  setRoom: (room: Room | null) => void;
  setCurrentView: (view: GameView) => void;
  setError: (error: string | null) => void;
  setGame: (game: Game | null) => void;
  setGamePhase: (phase: GamePhase | null) => void;
  setTimeRemaining: (time: number) => void;
  updatePlayers: (players: Player[]) => void;
  updateGameFromRoom: (room: Room) => void;
  isHost: () => boolean;
  reset: () => void;
}

const initialState = {
  playerName: '',
  playerId: '',
  room: null,
  currentView: 'name' as GameView,
  error: null,
  game: null,
  gamePhase: null,
  timeRemaining: 0,
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setPlayerName: (name) => set({ playerName: name }),
      setPlayerId: (id) => set({ playerId: id }),
      setRoom: (room) => set({ room }),
      setCurrentView: (view) => set({ currentView: view }),
      setError: (error) => set({ error }),
      setGame: (game) => set({ game, gamePhase: game?.phase || null }),
      setGamePhase: (phase) => set({ gamePhase: phase }),
      setTimeRemaining: (time) => set({ timeRemaining: time }),

      updatePlayers: (players) => {
        const currentRoom = get().room;
        if (currentRoom) {
          set({ room: { ...currentRoom, players } });
        }
      },

      updateGameFromRoom: (room) => {
        set({
          room,
          game: room.game || null,
          gamePhase: room.game?.phase || null,
        });
      },

      isHost: () => {
        const { room, playerId } = get();
        if (!room) return false;
        const player = room.players.find(p => p.id === playerId);
        return player?.isHost || false;
      },

      reset: () => set(initialState),
    }),
    {
      name: 'game-storage',
    }
  )
);
