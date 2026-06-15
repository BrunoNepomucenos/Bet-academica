import api from './api.js'

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

export async function criarAposta(aposta) {
  const { data } = await api.post('/apostas', aposta)
  return data
}

export async function atualizarAposta(id, dados) {
  const { data } = await api.patch(`/apostas/${id}`, dados)
  return data
}

// Registra uma movimentacao financeira ficticia (extrato).
export async function registrarMovimentacao(movimentacao) {
  const { data } = await api.post('/movimentacoes', movimentacao)
  return data
}

export async function listarMovimentacoesPorUsuario(usuarioId) {
  const { data } = await api.get('/movimentacoes', { params: { usuarioId } })
  return data
}
