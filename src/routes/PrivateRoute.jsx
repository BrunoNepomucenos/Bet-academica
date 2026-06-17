import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// "Guarda de rota" para paginas que exigem apenas estar logado (sem checar perfil).
// Recebe via "children" o componente da pagina que ele protege e decide se mostra
// a pagina ou redireciona para o login.
export default function PrivateRoute({ children }) {
  const { autenticado, carregando } = useAuth()

  // Enquanto o AuthContext ainda le a sessao salva no localStorage, nao renderiza
  // nada (null) para evitar um "piscar" da tela de login antes de saber se ha sessao.
  if (carregando) return null

  // Sem sessao valida -> manda para o login.
  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  // Autenticado -> libera a pagina protegida.
  return children
}
