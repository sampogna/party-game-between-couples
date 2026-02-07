# Art Sabotage - Frontend Tech Stack

## Versão 1.0
**Data:** 7 de Fevereiro de 2026  
**Status:** Especificação de Tecnologias

---

## 1. Visão Geral da Arquitetura

O frontend do Art Sabotage é projetado como uma **SPA (Single Page Application)** em React, otimizada para interações em tempo real e renderização eficiente de canvas.

### Requisitos Técnicos Principais
- Renderização em tempo real de strokes de múltiplos jogadores
- Sincronização bidirecional com backend via WebSocket
- Baixa latência para experiência de desenho fluida
- Suporte a canvas complexo com undo/redo
- Visualização de heatmaps e evidências

---

## 2. Stack Tecnológico

### Core Framework

**React 18+**
- **Justificativa:** Ecossistema maduro com Concurrent Features (Suspense, Transitions) essenciais para UI responsiva durante operações em tempo real. Virtual DOM otimizado para atualizações frequentes do canvas.

**TypeScript 5+**
- **Justificativa:** Segurança de tipos para estados complexos de jogo (fases, jogadores, papéis). Autocomplete e refatoração segura essenciais para projeto colaborativo.

**Vite**
- **Justificativa:** Build tool moderna com HMR (Hot Module Replacement) instantâneo, startup rápido e otimização nativa de assets. Substituto superior ao CRA (Create React App).

### Gerenciamento de Estado

**Zustand**
- **Justificativa:** Biblioteca de estado minimalista sem boilerplate. Alternativa ao Redux com API simples baseada em hooks. Ideal para estado global do jogo (sala, jogadores, fase atual).

**TanStack Query (React Query)**
- **Justificativa:** Cache automático de dados do servidor, sincronização em background, stale-while-revalidate. Elimina necessidade de gerenciar cache manualmente para dados de API.

### Comunicação em Tempo Real

**Socket.IO Client**
- **Justificativa:** Cliente WebSocket robusto com fallbacks automáticos, reconexão automática e rooms. Par perfeito com o backend Socket.IO.

### Canvas e Desenho

**Fabric.js**
- **Justificativa:** Biblioteca canvas madura com API orientada a objetos, sistema de layers, undo/redo nativo e serialização JSON. Ideal para canvas principal do jogo com múltiplos jogadores.

**Konva.js + React-Konva**
- **Justificativa:** Canvas com performance superior para visualizações complexas (heatmaps de evidências). Integração nativa com React via react-konva.

### UI e Estilização

**Tailwind CSS**
- **Justificativa:** Framework CSS utility-first para desenvolvimento rápido. Design system consistente sem necessidade de escrever CSS customizado. Bundle otimizado automaticamente.

**Framer Motion**
- **Justificativa:** Biblioteca de animações declarativa para React. Animações fluidas para transições de fase do jogo, modal de votação, e feedback visual.

**Headless UI**
- **Justificativa:** Componentes acessíveis (modal, dropdown, tabs) sem estilos opinativos. Permite customização total com Tailwind CSS.

**React Hook Form**
- **Justificativa:** Formulários performáticos com validação eficiente e mínimas re-renderizações. Ideal para formulário de entrada na sala.

### Testes

**Vitest**
- **Justificativa:** Test runner rápido com API compatível com Jest. Integração nativa com Vite.

**React Testing Library**
- **Justificativa:** Testes focados em comportamento do usuário, não implementação. Queries acessíveis e matchers customizados.

**JSDOM**
- **Justificativa:** Ambiente de teste DOM para Node.js. Permite testar componentes React sem browser real.

---

## 3. Justificativas Arquiteturais

### Por que React e não Vue/Svelte?

- **Ecossistema:** Maior disponibilidade de bibliotecas para canvas (Fabric, Konva)
- **Time:** Familiaridade da equipe com React
- **Concurrent Features:** Suspense e Transitions essenciais para UI não-bloqueante durante operações de canvas

### Por que Zustand ao invés de Redux?

- **Simplicidade:** API minimalista sem boilerplate
- **TypeScript:** Tipagem nativa sem configuração complexa
- **Tamanho:** Bundle menor (~1KB vs ~10KB)
- **Necessidade:** Estado do jogo é relativamente simples (não precisa de middlewares complexos)

### Por que duas bibliotecas de Canvas (Fabric + Konva)?

- **Fabric.js:** Melhor para canvas principal de desenho (undo/redo, layers, serialização)
- **Konva.js:** Performance superior para visualizações estáticas (heatmaps de evidências)
- **Separação de Responsabilidades:** Cada biblioteca no seu domínio de melhor performance

### Por que Tailwind CSS?

- **Velocidade:** Desenvolvimento sem context switching entre JS e CSS
- **Consistência:** Design system com spacing, colors, typography predefinidos
- **Bundle:** PurgeCSS remove classes não utilizadas automaticamente
- **Manutenção:** Sem necessidade de nomear classes ou gerenciar arquivos CSS

---

## 4. Variáveis de Ambiente

```
VITE_WS_URL=ws://localhost:3001
VITE_API_URL=http://localhost:3001
```

---

## 5. Considerações de Deploy

### Plataforma Recomendada: Render.com (Static Site)

**Justificativa:**
- Deploy simplificado de SPAs
- CDN integrado para assets estáticos
- Configuração CORS para WebSocket
- SSL/HTTPS automático

### Requisitos de Build

- Node.js 18+ para build
- Otimização de assets estáticos (imagens, fonts)
- Code splitting para chunks menores
- Source maps para debugging em produção

---

## 6. Performance

### Estratégias

1. **Canvas otimizado:** Rendering em requestAnimationFrame
2. **Memoização:** React.memo para componentes de lista de jogadores
3. **Virtualização:** Renderização virtual para listas longas (se necessário)
4. **Code Splitting:** Lazy loading de componentes por fase do jogo
5. **WebSocket eficiente:** Debounce de strokes, batching de eventos

### Métricas Alvo

- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Canvas Latency:** < 50ms para sincronização de strokes
- **Bundle Size:** < 200KB (gzip)

---

## 7. Acessibilidade

### Medidas Implementadas

- **Headless UI:** Componentes com ARIA labels nativos
- **Keyboard Navigation:** Suporte completo a navegação por teclado
- **Screen Readers:** Anúncios de mudanças de fase do jogo
- **Contraste:** Cores do Tailwind seguem WCAG 2.1

---

## 8. Resumo das Tecnologias

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| Framework | React | 18.2+ |
| Linguagem | TypeScript | 5.0+ |
| Build Tool | Vite | 5.0+ |
| Estado Global | Zustand | 4.4+ |
| Cache/Sync | TanStack Query | 5.0+ |
| WebSocket | Socket.IO Client | 4.7+ |
| Canvas Principal | Fabric.js | 5.3+ |
| Canvas Visualização | Konva.js + React-Konva | 9.2+ / 18.2+ |
| CSS | Tailwind CSS | 3.3+ |
| Animações | Framer Motion | 10.16+ |
| Componentes UI | Headless UI | 1.7+ |
| Formulários | React Hook Form | 7.47+ |
| Testes | Vitest + Testing Library | 0.34+ / 13.4+ |

---

*Este documento foca exclusivamente nas decisões de tecnologia. Detalhes de implementação, estrutura de código e planejamento de desenvolvimento serão documentados separadamente.*
