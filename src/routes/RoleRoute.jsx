import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// "Guarda de rota" mais restrito que o PrivateRoute: alem de exigir login,
// exige um perfil especifico. Recebe via prop "perfil" qual perfil pode entrar
// ("admin" ou "usuario") e via "children" a pagina que ele protege.
// Garante a regra do enunciado: jogador nao acessa telas de admin e vice-versa.
export default function RoleRoute({ perfil, children }) {
  const { autenticado, usuario, carregando } = useAuth()

  // Espera o carregamento da sessao para nao decidir cedo demais.
  if (carregando) return null

  // 1o filtro: precisa estar logado.
  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  // 2o filtro: o perfil do usuario logado precisa ser exatamente o exigido pela rota.
  if (usuario.perfil !== perfil) {
    // Se for o perfil errado, nao mostra erro: apenas redireciona cada um
    // para a sua propria area inicial (admin -> /admin, jogador -> /dashboard).
    const destino = usuario.perfil === 'admin' ? '/admin' : '/dashboard'
    return <Navigate to={destino} replace />
  }

  // Passou nos dois filtros -> libera a pagina.
  return children
}
