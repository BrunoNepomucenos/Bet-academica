import api from './api.js'

// Camada de servico dos EVENTOS esportivos (o CRUD completo do recurso /eventos).

// Lista todos os eventos cadastrados (telas de admin e do jogador).
export async function listarEventos() {
  const { data } = await api.get('/eventos')
  return data
}

// Busca um evento especifico pelo id.
export async function buscarEvento(id) {
  const { data } = await api.get(`/eventos/${id}`)
  return data
}

// Cria um novo evento (POST). Usado no formulario de cadastro do admin.
export async function criarEvento(evento) {
  const { data } = await api.post('/eventos', evento)
  return data
}

// Atualiza parcialmente um evento (PATCH): edicao dos dados, encerrar apostas
// (status 'encerrado') ou lancar o resultado (status 'finalizado' + vencedor).
export async function atualizarEvento(id, dados) {
  const { data } = await api.patch(`/eventos/${id}`, dados)
  return data
}

// Remove um evento (DELETE). Nao retorna corpo, por isso nao usamos o "data".
export async function removerEvento(id) {
  await api.delete(`/eventos/${id}`)
}
