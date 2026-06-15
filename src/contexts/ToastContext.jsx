import { createContext, useContext, useState, useCallback } from 'react'
import { Toast, ToastContainer } from 'react-bootstrap'

// Context global de notificacoes (avisos de sucesso/erro/alerta).
const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remover = useCallback((id) => {
    setToasts((lista) => lista.filter((t) => t.id !== id))
  }, [])

  // tipo: 'success' | 'danger' | 'warning' | 'info'
  const notificar = useCallback((mensagem, tipo = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((lista) => [...lista, { id, mensagem, tipo }])
  }, [])

  return (
    <ToastContext.Provider value={{ notificar }}>
      {children}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1080 }}>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            bg={t.tipo}
            onClose={() => remover(t.id)}
            delay={3500}
            autohide
          >
            <Toast.Body className="text-white">{t.mensagem}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider')
  }
  return ctx
}
