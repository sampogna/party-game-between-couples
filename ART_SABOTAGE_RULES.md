# Art Sabotage - Documentação Oficial de Regras

## Versão 1.0
**Data:** 7 de Fevereiro de 2026  
**Status:** Versão Final para Implementação

---

## Visão Geral

**Art Sabotage** é um jogo multiplayer de dedução social com elementos artísticos onde 4-8 jogadores competem para identificar sabotadores entre eles enquanto criam desenhos colaborativos.

### Conceito Central
- **Jogadores Honestos:** Recebem um tema secreto e devem desenhar fielmente
- **Sabotadores:** Recebem um tema diferente e devem sabotar sem serem descobertos
- **Objetivo:** Identificar sabotadores através de pistas visuais e comportamentais

---

## Setup e Configuração

### Requisitos Mínimos
- **Jogadores:** 4-8 por partida
- **Duração estimada:** 15-25 minutos por partida completa
- **Conexão:** Internet estável para multiplayer real-time

### Configurações da Sala (Lobby)
```
Parâmetros Configuráveis:
├── Número de Sabotadores: 1 ou 2 (baseado no total de jogadores)
├── Tempo de Desenho: 60, 90 ou 120 segundos
├── Dificuldade dos Temas: Fácil, Médio, Difícil
├── Limite de Rodadas: 3, 5 ou 7 rodadas
└── Tipo de Criatividade: Desenho, Texto, ou Ambos
```

### Regras de Lobby
- Sala privada com código de acesso de 6 caracteres alfanuméricos
- Host pode modificar configurações antes de iniciar
- Mínimo de 4 jogadores para começar
- Máximo de 8 jogadores por sala

---

## Sistema de Papéis

### Distribuição Automática de Papéis
```
Total de Jogadores → Sabotadores → Honestos
4-5 jogadores → 1 sabotador → 3-4 honestos
6-8 jogadores → 2 sabotadores → 4-6 honestos
```

### Características dos Papéis

#### Jogadores Honestos
- **Recebem:** Tema secreto A
- **Objetivo:** Desenhar fielmente o tema A
- **Meta secundária:** Identificar sabotadores
- **Informações:** Sabem que são honestos, não sabem quem são os sabotadores

#### Sabotadores  
- **Recebem:** Tema secreto B (diferente do tema A)
- **Objetivo:** Desenhar o tema B sem serem descobertos
- **Meta secundária:** Confundir outros jogadores
- **Informações:** Sabem que são sabotadores, conhecem os outros sabotadores

---

## Fluxo do Jogo

### Estrutura de Rodada
```
1. FASE DE PREPARAÇÃO (10 segundos)
   └── Distribuição de papéis e temas

2. FASE DE DESENHO (60-120 segundos)
   └── Desenho colaborativo simultâneo

3. FASE DE EVIDÊNCIAS (15 segundos)
   └── Análise e visualização das pistas

4. FASE DE DISCUSSÃO (60 segundos)
   └── Rodada estruturada de acusações

5. FASE DE VOTAÇÃO (20 segundos)
   └── Voto secreto simultâneo

6. FASE DE RESOLUÇÃO (10 segundos)
   └── Revelação e pontuação
```

---

## Mecânicas de Desenho

### Canvas Compartilhado
- **Dimensões:** 800x600 pixels (aspect ratio 4:3)
- **Coordenadas:** Sistema cartesiano com origem (0,0) no canto superior esquerdo
- **Visibilidade:** Todos veem o canvas em tempo real

### Ferramentas de Desenho

#### Ferramentas Básicas (Todos)
```
├── Lápis: Desenho livre
│   ├── Espessuras: 1px, 3px, 5px, 8px
│   └── Cores: Paleta de 7 cores fixas
│       ├── Preto (#000000)
│       ├── Vermelho (#FF0000)
│       ├── Azul (#0000FF)
│       ├── Verde (#00FF00)
│       ├── Amarelo (#FFFF00)
│       ├── Laranja (#FFA500)
│       └── Roxo (#800080)
├── Formas Geométricas
│   ├── Círculo (arrastar para definir raio)
│   ├── Retângulo (arrastar para definir largura/altura)
│   └── Linha reta (clique e arraste)
└── Utilitários
    ├── Undo (máximo 3 ações)
    ├── Redo (máximo 3 ações)
    └── Limpar Canvas
```

#### Modificações para Sabotadores
```
Diferenças nas Ferramentas:
├── Lápis de Sabotagem: Adiciona "DNA visual" sutil
│   ├── Distorção de cor: +10% shift em HSL
│   ├── Timestamp único em cada stroke
│   └── Padrão de frequência: 1.2x velocidade normal
└── Limpar Canvas: Cooldown de 5 segundos (vs 0 segundos honestos)
```

### Regras de Desenho
- **Mínimo obrigatório:** 5 strokes por jogador
- **Tempo máximo inativo:** 20 segundos (remoção automática)
- **Sobreposição:** Permitida entre strokes de jogadores diferentes
- **Transparência:** 100% opaco, sem alpha blending

---

## Sistema de Evidências

### Coleta Automática de Dados

#### Dados por Stroke
```
Stroke ID único:
├── Jogador ID
├── Timestamp de início (ms precisão)
├── Timestamp de fim (ms precisão)
├── Coordenadas sequenciais (x,y)
├── Cor aplicada (com shift para sabotadores)
├── Espessura do stroke
└── Tipo de ferramenta utilizada
```

#### Métricas Calculadas
```
Análise Individual:
├── Taxa de desenho (strokes/segundo)
├── Cobertura de canvas (% área utilizada)
├── Distribuição de cores (contagem por cor)
├── Padrões de movimento (análise de frequência)
└── Tempo de primeiro stroke (segundos após início)

Análise Comparativa:
├── Desvio padrão de velocidade
├── Correlação de paletas
├── Sobreposição espacial (heatmap)
└── Sequência temporal de contribuições
```

### Visualização de Evidências

#### Mapa de Calor
- **Cores:** Azul (baixa atividade) → Vermelho (alta atividade)
- **Resolução:** Grid de 40x30 células
- **Atualização:** Tempo real durante fase de evidências

#### Linha do Tempo
- **Eixo X:** Tempo (0-120 segundos)
- **Eixo Y:** Jogadores (separados por faixas horizontais)
- **Eventos:** Início/fim de strokes, uso de ferramentas especiais

#### Índice de Suspeita
```
Cálculo de Suspeição (0-100):
├── Anomalia de cores: 0-30 pontos
├── Padrão de movimento: 0-25 pontos
├── Tempo de atividade: 0-20 pontos
├── Cobertura anômala: 0-15 pontos
└── Comportamento de grupo: 0-10 pontos
```

---

## Fase de Discussão

### Estrutura Temporal
```
60 segundos totais distribuídos:
├── Revelação do tema real: 10 segundos
├── Apresentação de evidências: 15 segundos
├── Rodada de acusações: 30 segundos
│   └── 7.5 segundos por jogador (8 jogadores max)
└── Tempo livre: 5 segundos
```

### Regras de Discussão
- **Ordem:** Aleatória a cada rodada
- **Limite individual:** Máximo 15 segundos de fala contínua
- **Conteúdo permitido:** Alegações, defesas, análises de evidências
- **Proibido:** Revelar tema específico (apenas categoria)

---

## Mecânica de Votação

### Processo de Votação
```
Etapas:
1. Tela de votação aparece para todos simultaneamente
2. Cada jogador seleciona um alvo (exceto si mesmo)
3. Confirmação obrigatória
4. Abstenção permitida (contado como "não votou")
5. Tempo limite: 20 segundos (voto automático random se expirar)
```

### Regras de Votação
- **Auto-voto:** Proibido
- **Mudança de voto:** Permitido até o final do tempo
- **Voto em branco:** Abstenção (contado como "não votou")
- **Revelação:** Progressiva e individual após o tempo expirar

---

## Sistema de Pontuação

### Cálculo Base de Pontos

#### Jogadores Honestos
```
Pontuação por Rodada:
├── Participação: 10 pontos (se desenhou mínimo obrigatório)
├── Voto correto: +15 pontos
├── Voto incorreto: -5 pontos
├── Abstenção: 0 pontos
└── Bônus de precisão: +5 pontos (se >70% dos honestos votaram correto)
```

#### Sabotadores
```
Pontuação por Rodada:
├── Sobrevivência (não descoberto): +25 pontos
├── Eliminação (descoberto): -15 pontos
├── Frame-up (fazer honesto ser acusado): +10 pontos
└── Camuflagem perfeita (0-10% suspeição): +5 pontos
```

### Bonificação Final de Jogo
```
Multiplicadores baseados no desempenho:
├── Vitória Honesta: ×1.2 nos pontos da rodada final
├── Vitória Sabotadora: ×1.5 nos pontos da rodada final
├── Sobrevivente Perfeito: +50 pontos (nunca eliminado)
└── Detetive Mestre: +30 pontos (acertou todos os votos)
```

---

## Banco de Temas

### Categorias de Temas

#### Fácil
```
Objetos Comuns (fácil visualizar):
├── Animais domésticos: gato, cachorro, pássaro, peixe
├── Móveis: cadeira, mesa, cama, sofá
├── Frutas: maçã, banana, laranja, uva
├── Veículos: carro, bicicleta, avião, barco
└── Itens diários: celular, chave, relógio, livro
```

#### Médio
```
Conceitos e Ações:
├── Emoções: alegria, tristeza, raiva, surpresa
├── Ações: correndo, pulando, dormindo, comendo
├── Profissões: médico, professor, policial, cozinheiro
├── Esportes: futebol, natação, basquete, tênis
└── Fenômenos: chuva, sol, neve, vento
```

#### Difícil
```
Abstratos e Complexos:
├── Conceitos filosóficos: liberdade, justiça, amor, medo
├── Sensações: frio, calor, fome, sede
├── Estados 
mentais: confusão, clareza, pânico, calma
├── Ideias complexas: democracia, caos, harmonia, conflito
└── Metáforas visuais: tempo voando, coração partido
```

### Sistema de Pares Temáticos
```
Regra para Temas de Sabotadores:
├── Mesma categoria, elemento diferente:
│   └── Tema real: "gato" → Tema sabotador: "cachorro"
├── Visualmente similar, conceitualmente diferente:
│   └── Tema real: "sol" → Tema sabotador: "lua"
├── Oposto direto:
│   └── Tema real: "fogo" → Tema sabotador: "água"
└── Mesma forma, função diferente:
    └── Tema real: "copo" → Tema sabotador: "lata"
```

---

## Condições de Vitória

### Modo Padrão (3-7 rodadas)
```
Vitória por Pontuação:
├── Jogador com maior pontuação total ao final
├── Empate: Vitória compartilhada
└── Mínimo de rodadas: 3 (antes de encerramento opcional)
```

### Condições de Encerramento Antecipado
```
Eliminação Total:
├── Todos os sabotadores descobertos → Vitória Honesta
├── 50%+ dos honestos eliminados → Vitória Sabotadora
└── Apenas 2 jogadores restantes → Fim automático
```

---

## Regras Específicas

### Regras de Conexão e Reconexão
- **Desconexão:** 30 segundos tolerância antes de eliminação
- **Reconexão:** Permite continuar no mesmo papel se a rodada não iniciou
- **Substituição:** IA substitui jogador desconectado (nível médio)

### Regras de Empate
```
Desempate por Critérios:
1. Maior número de votos corretos
2. Maior tempo de participação total
3. Menor número de auto-votos acidentais
4. Sorteio aleatório (último recurso)
```

### Regras Anti-Exploração
```
Proibições:
├── Comunicação externa (voice chat, mensagens)
├── Compartilhamento de tela
├── Uso de ferramentas externas de desenho
├── Colusão pré-estabelecida
└── Abandono intencional de partidas
```

---

## Considerações Técnicas

### Requisitos de Performance
```
Latência Máxima Aceitável:
├── Input de desenho: <50ms
├── Sincronização de canvas: <100ms
├── Troca de fase: <500ms
└── Total de round trip: <200ms
```

### Estrutura de Dados Sugerida
```
Objeto de Partida:
{
  gameId: string,
  players: Player[],
  currentRound: number,
  gameState: 'lobby' | 'drawing' | 'evidence' | 'discussion' | 'voting' | 'resolution',
  settings: GameSettings,
  canvas: CanvasState,
  themeA: string,
  themeB: string,
  evidences: Evidence[],
  votes: Vote[],
  scores: Score[]
}
```

### Protocolo de Comunicação
```
Eventos WebSocket:
├── join_room → room_joined
├── start_game → game_started
├── stroke → stroke_broadcast
├── vote_cast → vote_result
├── phase_change → phase_updated
└── game_end → final_scores
```

---

## Apêndice

### Glossário de Termos
- **Stroke:** Traçado contínuo de desenho
- **Canvas:** Área de desenho compartilhada
- **DNA Visual:** Assinatura única deixada por sabotadores
- **Frame-up:** Fazer inocente ser acusado erroneamente
- **Heatmap:** Visualização de densidade de atividade

### Histórico de Versões
- **v1.0:** Versão inicial completa
- Futuras atualizações serão incrementadas baseadas em feedback

---

**Documento criado para servir como base técnica definitiva para qualquer implementação do jogo Art Sabotage. Todas as regras descritas são consideradas oficiais e devem ser seguidas literalmente durante o desenvolvimento.**
