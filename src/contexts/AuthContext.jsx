import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginService } from '../services/usuarios.js'

// Context responsavel pela autenticacao simulada e pelo usuario logado.
const AuthContext = createContext(null)

const STORAGE_KEY = 'bet-academica:usuario'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  // Recupera a sessao salva no localStorage ao iniciar a aplicacao.
  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY)
    if (salvo) {
      setUsuario(JSON.parse(salvo))
    }
    setCarregando(false)
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
