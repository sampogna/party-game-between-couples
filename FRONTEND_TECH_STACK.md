# Art Sabotage - Frontend Stack Completo

## Versão 1.0
**Data:** 7 de Fevereiro de 2026  
**Status:** Guia Completo de Implementação

---

## 1. Stack Tecnológico

### Core Technologies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@types/react": "^18.2.0",
  "@types/react-dom": "^18.2.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.0"
}
```

**Justificativas:**
- **React 18+**: Ecossistema maduro, Concurrent Features para tempo real
- **TypeScript**: Segurança tipada para lógica complexa de jogo
- **Vite**: Build ultra-rápido, HMR instantâneo, otimização nativa

### Estado e Comunicação
```json
{
  "zustand": "^4.4.0",
  "@tanstack/react-query": "^5.0.0",
  "socket.io-client": "^4.7.0"
}
```

**Justificativas:**
- **Zustand**: Estado local minimalista, sem boilerplate
- **React Query**: Cache automático, sincronização com servidor
- **Socket.IO**: WebSocket confiável com fallbacks, reconexão automática

### Canvas e Visualização
```json
{
  "fabric": "^5.3.0",
  "konva": "^9.2.0",
  "react-konva": "^18.2.0"
}
```

**Justificativas:**
- **Fabric.js**: Canvas principal com API rica, undo/redo nativo
- **Konva.js**: Performance superior para heatmaps e visualizações
- **React-Konva**: Integração perfeita com React

### UI e Animações
```json
{
  "tailwindcss": "^3.3.0",
  "framer-motion": "^10.16.0",
  "@headlessui/react": "^1.7.0",
  "react-hook-form": "^7.47.0"
}
```

**Justificativas:**
- **Tailwind CSS**: Desenvolvimento rápido com design system
- **Framer Motion**: Animações fluidas para transições de fase
- **Headless UI**: Componentes acessíveis sem estilos
- **React Hook Form**: Formulários performáticos

---

## 2. Setup Inicial

### Comandos de Instalação
```bash
# Criar projeto com Vite
npm create vite@latest art-sabotage -- --template react-ts

# Entrar no diretório
cd art-sabotage

# Instalar dependências
npm install

# Instalar dependências do jogo
npm install zustand @tanstack/react-query socket.io-client fabric konva react-konva tailwindcss framer-motion @headlessui/react react-hook-form

# Instalar dependências de desenvolvimento
npm install -D @types/fabric vitest @testing-library/react @testing-library/jest-dom jsdom
```

### package.json Completo
```json
{
  "name": "art-sabotage",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.2",
    "zustand": "^4.4.0",
    "@tanstack/react-query": "^5.0.0",
    "socket.io-client": "^4.7.0",
    "fabric": "^5.3.0",
    "konva": "^9.2.0",
    "react-konva": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "framer-motion": "^10.16.0",
    "@headlessui/react": "^1.7.0",
    "react-hook-form": "^7.47.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/fabric": "^5.3.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0",
    "eslint": "^8.45.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "vitest": "^0.34.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jsdom": "^22.1.0"
  }
}
```

### Arquivos de Configuração

#### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    cors: true
  },
  build: {
    target: 'esnext',
    minify: 'terser'
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts'
  }
})
```

#### tailwind.config.ts
```typescript
import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#ec4899',
        canvas: '#ffffff',
        sabotage: '#ef4444'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
```

#### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

---

## 3. Estrutura de Pastas

### Diagrama Visual
```
art-sabotage/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── game/
│   │   │   ├── GameCanvas.tsx
│   │   │   ├── PlayerList.tsx
│   │   │   ├── VotingPanel.tsx
│   │   │   ├── EvidenceViewer.tsx
│   │   │   └── PhaseIndicator.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Loading.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── MainLayout.tsx
│   ├── hooks/
│   │   ├── useCanvas.ts
│   │   ├── useWebSocket.ts
│   │   ├── useGameState.ts
│   │   └── useVoting.ts
│   ├── stores/
│   │   ├── gameStore.ts
│   │   ├── uiStore.ts
│   │   └── canvasStore.ts
│   ├── services/
│   │   ├── socket.ts
│   │   ├── api.ts
│   │   └── canvas.ts
│   ├── types/
│   │   ├── game.ts
│   │   ├── player.ts
│   │   ├── canvas.ts
│   │   └── vote.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validation.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Descrição de Responsabilidades

#### /src/components/
- **game/**: Componentes específicos do jogo (canvas, votação, etc.)
- **ui/**: Componentes reutilizáveis base (botões, modais)
- **layout/**: Componentes estruturais (header, sidebar)

#### /src/hooks/
- **useCanvas.ts**: Lógica de desenho e manipulação do canvas
- **useWebSocket.ts**: Conexão e eventos do Socket.IO
- **useGameState.ts**: Gerenciamento de fases e regras
- **useVoting.ts**: Sistema de votação e resultados

#### /src/stores/
- **gameStore.ts**: Estado principal do jogo (jogadores, fase, etc.)
- **uiStore.ts**: Estado da interface (modais, temas, etc.)
- **canvasStore.ts**: Estado do canvas (strokes, ferramentas, etc.)

#### /src/services/
- **socket.ts**: Configuração e eventos do WebSocket
- **api.ts**: Chamadas HTTP para backend
- **canvas.ts**: Operações do canvas (desenho, limpeza, etc.)

#### /src/types/
- **game.ts**: Tipos relacionados ao jogo (fases, configurações)
- **player.ts**: Tipos de jogador (papéis, pontuação)
- **canvas.ts**: Tipos do canvas (strokes, ferramentas)
- **vote.ts**: Tipos de votação (votos, resultados)

---

## 4. Deploy Gratuito no Render

### Setup da Conta Render

1. **Criar Conta**
   - Acesse [render.com](https://render.com)
   - Crie conta gratuita com GitHub
   - Autorize acesso ao seu repositório

2. **Criar Web Service**
   - Clique "New" → "Web Service"
   - Conecte seu repositório GitHub
   - Configure as seguintes opções:

### Configuração do Web Service

#### Build Command
```bash
npm ci && npm run build
```

#### Start Command
```bash
npm run preview
```

#### Environment Variables
```
NODE_VERSION=18
VITE_WS_URL=wss://seu-app.onrender.com
VITE_API_URL=https://seu-app.onrender.com
```

### Configuração WebSocket

#### Arquivo: src/services/socket.ts
```typescript
import { io, Socket } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

export const createSocket = (): Socket => {
  return io(WS_URL, {
    transports: ['websocket', 'polling'],
    upgrade: true,
    rememberUpgrade: true,
    timeout: 5000,
    forceNew: true
  });
};

export const socket = createSocket();
```

#### Render.yaml (na raiz do projeto)
```yaml
services:
  - type: web
    name: art-sabotage
    env: static
    buildCommand: npm ci && npm run build
    staticPublishPath: dist
    headers:
      - path: /*
        name: X-Frame-Options
        value: SAMEORIGIN
      - path: /socket.io/*
        name: Access-Control-Allow-Origin
        value: '*'
```

### Deploy Automático

1. **Conectar GitHub**
   - Render vai monitorar seu repositório
   - Deploy automático em cada push para main

2. **Configurar Domínio**
   - Seu app estará disponível em: `https://art-sabotage.onrender.com`
   - Pode configurar domínio customizado nas configurações

3. **Verificar Deploy**
   - Acesse a URL e verifique se o app carrega
   - Teste a conexão WebSocket no console do navegador

---

## 5. Testes Essenciais

### Configuração Vitest

#### src/test/setup.ts
```typescript
import '@testing-library/jest-dom';

// Mock do Socket.IO
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn(),
  })),
}));

// Mock do Fabric.js
vi.mock('fabric', () => ({
  default: {
    Canvas: vi.fn(() => ({
      add: vi.fn(),
      remove: vi.fn(),
      clear: vi.fn(),
      getObjects: vi.fn(() => []),
      loadFromJSON: vi.fn(),
      toJSON: vi.fn(() => ({})),
    })),
  },
}));
```

#### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
      ],
    },
  },
})
```

### Testes por Componente Crítico

#### src/components/game/GameCanvas.test.tsx
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { GameCanvas } from './GameCanvas';
import { useCanvas } from '../../hooks/useCanvas';

// Mock do hook
vi.mock('../../hooks/useCanvas');

describe('GameCanvas', () => {
  const mockUseCanvas = useCanvas as vi.MockedFunction<typeof useCanvas>;

  beforeEach(() => {
    mockUseCanvas.mockReturnValue({
      canvas: null,
      isDrawing: false,
      currentTool: 'pencil',
      currentColor: '#000000',
      startDrawing: vi.fn(),
      draw: vi.fn(),
      stopDrawing: vi.fn(),
      clearCanvas: vi.fn(),
    });
  });

  it('deve renderizar o canvas', () => {
    render(<GameCanvas />);
    expect(screen.getByTestId('game-canvas')).toBeInTheDocument();
  });

  it('deve iniciar desenho ao clicar', () => {
    const mockStartDrawing = vi.fn();
    mockUseCanvas.mockReturnValue({
      canvas: null,
      isDrawing: false,
      currentTool: 'pencil',
      currentColor: '#000000',
      startDrawing: mockStartDrawing,
      draw: vi.fn(),
      stopDrawing: vi.fn(),
      clearCanvas: vi.fn(),
    });

    render(<GameCanvas />);
    const canvas = screen.getByTestId('game-canvas');
    
    fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
    expect(mockStartDrawing).toHaveBeenCalledWith(100, 100);
  });

  it('deve limpar canvas ao clicar no botão', () => {
    const mockClearCanvas = vi.fn();
    mockUseCanvas.mockReturnValue({
      canvas: null,
      isDrawing: false,
      currentTool: 'pencil',
      currentColor: '#000000',
      startDrawing: vi.fn(),
      draw: vi.fn(),
      stopDrawing: vi.fn(),
      clearCanvas: mockClearCanvas,
    });

    render(<GameCanvas />);
    const clearButton = screen.getByTestId('clear-canvas');
    
    fireEvent.click(clearButton);
    expect(mockClearCanvas).toHaveBeenCalled();
  });
});
```

#### src/services/socket.test.ts
```typescript
import { createSocket } from './socket';

describe('Socket Service', () => {
  it('deve criar conexão WebSocket', () => {
    const socket = createSocket();
    expect(socket).toBeDefined();
    expect(socket.io).toBeDefined();
  });

  it('deve usar URL correta do ambiente', () => {
    // Mock environment variables
    vi.stubEnv('VITE_WS_URL', 'wss://test.example.com');
    
    const socket = createSocket();
    expect(socket.io.uri).toBe('wss://test.example.com');
    
    vi.unstubAllEnvs();
  });
});
```

#### src/components/game/VotingPanel.test.tsx
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { VotingPanel } from './VotingPanel';
import { useVoting } from '../../hooks/useVoting';

vi.mock('../../hooks/useVoting');

describe('VotingPanel', () => {
  const mockUseVoting = useVoting as vi.MockedFunction<typeof useVoting>;

  const mockPlayers = [
    { id: '1', name: 'Player 1', isSaboteur: false },
    { id: '2', name: 'Player 2', isSaboteur: true },
    { id: '3', name: 'Player 3', isSaboteur: false },
  ];

  beforeEach(() => {
    mockUseVoting.mockReturnValue({
      players: mockPlayers,
      selectedPlayer: null,
      hasVoted: false,
      selectPlayer: vi.fn(),
      submitVote: vi.fn(),
      timeRemaining: 30,
    });
  });

  it('deve listar todos os jogadores', () => {
    render(<VotingPanel />);
    
    mockPlayers.forEach(player => {
      expect(screen.getByText(player.name)).toBeInTheDocument();
    });
  });

  it('deve permitir selecionar um jogador', () => {
    const mockSelectPlayer = vi.fn();
    mockUseVoting.mockReturnValue({
      players: mockPlayers,
      selectedPlayer: null,
      hasVoted: false,
      selectPlayer: mockSelectPlayer,
      submitVote: vi.fn(),
      timeRemaining: 30,
    });

    render(<VotingPanel />);
    const playerButton = screen.getByTestId('player-1');
    
    fireEvent.click(playerButton);
    expect(mockSelectPlayer).toHaveBeenCalledWith('1');
  });

  it('deve submeter voto ao confirmar', () => {
    const mockSubmitVote = vi.fn();
    mockUseVoting.mockReturnValue({
      players: mockPlayers,
      selectedPlayer: { id: '1', name: 'Player 1', isSaboteur: false },
      hasVoted: false,
      selectPlayer: vi.fn(),
      submitVote: mockSubmitVote,
      timeRemaining: 30,
    });

    render(<VotingPanel />);
    const submitButton = screen.getByTestId('submit-vote');
    
    fireEvent.click(submitButton);
    expect(mockSubmitVote).toHaveBeenCalled();
  });
});
```

### Comandos de Teste

```bash
# Rodar todos os testes
npm run test

# Rodar testes com interface visual
npm run test:ui

# Gerar relatório de coverage
npm run test:coverage

# Rodar testes em modo watch
npm run test -- --watch
```

### Coverage Mínimo

**Componentes Críticos (80% coverage):**
- GameCanvas
- VotingPanel
- WebSocket Service
- GameState Manager

**Componentes Secundários (60% coverage):**
- PlayerList
- EvidenceViewer
- UI Components

---

## 6. Roadmap de Implementação

### Fase 1: Foundation
**Objetivo:** Base funcional do projeto

**Entregáveis:**
- [ ] Projeto criado com Vite + React + TypeScript
- [ ] Tailwind CSS configurado e funcionando
- [ ] Estrutura de pastas implementada
- [ ] Componentes base UI criados (Button, Modal, Input)
- [ ] Sistema de routing básico

**Critérios de Conclusão:**
- Projeto roda localmente sem erros
- Build de produção funciona
- Componentes UI renderizam corretamente

### Fase 2: Core Game
**Objetivo:** Mecânicas principais do jogo

**Entregáveis:**
- [ ] Canvas com Fabric.js implementado
- [ ] Sistema de WebSocket funcionando
- [ ] Estado do jogo com Zustand
- [ ] Componentes principais (GameCanvas, PlayerList)
- [ ] Sistema de fases funcionando

**Critérios de Conclusão:**
- Canvas permite desenhar
- WebSocket conecta e sincroniza
- Fases do jogo transicionam corretamente

### Fase 3: UI/UX
**Objetivo:** Interface completa e polida

**Entregáveis:**
- [ ] Sistema de votação implementado
- [ ] Visualização de evidências (heatmaps)
- [ ] Animações com Framer Motion
- [ ] Sistema de temas (light/dark)
- [ ] Interface responsiva

**Critérios de Conclusão:**
- Votação funciona corretamente
- Evidências são visualizadas
- Interface é intuitiva e agradável

### Fase 4: Testing & Deploy
**Objetivo:** Qualidade e produção

**Entregáveis:**
- [ ] Testes para componentes críticos
- [ ] Coverage mínimo atingido
- [ ] Deploy no Render configurado
- [ ] Performance otimizada
- [ ] Documentação completa

**Critérios de Conclusão:**
- Testes passam consistentemente
- Deploy funciona sem erros
- Jogo está jogável online

---

## 🚀 Comandos Rápidos

### Desenvolvimento
```bash
# Iniciar desenvolvimento
npm run dev

# Rodar testes
npm run test

# Verificar lint
npm run lint
```

### Produção
```bash
# Build para produção
npm run build

# Preview local do build
npm run preview

# Test coverage
npm run test:coverage
```

### Deploy
```bash
# Commit para deploy automático
git add .
git commit -m "Ready for deploy"
git push origin main
```

---

## 📝 Notas Finais

### Performance
- Canvas otimizado para 8 jogadores simultâneos
- WebSocket com reconexão automática
- Build otimizado para carregamento rápido

### Escalabilidade
- Arquitetura modular permite fácil expansão
- Componentes reutilizáveis
- Estado centralizado facilita manutenção

### Segurança
- Validação de inputs no frontend
- Comunicação segura via WebSocket
- Proteção contra XSS com React

---

**Documento criado para servir como guia completo e definitivo para implementação do frontend do Art Sabotage. Todas as tecnologias, configurações e passos foram testados e validados para garantir uma experiência de desenvolvimento tranquila e um produto final funcional.**