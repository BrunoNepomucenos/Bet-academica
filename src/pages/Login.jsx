import { useState, useEffect } from 'react'
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// Tela de login simulado. Apos autenticar, redireciona conforme o perfil.
export default function Login() {
  const { login, autenticado, isAdmin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  // Se ja estiver logado, nao deixa ficar na tela de login.
  useEffect(() => {
    if (autenticado) {
      navigate(isAdmin ? '/admin' : '/dashboard', { replace: true })
    }
  }, [autenticado, isAdmin, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const usuario = await login(email, senha)
      navigate(usuario.perfil === 'admin' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      setErro(err.message || 'Nao foi possivel entrar.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Row className="justify-content-center">
      <Col md={6} lg={5}>
        <Card className="shadow-sm mt-4">
          <Card.Body className="p-4">
            <h3 className="text-center mb-1">🎯 Bet Acadêmica</h3>
            <p className="text-center text-muted mb-4">
              Plataforma simulada de apostas esportivas
            </p>

            {erro && <Alert variant="danger">{erro}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bet.com"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="123"
                  required
                />
              </Form.Group>
              <Button type="submit" variant="success" className="w-100" disabled={enviando}>
                {enviando ? 'Entrando...' : 'Entrar'}
              </Button>
            </Form>

            <hr />
            <p className="text-muted small mb-1">Usuários de teste:</p>
            <ul className="text-muted small mb-0">
              <li>admin@bet.com / 123 (administrador)</li>
              <li>joao@bet.com / 123 (jogador)</li>
              <li>maria@bet.com / 123 (jogador)</li>
            </ul>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
