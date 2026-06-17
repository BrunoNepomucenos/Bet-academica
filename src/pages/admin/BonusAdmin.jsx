import { useState, useEffect } from 'react'
import { Card, Form, Button, Table, Row, Col } from 'react-bootstrap'
import { listarJogadores, atualizarUsuario } from '../../services/usuarios.js'
import { registrarMovimentacao } from '../../services/apostas.js'
import { useToast } from '../../contexts/ToastContext.jsx'
import Loader from '../../components/Loader.jsx'

// EXTRA: sistema de bonus ficticio. O admin credita saldo extra a um jogador.
export default function BonusAdmin() {
  const { notificar } = useToast()
  const [jogadores, setJogadores] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [jogadorId, setJogadorId] = useState('')
  const [valor, setValor] = useState('')

  useEffect(() => {
    carregar()
  }, [])

  // Recarrega a lista de jogadores (e seus saldos/bonus) da API.
  async function carregar() {
    setCarregando(true)
    setJogadores(await listarJogadores())
    setCarregando(false)
  }

  // Credita um bonus ficticio: soma o valor ao saldo e ao bonus acumulado do
  // jogador escolhido e registra a movimentacao no extrato dele.
  async function concederBonus(e) {
    e.preventDefault()
    const valorNumerico = Number(valor)
    // Validacao: precisa ter jogador selecionado e valor positivo.
    if (!jogadorId || valorNumerico <= 0) {
      notificar('Selecione um jogador e um valor válido.', 'warning')
      return
    }

    try {
      // O value do <select> vem como texto; converte para numero ao comparar o id.
      const jogador = jogadores.find((j) => j.id === Number(jogadorId))
      await atualizarUsuario(jogador.id, {
        saldo: jogador.saldo + valorNumerico,
        bonus: (jogador.bonus || 0) + valorNumerico,
      })
      await registrarMovimentacao({
        usuarioId: jogador.id,
        tipo: 'bonus',
        valor: valorNumerico,
        descricao: 'Bônus concedido pelo administrador',
        data: new Date().toISOString().slice(0, 10),
      })
      notificar(`Bônus de R$ ${valorNumerico.toFixed(2)} concedido a ${jogador.nome}.`, 'success')
      setValor('')
      setJogadorId('')
      carregar()
    } catch {
      notificar('Erro ao conceder bônus.', 'danger')
    }
  }

  return (
    <>
      <div className="page-header">
        <h2>Sistema de <span className="page-title-accent">Bônus</span></h2>
        <p className="text-muted mb-0">Conceda bônus fictícios aos jogadores da plataforma.</p>
      </div>
      <Row className="g-4">
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="fw-semibold">Conceder bônus</Card.Header>
            <Card.Body>
              <Form onSubmit={concederBonus}>
                <Form.Group className="mb-3">
                  <Form.Label>Jogador</Form.Label>
                  <Form.Select value={jogadorId} onChange={(e) => setJogadorId(e.target.value)}>
                    <option value="">Selecione...</option>
                    {jogadores.map((j) => (
                      <option key={j.id} value={j.id}>{j.nome}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Valor do bônus (R$)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    placeholder="Ex.: 200"
                  />
                </Form.Group>
                <Button type="submit" variant="success" className="w-100">
                  Conceder bônus
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="fw-semibold">Jogadores</Card.Header>
            <Card.Body className="p-0">
              {carregando ? (
                <Loader />
              ) : (
                <Table responsive hover className="mb-0 align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Jogador</th>
                      <th>E-mail</th>
                      <th>Saldo</th>
                      <th>Bônus total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jogadores.map((j) => (
                      <tr key={j.id}>
                        <td>{j.nome}</td>
                        <td className="small text-muted">{j.email}</td>
                        <td>R$ {Number(j.saldo).toFixed(2)}</td>
                        <td className="text-info fw-semibold">
                          R$ {Number(j.bonus || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
