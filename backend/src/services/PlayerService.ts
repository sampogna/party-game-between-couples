import { Player, PlayerRole } from '../types';

class PlayerService {
  private players: Map<string, Player> = new Map();

  /**
   * Cria um novo jogador
   */
  createPlayer(name: string, socketId: string, isHost: boolean = false): Player {
    const player: Player = {
      id: socketId,
      name: name.trim(),
      socketId,
      isHost,
      score: 0,
    };

    this.players.set(socketId, player);
    console.log(`👤 Jogador criado: ${name} (${socketId})`);
    return player;
  }

  /**
   * Busca jogador pelo ID
   */
  getPlayerById(playerId: string): Player | undefined {
    return this.players.get(playerId);
  }

  /**
   * Busca jogador pelo socketId
   */
  getPlayerBySocketId(socketId: string): Player | undefined {
    return this.players.get(socketId);
  }

  /**
   * Retorna todos os jogadores
   */
  getAllPlayers(): Player[] {
    return Array.from(this.players.values());
  }

  /**
   * Atualiza dados de um jogador
   */
  updatePlayer(playerId: string, updates: Partial<Player>): Player | null {
    const player = this.players.get(playerId);
    if (!player) {
      return null;
    }

    const updatedPlayer = { ...player, ...updates };
    this.players.set(playerId, updatedPlayer);
    return updatedPlayer;
  }

  /**
   * Atualiza o papel do jogador (honesto/sabotador)
   */
  setPlayerRole(playerId: string, role: PlayerRole): Player | null {
    return this.updatePlayer(playerId, { role });
  }

  /**
   * Adiciona pontos ao jogador
   */
  addScore(playerId: string, points: number): Player | null {
    const player = this.players.get(playerId);
    if (!player) {
      return null;
    }

    const newScore = (player.score || 0) + points;
    return this.updatePlayer(playerId, { score: newScore });
  }

  /**
   * Define a pontuação do jogador
   */
  setScore(playerId: string, score: number): Player | null {
    return this.updatePlayer(playerId, { score });
  }

  /**
   * Remove um jogador
   */
  removePlayer(playerId: string): boolean {
    const player = this.players.get(playerId);
    if (!player) {
      return false;
    }

    this.players.delete(playerId);
    console.log(`🗑️ Jogador removido: ${player.name} (${playerId})`);
    return true;
  }

  /**
   * Remove todos os jogadores
   */
  clearAllPlayers(): void {
    this.players.clear();
    console.log('🗑️ Todos os jogadores removidos');
  }

  /**
   * Retorna o número total de jogadores
   */
  getPlayerCount(): number {
    return this.players.size;
  }
}

export const playerService = new PlayerService();
