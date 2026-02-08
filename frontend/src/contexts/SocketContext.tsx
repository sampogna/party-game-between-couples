import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
  joinRoom: (roomCode: string, playerName: string) => void;
  leaveRoom: (roomCode: string) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

export function SocketProvider({ children }: { children: ReactNode }) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cria o socket apenas uma vez
  useEffect(() => {
    if (socketRef.current) return;

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
      setError(err.message);
      setIsConnected(false);
    });

    return () => {
      // Não desconecta aqui - apenas no unmount da aplicação
    };
  }, []);

  // Cleanup apenas quando o provider desmontar (fechar app)
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log('🔌 Disconnecting socket on app unmount');
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const joinRoom = useCallback((roomCode: string, playerName: string) => {
    if (socketRef.current) {
      console.log('📤 Emitting room:join', { roomCode, playerName });
      socketRef.current.emit('room:join', { roomCode, playerName });
    }
  }, []);

  const leaveRoom = useCallback((roomCode: string) => {
    if (socketRef.current) {
      console.log('📤 Emitting room:leave', { roomCode });
      socketRef.current.emit('room:leave', { roomCode });
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        error,
        joinRoom,
        leaveRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
