export interface Player {
  id: string;
  name: string;
  socketId: string;
  isHost: boolean;
}

export interface Room {
  code: string;
  players: Player[];
  createdAt: Date;
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
