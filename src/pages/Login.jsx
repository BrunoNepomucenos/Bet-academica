import { useState, useEffect } from 'react'
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
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
      setErro(err.message || 'Não foi possível entrar.')
    } finally {
      setEnviando(false)
    }
  }

  // Preenche o formulario com um usuario de teste (atalho de demonstracao).
  function preencher(e, s) {
    setEmail(e)
    setSenha(s)
  }

  return (
    <div className="auth-wrapper">
      <Row className="justify-content-center align-items-stretch w-100 g-4">
        {/* Hero (somente em telas md+) */}
        <Col md={6} lg={5} className="d-none d-md-block">
          <div className="auth-hero h-100 d-flex flex-column justify-content-center">
            <h1 className="mb-3">🎯 Bet Acadêmica</h1>
            <p className="fw-medium mb-4">
              A plataforma <strong>100% fictícia</strong> de apostas esportivas feita para aprender React.
            </p>
            <div className="feature-line">⚽ Eventos de vários esportes</div>
            <div className="feature-line">💸 Apostas e saldo simulados</div>
            <div className="feature-line">🏆 Ranking, bônus e histórico</div>
            <div className="feature-line">📊 Painéis e estatísticas</div>
            <p className="small mt-4 mb-0" style={{ opacity: 0.85 }}>
              Sem dinheiro real · sem PIX · sem cartão. Apenas aprendizado.
            </p>
          </div>
        </Col>

        {/* Formulario */}
        <Col md={6} lg={4}>
          <Card className="shadow h-100">
            <Card.Body className="p-4 p-md-5 d-flex flex-column justify-content-center">
              <h3 className="text-center mb-1">Bem-vindo de volta 👋</h3>
              <p className="text-center text-muted mb-4">Entre para continuar apostando</p>

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

              <p className="text-center text-muted small mt-3 mb-0">
                Não tem conta? <Link to="/cadastro">Cadastre-se grátis</Link>
              </p>

              <hr />
              <p className="text-muted small mb-2">Acesso rápido (usuários de teste):</p>
              <div className="d-flex flex-wrap gap-2">
                <span className="chip" onClick={() => preencher('admin@bet.com', '123')}>👤 Admin</span>
                <span className="chip" onClick={() => preencher('joao@bet.com', '123')}>🎮 João</span>
                <span className="chip" onClick={() => preencher('maria@bet.com', '123')}>🎮 Maria</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
