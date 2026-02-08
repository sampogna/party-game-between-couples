import crypto from 'crypto';
import { Game, GamePhase, PlayerRole, Player } from '../types';
import { roomService } from './RoomService';

const SABOTEUR_THEMES = [
  'Um círculo',
  'Uma linha reta',
  'Um quadrado',
  'Três pontos',
  'Uma cruz',
  'Um triângulo',
  'Um retângulo',
  'Um X',
  'Cinco linhas',
  'Um zigzag',
];

const HONEST_THEMES = [
  'Uma casa',
  'Um cachorro',
  'Uma árvore',
  'Uma flor',
  'Um sol',
  'Uma cara sorridente',
  'Uma estrela',
  'Uma nuvem',
  'Uma montanha',
  'Um carro',
  'Um pássaro',
  'Um peixe',
  'Uma maçã',
  'Um coração',
  'Uma lua',
];

class GameService {
  private games: Map<string, Game> = new Map();

  private generateGameId(): string {
    return crypto.randomUUID();
  }

  private getRandomTheme(themes: string[]): string {
    return themes[Math.floor(Math.random() * themes.length)];
  }

  private assignRoles(players: { id: string; name: string }[]): Map<string, PlayerRole> {
    const roleAssignment = new Map<string, PlayerRole>();
    const playerCount = players.length;

    if (playerCount < 3) {
      players.forEach(p => roleAssignment.set(p.id, PlayerRole.HONEST));
      return roleAssignment;
    }

    const saboteurCount = Math.floor(playerCount / 3);
    const indices = Array.from({ length: playerCount }, (_, i) => i);

    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    const saboteurIndices = new Set(indices.slice(0, saboteurCount));

    players.forEach((player, index) => {
      if (saboteurIndices.has(index)) {
        roleAssignment.set(player.id, PlayerRole.SABOTEUR);
      } else {
        roleAssignment.set(player.id, PlayerRole.HONEST);
      }
    });

    return roleAssignment;
  }

  private assignThemes(
    players: { id: string; name: string }[],
    roleAssignment: Map<string, PlayerRole>
  ): Map<string, string> {
    const themeAssignments = new Map<string, string>();
    const usedSaboteurThemes = new Set<string>();

    players.forEach(player => {
      const role = roleAssignment.get(player.id);
      const isSaboteur = role === PlayerRole.SABOTEUR;

      let theme: string;
      if (isSaboteur) {
        let saboteurTheme = this.getRandomTheme(SABOTEUR_THEMES);
        while (usedSaboteurThemes.has(saboteurTheme) && usedSaboteurThemes.size < SABOTEUR_THEMES.length) {
          saboteurTheme = this.getRandomTheme(SABOTEUR_THEMES);
        }
        usedSaboteurThemes.add(saboteurTheme);
        theme = saboteurTheme;
      } else {
        theme = this.getRandomTheme(HONEST_THEMES);
      }

      themeAssignments.set(player.id, theme);
    });

    return themeAssignments;
  }

  createGame(
    roomCode: string,
    options: {
      maxRounds?: number;
      drawingTime?: number;
      votingTime?: number;
    } = {}
  ): Game | null {
    const normalizedCode = roomCode.toUpperCase().trim();
    const room = roomService.getRoomByCode(normalizedCode);

    if (!room) {
      console.log(`❌ Sala não encontrada: ${normalizedCode}`);
      return null;
    }

    if (room.game) {
      console.log(`⚠️ Já existe um jogo na sala: ${normalizedCode}`);
      return null;
    }

    if (room.players.length < 3) {
      console.log(`⚠️ Jogadores insuficientes na sala ${normalizedCode}: ${room.players.length}`);
      return null;
    }

    const gameId = this.generateGameId();
    const maxRounds = options.maxRounds || 5;
    const drawingTime = options.drawingTime || 60;
    const votingTime = options.votingTime || 30;

    const game: Game = {
      id: gameId,
      roomCode: normalizedCode,
      phase: GamePhase.PREPARATION,
      round: 1,
      maxRounds,
      themes: {
        honest: '',
        saboteur: '',
      },
      drawingTime,
      votingTime,
      createdAt: new Date(),
      startedAt: new Date(),
    };

    this.games.set(gameId, game);

    room.game = game;

    console.log(`🎮 Jogo criado: ${gameId} na sala ${normalizedCode}`);
    console.log(`📊 Rodadas: ${maxRounds}, Tempo desenho: ${drawingTime}s, Tempo votação: ${votingTime}s`);

    return game;
  }

  getGameById(gameId: string): Game | undefined {
    return this.games.get(gameId);
  }

  getGameByRoomCode(roomCode: string): Game | undefined {
    const normalizedCode = roomCode.toUpperCase().trim();
    for (const game of this.games.values()) {
      if (game.roomCode === normalizedCode) {
        return game;
      }
    }
    return undefined;
  }

  endGame(roomCode: string): Game | null {
    const normalizedCode = roomCode.toUpperCase().trim();
    const game = this.getGameByRoomCode(normalizedCode);

    if (!game) {
      console.log(`❌ Jogo não encontrado para a sala: ${normalizedCode}`);
      return null;
    }

    game.phase = GamePhase.GAME_OVER;
    game.endedAt = new Date();

    console.log(`🏁 Jogo encerrado: ${game.id} na sala ${normalizedCode}`);

    return game;
  }

  startGame(roomCode: string): { game: Game; roles: Map<string, PlayerRole>; themes: Map<string, string> } | null {
    const normalizedCode = roomCode.toUpperCase().trim();
    const room = roomService.getRoomByCode(normalizedCode);

    if (!room || !room.game) {
      console.log(`❌ Jogo não encontrado para a sala: ${normalizedCode}`);
      return null;
    }

    const game = room.game;
    const players = room.players.map(p => ({ id: p.id, name: p.name }));
    const roleAssignment = this.assignRoles(players);
    const themeAssignments = this.assignThemes(players, roleAssignment);

    room.players.forEach(player => {
      const role = roleAssignment.get(player.id);
      const theme = themeAssignments.get(player.id);
      if (role) {
        player.role = role;
      }
      if (theme) {
        player.gameTheme = theme;
      }
    });

    const honestTheme = this.getRandomTheme(HONEST_THEMES);
    const saboteurTheme = this.getRandomTheme(SABOTEUR_THEMES);

    game.themes = {
      honest: honestTheme,
      saboteur: saboteurTheme,
    };
    game.phase = GamePhase.DRAWING;

    console.log(`🎮 Jogo iniciado: ${game.id}`);
    console.log(`📋 Papéis atribuídos: ${roleAssignment.size} jogadores`);

    return { game, roles: roleAssignment, themes: themeAssignments };
  }

  setPhase(roomCode: string, phase: GamePhase): Game | null {
    const game = this.getGameByRoomCode(roomCode.toUpperCase().trim());

    if (!game) {
      return null;
    }

    game.phase = phase;
    console.log(`🔄 Fase alterada: ${game.id} -> ${phase}`);

    return game;
  }

  advanceRound(roomCode: string): Game | null {
    const game = this.getGameByRoomCode(roomCode.toUpperCase().trim());

    if (!game) {
      return null;
    }

    if (game.round >= game.maxRounds) {
      return this.endGame(roomCode);
    }

    game.round += 1;
    console.log(`📈 Rodada avançada: ${game.id} -> Rodada ${game.round}`);

    return game;
  }

  getPlayerRole(playerId: string): PlayerRole | undefined {
    const roomResult = roomService.getPlayerRoom(playerId);
    if (roomResult && roomResult.room.game) {
      const player = roomResult.room.players.find(p => p.id === playerId);
      return player?.role;
    }
    return undefined;
  }

  getPlayerTheme(playerId: string): string | undefined {
    const roomResult = roomService.getPlayerRoom(playerId);
    if (roomResult && roomResult.room.game) {
      const player = roomResult.room.players.find(p => p.id === playerId);
      return player?.gameTheme;
    }
    return undefined;
  }

  getAllGames(): Game[] {
    return Array.from(this.games.values());
  }

  getActiveGameCount(): number {
    let count = 0;
    for (const game of this.games.values()) {
      if (game.phase !== GamePhase.GAME_OVER) {
        count++;
      }
    }
    return count;
  }

  clearAllGames(): void {
    this.games.clear();
    console.log('🗑️ Todos os jogos removidos');
  }
}

export const gameService = new GameService();
