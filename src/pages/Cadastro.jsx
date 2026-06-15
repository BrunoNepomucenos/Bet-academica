import { useState } from 'react'
import { Card, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { emailExiste, cadastrarUsuario } from '../services/usuarios.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { useToast } from '../contexts/ToastContext.jsx'

// Tela de cadastro de novo jogador. Cria o usuario no JSON Server e ja autentica.
export default function Cadastro() {
  const { login } = useAuth()
  const { notificar } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmar: '' })
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    // Validacoes basicas do formulario.
    if (form.nome.trim().length < 3) {
      setErro('Informe seu nome completo (mín. 3 caracteres).')
      return
    }
    if (form.senha.length < 3) {
      setErro('A senha deve ter pelo menos 3 caracteres.')
      return
    }
    if (form.senha !== form.confirmar) {
      setErro('As senhas não coincidem.')
      return
    }

    setEnviando(true)
    try {
      if (await emailExiste(form.email)) {
        setErro('Este e-mail já está cadastrado.')
        return
      }
      await cadastrarUsuario({
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
      })
      // Login automatico apos o cadastro.
      await login(form.email.trim(), form.senha)
      notificar('Conta criada! Você ganhou R$ 500 de bônus de boas-vindas. 🎉', 'success')
      navigate('/dashboard', { replace: true })
    } catch {
      setErro('Não foi possível concluir o cadastro. Verifique se a API está rodando.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <Row className="justify-content-center w-100 g-0">
        <Col md={7} lg={5}>
          <Card className="shadow">
            <Card.Body className="p-4 p-md-5">
              <h3 className="text-center mb-1">Criar conta</h3>
              <p className="text-center text-muted mb-4">
                Cadastre-se e ganhe <strong className="text-success">R$ 500</strong> de bônus fictício 🎁
              </p>

              {erro && <Alert variant="danger">{erro}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome completo</Form.Label>
                  <Form.Control name="nome" value={form.nome} onChange={handleChange} placeholder="Seu nome" required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control type="email" name="email" value={form.email} onChange={handleChange} placeholder="voce@email.com" required />
                </Form.Group>
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Senha</Form.Label>
                      <Form.Control type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="••••" required />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirmar senha</Form.Label>
                      <Form.Control type="password" name="confirmar" value={form.confirmar} onChange={handleChange} placeholder="••••" required />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="success" className="w-100" disabled={enviando}>
                  {enviando ? 'Criando conta...' : 'Cadastrar'}
                </Button>
              </Form>

              <p className="text-center text-muted small mt-4 mb-0">
                Já tem conta? <Link to="/login">Entrar</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
