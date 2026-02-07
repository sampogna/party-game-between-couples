# Art Sabotage - Plano de Implementação

## Controle de Versão do Plano

**Versão:** 1.0  
**Última Atualização:** 7 de Fevereiro de 2026  
**Status:** Em andamento

---

## 📋 Como Usar Este Documento

Este é um plano de implementação incremental. Cada item tem uma checkbox `[ ]` que deve ser marcada `[x]` quando concluído.

**Instruções para Agents:**
1. Sempre leia este documento antes de iniciar trabalho
2. Marque tarefas como concluídas imediatamente após finalizar
3. Nunca prossiga para a próxima tarefa sem concluir e testar a atual
4. Se encontrar bloqueios, documente na seção de Notas

**Instruções para Usuário:**
1. Revise cada tarefa concluída antes de autorizar a próxima
2. Teste o código entregue em cada passo
3. Forneça feedback imediato se algo não estiver conforme esperado

---

## 🎯 Fase 1: Setup e Fundação

### 1.1 Setup Inicial Backend

- [ ] **1.1.1** Criar estrutura de pastas do backend (src/, tests/)
- [ ] **1.1.2** Inicializar projeto Node.js com package.json
- [ ] **1.1.3** Instalar TypeScript e configurar tsconfig.json
- [ ] **1.1.4** Configurar ESLint e Prettier
- [ ] **1.1.5** Criar script de dev com ts-node
- [ ] **1.1.6** Testar: `npm run dev` deve iniciar sem erros

### 1.2 Setup Inicial Frontend

- [ ] **1.2.1** Criar projeto React com Vite (template react-ts)
- [ ] **1.2.2** Configurar Tailwind CSS
- [ ] **1.2.3** Configurar path aliases (@/*)
- [ ] **1.2.4** Criar estrutura de pastas (components/, hooks/, stores/)
- [ ] **1.2.5** Testar: `npm run dev` deve abrir página padrão do Vite

### 1.3 Configuração de Ambiente

- [ ] **1.3.1** Criar .env.example no backend
- [ ] **1.3.2** Criar .env.example no frontend
- [ ] **1.3.3** Configurar variáveis de ambiente básicas (PORT, NODE_ENV)
- [ ] **1.3.4** Testar: Ambientes devem carregar variáveis corretamente

---

## 🎯 Fase 2: Backend - Comunicação Básica

### 2.1 Servidor HTTP Básico

- [ ] **2.1.1** Instalar Express e tipos
- [ ] **2.1.2** Criar servidor Express básico
- [ ] **2.1.3** Configurar middlewares (CORS, Helmet, JSON parser)
- [ ] **2.1.4** Criar rota GET /health
- [ ] **2.1.5** Testar: `curl http://localhost:3001/health` deve retornar status 200

### 2.2 WebSocket Básico

- [ ] **2.2.1** Instalar Socket.IO
- [ ] **2.2.2** Integrar Socket.IO com servidor Express
- [ ] **2.2.3** Configurar CORS para WebSocket
- [ ] **2.2.4** Criar handler de connection básico (log no console)
- [ ] **2.2.5** Testar: Cliente Socket.IO deve conectar sem erros

### 2.3 Sistema de Salas (Rooms)

- [ ] **2.3.1** Criar endpoint POST /rooms (criar sala)
- [ ] **2.3.2** Implementar join room no Socket.IO
- [ ] **2.3.3** Implementar leave room no Socket.IO
- [ ] **2.3.4** Criar evento de broadcast para sala (teste: mensagem simples)
- [ ] **2.3.5** Testar: Dois clientes na mesma sala devem receber mensagens

---

## 🎯 Fase 3: Frontend - Comunicação Básica

### 3.1 Integração WebSocket

- [ ] **3.1.1** Instalar Socket.IO Client
- [ ] **3.1.2** Criar hook useSocket (conexão básica)
- [ ] **3.1.3** Implementar conexão ao servidor na inicialização
- [ ] **3.1.4** Mostrar status de conexão na UI (conectado/desconectado)
- [ ] **3.1.5** Testar: UI deve mostrar "Conectado" quando server estiver online

### 3.2 Sistema de Salas

- [ ] **3.2.1** Criar tela de entrada (input para nome do jogador)
- [ ] **3.2.2** Criar tela de criação/entrada em sala
- [ ] **3.2.3** Implementar criação de sala (chamada ao backend)
- [ ] **3.2.4** Implementar entrada em sala existente
- [ ] **3.2.5** Mostrar lista de jogadores na sala
- [ ] **3.2.6** Testar: Dois jogadores devem ver um ao outro na lista

### 3.3 Estados com Zustand

- [ ] **3.3.1** Instalar Zustand
- [ ] **3.3.2** Criar store de autenticação (playerName, playerId)
- [ ] **3.3.3** Criar store de sala (roomId, players, isHost)
- [ ] **3.3.4** Persistir estado no localStorage
- [ ] **3.3.5** Testar: Recarregar página deve manter sessão

---

## 🎯 Fase 4: Backend - Modelos de Dados

### 4.1 Tipos TypeScript

- [ ] **4.1.1** Definir tipos básicos (Player, Room)
- [ ] **4.1.2** Definir tipos de jogo (Game, GamePhase)
- [ ] **4.1.3** Definir tipos de canvas (Stroke, Point)
- [ ] **4.1.4** Criar enums para eventos Socket.IO
- [ ] **4.1.5** Testar: Types devem compilar sem erros

### 4.2 Serviço de Jogadores

- [ ] **4.2.1** Criar PlayerService (gerenciar jogadores em memória)
- [ ] **4.2.2** Implementar createPlayer
- [ ] **4.2.3** Implementar getPlayerById
- [ ] **4.2.4** Implementar removePlayer
- [ ] **4.2.5** Testar: CRUD básico de jogadores deve funcionar

### 4.3 Serviço de Salas

- [ ] **4.3.1** Criar RoomService (gerenciar salas em memória)
- [ ] **4.3.2** Implementar createRoom (gerar código único)
- [ ] **4.3.3** Implementar addPlayerToRoom
- [ ] **4.3.4** Implementar removePlayerFromRoom
- [ ] **4.3.5** Implementar getRoomByCode
- [ ] **4.3.6** Testar: Ciclo completo de sala deve funcionar

---

## 🎯 Fase 5: Frontend - UI Básica

### 5.1 Componentes Base

- [ ] **5.1.1** Criar componente Button reutilizável
- [ ] **5.1.2** Criar componente Input reutilizável
- [ ] **5.1.3** Criar componente Modal reutilizável
- [ ] **5.1.4** Criar componente Loading
- [ ] **5.1.5** Testar: Componentes devem renderizar corretamente

### 5.2 Layout da Aplicação

- [ ] **5.2.1** Criar componente Header
- [ ] **5.2.2** Criar componente MainLayout
- [ ] **5.2.3** Implementar roteamento básico (React Router)
- [ ] **5.2.4** Criar página Home
- [ ] **5.2.5** Criar página Lobby
- [ ] **5.2.6** Testar: Navegação entre páginas deve funcionar

### 5.3 Tela de Jogo

- [ ] **5.3.1** Criar estrutura da página Game
- [ ] **5.3.2** Criar componente PlayerList (sidebar)
- [ ] **5.3.3** Criar componente PhaseIndicator
- [ ] **5.3.4** Criar placeholder para GameCanvas
- [ ] **5.3.5** Testar: Layout deve ser responsivo

---

## 🎯 Fase 6: Canvas - Desenho Básico

### 6.1 Integração Fabric.js

- [ ] **6.1.1** Instalar Fabric.js
- [ ] **6.1.2** Criar componente GameCanvas básico
- [ ] **6.1.3** Inicializar canvas Fabric.js
- [ ] **6.1.4** Configurar dimensões do canvas
- [ ] **6.1.5** Testar: Canvas deve renderizar na tela

### 6.2 Desenho Local

- [ ] **6.2.1** Implementar evento mouseDown (iniciar stroke)
- [ ] **6.2.2** Implementar evento mouseMove (continuar stroke)
- [ ] **6.2.3** Implementar evento mouseUp (finalizar stroke)
- [ ] **6.2.4** Implementar seleção de cor
- [ ] **6.2.5** Implementar seleção de espessura
- [ ] **6.2.6** Testar: Deve ser possível desenhar localmente

### 6.3 Sincronização de Strokes

- [ ] **6.3.1** Emitir evento stroke:start para servidor
- [ ] **6.3.2** Emitir evento stroke:continue para servidor
- [ ] **6.3.3** Emitir evento stroke:end para servidor
- [ ] **6.3.4** Receber strokes de outros jogadores
- [ ] **6.3.5** Renderizar strokes remotos no canvas
- [ ] **6.3.6** Testar: Dois jogadores devem ver desenhos um do outro em tempo real

---

## 🎯 Fase 7: Backend - Lógica do Jogo

### 7.1 Serviço de Jogo

- [ ] **7.1.1** Criar GameService
- [ ] **7.1.2** Implementar createGame (vincular a sala)
- [ ] **7.1.3** Implementar getGameById
- [ ] **7.1.4** Implementar endGame
- [ ] **7.1.5** Testar: Ciclo de vida básico de jogo

### 7.2 Fases do Jogo

- [ ] **7.2.1** Implementar enum GamePhase (LOBBY, DRAWING, VOTING, etc)
- [ ] **7.2.2** Implementar mudança de fase
- [ ] **7.2.3** Broadcast de mudança de fase para todos jogadores
- [ ] **7.2.4** Implementar timer por fase (básico)
- [ ] **7.2.5** Testar: Transições de fase devem funcionar

### 7.3 Distribuição de Papéis

- [ ] **7.3.1** Implementar lógica de atribuição de sabotadores
- [ ] **7.3.2** Implementar atribuição de temas (honesto vs sabotador)
- [ ] **7.3.3** Enviar papel secreto para cada jogador
- [ ] **7.3.4** Testar: Jogadores devem receber papéis diferentes

---

## 🎯 Fase 8: Frontend - Fluxo de Jogo

### 8.1 Gerenciamento de Fases

- [ ] **8.1.1** Criar store de jogo (gameStore)
- [ ] **8.1.2** Implementar atualização de fase via WebSocket
- [ ] **8.1.3** Criar componente PhaseManager
- [ ] **8.1.4** Mostrar fase atual na UI
- [ ] **8.1.5** Testar: UI deve refletir mudanças de fase

### 8.2 Tela de Preparação

- [ ] **8.2.1** Criar componente PreparationPhase
- [ ] **8.2.2** Mostrar papel do jogador (honesto/sabotador)
- [ ] **8.2.3** Mostrar tema para desenhar
- [ ] **8.2.4** Implementar countdown para início
- [ ] **8.2.5** Testar: Informações devem ser mostradas corretamente

### 8.3 Tela de Desenho

- [ ] **8.3.1** Integrar GameCanvas no fluxo de jogo
- [ ] **8.3.2** Mostrar timer de desenho
- [ ] **8.3.3** Implementar toolbar de ferramentas
- [ ] **8.3.4** Implementar clear canvas
- [ ] **8.3.5** Testar: Canvas funcional durante fase de desenho

---

## 🎯 Fase 9: Backend - Sistema de Votação

### 9.1 Serviço de Votação

- [ ] **9.1.1** Criar VoteService
- [ ] **9.1.2** Implementar castVote (jogador vota em outro)
- [ ] **9.1.3** Implementar hasAllPlayersVoted
- [ ] **9.1.4** Implementar getVoteResults
- [ ] **9.1.5** Testar: Sistema de votação básico

### 9.2 Eventos de Votação

- [ ] **9.2.1** Criar evento voting:started
- [ ] **9.2.2** Criar evento vote:cast (receber voto)
- [ ] **9.2.3** Criar evento voting:ended
- [ ] **9.2.4** Criar evento vote:results (enviar resultados)
- [ ] **9.2.5** Testar: Ciclo completo de votação

---

## 🎯 Fase 10: Frontend - Sistema de Votação

### 10.1 UI de Votação

- [ ] **10.1.1** Criar componente VotingPanel
- [ ] **10.1.2** Listar jogadores disponíveis para voto
- [ ] **10.1.3** Implementar seleção de jogador
- [ ] **10.1.4** Implementar botão de confirmar voto
- [ ] **10.1.5** Mostrar timer de votação
- [ ] **10.1.6** Testar: Votação deve funcionar end-to-end

### 10.2 Resultados

- [ ] **10.2.1** Criar componente VotingResults
- [ ] **10.2.2** Mostrar votação de cada jogador
- [ ] **10.2.3** Destacar jogador mais votado
- [ ] **10.2.4** Revelar se sabotador foi pego
- [ ] **10.2.5** Testar: Resultados devem ser claros

---

## 🎯 Fase 11: Backend - Sistema de Pontuação

### 11.1 Serviço de Pontuação

- [ ] **11.1.1** Criar ScoringService
- [ ] **11.1.2** Implementar cálculo de pontos por rodada
- [ ] **11.1.3** Implementar bônus de sobrevivência
- [ ] **11.1.4** Implementar bônus de voto correto
- [ ] **11.1.5** Testar: Cálculos de pontuação

### 11.2 Múltiplas Rodadas

- [ ] **11.2.1** Implementar contador de rodadas
- [ ] **11.2.2** Implementar próxima rodada
- [ ] **11.2.3** Resetar canvas entre rodadas
- [ ] **11.2.4** Verificar condição de vitória
- [ ] **11.2.5** Testar: Jogo de múltiplas rodadas

---

## 🎯 Fase 12: Frontend - Evidências e Fim de Jogo

### 12.1 Visualização de Evidências

- [ ] **12.1.1** Criar componente EvidenceViewer
- [ ] **12.1.2** Integrar Konva.js para heatmaps
- [ ] **12.1.3** Mostrar estatísticas de desenho
- [ ] **12.1.4** Mostrar anomalias detectadas
- [ ] **12.1.5** Testar: Evidências devem ser visuais

### 12.2 Tela de Fim de Jogo

- [ ] **12.2.1** Criar componente GameOver
- [ ] **12.2.2** Mostrar ranking final
- [ ] **12.2.3** Mostrar vencedor
- [ ] **12.2.4** Opção de jogar novamente
- [ ] **12.2.5** Testar: Fluxo completo de fim de jogo

---

## 🎯 Fase 13: Backend - Análise de Evidências

### 13.1 Coleta de Dados

- [ ] **13.1.1** Instalar simple-statistics
- [ ] **13.1.2** Criar EvidenceService
- [ ] **13.1.3** Coletar métricas de strokes (tempo, comprimento)
- [ ] **13.1.4** Coletar distribuição de cores
- [ ] **13.1.5** Testar: Dados sendo coletados

### 13.2 Análise

- [ ] **13.2.1** Implementar análise de padrão de movimento
- [ ] **13.2.2** Implementar análise de timing
- [ ] **13.2.3** Implementar análise de cobertura
- [ ] **13.2.4** Calcular score de suspeição
- [ ] **13.2.5** Testar: Análise identifica padrões

---

## 🎯 Fase 14: Frontend - Polimentos

### 14.1 Animações

- [ ] **14.1.1** Instalar Framer Motion
- [ ] **14.1.2** Animar transições de fase
- [ ] **14.1.3** Animar entrada de jogadores
- [ ] **14.1.4** Animar resultados de votação
- [ ] **14.1.5** Testar: Animações suaves

### 14.2 Temas

- [ ] **14.2.1** Implementar tema dark/light
- [ ] **14.2.2** Persistir preferência de tema
- [ ] **14.2.3** Aplicar tema ao canvas
- [ ] **14.2.4** Testar: Temas funcionam corretamente

---

## 🎯 Fase 15: Testes e Qualidade

### 15.1 Testes Backend

- [ ] **15.1.1** Configurar Jest
- [ ] **15.1.2** Criar testes para PlayerService
- [ ] **15.1.3** Criar testes para RoomService
- [ ] **15.1.4** Criar testes para GameService
- [ ] **15.1.5** Criar testes para VoteService
- [ ] **15.1.6** Testar: `npm test` deve passar

### 15.2 Testes Frontend

- [ ] **15.2.1** Configurar Vitest
- [ ] **15.2.2** Criar testes para componentes base
- [ ] **15.2.3** Criar testes para hooks
- [ ] **15.2.4** Criar testes para stores
- [ ] **15.2.5** Testar: `npm test` deve passar

### 15.3 Testes E2E

- [ ] **15.3.1** Configurar Playwright ou Cypress
- [ ] **15.3.2** Criar teste: Criar sala e entrar
- [ ] **15.3.3** Criar teste: Fluxo de jogo completo
- [ ] **15.3.4** Testar: Testes E2E passam

---

## 🎯 Fase 16: Deploy

### 16.1 Backend Deploy

- [ ] **16.1.1** Criar render.yaml
- [ ] **16.1.2** Configurar variáveis de ambiente no Render
- [ ] **16.1.3** Configurar build e start commands
- [ ] **16.1.4** Fazer deploy
- [ ] **16.1.5** Testar: Backend online e acessível

### 16.2 Frontend Deploy

- [ ] **16.2.1** Configurar build de produção
- [ ] **16.2.2** Atualizar URL do backend para produção
- [ ] **16.2.3** Fazer deploy no Render (Static Site)
- [ ] **16.2.4** Configurar CORS no backend para domínio de produção
- [ ] **16.2.5** Testar: Aplicação completa online

---

## 🎯 Fase 17: Documentação Final

### 17.1 Documentação Técnica

- [ ] **17.1.1** Criar README.md do backend
- [ ] **17.1.2** Criar README.md do frontend
- [ ] **17.1.3** Documentar API (endpoints)
- [ ] **17.1.4** Documentar eventos Socket.IO
- [ ] **17.1.5** Documentar variáveis de ambiente

### 17.2 Documentação do Usuário

- [ ] **17.2.1** Criar guia de instalação local
- [ ] **17.2.2** Criar regras do jogo
- [ ] **17.2.3** Criar tutorial de uso
- [ ] **17.2.4** Adicionar screenshots

---

## 📊 Progresso Geral

**Fases Concluídas:** 0/17  
**Tarefas Concluídas:** 0/131  
**Progresso:** 0%

---

## 📝 Notas e Bloqueios

### Bloqueios Atuais
*Nenhum*

### Decisões Pendentes
*Nenhuma*

### Observações Importantes
- Sempre testar após cada tarefa
- Manter código simples e legível
- Documentar funções complexas
- Commits frequentes com mensagens claras

---

## 🔄 Histórico de Atualizações

| Data | Versão | Alterações |
|------|--------|------------|
| 2026-02-07 | 1.0 | Criação inicial do plano |

---

*Última atualização: 7 de Fevereiro de 2026*
