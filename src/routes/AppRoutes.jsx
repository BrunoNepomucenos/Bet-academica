import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import RoleRoute from './RoleRoute.jsx'
import PrivateRoute from './PrivateRoute.jsx'

import Login from '../pages/Login.jsx'
import Cadastro from '../pages/Cadastro.jsx'
import Regulamento from '../pages/Regulamento.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import EventosAdmin from '../pages/admin/EventosAdmin.jsx'
import BonusAdmin from '../pages/admin/BonusAdmin.jsx'
import UserDashboard from '../pages/user/UserDashboard.jsx'
import EventosDisponiveis from '../pages/user/EventosDisponiveis.jsx'
import HistoricoApostas from '../pages/user/HistoricoApostas.jsx'
import Ranking from '../pages/user/Ranking.jsx'
import Perfil from '../pages/user/Perfil.jsx'

// Componente da rota raiz ("/"). Funciona como um "porteiro" de entrada:
// - se ninguem esta logado, manda para a tela de login;
// - se ja esta logado, manda para a area certa de acordo com o perfil
//   (admin vai para /admin, jogador vai para /dashboard).
// O atributo "replace" troca a entrada atual no historico do navegador,
// para o botao "voltar" nao trazer o usuario de volta para esta tela tecnica.
function Inicio() {
  const { autenticado, isAdmin } = useAuth()
  if (!autenticado) return <Navigate to="/login" replace />
  return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
}

// Tabela central de rotas da aplicacao (SPA - troca de telas sem recarregar a pagina).
// Cada <Route> liga uma URL (path) a um componente (element).
// Rotas protegidas sao "embrulhadas" em PrivateRoute (precisa estar logado)
// ou RoleRoute (precisa estar logado E ter o perfil certo).
export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas publicas: acessiveis sem login */}
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      {/* Pagina de regulamento: qualquer usuario autenticado, sem importar o perfil (EXTRA) */}
      <Route
        path="/regulamento"
        element={
          <PrivateRoute>
            <Regulamento />
          </PrivateRoute>
        }
      />

      {/* Area do Administrador: RoleRoute perfil="admin" bloqueia jogadores comuns */}
      <Route
        path="/admin"
        element={
          <RoleRoute perfil="admin">
            <AdminDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/eventos"
        element={
          <RoleRoute perfil="admin">
            <EventosAdmin />
          </RoleRoute>
        }
      />
      <Route
        path="/admin/bonus"
        element={
          <RoleRoute perfil="admin">
            <BonusAdmin />
          </RoleRoute>
        }
      />

      {/* Area do Usuario/Jogador: RoleRoute perfil="usuario" bloqueia o admin */}
      <Route
        path="/dashboard"
        element={
          <RoleRoute perfil="usuario">
            <UserDashboard />
          </RoleRoute>
        }
      />
      <Route
        path="/eventos"
        element={
          <RoleRoute perfil="usuario">
            <EventosDisponiveis />
          </RoleRoute>
        }
      />
      <Route
        path="/historico"
        element={
          <RoleRoute perfil="usuario">
            <HistoricoApostas />
          </RoleRoute>
        }
      />
      <Route
        path="/ranking"
        element={
          <RoleRoute perfil="usuario">
            <Ranking />
          </RoleRoute>
        }
      />
      <Route
        path="/perfil"
        element={
          <RoleRoute perfil="usuario">
            <Perfil />
          </RoleRoute>
        }
      />

      {/* Curinga "*": qualquer URL que nao casou com nenhuma rota acima
          (ex.: link quebrado) cai aqui e e redirecionada para o inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
