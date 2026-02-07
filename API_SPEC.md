# Art Sabotage - Especificação da API

## Overview

**Base URL:** `http://localhost:3001` (dev) / `https://api.art-sabotage.com` (prod)

**Formato:** JSON para REST, WebSocket para tempo real

**Autenticação:** Token de sessão gerado automaticamente ao entrar na sala (armazenado no socket handshake)

---

## Endpoints REST

### Health Check

**GET** `/health`

Verifica se o servidor está online.

**Response 200:**
```json
{
  "status": "ok",
  "timestamp": "2026-02-07T10:30:00.000Z",
  "version": "1.0.0"
}
```

---

### Criar Sala

**POST** `/rooms`

Cria uma nova sala de jogo.

**Request Body:**
```json
{
  "playerName": "João",
  "settings": {
    "drawingTime": 90,
    "themeDifficulty": "medium",
    "roundCount": 5
  }
}
```

**Response 201:**
```json
{
  "room": {
    "id": "uuid",
    "code": "ABC123",
    "hostId": "player-uuid",
    "players": [
      {
        "id": "player-uuid",
        "name": "João",
        "isHost": true,
        "isConnected": true
      }
    ],
    "settings": {
      "drawingTime": 90,
      "themeDifficulty": "medium",
      "roundCount": 5,
      "maxPlayers": 8
    },
    "status": "waiting",
    "createdAt": "2026-02-07T10:30:00.000Z"
  },
  "player": {
    "id": "player-uuid",
    "name": "João",
    "token": "jwt-token-for-websocket"
  }
}
```

**Response 400:**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "playerName is required and must be 2-20 characters"
}
```

---

### Obter Sala

**GET** `/rooms/:code`

Obtém informações de uma sala existente.

**Parameters:**
- `code` (path): Código da sala (6 caracteres)

**Response 200:**
```json
{
  "id": "uuid",
  "code": "ABC123",
  "hostId": "player-uuid",
  "players": [...],
  "settings": {...},
  "status": "waiting",
  "playerCount": 4,
  "maxPlayers": 8,
  "canJoin": true
}
```

**Response 404:**
```json
{
  "error": "ROOM_NOT_FOUND",
  "message": "Room with code ABC123 not found"
}
```

---

### Entrar na Sala

**POST** `/rooms/:code/join`

Adiciona um jogador à sala existente.

**Parameters:**
- `code` (path): Código da sala

**Request Body:**
```json
{
  "playerName": "Maria"
}
```

**Response 200:**
```json
{
  "room": {
    "id": "uuid",
    "code": "ABC123",
    "players": [...],
    "settings": {...}
  },
  "player": {
    "id": "player-uuid-2",
    "name": "Maria",
    "token": "jwt-token-for-websocket"
  }
}
```

**Response 400:**
```json
{
  "error": "ROOM_FULL",
  "message": "Room is full (max 8 players)"
}
```

**Response 400:**
```json
{
  "error": "GAME_ALREADY_STARTED",
  "message": "Cannot join, game is already in progress"
}
```

---

## Eventos WebSocket (Socket.IO)

### Conexão

**Cliente → Conectar:**
```javascript
const socket = io('ws://localhost:3001', {
  auth: {
    token: 'jwt-token-from-rest-api'
  }
});
```

### Eventos de Sala (Room)

#### `room:join`
**Direção:** Cliente → Servidor

Jogador entra na sala após conectar WebSocket.

**Payload:**
```json
{
  "roomId": "room-uuid"
}
```

#### `room:joined`
**Direção:** Servidor → Cliente

Confirma entrada na sala.

**Payload:**
```json
{
  "playerId": "uuid",
  "roomId": "room-uuid",
  "players": [...]
}
```

#### `room:player_joined`
**Direção:** Servidor → Todos na sala (broadcast)

Novo jogador entrou na sala.

**Payload:**
```json
{
  "player": {
    "id": "uuid",
    "name": "Carlos",
    "isConnected": true
  },
  "playerCount": 5
}
```

#### `room:player_left`
**Direção:** Servidor → Todos na sala (broadcast)

Jogador saiu da sala.

**Payload:**
```json
{
  "playerId": "uuid",
  "playerCount": 4
}
```

---

### Eventos de Jogo (Game)

#### `game:start`
**Direção:** Cliente → Servidor (apenas host)

Inicia o jogo. Requer mínimo 4 jogadores.

**Payload:**
```json
{
  "roomId": "room-uuid"
}
```

#### `game:started`
**Direção:** Servidor → Todos na sala (broadcast)

Jogo iniciado com sucesso.

**Payload:**
```json
{
  "gameId": "game-uuid",
  "players": [...],
  "settings": {...},
  "currentRound": 1,
  "maxRounds": 5
}
```

#### `game:phase_change`
**Direção:** Servidor → Todos na sala (broadcast)

Fase do jogo mudou.

**Payload:**
```json
{
  "phase": "drawing",
  "previousPhase": "preparation",
  "duration": 90,
  "timestamp": 1707303000000
}
```

**Fases possíveis:** `lobby`, `preparation`, `drawing`, `evidence`, `discussion`, `voting`, `resolution`, `ended`

#### `game:role_assigned`
**Direção:** Servidor → Cliente específico (privado)

Papel e tema atribuídos ao jogador.

**Payload Honesto:**
```json
{
  "role": "honest",
  "theme": "gato",
  "isSaboteur": false
}
```

**Payload Sabotador:**
```json
{
  "role": "saboteur",
  "theme": "cachorro",
  "isSaboteur": true,
  "otherSaboteurs": ["player-id-2"]
}
```

#### `game:ended`
**Direção:** Servidor → Todos na sala (broadcast)

Jogo encerrou.

**Payload:**
```json
{
  "winner": {
    "playerId": "uuid",
    "name": "João",
    "totalScore": 145
  },
  "finalScores": [...],
  "reason": "max_rounds_reached"
}
```

---

### Eventos de Desenho (Drawing)

#### `stroke:start`
**Direção:** Cliente → Servidor

Inicia um novo stroke.

**Payload:**
```json
{
  "gameId": "game-uuid",
  "strokeId": "stroke-uuid",
  "x": 100,
  "y": 200,
  "color": "#FF0000",
  "thickness": 3,
  "tool": "pencil",
  "timestamp": 1707303000000
}
```

#### `stroke:continue`
**Direção:** Cliente → Servidor

Adiciona ponto ao stroke atual.

**Payload:**
```json
{
  "gameId": "game-uuid",
  "strokeId": "stroke-uuid",
  "x": 105,
  "y": 205,
  "timestamp": 1707303000050
}
```

#### `stroke:end`
**Direção:** Cliente → Servidor

Finaliza o stroke.

**Payload:**
```json
{
  "gameId": "game-uuid",
  "strokeId": "stroke-uuid",
  "timestamp": 1707303000100
}
```

#### `stroke:broadcast`
**Direção:** Servidor → Todos na sala exceto emissor (broadcast)

Propaga stroke para outros jogadores.

**Payload:**
```json
{
  "playerId": "uuid",
  "action": "start",
  "strokeId": "stroke-uuid",
  "x": 100,
  "y": 200,
  "color": "#FF0000",
  "thickness": 3,
  "tool": "pencil"
}
```

#### `canvas:clear`
**Direção:** Cliente → Servidor

Limpa o canvas.

**Payload:**
```json
{
  "gameId": "game-uuid"
}
```

#### `canvas:cleared`
**Direção:** Servidor → Todos na sala (broadcast)

Canvas foi limpo.

**Payload:**
```json
{
  "playerId": "uuid",
  "timestamp": 1707303000000
}
```

---

### Eventos de Votação (Voting)

#### `voting:start`
**Direção:** Servidor → Todos na sala (broadcast)

Fase de votação iniciada.

**Payload:**
```json
{
  "duration": 20,
  "eligiblePlayers": [
    {"id": "uuid-1", "name": "João"},
    {"id": "uuid-2", "name": "Maria"}
  ]
}
```

#### `vote:cast`
**Direção:** Cliente → Servidor

Jogador votou em alguém.

**Payload:**
```json
{
  "gameId": "game-uuid",
  "targetId": "player-uuid"
}
```

#### `vote:confirmed`
**Direção:** Servidor → Cliente específico (privado)

Voto registrado com sucesso.

**Payload:**
```json
{
  "voteId": "vote-uuid",
  "targetId": "player-uuid",
  "timestamp": 1707303000000
}
```

#### `voting:end`
**Direção:** Servidor → Todos na sala (broadcast)

Fase de votação encerrou.

**Payload:**
```json
{
  "totalVotes": 7,
  "abstentions": 1
}
```

#### `vote:results`
**Direção:** Servidor → Todos na sala (broadcast)

Resultados da votação revelados.

**Payload:**
```json
{
  "eliminatedPlayer": {
    "id": "player-uuid",
    "name": "Carlos",
    "wasSaboteur": true
  },
  "voteCount": {
    "player-uuid": 4,
    "player-uuid-2": 2,
    "abstain": 1
  },
  "scores": [...]
}
```

---

### Eventos de Erro

#### `error`
**Direção:** Servidor → Cliente

Erro ocorrido.

**Payload:**
```json
{
  "code": "GAME_NOT_FOUND",
  "message": "Game with id game-uuid not found",
  "details": {}
}
```

**Códigos de Erro Comuns:**
- `AUTH_ERROR`: Token inválido ou expirado
- `ROOM_NOT_FOUND`: Sala não existe
- `ROOM_FULL`: Sala cheia
- `GAME_NOT_FOUND`: Jogo não encontrado
- `GAME_ALREADY_STARTED`: Jogo já iniciou
- `INVALID_PHASE`: Ação não permitida na fase atual
- `NOT_HOST`: Apenas host pode executar esta ação
- `ALREADY_VOTED`: Jogador já votou
- `CANNOT_VOTE_SELF`: Auto-voto proibido

---

## Exemplos de Fluxo

### Fluxo 1: Criar Sala e Entrar

```
1. Cliente A: POST /rooms → Recebe room.code e player.token
2. Cliente A: Socket connect com token
3. Cliente A: Emit room:join {roomId}
4. Servidor: Emit room:joined para Cliente A

5. Cliente B: GET /rooms/ABC123 → Verifica sala
6. Cliente B: POST /rooms/ABC123/join → Recebe token
7. Cliente B: Socket connect com token
8. Cliente B: Emit room:join {roomId}
9. Servidor: 
   - Emit room:joined para Cliente B
   - Emit room:player_joined para todos (inclui Cliente A)
```

### Fluxo 2: Ciclo Completo de Rodada

```
1. Host: Emit game:start {roomId}
2. Servidor: 
   - Distribui papéis
   - Emit game:started para todos
   - Emit game:role_assigned (privado) para cada jogador

3. [Preparação - 10s]
   - Servidor: Emit game:phase_change {phase: "drawing"}

4. [Desenho - 90s]
   - Jogadores: Emit stroke:start/continue/end
   - Servidor: Propaga via stroke:broadcast
   - Servidor: Coleta evidências

5. [Evidências - 15s]
   - Servidor: Emit game:phase_change {phase: "evidence"}
   - (Frontend mostra heatmaps/análises)

6. [Discussão - 60s]
   - Servidor: Emit game:phase_change {phase: "discussion"}
   - (Chat/discussão via frontend)

7. [Votação - 20s]
   - Servidor: Emit voting:start
   - Jogadores: Emit vote:cast {targetId}
   - Servidor: Emit vote:confirmed (privado)
   - Timer expira...
   - Servidor: Emit voting:end
   - Servidor: Emit vote:results

8. [Resolução - 10s]
   - Servidor: Emit game:phase_change {phase: "resolution"}
   - Atualiza scores
   - Verifica condição de vitória
   - Se não encerrou: volta para passo 3 (próxima rodada)
   - Se encerrou: Emit game:ended
```

---

## Notas de Implementação

1. **Reconexão:** Socket.IO gerencia automaticamente. Cliente deve re-emitir `room:join` ao reconectar.

2. **Rate Limiting:** Strokes devem ser throttled no cliente (máximo 60/segundo) para evitar spam.

3. **Validação:** Servidor valida todos os payloads. Erros são emitidos via evento `error`.

4. **Persistência:** Estado do jogo mantido em memória. Dados perdidos se servidor reiniciar.

5. **Escalabilidade:** Para múltiplos servidores, será necessário Redis Adapter para Socket.IO.

---

*Versão 1.0 - API Specification*
