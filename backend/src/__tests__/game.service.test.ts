import { gameService } from '../services/GameService';
import { roomService } from '../services/RoomService';
import { GamePhase, PlayerRole } from '../types';

describe('GameService', () => {
  beforeEach(() => {
    roomService.clearAllRooms();
    gameService.clearAllGames();
  });

  describe('createGame', () => {
    it('should create a game in a room with sufficient players', () => {
      const room = roomService.createRoom();
      roomService.addPlayerToRoom(room.code, 'Player1', 'socket-1');
      roomService.addPlayerToRoom(room.code, 'Player2', 'socket-2');
      roomService.addPlayerToRoom(room.code, 'Player3', 'socket-3');

      const game = gameService.createGame(room.code, {
        maxRounds: 3,
        drawingTime: 45,
        votingTime: 20,
      });

      expect(game).not.toBeNull();
      expect(game?.phase).toBe(GamePhase.PREPARATION);
      expect(game?.round).toBe(1);
      expect(game?.maxRounds).toBe(3);
      expect(game?.drawingTime).toBe(45);
      expect(game?.votingTime).toBe(20);
      expect(room.game).toBeDefined();
    });

    it('should return null for non-existent room', () => {
      const game = gameService.createGame('INVALID');
      expect(game).toBeNull();
    });

    it('should return null if game already exists', () => {
      const room = roomService.createRoom();
      roomService.addPlayerToRoom(room.code, 'Player1', 'socket-1');
      roomService.addPlayerToRoom(room.code, 'Player2', 'socket-2');
      roomService.addPlayerToRoom(room.code, 'Player3', 'socket-3');

      gameService.createGame(room.code);
      const game2 = gameService.createGame(room.code);

      expect(game2).toBeNull();
    });

    it('should return null with insufficient players', () => {
      const room = roomService.createRoom();
      roomService.addPlayerToRoom(room.code, 'Player1', 'socket-1');
      roomService.addPlayerToRoom(room.code, 'Player2', 'socket-2');

      const game = gameService.createGame(room.code);
      expect(game).toBeNull();
    });
  });

  describe('getGameById', () => {
    it('should return game by ID', () => {
      const room = roomService.createRoom();
      roomService.addPlayerToRoom(room.code, 'Player1', 'socket-1');
      roomService.addPlayerToRoom(room.code, 'Player2', 'socket-2');
      roomService.addPlayerToRoom(room.code, 'Player3', 'socket-3');

      const createdGame = gameService.createGame(room.code);
      const foundGame = gameService.getGameById(createdGame!.id);

      expect(foundGame).toBeDefined();
      expect(foundGame?.id).toBe(createdGame?.id);
    });

    it('should return undefined for non-existent ID', () => {
      const game = gameService.getGameById('non-existent-id');
      expect(game).toBeUndefined();
    });
  });

  describe('getGameByRoomCode', () => {
    it('should return game by room code', () => {
      const room = roomService.createRoom();
      roomService.addPlayerToRoom(room.code, 'Player1', 'socket-1');
      roomService.addPlayerToRoom(room.code, 'Player2', 'socket-2');
      roomService.addPlayerToRoom(room.code, 'Player3', 'socket-3');

      gameService.createGame(room.code);
      const game = gameService.getGameByRoomCode(room.code);

      expect(game).toBeDefined();
      expect(game?.roomCode).toBe(room.code.toUpperCase());
    });
  });

  describe('endGame', () => {
    it('should end a game', () => {
      const room = roomService.createRoom();
      roomService.addPlayerToRoom(room.code, 'Player1', 'socket-1');
      roomService.addPlayerToRoom(room.code, 'Player2', 'socket-2');
      roomService.addPlayerToRoom(room.code, 'Player3', 'socket-3');

      gameService.createGame(room.code);
      const endedGame = gameService.endGame(room.code);

      expect(endedGame).not.toBeNull();
      expect(endedGame?.phase).toBe(GamePhase.GAME_OVER);
      expect(endedGame?.endedAt).toBeDefined();
    });

    it('should return null for non-existent game', () => {
      const game = gameService.endGame('INVALID');
      expect(game).toBeNull();
    });
  });

  describe('startGame', () => {
    it('should assign roles and themes to players', () => {
      const room = roomService.createRoom();
      roomService.addPlayerToRoom(room.code, 'Player1', 'socket-1');
      roomService.addPlayerToRoom(room.code, 'Player2', 'socket-2');
      roomService.addPlayerToRoom(room.code, 'Player3', 'socket-3');

      gameService.createGame(room.code);
      const result = gameService.startGame(room.code);

      expect(result).not.toBeNull();
      expect(result?.game.phase).toBe(GamePhase.DRAWING);

      const roles = result?.roles;
      const themes = result?.themes;

      expect(roles?.size).toBe(3);
      expect(themes?.size).toBe(3);

      let saboteurCount = 0;
      roles?.forEach(role => {
        if (role === PlayerRole.SABOTEUR) saboteurCount++;
      });

      expect(saboteurCount).toBeGreaterThanOrEqual(1);

      room.players.forEach(player => {
        expect(player.role).toBeDefined();
        expect(player.gameTheme).toBeDefined();
      });
    });
  });

  describe('setPhase', () => {
    it('should change game phase', () => {
      const room = roomService.createRoom();
      roomService.addPlayerToRoom(room.code, 'Player1', 'socket-1');
      roomService.addPlayerToRoom(room.code, 'Player2', 'socket-2');
      roomService.addPlayerToRoom(room.code, 'Player3', 'socket-3');

      gameService.createGame(room.code);
      gameService.setPhase(room.code, GamePhase.VOTING);

      const game = gameService.getGameByRoomCode(room.code);
      expect(game?.phase).toBe(GamePhase.VOTING);
    });
  });

  describe('advanceRound', () => {
    it('should advance to next round', () => {
      const room = roomService.createRoom();
      roomService.addPlayerToRoom(room.code, 'Player1', 'socket-1');
      roomService.addPlayerToRoom(room.code, 'Player2', 'socket-2');
      roomService.addPlayerToRoom(room.code, 'Player3', 'socket-3');

      gameService.createGame(room.code, { maxRounds: 3 });
      gameService.advanceRound(room.code);

      const game = gameService.getGameByRoomCode(room.code);
      expect(game?.round).toBe(2);
    });

    it('should end game when max rounds reached', () => {
      const room = roomService.createRoom();
      roomService.addPlayerToRoom(room.code, 'Player1', 'socket-1');
      roomService.addPlayerToRoom(room.code, 'Player2', 'socket-2');
      roomService.addPlayerToRoom(room.code, 'Player3', 'socket-3');

      gameService.createGame(room.code, { maxRounds: 1 });
      gameService.advanceRound(room.code);

      const game = gameService.getGameByRoomCode(room.code);
      expect(game?.phase).toBe(GamePhase.GAME_OVER);
    });
  });

  describe('getPlayerRole and getPlayerTheme', () => {
    it('should return player role and theme', () => {
      const room = roomService.createRoom();
      roomService.addPlayerToRoom(room.code, 'Player1', 'socket-1');
      roomService.addPlayerToRoom(room.code, 'Player2', 'socket-2');
      roomService.addPlayerToRoom(room.code, 'Player3', 'socket-3');

      gameService.createGame(room.code);
      gameService.startGame(room.code);

      const role = gameService.getPlayerRole('socket-1');
      const theme = gameService.getPlayerTheme('socket-1');

      expect(role).toBeDefined();
      expect(theme).toBeDefined();
    });
  });
});
