import { Navbar as BsNavbar, Nav, Container, Button, Badge } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// Barra de navegacao: mostra links conforme o perfil e o saldo do jogador.
export default function Navbar() {
  const { usuario, autenticado, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/login')
  }

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <BsNavbar.Brand as={NavLink} to="/">
          🎯 Bet Acadêmica
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="menu-principal" />
        <BsNavbar.Collapse id="menu-principal">
          {autenticado && (
            <Nav className="me-auto">
              {isAdmin ? (
                <>
                  <Nav.Link as={NavLink} to="/admin">Painel</Nav.Link>
                  <Nav.Link as={NavLink} to="/admin/eventos">Eventos</Nav.Link>
                  <Nav.Link as={NavLink} to="/admin/bonus">Bônus</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/dashboard">Meu Painel</Nav.Link>
                  <Nav.Link as={NavLink} to="/eventos">Eventos</Nav.Link>
                  <Nav.Link as={NavLink} to="/historico">Histórico</Nav.Link>
                  <Nav.Link as={NavLink} to="/ranking">Ranking</Nav.Link>
                </>
              )}
            </Nav>
          )}

          {autenticado && (
            <Nav className="align-items-lg-center gap-2">
              {!isAdmin && (
                <Badge bg="success" className="fs-6">
                  Saldo: R$ {Number(usuario.saldo).toFixed(2)}
                </Badge>
              )}
              <span className="text-light small">
                {usuario.nome} ({usuario.perfil})
              </span>
              <Button size="sm" variant="outline-light" onClick={sair}>
                Sair
              </Button>
            </Nav>
          )}
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}
