import api from './api.js'

// Login simulado: busca um usuario pelo email e compara a senha.
export async function login(email, senha) {
  const { data } = await api.get('/usuarios', { params: { email } })
  const usuario = data.find((u) => u.senha === senha)
  return usuario || null
}

export async function listarUsuarios() {
  const { data } = await api.get('/usuarios')
  return data
}

export async function buscarUsuario(id) {
  const { data } = await api.get(`/usuarios/${id}`)
  return data
}

// Atualiza campos do usuario (saldo, bonus). Usa PATCH para alteracao parcial.
export async function atualizarUsuario(id, dados) {
  const { data } = await api.patch(`/usuarios/${id}`, dados)
  return data
}

// Lista apenas jogadores (perfil usuario) - usado no ranking.
export async function listarJogadores() {
  const { data } = await api.get('/usuarios', { params: { perfil: 'usuario' } })
  return data
}
