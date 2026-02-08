import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, Room, GameView } from '../types';

interface GameState {
  playerName: string;
  playerId: string;
  room: Room | null;
  currentView: GameView;
  error: string | null;
  
  setPlayerName: (name: string) => void;
  setPlayerId: (id: string) => void;
  setRoom: (room: Room | null) => void;
  setCurrentView: (view: GameView) => void;
  setError: (error: string | null) => void;
  updatePlayers: (players: Player[]) => void;
  isHost: () => boolean;
  reset: () => void;
}

const initialState = {
  playerName: '',
  playerId: '',
  room: null,
  currentView: 'name' as GameView,
  error: null,
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
      
      updatePlayers: (players) => {
        const currentRoom = get().room;
        if (currentRoom) {
          set({ room: { ...currentRoom, players } });
        }
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
