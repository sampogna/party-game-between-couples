import { Room, Player } from '../types';
import { playerService } from './PlayerService';

class RoomService {
  private rooms: Map<string, Room> = new Map();

  /**
   * Gera um código único de 6 caracteres para a sala
   */
  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * Gera um código único garantindo que não existe
   */
  private generateUniqueRoomCode(): string {
    let code = this.generateRoomCode();
    let attempts = 0;
    const maxAttempts = 100;

    // Tenta gerar um código único
    while (this.rooms.has(code) && attempts < maxAttempts) {
      code = this.generateRoomCode();
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error('Não foi possível gerar um código único para a sala');
    }

    return code;
  }

  /**
   * Cria uma nova sala
   */
  createRoom(): Room {
    // Gera código único
    const code = this.generateUniqueRoomCode();

    // Cria a sala vazia (jogadores serão adicionados via Socket.IO)
    const room: Room = {
      code,
      players: [],
      createdAt: new Date(),
    };

    this.rooms.set(code, room);
    console.log(`🏠 Sala criada: ${code}`);
    return room;
  }

  /**
   * Busca sala pelo código
   */
  getRoomByCode(code: string): Room | undefined {
    return this.rooms.get(code.toUpperCase().trim());
  }

  /**
   * Adiciona um jogador à sala
   */
  addPlayerToRoom(roomCode: string, playerName: string, socketId: string): Room | null {
    const room = this.rooms.get(roomCode.toUpperCase().trim());
    if (!room) return null;

    // Verifica se o jogador já está na sala (mesmo socketId)
    const existingPlayer = room.players.find(p => p.socketId === socketId);
    if (existingPlayer) {
      console.log(`👤 ${playerName} já está na sala ${roomCode}`);
      return room;
    }

    // O primeiro jogador a entrar é o host
    const isHost = room.players.length === 0;

    // Cria o jogador no PlayerService
    const player = playerService.createPlayer(playerName, socketId, isHost);

    // Adiciona à sala
    room.players.push(player);
    console.log(`👤 ${playerName} entrou na sala ${roomCode}${isHost ? ' (host)' : ''}`);
    return room;
  }

  /**
   * Remove um jogador da sala
   */
  removePlayerFromRoom(roomCode: string, socketId: string): Room | null {
    const normalizedCode = roomCode.toUpperCase().trim();
    const room = this.rooms.get(normalizedCode);
    if (!room) return null;

    const playerIndex = room.players.findIndex((p) => p.socketId === socketId);
    if (playerIndex === -1) return room;

    const player = room.players[playerIndex];
    
    // Remove o jogador da sala
    room.players.splice(playerIndex, 1);
    
    // Remove o jogador do PlayerService
    playerService.removePlayer(socketId);

    console.log(`👤 ${player.name} saiu da sala ${roomCode}`);

    // Se não houver mais jogadores, remove a sala
    if (room.players.length === 0) {
      this.rooms.delete(normalizedCode);
      console.log(`🗑️ Sala ${roomCode} removida (sem jogadores)`);
      return null;
    }

    // Se o host saiu, passa o host para o próximo jogador
    if (player.isHost && room.players.length > 0) {
      room.players[0].isHost = true;
      // Atualiza no PlayerService também
      playerService.updatePlayer(room.players[0].id, { isHost: true });
      console.log(`👑 Novo host da sala ${roomCode}: ${room.players[0].name}`);
    }

    return room;
  }

  /**
   * Busca em qual sala um jogador está
   */
  getPlayerRoom(socketId: string): { room: Room; player: Player } | null {
    for (const room of this.rooms.values()) {
      const player = room.players.find((p) => p.socketId === socketId);
      if (player) {
        return { room, player };
      }
    }
    return null;
  }

  /**
   * Retorna todas as salas
   */
  getAllRooms(): Room[] {
    return Array.from(this.rooms.values());
  }

  /**
   * Retorna o número de salas ativas
   */
  getRoomCount(): number {
    return this.rooms.size;
  }

  /**
   * Retorna o número de jogadores em uma sala
   */
  getPlayerCountInRoom(roomCode: string): number {
    const room = this.getRoomByCode(roomCode);
    return room ? room.players.length : 0;
  }

  /**
   * Verifica se um código de sala existe
   */
  roomExists(code: string): boolean {
    return this.rooms.has(code.toUpperCase().trim());
  }

  /**
   * Remove uma sala completamente
   */
  deleteRoom(roomCode: string): boolean {
    const normalizedCode = roomCode.toUpperCase().trim();
    const room = this.rooms.get(normalizedCode);
    
    if (!room) return false;

    // Remove todos os jogadores do PlayerService
    for (const player of room.players) {
      playerService.removePlayer(player.id);
    }

    this.rooms.delete(normalizedCode);
    console.log(`🗑️ Sala ${roomCode} removida`);
    return true;
  }

  /**
   * Limpa todas as salas (útil para testes)
   */
  clearAllRooms(): void {
    this.rooms.clear();
    console.log('🗑️ Todas as salas removidas');
  }
}

export const roomService = new RoomService();
