import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// Controla o acesso por perfil. Ex.: perfil="admin" so deixa o administrador entrar.
// Usuario comum nao acessa telas administrativas e vice-versa (regra do enunciado).
export default function RoleRoute({ perfil, children }) {
  const { autenticado, usuario, carregando } = useAuth()

  if (carregando) return null

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  if (usuario.perfil !== perfil) {
    // Redireciona cada perfil para a sua area inicial.
    const destino = usuario.perfil === 'admin' ? '/admin' : '/dashboard'
    return <Navigate to={destino} replace />
  }

  return children
}
