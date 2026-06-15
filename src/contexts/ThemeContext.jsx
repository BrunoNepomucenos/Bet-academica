import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Context de tema (claro/escuro). Persiste a escolha no localStorage e aplica
// o atributo data-bs-theme no <html>, aproveitando o suporte nativo do Bootstrap 5.3.
const ThemeContext = createContext(null)

const STORAGE_KEY = 'bet-academica:tema'

export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'light'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', tema)
    localStorage.setItem(STORAGE_KEY, tema)
  }, [tema])

  const alternarTema = useCallback(() => {
    setTema((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  return (
    <ThemeContext.Provider value={{ tema, alternarTema, escuro: tema === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider')
  }
  return ctx
}
