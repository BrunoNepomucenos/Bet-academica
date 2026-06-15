import api from './api.js'

export async function listarEventos() {
  const { data } = await api.get('/eventos')
  return data
}

export async function buscarEvento(id) {
  const { data } = await api.get(`/eventos/${id}`)
  return data
}

export async function criarEvento(evento) {
  const { data } = await api.post('/eventos', evento)
  return data
}

export async function atualizarEvento(id, dados) {
  const { data } = await api.patch(`/eventos/${id}`, dados)
  return data
}

export async function removerEvento(id) {
  await api.delete(`/eventos/${id}`)
}
