import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginService, buscarUsuario } from '../services/usuarios.js'

// Context responsavel pela autenticacao simulada e pelo usuario logado.
const AuthContext = createContext(null)

const STORAGE_KEY = 'bet-academica:usuario'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // Recupera a sessao salva no localStorage ao iniciar e REVALIDA no backend.
  // Isso evita o erro 404 ao apostar/recarregar quando a conta nao existe mais
  // no servidor (o JSON Server do Render reinicia periodicamente no plano free e
  // reseta o db.json, apagando contas criadas no site). Em caso de erro temporario
  // (backend "dormindo"), mantemos a sessao do cache para nao deslogar a toa.
  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (!salvo) {
      setCarregando(false)
      return
    }
    const cache = JSON.parse(salvo)
    setUsuario(cache) // mostra rapido enquanto revalida

    buscarUsuario(cache.id)
      .then((fresco) => {
        // Conta existe: atualiza com os dados atuais (saldo/bonus) do servidor.
        setUsuario(fresco)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fresco))
      })
      .catch((err) => {
        if (err?.response?.status === 404) {
          // A conta nao existe mais no servidor: encerra a sessao.
          localStorage.removeItem(STORAGE_KEY)
          setUsuario(null)
        }
        // Outros erros (rede/backend dormindo): mantem a sessao do cache.
      })
      .finally(() => setCarregando(false))
  }, [])

  // Login simulado: valida email e senha contra o JSON Server.
  async function login(email, senha) {
    const encontrado = await loginService(email, senha)
    if (!encontrado) {
      throw new Error('E-mail ou senha invalidos.')
    }
    setUsuario(encontrado)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(encontrado))
    return encontrado
  }

  function logout() {
    setUsuario(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  // Mantem saldo/bonus do usuario logado em sincronia apos apostas e premios.
  function atualizarUsuario(dadosNovos) {
    setUsuario((atual) => {
      const atualizado = { ...atual, ...dadosNovos }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(atualizado))
      return atualizado
    })
  }

  const valor = {
    usuario,
    carregando,
    autenticado: !!usuario,
    isAdmin: usuario?.perfil === 'admin',
    login,
    logout,
    atualizarUsuario,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

// Hook customizado para consumir o AuthContext de forma simples.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return ctx
}
