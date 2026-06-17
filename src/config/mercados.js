// Catalogo de MERCADOS de aposta por esporte.
//
// Cada esporte tem suas proprias "areas de aposta" (mercados). Um mercado e uma
// categoria — ex.: "Placar Exato", "Total de Gols", "Cartoes Amarelos" — e cada
// mercado oferece varias OPCOES, cada uma com a sua propria odd.
//
// Estrutura de um mercado:
//   { id, nome, icone, descricao, opcoes: [{ label, odd }, ...] }
//
// As opcoes dependem do evento (nomes dos times/atletas), por isso cada mercado
// e descrito por uma funcao que recebe o evento e devolve as opcoes ja prontas.
//
// Observacao academica: as odds dos mercados que nao sao "Vencedor" sao valores
// ilustrativos fixos (nao vem de uma casa de apostas real). O mercado "Vencedor"
// reaproveita as odds cadastradas no evento (oddA / oddB).

// Util: arredonda para 2 casas mantendo number.
const odd = (n) => Number(Number(n).toFixed(2))

// --- Mercado de PLACAR EXATO (o jogador monta o resultado) --------------------

// Calcula a odd de um placar montado pelo jogador. Quanto mais gols e maior a
// diferenca, mais "improvavel" e maior a odd (modelo simples, academico).
export function oddPlacar(a, b) {
  const total = a + b
  const valor = 5 + total * 1.6 + Math.abs(a - b) * 0.7
  return odd(valor)
}

// Texto padrao de um placar (usado como "palpite" e na apuracao). Manter este
// formato igual nos dois lados (aposta e resultado) garante a comparacao.
export function formatPlacar(a, b) {
  return `${a} x ${b}`
}

// Le de volta os gols a partir do texto "a x b" (default 0 x 0).
export function parsePlacar(texto) {
  const m = /^(\d+)\s*x\s*(\d+)$/i.exec(String(texto || '').trim())
  return m ? [Number(m[1]), Number(m[2])] : [0, 0]
}

// ---------------------------------------------------------------------------
// FUTEBOL ⚽
// ---------------------------------------------------------------------------
function mercadosFutebol(ev) {
  return [
    {
      id: 'vencedor',
      nome: 'Resultado Final (1x2)',
      icone: '🏆',
      descricao: 'Quem vence a partida (ou empate)?',
      opcoes: [
        { label: ev.timeA, odd: odd(ev.oddA) },
        { label: 'Empate', odd: 3.2 },
        { label: ev.timeB, odd: odd(ev.oddB) },
      ],
    },
    {
      id: 'dupla_chance',
      nome: 'Dupla Chance',
      icone: '🎯',
      descricao: 'Dois resultados possiveis na mesma aposta.',
      opcoes: [
        { label: `${ev.timeA} ou Empate`, odd: 1.35 },
        { label: `${ev.timeA} ou ${ev.timeB}`, odd: 1.28 },
        { label: `Empate ou ${ev.timeB}`, odd: 1.45 },
      ],
    },
    {
      id: 'total_gols',
      nome: 'Total de Gols',
      icone: '⚽',
      descricao: 'Soma de gols das duas equipes.',
      opcoes: [
        { label: 'Mais de 1.5', odd: 1.35 },
        { label: 'Menos de 1.5', odd: 3.0 },
        { label: 'Mais de 2.5', odd: 1.95 },
        { label: 'Menos de 2.5', odd: 1.85 },
        { label: 'Mais de 3.5', odd: 3.4 },
        { label: 'Menos de 3.5', odd: 1.3 },
      ],
    },
    {
      id: 'ambas_marcam',
      nome: 'Ambas Equipes Marcam',
      icone: '🥅',
      descricao: 'As duas equipes balancam as redes?',
      opcoes: [
        { label: 'Sim', odd: 1.8 },
        { label: 'Nao', odd: 1.9 },
      ],
    },
    {
      id: 'placar_exato',
      nome: 'Placar Exato',
      icone: '🔢',
      descricao: 'Monte o placar exato com que acha que a partida vai terminar.',
      tipo: 'placar',
      maxGols: 9,
      odd: oddPlacar,
      // Opcoes ilustrativas (atalhos); o jogador tambem pode montar livremente.
      opcoes: [
        { label: formatPlacar(1, 0), odd: oddPlacar(1, 0) },
        { label: formatPlacar(2, 1), odd: oddPlacar(2, 1) },
        { label: formatPlacar(1, 1), odd: oddPlacar(1, 1) },
        { label: formatPlacar(0, 0), odd: oddPlacar(0, 0) },
      ],
    },
    {
      id: 'primeiro_gol',
      nome: 'Primeiro a Marcar',
      icone: '🚀',
      descricao: 'Qual equipe abre o placar?',
      opcoes: [
        { label: ev.timeA, odd: 2.0 },
        { label: ev.timeB, odd: 2.2 },
        { label: 'Nao sai gol', odd: 9.0 },
      ],
    },
    {
      id: 'escanteios',
      nome: 'Total de Escanteios',
      icone: '🚩',
      descricao: 'Soma dos escanteios na partida.',
      opcoes: [
        { label: 'Mais de 8.5', odd: 1.7 },
        { label: 'Menos de 8.5', odd: 2.0 },
        { label: 'Mais de 10.5', odd: 2.4 },
        { label: 'Menos de 10.5', odd: 1.5 },
      ],
    },
    {
      id: 'cartoes_amarelos',
      nome: 'Cartoes Amarelos',
      icone: '🟨',
      descricao: 'Total de cartoes amarelos na partida.',
      opcoes: [
        { label: 'Mais de 3.5', odd: 1.75 },
        { label: 'Menos de 3.5', odd: 1.95 },
        { label: 'Mais de 5.5', odd: 2.6 },
        { label: 'Menos de 5.5', odd: 1.45 },
      ],
    },
    {
      id: 'faltas',
      nome: 'Total de Faltas',
      icone: '🦵',
      descricao: 'Soma das faltas cometidas pelas equipes.',
      opcoes: [
        { label: 'Mais de 21.5', odd: 1.85 },
        { label: 'Menos de 21.5', odd: 1.85 },
        { label: 'Mais de 25.5', odd: 2.5 },
        { label: 'Menos de 25.5', odd: 1.5 },
      ],
    },
    {
      id: 'expulsao',
      nome: 'Havera Expulsao (Vermelho)',
      icone: '🟥',
      descricao: 'Algum jogador sera expulso?',
      opcoes: [
        { label: 'Sim', odd: 3.5 },
        { label: 'Nao', odd: 1.28 },
      ],
    },
  ]
}

// ---------------------------------------------------------------------------
// BASQUETE 🏀
// ---------------------------------------------------------------------------
function mercadosBasquete(ev) {
  return [
    {
      id: 'vencedor',
      nome: 'Vencedor da Partida',
      icone: '🏆',
      descricao: 'Quem vence o jogo?',
      opcoes: [
        { label: ev.timeA, odd: odd(ev.oddA) },
        { label: ev.timeB, odd: odd(ev.oddB) },
      ],
    },
    {
      id: 'total_pontos',
      nome: 'Total de Pontos',
      icone: '🔢',
      descricao: 'Soma de pontos das duas equipes.',
      opcoes: [
        { label: 'Mais de 200.5', odd: 1.7 },
        { label: 'Menos de 200.5', odd: 2.0 },
        { label: 'Mais de 215.5', odd: 2.3 },
        { label: 'Menos de 215.5', odd: 1.55 },
      ],
    },
    {
      id: 'handicap',
      nome: 'Handicap (-5.5)',
      icone: '⚖️',
      descricao: 'Vencedor considerando vantagem/desvantagem de 5.5 pontos.',
      opcoes: [
        { label: `${ev.timeA} -5.5`, odd: 1.9 },
        { label: `${ev.timeB} +5.5`, odd: 1.9 },
      ],
    },
    {
      id: 'vencedor_1q',
      nome: 'Vencedor do 1º Quarto',
      icone: '1️⃣',
      descricao: 'Quem fica na frente no primeiro quarto?',
      opcoes: [
        { label: ev.timeA, odd: 1.95 },
        { label: ev.timeB, odd: 1.95 },
      ],
    },
    {
      id: 'prorrogacao',
      nome: 'Havera Prorrogacao',
      icone: '⏱️',
      descricao: 'O jogo vai para a prorrogacao?',
      opcoes: [
        { label: 'Sim', odd: 4.5 },
        { label: 'Nao', odd: 1.18 },
      ],
    },
  ]
}

// ---------------------------------------------------------------------------
// VOLEI 🏐
// ---------------------------------------------------------------------------
function mercadosVolei(ev) {
  return [
    {
      id: 'vencedor',
      nome: 'Vencedor da Partida',
      icone: '🏆',
      descricao: 'Quem vence a partida?',
      opcoes: [
        { label: ev.timeA, odd: odd(ev.oddA) },
        { label: ev.timeB, odd: odd(ev.oddB) },
      ],
    },
    {
      id: 'placar_sets',
      nome: 'Placar em Sets',
      icone: '🔢',
      descricao: 'Resultado exato em sets (melhor de 5).',
      opcoes: [
        { label: `${ev.timeA} 3x0`, odd: 3.0 },
        { label: `${ev.timeA} 3x1`, odd: 3.5 },
        { label: `${ev.timeA} 3x2`, odd: 5.0 },
        { label: `${ev.timeB} 3x0`, odd: 3.2 },
        { label: `${ev.timeB} 3x1`, odd: 3.8 },
        { label: `${ev.timeB} 3x2`, odd: 5.5 },
      ],
    },
    {
      id: 'total_pontos_set',
      nome: 'Total de Pontos (1º set)',
      icone: '📊',
      descricao: 'Soma dos pontos no primeiro set.',
      opcoes: [
        { label: 'Mais de 47.5', odd: 1.85 },
        { label: 'Menos de 47.5', odd: 1.85 },
      ],
    },
    {
      id: 'tie_break',
      nome: 'Havera 5º Set (Tie-break)',
      icone: '🔥',
      descricao: 'A partida chega ao set decisivo?',
      opcoes: [
        { label: 'Sim', odd: 3.0 },
        { label: 'Nao', odd: 1.35 },
      ],
    },
  ]
}

// ---------------------------------------------------------------------------
// TENIS 🎾
// ---------------------------------------------------------------------------
function mercadosTenis(ev) {
  return [
    {
      id: 'vencedor',
      nome: 'Vencedor da Partida',
      icone: '🏆',
      descricao: 'Quem vence o confronto?',
      opcoes: [
        { label: ev.timeA, odd: odd(ev.oddA) },
        { label: ev.timeB, odd: odd(ev.oddB) },
      ],
    },
    {
      id: 'placar_sets',
      nome: 'Placar em Sets',
      icone: '🔢',
      descricao: 'Resultado exato em sets (melhor de 3).',
      opcoes: [
        { label: `${ev.timeA} 2x0`, odd: 2.2 },
        { label: `${ev.timeA} 2x1`, odd: 3.5 },
        { label: `${ev.timeB} 2x0`, odd: 2.5 },
        { label: `${ev.timeB} 2x1`, odd: 3.8 },
      ],
    },
    {
      id: 'total_games',
      nome: 'Total de Games',
      icone: '📊',
      descricao: 'Soma de games na partida.',
      opcoes: [
        { label: 'Mais de 22.5', odd: 1.9 },
        { label: 'Menos de 22.5', odd: 1.8 },
      ],
    },
    {
      id: 'tie_break',
      nome: 'Havera Tie-break',
      icone: '🔥',
      descricao: 'Algum set sera decidido no tie-break?',
      opcoes: [
        { label: 'Sim', odd: 2.1 },
        { label: 'Nao', odd: 1.7 },
      ],
    },
  ]
}

// ---------------------------------------------------------------------------
// E-SPORTS 🎮
// ---------------------------------------------------------------------------
function mercadosEsports(ev) {
  return [
    {
      id: 'vencedor',
      nome: 'Vencedor da Serie',
      icone: '🏆',
      descricao: 'Qual equipe vence a serie?',
      opcoes: [
        { label: ev.timeA, odd: odd(ev.oddA) },
        { label: ev.timeB, odd: odd(ev.oddB) },
      ],
    },
    {
      id: 'placar_mapas',
      nome: 'Placar de Mapas',
      icone: '🗺️',
      descricao: 'Resultado exato em mapas (melhor de 3).',
      opcoes: [
        { label: `${ev.timeA} 2x0`, odd: 2.3 },
        { label: `${ev.timeA} 2x1`, odd: 3.6 },
        { label: `${ev.timeB} 2x0`, odd: 2.5 },
        { label: `${ev.timeB} 2x1`, odd: 3.9 },
      ],
    },
    {
      id: 'total_rounds',
      nome: 'Total de Rounds (Mapa 1)',
      icone: '📊',
      descricao: 'Soma de rounds no primeiro mapa.',
      opcoes: [
        { label: 'Mais de 21.5', odd: 1.9 },
        { label: 'Menos de 21.5', odd: 1.8 },
      ],
    },
    {
      id: 'primeiro_abate',
      nome: 'Primeiro Abate (First Blood)',
      icone: '🩸',
      descricao: 'Qual equipe consegue o primeiro abate?',
      opcoes: [
        { label: ev.timeA, odd: 1.9 },
        { label: ev.timeB, odd: 1.9 },
      ],
    },
  ]
}

// Mercado padrao para esportes nao mapeados: apenas o vencedor.
function mercadosPadrao(ev) {
  return [
    {
      id: 'vencedor',
      nome: 'Vencedor',
      icone: '🏆',
      descricao: 'Quem vence o evento?',
      opcoes: [
        { label: ev.timeA, odd: odd(ev.oddA) },
        { label: ev.timeB, odd: odd(ev.oddB) },
      ],
    },
  ]
}

const MAPA_ESPORTES = {
  Futebol: mercadosFutebol,
  Basquete: mercadosBasquete,
  Vôlei: mercadosVolei,
  Volei: mercadosVolei,
  Tênis: mercadosTenis,
  Tenis: mercadosTenis,
  'E-Sports': mercadosEsports,
}

// Devolve a lista de mercados de aposta para um evento, conforme o esporte.
export function getMercados(evento) {
  if (!evento) return []
  const construtor = MAPA_ESPORTES[evento.esporte] || mercadosPadrao
  return construtor(evento)
}

// Acha um mercado pelo id dentro do catalogo de um evento (util na apuracao).
export function getMercadoPorId(evento, mercadoId) {
  return getMercados(evento).find((m) => m.id === mercadoId) || null
}
