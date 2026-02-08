import { Room, Player } from '../types';

class RoomManager {
  private rooms: Map<string, Room> = new Map();

  generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  createRoom(playerName: string, socketId: string): Room {
    const code = this.generateRoomCode();
    const player: Player = {
      id: socketId,
      name: playerName,
      socketId,
      isHost: true,
    };

    const room: Room = {
      code,
      players: [player],
      createdAt: new Date(),
    };

    this.rooms.set(code, room);
    console.log(`🏠 Sala criada: ${code} por ${playerName}`);
    return room;
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase());
  }

  addPlayerToRoom(roomCode: string, playerName: string, socketId: string): Room | null {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room) return null;

    const player: Player = {
      id: socketId,
      name: playerName,
      socketId,
      isHost: false,
    };

    room.players.push(player);
    console.log(`👤 ${playerName} entrou na sala ${roomCode}`);
    return room;
  }

  removePlayerFromRoom(roomCode: string, socketId: string): Room | null {
    const room = this.rooms.get(roomCode.toUpperCase());
    if (!room) return null;

    const playerIndex = room.players.findIndex((p) => p.socketId === socketId);
    if (playerIndex === -1) return room;

    const player = room.players[playerIndex];
    room.players.splice(playerIndex, 1);
    console.log(`👤 ${player.name} saiu da sala ${roomCode}`);

    // Se não houver mais jogadores, remove a sala
    if (room.players.length === 0) {
      this.rooms.delete(roomCode.toUpperCase());
      console.log(`🗑️ Sala ${roomCode} removida (sem jogadores)`);
      return null;
    }

    // Se o host saiu, passa o host para o próximo jogador
    if (player.isHost && room.players.length > 0) {
      room.players[0].isHost = true;
      console.log(`👑 Novo host da sala ${roomCode}: ${room.players[0].name}`);
    }

    return room;
  }

  getPlayerRoom(socketId: string): { room: Room; player: Player } | null {
    for (const room of this.rooms.values()) {
      const player = room.players.find((p) => p.socketId === socketId);
      if (player) {
        return { room, player };
      }
    }
    return null;
  }

  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }
}

export const roomManager = new RoomManager();
