# Art Sabotage - Modelos de Dados

## Overview

**Persistência:** Estado mantido em memória (Map/Objects). Dados perdidos em reinicialização do servidor.

**Relações Principais:**
- Room 1:N Players
- Room 1:1 Game
- Game 1:N Strokes
- Game 1:N Votes (por rodada)
- Game 1:N Scores

---

## Enums

### GamePhase
```typescript
enum GamePhase {
  LOBBY = 'lobby',           // Aguardando jogadores
  PREPARATION = 'preparation', // Distribuição de papéis
  DRAWING = 'drawing',       // Fase de desenho
  EVIDENCE = 'evidence',     // Análise de evidências
  DISCUSSION = 'discussion', // Discussão
  VOTING = 'voting',         // Votação
  RESOLUTION = 'resolution', // Resolução e pontuação
  ENDED = 'ended'            // Jogo encerrado
}
```

### PlayerRole
```typescript
enum PlayerRole {
  HONEST = 'honest',
  SABOTEUR = 'saboteur'
}
```

### ToolType
```typescript
enum ToolType {
  PENCIL = 'pencil',
  CIRCLE = 'circle',
  RECTANGLE = 'rectangle',
  LINE = 'line'
}
```

### EvidenceType
```typescript
enum EvidenceType {
  COLOR_ANOMALY = 'color_anomaly',
  MOVEMENT_PATTERN = 'movement_pattern',
  TIMING_ANOMALY = 'timing_anomaly',
  COVERAGE_ANOMALY = 'coverage_anomaly'
}
```

---

## Entidades

### Player

Representa um jogador na aplicação.

**Schema:**
```typescript
interface Player {
  id: string;                    // UUID v4
  name: string;                  // 2-20 caracteres
  roomId: string | null;         // ID da sala atual
  role: PlayerRole | null;       // Papel no jogo (null se não em jogo)
  isSaboteur: boolean;           // true se sabotador
  theme: string | null;          // Tema secreto atribuído
  score: number;                 // Pontuação total
  isConnected: boolean;          // Status de conexão
  isHost: boolean;               // true se criador da sala
  joinedAt: number;              // Timestamp de entrada
  lastActivity: number;          // Timestamp última ação
  socketId: string | null;       // ID do socket conectado
}
```

**Exemplo:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João",
  "roomId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "role": "honest",
  "isSaboteur": false,
  "theme": "gato",
  "score": 45,
  "isConnected": true,
  "isHost": true,
  "joinedAt": 1707303000000,
  "lastActivity": 1707303600000,
  "socketId": "socket_123abc"
}
```

**Validações:**
- `name`: obrigatório, 2-20 caracteres, sem caracteres especiais
- `id`: UUID v4 único
- `socketId`: único entre jogadores conectados

---

### Room

Representa uma sala de espera/lobby.

**Schema:**
```typescript
interface Room {
  id: string;                    // UUID v4
  code: string;                  // 6 caracteres alfanuméricos (ABC123)
  hostId: string;                // ID do jogador host
  players: Player[];             // Jogadores na sala (max 8)
  settings: RoomSettings;        // Configurações da sala
  status: RoomStatus;            // waiting | playing | closed
  gameId: string | null;         // ID do jogo atual (null se não iniciado)
  createdAt: number;             // Timestamp de criação
  updatedAt: number;             // Timestamp última atualização
}

interface RoomSettings {
  maxPlayers: number;            // 4-8 (default: 8)
  saboteurCount: number;         // 1 ou 2 (auto-calculado)
  drawingTime: number;           // 60, 90 ou 120 segundos
  discussionTime: number;        // 60 segundos (fixo)
  votingTime: number;            // 20 segundos (fixo)
  themeDifficulty: 'easy' | 'medium' | 'hard';
  roundCount: number;            // 3, 5 ou 7
}

type RoomStatus = 'waiting' | 'playing' | 'closed';
```

**Exemplo:**
```json
{
  "id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "code": "ABC123",
  "hostId": "550e8400-e29b-41d4-a716-446655440000",
  "players": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "João",
      "isHost": true,
      "isConnected": true
    },
    {
      "id": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
      "name": "Maria",
      "isHost": false,
      "isConnected": true
    }
  ],
  "settings": {
    "maxPlayers": 8,
    "saboteurCount": 1,
    "drawingTime": 90,
    "discussionTime": 60,
    "votingTime": 20,
    "themeDifficulty": "medium",
    "roundCount": 5
  },
  "status": "playing",
  "gameId": "7c98c921-aebe-22e2-91c5-11d15fe541d9",
  "createdAt": 1707303000000,
  "updatedAt": 1707303100000
}
```

**Regras:**
- `code`: único, 6 caracteres, gerado aleatoriamente
- `players.length`: mínimo 4 para iniciar, máximo 8
- `saboteurCount`: 1 se players ≤ 5, 2 se players ≥ 6
- `status`: muda para 'playing' ao iniciar jogo

---

### Game

Representa uma partida em andamento.

**Schema:**
```typescript
interface Game {
  id: string;                    // UUID v4
  roomId: string;                // ID da sala vinculada
  phase: GamePhase;              // Fase atual
  currentRound: number;          // Rodada atual (1-indexed)
  maxRounds: number;             // Total de rodadas
  players: Player[];             // Jogadores (referências)
  settings: GameSettings;        // Configurações (cópia da Room)
  canvas: CanvasState;           // Estado do canvas
  themes: {
    honest: string;              // Tema dos honestos
    saboteur: string;            // Tema dos sabotadores
  };
  strokes: Stroke[];             // Todos os strokes do jogo
  evidences: Evidence[];         // Evidências coletadas
  votes: Vote[];                 // Todos os votos
  scores: Score[];               // Pontuações
  phaseStartTime: number;        // Timestamp início fase atual
  phaseEndTime: number;          // Timestamp término fase atual
  createdAt: number;             // Timestamp início do jogo
  endedAt: number | null;        // Timestamp fim do jogo
  winner: Player | null;         // Vencedor (null se não terminou)
}

interface CanvasState {
  strokes: Stroke[];             // Strokes no canvas
  width: number;                 // 800 (fixo)
  height: number;                // 600 (fixo)
  backgroundColor: string;       // "#FFFFFF"
  lastClearedAt: number | null;  // Timestamp última limpeza
}
```

**Exemplo:**
```json
{
  "id": "7c98c921-aebe-22e2-91c5-11d15fe541d9",
  "roomId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "phase": "drawing",
  "currentRound": 1,
  "maxRounds": 5,
  "players": [...],
  "settings": {
    "maxPlayers": 8,
    "saboteurCount": 1,
    "drawingTime": 90,
    "discussionTime": 60,
    "votingTime": 20,
    "themeDifficulty": "medium",
    "roundCount": 5
  },
  "canvas": {
    "strokes": [],
    "width": 800,
    "height": 600,
    "backgroundColor": "#FFFFFF",
    "lastClearedAt": null
  },
  "themes": {
    "honest": "gato",
    "saboteur": "cachorro"
  },
  "strokes": [],
  "evidences": [],
  "votes": [],
  "scores": [...],
  "phaseStartTime": 1707303200000,
  "phaseEndTime": 1707303290000,
  "createdAt": 1707303200000,
  "endedAt": null,
  "winner": null
}
```

---

### Stroke

Representa um traçado de desenho.

**Schema:**
```typescript
interface Stroke {
  id: string;                    // UUID v4
  playerId: string;              // ID do jogador
  gameId: string;                // ID do jogo
  points: Point[];               // Pontos do traçado
  color: string;                 // Cor em hex (#RRGGBB)
  thickness: number;             // Espessura em pixels (1, 3, 5, 8)
  tool: ToolType;                // Ferramenta utilizada
  startTime: number;             // Timestamp início
  endTime: number | null;        // Timestamp fim (null se não finalizado)
}

interface Point {
  x: number;                     // Coordenada X (0-800)
  y: number;                     // Coordenada Y (0-600)
  timestamp: number;             // Timestamp do ponto
}
```

**Exemplo:**
```json
{
  "id": "8d09d032-bfcf-33f3-a2d6-22e26gf652e0",
  "playerId": "550e8400-e29b-41d4-a716-446655440000",
  "gameId": "7c98c921-aebe-22e2-91c5-11d15fe541d9",
  "points": [
    {"x": 100, "y": 200, "timestamp": 1707303200000},
    {"x": 105, "y": 205, "timestamp": 1707303200050},
    {"x": 110, "y": 210, "timestamp": 1707303200100}
  ],
  "color": "#FF0000",
  "thickness": 3,
  "tool": "pencil",
  "startTime": 1707303200000,
  "endTime": 1707303200150
}
```

**Regras:**
- Mínimo 2 pontos para ser válido
- `x` e `y` devem estar dentro das dimensões do canvas
- `color`: deve ser uma das 7 cores permitidas (ou variação para sabotadores)

---

### Vote

Representa um voto em uma rodada.

**Schema:**
```typescript
interface Vote {
  id: string;                    // UUID v4
  gameId: string;                // ID do jogo
  round: number;                 // Número da rodada
  voterId: string;               // ID do jogador que votou
  targetId: string | null;       // ID do alvo (null = abstenção)
  timestamp: number;             // Timestamp do voto
}
```

**Exemplo:**
```json
{
  "id": "9e1ae143-c0d0-4404-b3e7-33f37hg763f1",
  "gameId": "7c98c921-aebe-22e2-91c5-11d15fe541d9",
  "round": 1,
  "voterId": "550e8400-e29b-41d4-a716-446655440000",
  "targetId": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
  "timestamp": 1707303500000
}
```

**Regras:**
- `voterId` ≠ `targetId` (auto-voto proibido)
- Um jogador pode votar apenas uma vez por rodada
- `targetId` null representa abstenção

---

### Score

Representa a pontuação de um jogador.

**Schema:**
```typescript
interface Score {
  playerId: string;              // ID do jogador
  roundScores: number[];         // Pontos por rodada
  totalScore: number;            // Soma total
  bonuses: Bonus[];              // Bônus recebidos
}

interface Bonus {
  type: BonusType;               // Tipo de bônus
  value: number;                 // Valor em pontos
  round: number;                 // Rodada do bônus
  description: string;           // Descrição
}

enum BonusType {
  SURVIVAL = 'survival',         // Sobrevivência como sabotador
  CORRECT_VOTE = 'correct_vote', // Voto correto
  FRAME_UP = 'frame_up',         // Frame-up bem sucedido
  PERFECT_CAMOUFLAGE = 'perfect_camouflage', // Pouca suspeição
  VICTORY = 'victory'            // Vitória no jogo
}
```

**Exemplo:**
```json
{
  "playerId": "550e8400-e29b-41d4-a716-446655440000",
  "roundScores": [25, 30, 20],
  "totalScore": 75,
  "bonuses": [
    {
      "type": "correct_vote",
      "value": 15,
      "round": 1,
      "description": "Acertou o voto na rodada 1"
    },
    {
      "type": "victory",
      "value": 50,
      "round": 3,
      "description": "Vitória honesta"
    }
  ]
}
```

---

### Evidence (Opcional - Pós-MVP)

Representa evidências analisadas pelo sistema.

**Schema:**
```typescript
interface Evidence {
  id: string;                    // UUID v4
  playerId: string;              // ID do jogador analisado
  gameId: string;                // ID do jogo
  round: number;                 // Rodada da análise
  type: EvidenceType;            // Tipo de evidência
  value: number;                 // Valor da suspeição (0-100)
  description: string;           // Descrição legível
  data: Record<string, any>;     // Dados brutos da análise
  timestamp: number;             // Timestamp da análise
}
```

**Exemplo:**
```json
{
  "id": "af2bf254-d1e1-5515-c4f8-44g48ih874g2",
  "playerId": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
  "gameId": "7c98c921-aebe-22e2-91c5-11d15fe541d9",
  "round": 1,
  "type": "color_anomaly",
  "value": 23,
  "description": "Distribuição de cores atípica detectada",
  "data": {
    "entropy": 2.3,
    "deviation": 0.8,
    "colorDistribution": {
      "#FF0000": 15,
      "#0000FF": 3
    }
  },
  "timestamp": 1707303400000
}
```

---

## Exemplo Completo

Estado de uma partida em andamento:

```json
{
  "room": {
    "id": "room-uuid",
    "code": "ABC123",
    "hostId": "player-1",
    "players": [
      {
        "id": "player-1",
        "name": "João",
        "role": "honest",
        "isSaboteur": false,
        "theme": "gato",
        "score": 45,
        "isConnected": true,
        "isHost": true
      },
      {
        "id": "player-2",
        "name": "Maria",
        "role": "saboteur",
        "isSaboteur": true,
        "theme": "cachorro",
        "score": 60,
        "isConnected": true,
        "isHost": false
      }
    ],
    "status": "playing",
    "gameId": "game-uuid"
  },
  "game": {
    "id": "game-uuid",
    "phase": "drawing",
    "currentRound": 1,
    "themes": {
      "honest": "gato",
      "saboteur": "cachorro"
    },
    "canvas": {
      "strokes": [...],
      "width": 800,
      "height": 600
    },
    "scores": [
      {
        "playerId": "player-1",
        "roundScores": [25],
        "totalScore": 25,
        "bonuses": []
      }
    ]
  }
}
```

---

## Relacionamentos

```
┌─────────┐       1:N       ┌─────────┐
│  Room   │◄───────────────│ Player  │
└────┬────┘                 └─────────┘
     │
     │ 1:1
     ▼
┌─────────┐       1:N       ┌─────────┐
│  Game   │◄───────────────│ Stroke  │
└────┬────┘                 └─────────┘
     │
     │ 1:N
     ▼
┌─────────┐       1:N       ┌─────────┐
│  Vote   │                 │ Evidence│
└─────────┘                 └─────────┘
     │
     │ 1:N
     ▼
┌─────────┐
│  Score  │
└─────────┘
```

---

## Considerações de Implementação

1. **IDs:** Todos os IDs são UUID v4 gerados no momento da criação

2. **Timestamps:** Usar `Date.now()` (milliseconds since epoch)

3. **Cores:** Validar contra paleta permitida:
   - Preto: #000000
   - Vermelho: #FF0000
   - Azul: #0000FF
   - Verde: #00FF00
   - Amarelo: #FFFF00
   - Laranja: #FFA500
   - Roxo: #800080

4. **Validações de Canvas:**
   - x: 0 <= x <= 800
   - y: 0 <= y <= 600
   - thickness: 1, 3, 5, ou 8

5. **Limpeza de Dados:**
   - Remover jogadores desconectados após 30s
   - Remover salas vazias após 5 minutos
   - Arquivar jogos encerrados (opcional)

---

*Versão 1.0 - Data Models*
