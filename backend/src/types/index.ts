// ============================================
// TIPOS BÁSICOS
// ============================================

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

// ============================================
// TIPOS DE JOGO
// ============================================

export enum GamePhase {
  LOBBY = 'LOBBY',
  PREPARATION = 'PREPARATION',
  DRAWING = 'DRAWING',
  VOTING = 'VOTING',
  RESULTS = 'RESULTS',
  GAME_OVER = 'GAME_OVER',
}

export enum PlayerRole {
  HONEST = 'HONEST',
  SABOTEUR = 'SABOTEUR',
}

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

export interface GameState {
  game: Game;
  players: Player[];
  currentRound: number;
  timeRemaining: number;
}

// ============================================
// TIPOS DE CANVAS
// ============================================

export interface Point {
  x: number;
  y: number;
  timestamp: number;
}

export interface Stroke {
  id: string;
  playerId: string;
  points: Point[];
  color: string;
  width: number;
  startedAt: number;
  endedAt?: number;
}

export interface CanvasState {
  strokes: Stroke[];
  currentStroke?: Stroke;
}

// ============================================
// ENUMS DE EVENTOS SOCKET.IO
// ============================================

export enum SocketEvents {
  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECT_ERROR = 'connect_error',

  // Room events
  ROOM_JOIN = 'room:join',
  ROOM_LEAVE = 'room:leave',
  ROOM_JOINED = 'room:joined',
  ROOM_PLAYER_JOINED = 'room:playerJoined',
  ROOM_PLAYER_LEFT = 'room:playerLeft',
  ROOM_ERROR = 'room:error',
  ROOM_MESSAGE = 'room:message',

  // Game events
  GAME_START = 'game:start',
  GAME_STARTED = 'game:started',
  GAME_PHASE_CHANGE = 'game:phaseChange',
  GAME_END = 'game:end',
  GAME_ENDED = 'game:ended',

  // Drawing events
  STROKE_START = 'stroke:start',
  STROKE_CONTINUE = 'stroke:continue',
  STROKE_END = 'stroke:end',
  CANVAS_CLEAR = 'canvas:clear',
  CANVAS_UPDATE = 'canvas:update',

  // Voting events
  VOTING_START = 'voting:start',
  VOTE_CAST = 'vote:cast',
  VOTING_END = 'voting:end',
  VOTE_RESULTS = 'vote:results',
}

// ============================================
// REQUESTS E RESPONSES
// ============================================

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

export interface StartGameRequest {
  roomCode: string;
  maxRounds?: number;
  drawingTime?: number;
  votingTime?: number;
}

export interface CastVoteRequest {
  roomCode: string;
  votedPlayerId: string;
}
