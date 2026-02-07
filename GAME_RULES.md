# Art Sabotage - Regras do Jogo

## Visão Geral

Art Sabotage é um jogo multiplayer de dedução social com elementos artísticos. Jogadores criam desenhos colaborativos enquanto tentam identificar sabotadores entre eles.

**Conceito Central:**
- **Jogadores Honestos:** Recebem tema A e devem desenhar fielmente
- **Sabotadores:** Recebem tema B (diferente) e devem sabotar sem serem descobertos
- **Objetivo:** Identificar sabotadores através de pistas visuais e comportamentais

---

## Setup

### Requisitos
- **Jogadores:** 4-8 por partida
- **Duração:** 15-25 minutos
- **Conexão:** Internet estável

### Configurações da Sala
- **Sabotadores:** 1 (4-5 jogadores) ou 2 (6-8 jogadores)
- **Tempo de Desenho:** 60, 90 ou 120 segundos
- **Dificuldade dos Temas:** Fácil, Médio, Difícil
- **Limite de Rodadas:** 3, 5 ou 7

### Código da Sala
- 6 caracteres alfanuméricos (ex: "ABC123")
- Mínimo 4 jogadores para iniciar
- Máximo 8 jogadores

---

## Papéis

### Jogador Honesto
- **Recebe:** Tema secreto A
- **Objetivo:** Desenhar fielmente o tema A
- **Sabe:** Que é honesto, não sabe quem são os sabotadores
- **Meta secundária:** Identificar sabotadores

### Sabotador
- **Recebe:** Tema secreto B (diferente de A)
- **Objetivo:** Desenhar tema B sem ser descoberto
- **Sabe:** Que é sabotador, conhece outros sabotadores
- **Meta secundária:** Confundir outros jogadores

---

## Fluxo de Rodada

Cada rodada segue 6 fases sequenciais:

| Fase | Duração | Descrição |
|------|---------|-----------|
| **Preparação** | 10s | Distribuição de papéis e temas |
| **Desenho** | 60-120s | Desenho colaborativo simultâneo |
| **Evidências** | 15s | Análise e visualização das pistas |
| **Discussão** | 60s | Rodada estruturada de acusações |
| **Votação** | 20s | Voto secreto simultâneo |
| **Resolução** | 10s | Revelação e pontuação |

---

## Mecânicas de Desenho

### Canvas
- **Dimensões:** 800x600 pixels
- **Visibilidade:** Todos veem em tempo real
- **Mínimo obrigatório:** 5 strokes por jogador
- **Tempo inativo:** Remoção após 20s

### Ferramentas

**Básicas (Todos):**
- Lápis (espessuras: 1px, 3px, 5px, 8px)
- Cores: Preto, Vermelho, Azul, Verde, Amarelo, Laranja, Roxo
- Formas: Círculo, Retângulo, Linha reta
- Utilitários: Undo (3x), Redo (3x), Limpar Canvas

**Modificações para Sabotadores:**
- Distorção de cor: +10% shift em HSL
- Velocidade: 1.2x mais rápida
- Limpar Canvas: Cooldown de 5 segundos

---

## Sistema de Evidências

### Dados Coletados por Stroke
- Jogador ID
- Timestamps (início/fim)
- Coordenadas sequenciais
- Cor aplicada
- Espessura e ferramenta

### Métricas Analisadas
- Taxa de desenho (strokes/segundo)
- Cobertura de canvas (%)
- Distribuição de cores
- Padrões de movimento
- Tempo até primeiro stroke

### Visualização
- **Mapa de Calor:** Azul (baixa) → Vermelho (alta) atividade
- **Linha do Tempo:** Eventos sequenciais por jogador
- **Índice de Suspeição:** 0-100 pontos baseado em anomalias

---

## Sistema de Votação

### Processo
1. Tela de votação aparece simultaneamente
2. Cada jogador seleciona um alvo (exceto si mesmo)
3. Confirmação obrigatória
4. Abstenção permitida (contada como "não votou")
5. Tempo limite: 20 segundos

### Regras
- **Auto-voto:** Proibido
- **Mudança:** Permitida até o final do tempo
- **Revelação:** Progressiva após expirar tempo

---

## Sistema de Pontuação

### Jogador Honesto (por rodada)
- Participação: +10 pontos
- Voto correto: +15 pontos
- Voto incorreto: -5 pontos
- Abstenção: 0 pontos
- Bônus de precisão (>70% acertos): +5 pontos

### Sabotador (por rodada)
- Sobrevivência (não descoberto): +25 pontos
- Eliminação (descoberto): -15 pontos
- Frame-up (honesto acusado): +10 pontos
- Camuflagem perfeita (0-10% suspeição): +5 pontos

### Bonificação Final
- Vitória Honesta: ×1.2 multiplicador
- Vitória Sabotadora: ×1.5 multiplicador
- Sobrevivente Perfeito: +50 pontos
- Detetive Mestre: +30 pontos

---

## Temas

### Fácil
Animais (gato, cachorro), Móveis (cadeira, mesa), Frutas (maçã, banana), Veículos (carro, bicicleta)

### Médio
Emoções (alegria, raiva), Ações (correndo, pulando), Profissões (médico, professor), Esportes (futebol, natação)

### Difícil
Conceitos filosóficos (liberdade, justiça), Sensações (frio, calor), Estados mentais (confusão, calma)

### Pares Temáticos
Saboteadores recebem tema da mesma categoria mas diferente:
- Tema real: "gato" → Tema sabotador: "cachorro"
- Tema real: "sol" → Tema sabotador: "lua"
- Tema real: "fogo" → Tema sabotador: "água"

---

## Condições de Vitória

### Por Pontuação
Jogador com maior pontuação total ao final das rodadas.

### Por Eliminação
- **Vitória Honesta:** Todos sabotadores descobertos
- **Vitória Sabotadora:** 50%+ dos honestos eliminados
- **Fim Automático:** Apenas 2 jogadores restantes

### Desempate
1. Maior número de votos corretos
2. Maior tempo de participação
3. Sorteio aleatório

---

## Regras Adicionais

### Conexão
- **Desconexão:** 30 segundos de tolerância
- **Reconexão:** Permitida se rodada não iniciou
- **Substituição:** IA assume jogador desconectado

### Proibições
- Comunicação externa durante partida
- Compartilhamento de tela
- Ferramentas externas de desenho
- Colusão pré-estabelecida

---

## Glossário

- **Stroke:** Traçado contínuo de desenho
- **Canvas:** Área de desenho compartilhada
- **DNA Visual:** Assinatura única de sabotadores
- **Frame-up:** Fazer inocente ser acusado
- **Heatmap:** Visualização de densidade de atividade

---

*Versão 1.0 - Base para implementação*
