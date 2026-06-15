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

// Verifica se ja existe um usuario com o e-mail informado (cadastro).
export async function emailExiste(email) {
  const { data } = await api.get('/usuarios', { params: { email } })
  return data.length > 0
}

// Cadastra um novo jogador (perfil "usuario") com saldo inicial de boas-vindas.
export async function cadastrarUsuario({ nome, email, senha }) {
  const novo = {
    nome,
    email,
    senha,
    perfil: 'usuario',
    saldo: 500, // bonus de boas-vindas ficticio
    bonus: 500,
  }
  const { data } = await api.post('/usuarios', novo)
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
