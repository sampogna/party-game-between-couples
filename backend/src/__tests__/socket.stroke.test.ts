import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as ioc, Socket as ClientSocket } from 'socket.io-client';
import { roomService } from '../services/RoomService';

describe('Socket.IO Stroke Events', () => {
  let io: Server;
  let httpServer: ReturnType<typeof createServer>;
  let clientSocket1: ClientSocket;
  let clientSocket2: ClientSocket;
  const TEST_PORT = 3002;

  beforeAll((done) => {
    httpServer = createServer();
    io = new Server(httpServer);

    // Setup socket handlers similar to index.ts
    io.on('connection', (socket) => {
      // Join room handler
      socket.on('room:join', ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
        const normalizedCode = roomCode.toUpperCase().trim();
        const room = roomService.addPlayerToRoom(normalizedCode, playerName, socket.id);
        
        if (!room) {
          socket.emit('room:error', { message: 'Sala não encontrada' });
          return;
        }

        socket.join(normalizedCode);
        socket.emit('room:joined', {
          code: room.code,
          players: room.players,
          playerId: socket.id,
        });
        socket.to(normalizedCode).emit('room:playerJoined', {
          player: room.players.find(p => p.socketId === socket.id),
          players: room.players,
        });
      });

      // Stroke start handler
      socket.on('stroke:start', ({ roomCode, strokeId, point, color, width }: {
        roomCode: string;
        strokeId: string;
        point: { x: number; y: number };
        color: string;
        width: number;
      }) => {
        const normalizedCode = roomCode.toUpperCase().trim();
        const rooms = Array.from(socket.rooms);
        if (!rooms.includes(normalizedCode)) return;

        socket.to(normalizedCode).emit('stroke:start', {
          strokeId,
          playerId: socket.id,
          point,
          color,
          width,
          timestamp: Date.now(),
        });
      });

      // Stroke continue handler
      socket.on('stroke:continue', ({ roomCode, strokeId, point }: {
        roomCode: string;
        strokeId: string;
        point: { x: number; y: number };
      }) => {
        const normalizedCode = roomCode.toUpperCase().trim();
        const rooms = Array.from(socket.rooms);
        if (!rooms.includes(normalizedCode)) return;

        socket.to(normalizedCode).emit('stroke:continue', {
          strokeId,
          playerId: socket.id,
          point,
          timestamp: Date.now(),
        });
      });

      // Stroke end handler
      socket.on('stroke:end', ({ roomCode, strokeId }: {
        roomCode: string;
        strokeId: string;
      }) => {
        const normalizedCode = roomCode.toUpperCase().trim();
        const rooms = Array.from(socket.rooms);
        if (!rooms.includes(normalizedCode)) return;

        socket.to(normalizedCode).emit('stroke:end', {
          strokeId,
          playerId: socket.id,
          timestamp: Date.now(),
        });
      });

      // Canvas clear handler
      socket.on('canvas:clear', ({ roomCode }: { roomCode: string }) => {
        const normalizedCode = roomCode.toUpperCase().trim();
        const rooms = Array.from(socket.rooms);
        if (!rooms.includes(normalizedCode)) return;

        io.to(normalizedCode).emit('canvas:clear', {
          playerId: socket.id,
          timestamp: Date.now(),
        });
      });
    });

    httpServer.listen(TEST_PORT, () => {
      done();
    });
  });

  beforeEach((done) => {
    // Create two client sockets
    clientSocket1 = ioc(`http://localhost:${TEST_PORT}`);
    clientSocket2 = ioc(`http://localhost:${TEST_PORT}`);

    let connectedCount = 0;
    const onConnect = () => {
      connectedCount++;
      if (connectedCount === 2) done();
    };

    clientSocket1.on('connect', onConnect);
    clientSocket2.on('connect', onConnect);
  });

  afterEach(() => {
    clientSocket1.close();
    clientSocket2.close();
  });

  afterAll(() => {
    io.close();
    httpServer.close();
  });

  describe('Room Setup', () => {
    it('should allow two players to join the same room', (done) => {
      const roomCode = 'ABC123';
      
      // Create room first
      roomService.createRoom();
      const room = roomService.getRoomByCode(roomCode);
      if (!room) {
        roomService.createRoom();
      }

      clientSocket1.emit('room:join', { roomCode, playerName: 'Player1' });

      clientSocket1.once('room:joined', ({ code, players }: { code: string; players: any[] }) => {
        expect(code).toBe(roomCode);
        expect(players).toHaveLength(1);

        clientSocket2.emit('room:join', { roomCode, playerName: 'Player2' });

        clientSocket2.once('room:joined', ({ code: c, players: p }: { code: string; players: any[] }) => {
          expect(c).toBe(roomCode);
          expect(p).toHaveLength(2);
          done();
        });
      });
    });
  });

  describe('Stroke Events', () => {
    const roomCode = 'TEST01';

    beforeEach((done) => {
      // Create room and join both players
      roomService.createRoom();
      
      let joinedCount = 0;
      const onJoined = () => {
        joinedCount++;
        if (joinedCount === 2) done();
      };

      clientSocket1.once('room:joined', onJoined);
      clientSocket2.once('room:joined', onJoined);

      clientSocket1.emit('room:join', { roomCode, playerName: 'Player1' });
      
      setTimeout(() => {
        clientSocket2.emit('room:join', { roomCode, playerName: 'Player2' });
      }, 100);
    });

    it('should emit stroke:start to other players in room', (done) => {
      const strokeData = {
        roomCode,
        strokeId: 'stroke_123',
        point: { x: 100, y: 200 },
        color: '#000000',
        width: 4,
      };

      // Client2 should receive the stroke:start event from Client1
      clientSocket2.once('stroke:start', (data: any) => {
        expect(data.strokeId).toBe(strokeData.strokeId);
        expect(data.playerId).toBe(clientSocket1.id);
        expect(data.point).toEqual(strokeData.point);
        expect(data.color).toBe(strokeData.color);
        expect(data.width).toBe(strokeData.width);
        expect(data.timestamp).toBeDefined();
        done();
      });

      // Client1 emits stroke:start
      clientSocket1.emit('stroke:start', strokeData);
    });

    it('should emit stroke:continue to other players in room', (done) => {
      const strokeId = 'stroke_456';
      const point = { x: 150, y: 250 };

      clientSocket2.once('stroke:continue', (data: any) => {
        expect(data.strokeId).toBe(strokeId);
        expect(data.playerId).toBe(clientSocket1.id);
        expect(data.point).toEqual(point);
        expect(data.timestamp).toBeDefined();
        done();
      });

      clientSocket1.emit('stroke:continue', {
        roomCode,
        strokeId,
        point,
      });
    });

    it('should emit stroke:end to other players in room', (done) => {
      const strokeId = 'stroke_789';

      clientSocket2.once('stroke:end', (data: any) => {
        expect(data.strokeId).toBe(strokeId);
        expect(data.playerId).toBe(clientSocket1.id);
        expect(data.timestamp).toBeDefined();
        done();
      });

      clientSocket1.emit('stroke:end', {
        roomCode,
        strokeId,
      });
    });

    it('should NOT emit stroke events to the sender', (done) => {
      const strokeId = 'stroke_no_echo';
      let received = false;

      clientSocket1.once('stroke:start', () => {
        received = true;
      });

      clientSocket1.emit('stroke:start', {
        roomCode,
        strokeId,
        point: { x: 0, y: 0 },
        color: '#000000',
        width: 4,
      });

      setTimeout(() => {
        expect(received).toBe(false);
        done();
      }, 500);
    });

    it('should NOT emit stroke events to players not in the room', (done) => {
      const strokeId = 'stroke_private';
      let received = false;

      // Create a third client that won't join the room
      const clientSocket3 = ioc(`http://localhost:${TEST_PORT}`);
      
      clientSocket3.on('connect', () => {
        clientSocket3.once('stroke:start', () => {
          received = true;
        });

        clientSocket1.emit('stroke:start', {
          roomCode,
          strokeId,
          point: { x: 0, y: 0 },
          color: '#000000',
          width: 4,
        });

        setTimeout(() => {
          expect(received).toBe(false);
          clientSocket3.close();
          done();
        }, 500);
      });
    });
  });

  describe('Canvas Clear Event', () => {
    const roomCode = 'CLEAR1';

    beforeEach((done) => {
      roomService.createRoom();
      
      let joinedCount = 0;
      const onJoined = () => {
        joinedCount++;
        if (joinedCount === 2) done();
      };

      clientSocket1.once('room:joined', onJoined);
      clientSocket2.once('room:joined', onJoined);

      clientSocket1.emit('room:join', { roomCode, playerName: 'Player1' });
      
      setTimeout(() => {
        clientSocket2.emit('room:join', { roomCode, playerName: 'Player2' });
      }, 100);
    });

    it('should emit canvas:clear to all players in room including sender', (done) => {
      let receivedCount = 0;

      const checkDone = () => {
        receivedCount++;
        if (receivedCount === 2) done();
      };

      clientSocket1.once('canvas:clear', (data: any) => {
        expect(data.playerId).toBe(clientSocket1.id);
        expect(data.timestamp).toBeDefined();
        checkDone();
      });

      clientSocket2.once('canvas:clear', (data: any) => {
        expect(data.playerId).toBe(clientSocket1.id);
        expect(data.timestamp).toBeDefined();
        checkDone();
      });

      clientSocket1.emit('canvas:clear', { roomCode });
    });
  });
});
