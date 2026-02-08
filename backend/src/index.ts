import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { roomService } from './services/RoomService';
import { gameService } from './services/GameService';
import { CreateRoomRequest, JoinRoomRequest } from './types';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Socket.IO setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// Create room endpoint
app.post('/rooms', (req: Request, res: Response) => {
  const { playerName } = req.body as CreateRoomRequest;

  if (!playerName || playerName.trim().length === 0) {
    res.status(400).json({ error: 'Nome do jogador é obrigatório' });
    return;
  }

  // Note: socketId will be updated when the client connects via Socket.IO
  const room = roomService.createRoom();
  
  res.status(201).json({
    code: room.code,
    players: room.players,
  });
});

// Join room endpoint
app.post('/rooms/join', (req: Request, res: Response) => {
  const { roomCode, playerName } = req.body as JoinRoomRequest;

  console.log(`🔍 POST /rooms/join - roomCode: "${roomCode}", playerName: "${playerName}"`);
  console.log(`📊 Salas existentes:`, roomService.getAllRooms().map(r => r.code));

  if (!roomCode || roomCode.trim().length === 0) {
    res.status(400).json({ error: 'Código da sala é obrigatório' });
    return;
  }

  if (!playerName || playerName.trim().length === 0) {
    res.status(400).json({ error: 'Nome do jogador é obrigatório' });
    return;
  }

  const room = roomService.getRoomByCode(roomCode.trim());
  
  if (!room) {
    console.log(`❌ Sala não encontrada: "${roomCode.trim().toUpperCase()}"`);
    res.status(404).json({ error: 'Sala não encontrada' });
    return;
  }

  console.log(`✅ Sala encontrada: ${room.code}, jogadores: ${room.players.length}`);
  res.status(200).json({
    code: room.code,
    players: room.players,
  });
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`🔌 Novo cliente conectado: ${socket.id}`);

  // Join room event
  socket.on('room:join', ({ roomCode, playerName }: { roomCode: string; playerName: string }) => {
    const normalizedCode = roomCode.toUpperCase().trim();
    
    // Check if room exists
    const existingRoom = roomService.getRoomByCode(normalizedCode);
    if (!existingRoom) {
      socket.emit('room:error', { message: 'Sala não encontrada' });
      return;
    }

    // Add player to room
    const room = roomService.addPlayerToRoom(normalizedCode, playerName.trim(), socket.id);
    if (!room) {
      socket.emit('room:error', { message: 'Erro ao entrar na sala' });
      return;
    }

    // Join socket room
    socket.join(normalizedCode);
    
    // Notify player
    socket.emit('room:joined', {
      code: room.code,
      players: room.players,
      playerId: socket.id,
    });

    // Notify other players in room
    socket.to(normalizedCode).emit('room:playerJoined', {
      player: room.players.find(p => p.socketId === socket.id),
      players: room.players,
    });

    console.log(`👤 ${playerName} entrou na sala ${normalizedCode} via Socket.IO`);
  });

  // Leave room event
  socket.on('room:leave', ({ roomCode }: { roomCode: string }) => {
    const normalizedCode = roomCode.toUpperCase().trim();
    
    const room = roomService.removePlayerFromRoom(normalizedCode, socket.id);
    
    if (room) {
      socket.leave(normalizedCode);
      
      // Notify other players
      socket.to(normalizedCode).emit('room:playerLeft', {
        playerId: socket.id,
        players: room.players,
      });
    }
  });

  // Broadcast message to room (test)
  socket.on('room:message', ({ roomCode, message }: { roomCode: string; message: string }) => {
    const normalizedCode = roomCode.toUpperCase().trim();
    
    // Check if socket is in the room
    const rooms = Array.from(socket.rooms);
    if (!rooms.includes(normalizedCode)) {
      socket.emit('room:error', { message: 'Você não está nesta sala' });
      return;
    }

    // Broadcast to all clients in room (including sender)
    io.to(normalizedCode).emit('room:message', {
      playerId: socket.id,
      message,
      timestamp: new Date().toISOString(),
    });

    console.log(`💬 Mensagem na sala ${normalizedCode}: ${message}`);
  });

  // Stroke events for drawing synchronization
  socket.on('stroke:start', ({ roomCode, strokeId, point, color, width }: { 
    roomCode: string; 
    strokeId: string; 
    point: { x: number; y: number }; 
    color: string; 
    width: number;
  }) => {
    const normalizedCode = roomCode.toUpperCase().trim();
    
    // Check if socket is in the room
    const rooms = Array.from(socket.rooms);
    if (!rooms.includes(normalizedCode)) {
      socket.emit('room:error', { message: 'Você não está nesta sala' });
      return;
    }

    // Broadcast to other players in room (excluding sender)
    socket.to(normalizedCode).emit('stroke:start', {
      strokeId,
      playerId: socket.id,
      point,
      color,
      width,
      timestamp: Date.now(),
    });
  });

  socket.on('stroke:continue', ({ roomCode, strokeId, point }: { 
    roomCode: string; 
    strokeId: string; 
    point: { x: number; y: number };
  }) => {
    const normalizedCode = roomCode.toUpperCase().trim();
    
    // Check if socket is in the room
    const rooms = Array.from(socket.rooms);
    if (!rooms.includes(normalizedCode)) {
      return;
    }

    // Broadcast to other players in room (excluding sender)
    socket.to(normalizedCode).emit('stroke:continue', {
      strokeId,
      playerId: socket.id,
      point,
      timestamp: Date.now(),
    });
  });

  socket.on('stroke:end', ({ roomCode, strokeId }: { 
    roomCode: string; 
    strokeId: string;
  }) => {
    const normalizedCode = roomCode.toUpperCase().trim();
    
    // Check if socket is in the room
    const rooms = Array.from(socket.rooms);
    if (!rooms.includes(normalizedCode)) {
      return;
    }

    // Broadcast to other players in room (excluding sender)
    socket.to(normalizedCode).emit('stroke:end', {
      strokeId,
      playerId: socket.id,
      timestamp: Date.now(),
    });
  });

  // Clear canvas event
  socket.on('canvas:clear', ({ roomCode }: { roomCode: string }) => {
    const normalizedCode = roomCode.toUpperCase().trim();
    
    // Check if socket is in the room
    const rooms = Array.from(socket.rooms);
    if (!rooms.includes(normalizedCode)) {
      return;
    }

    // Broadcast to all players in room (including sender)
    io.to(normalizedCode).emit('canvas:clear', {
      playerId: socket.id,
      timestamp: Date.now(),
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`🔌 Cliente desconectado: ${socket.id}`);
    
    // Check if player was in a room and remove them
    const result = roomService.getPlayerRoom(socket.id);
    if (result) {
      const { room } = result;
      const updatedRoom = roomService.removePlayerFromRoom(room.code, socket.id);
      
      if (updatedRoom) {
        // Notify other players
        socket.to(room.code).emit('room:playerLeft', {
          playerId: socket.id,
          players: updatedRoom.players,
        });
      }
    }
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log('🎨 Art Sabotage Backend - Servidor iniciado!');
  console.log(`📡 Porta: ${PORT}`);
  console.log(`🌍 Ambiente: ${NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
});
