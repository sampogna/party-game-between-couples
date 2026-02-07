# Art Sabotage - Backend Tech Stack

## Versão 1.0
**Data:** 7 de Fevereiro de 2026  
**Status:** Especificação de Tecnologias

---

## 1. Visão Geral da Arquitetura

O backend do Art Sabotage é projetado como uma aplicação **Node.js com TypeScript**, utilizando comunicação em tempo real via WebSockets para suportar a natureza multiplayer sincronizada do jogo.

### Requisitos Técnicos Principais
- Comunicação em tempo real para desenho colaborativo
- Baixa latência para sincronização de strokes
- Escalabilidade horizontal para múltiplas salas simultâneas
- Processamento server-side de evidências e análise

---

## 2. Stack Tecnológico

### Core Runtime

**Node.js 18+ (LTS)**
- **Justificativa:** Runtime estável com suporte LTS, performance otimizada para operações I/O intensivas. O modelo event-loop do Node.js é ideal para aplicações em tempo real com múltiplas conexões simultâneas.

**TypeScript 5+**
- **Justificativa:** Segurança de tipos para lógica complexa de jogo, melhor experiência de desenvolvimento com autocomplete e refatoração segura. Essencial para manter a integridade dos dados de jogo e estados.

### Framework HTTP

**Express.js**
- **Justificativa:** Framework web maduro e minimalista, ampla comunidade, middlewares robustos. Ideal para APIs REST complementares ao WebSocket.

**Middlewares Essenciais:**
- **CORS:** Cross-origin para comunicação com frontend React
- **Helmet:** Headers de segurança HTTP
- **Compression:** Redução de bandwidth para dados de canvas

### Comunicação em Tempo Real

**Socket.IO 4.7+**
- **Justificativa:** Biblioteca WebSocket madura com fallbacks automáticos (long-polling), sistema de reconexão automática, namespaces e rooms para organização de salas. Elimina necessidade de gerenciar conexões manualmente.

### Gerenciamento de Dados

**UUID**
- Geração de IDs únicos para jogos, jogadores e strokes

**NanoID**
- Geração de códigos curtos e legíveis para rooms (ex: "ABC123")

**Lodash**
- Utilitários para manipulação de arrays e objetos complexos

**Joi**
- Validação de dados de entrada e schemas

### Análise e Evidências

**Simple Statistics**
- Cálculos estatísticos para detecção de anomalias e suspeição de sabotadores

**Color Diff**
- Análise de desvio de cores entre jogadores para identificar sabotadores

**Canvas (Node Canvas)**
- Processamento server-side de imagens para geração de evidências visuais

### Testes

**Jest + ts-jest**
- Framework de testes unitários com suporte nativo a TypeScript

**Supertest**
- Testes de integração para endpoints HTTP

**Socket.IO Client**
- Testes de comunicação WebSocket

---

## 3. Justificativas Arquiteturais

### Por que Node.js?

O Art Sabotage exige comunicação bidirecional em tempo real entre múltiplos jogadores. O modelo não-bloqueante do Node.js permite:
- Manter milhares de conexões WebSocket simultâneas com baixo overhead
- Broadcasting eficiente de strokes para todos os jogadores da sala
- Processamento assíncrono de evidências sem bloquear o event loop

### Por que Socket.IO ao invés de WebSocket nativo?

- **Fallbacks automáticos:** Funciona em redes restritas (corporativas, proxies)
- **Reconexão:** Reconexão automática com buffer de eventos
- **Rooms:** Organização nativa de jogadores em salas
- **Acknowledgments:** Confirmação de recebimento de mensagens

### Por que TypeScript?

A lógica de jogo envolve:
- Estados complexos (fases, jogadores, canvas, evidências)
- Papéis de jogador (honesto vs sabotador)
- Sistema de pontuação com múltiplos bônus
- Tipagem estática previne bugs em tempo de desenvolvimento

---

## 4. Variáveis de Ambiente

```
NODE_ENV=development|production
PORT=3001
FRONTEND_URL=http://localhost:3000
```

---

## 5. Considerações de Deploy

### Plataforma Recomendada: Render.com

**Justificativa:**
- Deploy simplificado via Git
- WebSocket support nativo
- Free tier generoso para MVP
- SSL/HTTPS automático

### Requisitos de Infraestrutura

- Node.js 18+ runtime
- Suporte a WebSocket (portas não-bloqueadas)
- Headers CORS configurados para domínio do frontend

---

## 6. Segurança

### Medidas Implementadas

1. **Helmet:** Headers HTTP de segurança (HSTS, CSP, etc)
2. **CORS:** Restrição de origem do frontend
3. **Validação de Input:** Joi para sanitização de dados
4. **Rate Limiting:** Prevenção de spam de strokes

---

## 7. Escalabilidade

### Estratégia

O backend é projetado para escalar horizontalmente:
- **Stateless:** Estado do jogo mantido em memória (v1) ou Redis (v2+)
- **Rooms:** Isolamento natural de jogos em salas separadas
- **Load Balancing:** Socket.IO com sticky sessions para múltiplos workers

### Limitações da Versão Atual

- Máximo 8 jogadores por sala
- Estado em memória (não persistente)
- Single-node deployment

---

## 8. Resumo das Tecnologias

| Categoria | Tecnologia | Versão |
|-----------|-----------|--------|
| Runtime | Node.js | 18+ LTS |
| Linguagem | TypeScript | 5.0+ |
| Framework | Express | 4.18+ |
| WebSocket | Socket.IO | 4.7+ |
| IDs | UUID / NanoID | 9.0 / 4.0 |
| Validação | Joi | 17.9+ |
| Estatística | Simple Statistics | 7.8+ |
| Cores | Color Diff | 1.4+ |
| Canvas | Node Canvas | 2.11+ |
| Testes | Jest | 29.6+ |

---

*Este documento foca exclusivamente nas decisões de tecnologia. Detalhes de implementação, estrutura de código e planejamento de desenvolvimento serão documentados separadamente.*
