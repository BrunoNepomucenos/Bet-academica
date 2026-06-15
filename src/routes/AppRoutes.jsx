import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import RoleRoute from './RoleRoute.jsx'

import Login from '../pages/Login.jsx'
import AdminDashboard from '../pages/admin/AdminDashboard.jsx'
import EventosAdmin from '../pages/admin/EventosAdmin.jsx'
import BonusAdmin from '../pages/admin/BonusAdmin.jsx'
import UserDashboard from '../pages/user/UserDashboard.jsx'
import EventosDisponiveis from '../pages/user/EventosDisponiveis.jsx'
import HistoricoApostas from '../pages/user/HistoricoApostas.jsx'
import Ranking from '../pages/user/Ranking.jsx'

// Redireciona a rota raiz conforme o perfil (ou login se nao autenticado).
function Inicio() {
  const { autenticado, isAdmin } = useAuth()
  if (!autenticado) return <Navigate to="/login" replace />
  return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/login" element={<Login />} />

      {/* Area do Administrador */}
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

      {/* Area do Usuario/Jogador */}
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

      {/* Qualquer rota desconhecida volta para o inicio */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
