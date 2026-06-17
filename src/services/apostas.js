import api from './api.js'

// Camada de servico das APOSTAS e das MOVIMENTACOES financeiras.
// Cada funcao isola uma chamada HTTP ao JSON Server, devolvendo so o "data"
// (o corpo da resposta), para as telas nao precisarem conhecer detalhes do axios.

// Lista TODAS as apostas da plataforma (usado nas estatisticas do admin).
export async function listarApostas() {
  const { data } = await api.get('/apostas')
  return data
}

// Apostas de um usuario especifico (historico).
export async function listarApostasPorUsuario(usuarioId) {
  const { data } = await api.get('/apostas', { params: { usuarioId } })
  return data
}

// Apostas de um evento (usado ao processar o resultado).
export async function listarApostasPorEvento(eventoId) {
  const { data } = await api.get('/apostas', { params: { eventoId } })
  return data
}

// Cria uma nova aposta (POST). O JSON Server gera o id automaticamente.
export async function criarAposta(aposta) {
  const { data } = await api.post('/apostas', aposta)
  return data
}

// Atualiza parcialmente uma aposta (PATCH). Ex.: trocar o status para
// 'ganha'/'perdida'/'cancelada' e gravar o retorno, sem reenviar o objeto todo.
export async function atualizarAposta(id, dados) {
  const { data } = await api.patch(`/apostas/${id}`, dados)
  return data
}

// Registra uma movimentacao financeira ficticia (extrato).
export async function registrarMovimentacao(movimentacao) {
  const { data } = await api.post('/movimentacoes', movimentacao)
  return data
}

// Lista o extrato (todas as movimentacoes) de um usuario: apostas, premios,
// bonus, recargas e estornos. Usado no painel e na carteira do jogador.
export async function listarMovimentacoesPorUsuario(usuarioId) {
  const { data } = await api.get('/movimentacoes', { params: { usuarioId } })
  return data
}
