import { Navbar as BsNavbar, Nav, Container, Button, Badge, Dropdown } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useTheme } from '../contexts/ThemeContext.jsx'

// Pega as iniciais do nome para o avatar (ex.: "João Jogador" -> "JJ").
function iniciais(nome = '') {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

// Barra de navegacao: links conforme o perfil, saldo, tema e menu do usuario.
export default function Navbar() {
  const { usuario, autenticado, isAdmin, logout } = useAuth()
  const { escuro, alternarTema } = useTheme()
  const navigate = useNavigate()

  function sair() {
    logout()
    navigate('/login')
  }

  return (
    <BsNavbar variant="dark" expand="lg" sticky="top" className="bet-navbar">
      <Container>
        <BsNavbar.Brand as={NavLink} to="/">
          🎯 Bet <span className="page-title-accent">Acadêmica</span>
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
                  <Nav.Link as={NavLink} to="/regulamento">Regulamento</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/dashboard">Meu Painel</Nav.Link>
                  <Nav.Link as={NavLink} to="/eventos">Eventos</Nav.Link>
                  <Nav.Link as={NavLink} to="/historico">Histórico</Nav.Link>
                  <Nav.Link as={NavLink} to="/ranking">Ranking</Nav.Link>
                  <Nav.Link as={NavLink} to="/regulamento">Regulamento</Nav.Link>
                </>
              )}
            </Nav>
          )}

          <Nav className="align-items-lg-center gap-2">
            {/* Alternar tema claro/escuro */}
            <Button
              size="sm"
              variant="outline-light"
              onClick={alternarTema}
              title={escuro ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              aria-label="Alternar tema"
            >
              {escuro ? '☀️' : '🌙'}
            </Button>

            {autenticado ? (
              <>
                {!isAdmin && (
                  <Badge className="saldo-badge">
                    Saldo: R$ {Number(usuario.saldo).toFixed(2)}
                  </Badge>
                )}
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="link"
                    className="d-flex align-items-center gap-2 text-decoration-none text-light p-1"
                  >
                    <span className="avatar-circ">{iniciais(usuario.nome)}</span>
                    <span className="d-none d-lg-inline small">{usuario.nome.split(' ')[0]}</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.ItemText className="small text-muted">
                      {usuario.nome}<br />
                      <span className="text-capitalize">{usuario.perfil}</span> · {usuario.email}
                    </Dropdown.ItemText>
                    <Dropdown.Divider />
                    {!isAdmin && (
                      <>
                        <Dropdown.Item onClick={() => navigate('/perfil')}>👤 Meu perfil</Dropdown.Item>
                        <Dropdown.Item onClick={() => navigate('/dashboard')}>📊 Meu painel</Dropdown.Item>
                      </>
                    )}
                    {isAdmin && (
                      <Dropdown.Item onClick={() => navigate('/admin')}>📊 Painel admin</Dropdown.Item>
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={sair} className="text-danger">↩️ Sair</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <Button size="sm" variant="light" onClick={() => navigate('/login')}>
                Entrar
              </Button>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}
