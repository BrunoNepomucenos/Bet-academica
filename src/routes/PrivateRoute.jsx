import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// Bloqueia o acesso de quem nao esta logado, redirecionando ao login.
export default function PrivateRoute({ children }) {
  const { autenticado, carregando } = useAuth()

  if (carregando) return null

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  return children
}
