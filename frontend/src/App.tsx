import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useGameStore } from './stores/gameStore'
import { NameInputPage, MenuPage, LobbyPage, HomePage, GamePage } from './pages'
import { MainLayout } from './components'
import { SocketProvider, useSocket } from './contexts/SocketContext'
import type { Player } from './types'
import './App.css'

function AppContent() {
  const navigate = useNavigate()
  const { socket, isConnected } = useSocket()
  const { error, playerName, setPlayerId, setRoom, setError: setStoreError, updatePlayers } = useGameStore()

  useEffect(() => {
    if (error) {
      console.error('Game error:', error)
    }
  }, [error])

  // Escuta eventos do socket
  useEffect(() => {
    if (!socket) return

    const handleRoomJoined = ({ code, players, playerId }: { code: string; players: Player[]; playerId: string }) => {
      console.log('✅ Joined room:', code)
      setPlayerId(playerId)
      setRoom({
        code,
        players,
        createdAt: new Date(),
      })
      navigate('/lobby')
    }

    const handleRoomError = ({ message }: { message: string }) => {
      console.error('❌ Room error:', message)
      setStoreError(message)
    }

    const handlePlayerJoined = ({ players }: { player: Player; players: Player[] }) => {
      console.log('👤 Player joined, updated players:', players)
      updatePlayers(players)
    }

    const handlePlayerLeft = ({ players }: { playerId: string; players: Player[] }) => {
      console.log('👤 Player left, updated players:', players)
      updatePlayers(players)
    }

    socket.on('room:joined', handleRoomJoined)
    socket.on('room:error', handleRoomError)
    socket.on('room:playerJoined', handlePlayerJoined)
    socket.on('room:playerLeft', handlePlayerLeft)

    return () => {
      socket.off('room:joined', handleRoomJoined)
      socket.off('room:error', handleRoomError)
      socket.off('room:playerJoined', handlePlayerJoined)
      socket.off('room:playerLeft', handlePlayerLeft)
    }
  }, [socket, setPlayerId, setRoom, setStoreError, updatePlayers, navigate])

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Routes>
        <Route 
          path="/" 
          element={
            playerName ? <Navigate to="/home" replace /> : <NameInputPage />
          } 
        />
        <Route 
          path="/home" 
          element={
            playerName ? (
              <MainLayout>
                <HomePage />
              </MainLayout>
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/menu" 
          element={
            playerName ? <MenuPage /> : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/lobby" 
          element={
            playerName ? <LobbyPage /> : <Navigate to="/" replace />
          } 
        />
        <Route 
          path="/game" 
          element={
            playerName ? <GamePage /> : <Navigate to="/" replace />
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Connection status indicator */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-lg z-50">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className="text-sm text-gray-600">
          {isConnected ? 'Online' : 'Offline'}
        </span>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </Router>
  )
}

export default App
