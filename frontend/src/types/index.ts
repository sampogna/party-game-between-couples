export interface Player {
  id: string;
  name: string;
  socketId: string;
  isHost: boolean;
  role?: PlayerRole;
  score?: number;
  gameTheme?: string;
}

export interface Room {
  code: string;
  players: Player[];
  createdAt: Date;
  game?: Game;
}

export interface CreateRoomRequest {
  playerName: string;
}

export interface JoinRoomRequest {
  roomCode: string;
  playerName: string;
}

export interface RoomResponse {
  code: string;
  players: Player[];
}

export type GameView = 'name' | 'menu' | 'lobby' | 'game';

export type GamePhase = 'LOBBY' | 'PREPARATION' | 'DRAWING' | 'VOTING' | 'RESULTS' | 'GAME_OVER';

export const GamePhaseValues = {
  LOBBY: 'LOBBY' as const,
  PREPARATION: 'PREPARATION' as const,
  DRAWING: 'DRAWING' as const,
  VOTING: 'VOTING' as const,
  RESULTS: 'RESULTS' as const,
  GAME_OVER: 'GAME_OVER' as const,
};

export type PlayerRole = 'HONEST' | 'SABOTEUR';

export const PlayerRoleValues = {
  HONEST: 'HONEST' as const,
  SABOTEUR: 'SABOTEUR' as const,
};

export interface Game {
  id: string;
  roomCode: string;
  phase: GamePhase;
  round: number;
  maxRounds: number;
  themes: {
    honest: string;
    saboteur: string;
  };
  drawingTime: number;
  votingTime: number;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
}

export interface GameStateData {
  game: Game;
  players: Player[];
  currentRound: number;
  timeRemaining: number;
}
