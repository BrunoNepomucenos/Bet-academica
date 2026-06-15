import { useState } from 'react'
import { Row, Col, Card, Form, Button, InputGroup, ListGroup } from 'react-bootstrap'
import { atualizarUsuario } from '../../services/usuarios.js'
import { registrarMovimentacao } from '../../services/apostas.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'

const VALORES_RAPIDOS = [50, 100, 250, 500]

// EXTRA: simulacao de carteira do jogador. Permite "recarregar" saldo ficticio.
export default function Perfil() {
  const { usuario, atualizarUsuario: atualizarSessao } = useAuth()
  const { notificar } = useToast()
  const [valor, setValor] = useState('')
  const [processando, setProcessando] = useState(false)

  async function recarregar(e) {
    e.preventDefault()
    const valorNumerico = Number(valor)
    if (!valorNumerico || valorNumerico <= 0) {
      notificar('Informe um valor de recarga válido.', 'warning')
      return
    }
    setProcessando(true)
    try {
      const novoSaldo = Number(usuario.saldo) + valorNumerico
      await atualizarUsuario(usuario.id, { saldo: novoSaldo })
      await registrarMovimentacao({
        usuarioId: usuario.id,
        tipo: 'recarga',
        valor: valorNumerico,
        descricao: 'Recarga fictícia de saldo (carteira)',
        data: new Date().toISOString().slice(0, 10),
      })
      atualizarSessao({ saldo: novoSaldo })
      notificar(`Recarga fictícia de R$ ${valorNumerico.toFixed(2)} realizada!`, 'success')
      setValor('')
    } catch {
      notificar('Erro ao recarregar o saldo.', 'danger')
    } finally {
      setProcessando(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h2>Minha <span className="page-title-accent">Carteira</span></h2>
        <p className="text-muted mb-0">Gerencie seus dados e recarregue seu saldo fictício.</p>
      </div>

      <Row className="g-4">
        <Col lg={5}>
          <Card className="stat-card bg-grad-green is-hoverable mb-4">
            <Card.Body>
              <div className="stat-label">Saldo disponível</div>
              <div className="stat-value">R$ {Number(usuario.saldo).toFixed(2)}</div>
              <span className="stat-icon">💰</span>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Header className="fw-semibold">Dados da conta</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="text-muted">Nome</span><strong>{usuario.nome}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="text-muted">E-mail</span><strong>{usuario.email}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="text-muted">Perfil</span><strong className="text-capitalize">{usuario.perfil}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="d-flex justify-content-between">
                <span className="text-muted">Bônus acumulado</span>
                <strong className="text-info">R$ {Number(usuario.bonus || 0).toFixed(2)}</strong>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>

        <Col lg={7}>
          <Card className="shadow-sm">
            <Card.Header className="fw-semibold">Recarregar saldo (fictício)</Card.Header>
            <Card.Body>
              <p className="text-muted small">
                ⚠️ Recarga 100% simulada — não há dinheiro real, PIX ou cartão. Apenas para fins acadêmicos.
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {VALORES_RAPIDOS.map((v) => (
                  <span key={v} className="chip" onClick={() => setValor(String(v))}>
                    + R$ {v}
                  </span>
                ))}
              </div>
              <Form onSubmit={recarregar}>
                <Form.Label>Valor da recarga</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>R$</InputGroup.Text>
                  <Form.Control
                    type="number"
                    min="1"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="Ex.: 100"
                  />
                </InputGroup>
                <Button type="submit" variant="success" disabled={processando}>
                  {processando ? 'Processando...' : '💳 Confirmar recarga fictícia'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
