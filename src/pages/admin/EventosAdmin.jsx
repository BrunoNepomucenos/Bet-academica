import { useState, useEffect } from 'react'
import { Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap'
import {
  listarEventos,
  criarEvento,
  atualizarEvento,
  removerEvento,
} from '../../services/eventos.js'
import {
  listarApostasPorEvento,
  atualizarAposta,
  registrarMovimentacao,
} from '../../services/apostas.js'
import { buscarUsuario, atualizarUsuario } from '../../services/usuarios.js'
import { useToast } from '../../contexts/ToastContext.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import Loader from '../../components/Loader.jsx'

const eventoVazio = {
  timeA: '',
  timeB: '',
  esporte: 'Futebol',
  data: '',
  oddA: 1.5,
  oddB: 2.0,
}

// Tela do administrador: cadastra eventos, encerra apostas e lanca o resultado.
export default function EventosAdmin() {
  const { notificar } = useToast()
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [form, setForm] = useState(eventoVazio)

  // Modal de resultado
  const [eventoResultado, setEventoResultado] = useState(null)

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    setCarregando(true)
    setEventos(await listarEventos())
    setCarregando(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  // Cadastro de novo evento (status inicial "aberto").
  async function cadastrar(e) {
    e.preventDefault()
    try {
      await criarEvento({
        ...form,
        oddA: Number(form.oddA),
        oddB: Number(form.oddB),
        status: 'aberto',
        resultado: '',
      })
      setForm(eventoVazio)
      notificar('Evento cadastrado com sucesso!', 'success')
      carregar()
    } catch {
      notificar('Erro ao cadastrar evento.', 'danger')
    }
  }

  // Encerra as apostas: ninguem mais pode apostar neste evento.
  async function encerrarApostas(evento) {
    await atualizarEvento(evento.id, { status: 'encerrado' })
    notificar('Apostas encerradas para este evento.', 'warning')
    carregar()
  }

  async function excluir(evento) {
    await removerEvento(evento.id)
    notificar('Evento removido.', 'info')
    carregar()
  }

  // Processa o resultado: define vencedor, atualiza apostas e credita os ganhadores.
  async function confirmarResultado(vencedor) {
    const evento = eventoResultado
    try {
      const apostas = await listarApostasPorEvento(evento.id)

      for (const aposta of apostas) {
        if (aposta.status !== 'pendente') continue

        const acertou = aposta.palpite === vencedor
        const retorno = acertou ? Number((aposta.valor * (aposta.odd || 1)).toFixed(2)) : 0

        await atualizarAposta(aposta.id, {
          status: acertou ? 'ganha' : 'perdida',
          retorno,
        })

        // Credita o premio no saldo do ganhador e registra a movimentacao.
        if (acertou) {
          const jogador = await buscarUsuario(aposta.usuarioId)
          await atualizarUsuario(jogador.id, { saldo: jogador.saldo + retorno })
          await registrarMovimentacao({
            usuarioId: jogador.id,
            tipo: 'premio',
            valor: retorno,
            descricao: `Prêmio: ${evento.timeA} x ${evento.timeB} (acertou ${vencedor})`,
            data: new Date().toISOString().slice(0, 10),
          })
        }
      }

      await atualizarEvento(evento.id, { status: 'finalizado', resultado: vencedor })
      notificar('Resultado lançado e apostas atualizadas!', 'success')
      setEventoResultado(null)
      carregar()
    } catch {
      notificar('Erro ao processar o resultado.', 'danger')
    }
  }

  return (
    <>
      <h2 className="mb-3">Gerenciamento de Eventos</h2>

      <Row className="g-4">
        {/* Formulario de cadastro */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="fw-semibold">Cadastrar evento</Card.Header>
            <Card.Body>
              <Form onSubmit={cadastrar}>
                <Form.Group className="mb-2">
                  <Form.Label>Time / Atleta A</Form.Label>
                  <Form.Control name="timeA" value={form.timeA} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Time / Atleta B</Form.Label>
                  <Form.Control name="timeB" value={form.timeB} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Esporte</Form.Label>
                  <Form.Select name="esporte" value={form.esporte} onChange={handleChange}>
                    <option>Futebol</option>
                    <option>Basquete</option>
                    <option>Vôlei</option>
                    <option>Tênis</option>
                    <option>E-Sports</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-2">
                  <Form.Label>Data</Form.Label>
                  <Form.Control type="date" name="data" value={form.data} onChange={handleChange} required />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Odd A</Form.Label>
                      <Form.Control type="number" step="0.1" min="1" name="oddA" value={form.oddA} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Odd B</Form.Label>
                      <Form.Control type="number" step="0.1" min="1" name="oddB" value={form.oddB} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" variant="success" className="w-100">
                  Cadastrar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Lista de eventos */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="fw-semibold">Eventos cadastrados</Card.Header>
            <Card.Body className="p-0">
              {carregando ? (
                <Loader />
              ) : (
                <Table responsive hover className="mb-0 align-middle">
                  <thead className="table-dark">
                    <tr>
                      <th>Evento</th>
                      <th>Esporte</th>
                      <th>Status</th>
                      <th className="text-end">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventos.map((evento) => (
                      <tr key={evento.id}>
                        <td>
                          {evento.timeA} x {evento.timeB}
                          <div className="small text-muted">
                            {new Date(evento.data).toLocaleDateString('pt-BR')}
                            {evento.resultado && ` · Vencedor: ${evento.resultado}`}
                          </div>
                        </td>
                        <td>{evento.esporte}</td>
                        <td><StatusBadge status={evento.status} /></td>
                        <td className="text-end">
                          {evento.status === 'aberto' && (
                            <Button size="sm" variant="warning" className="me-1 mb-1"
                              onClick={() => encerrarApostas(evento)}>
                              Encerrar
                            </Button>
                          )}
                          {evento.status !== 'finalizado' && (
                            <Button size="sm" variant="primary" className="me-1 mb-1"
                              onClick={() => setEventoResultado(evento)}>
                              Resultado
                            </Button>
                          )}
                          <Button size="sm" variant="outline-danger" className="mb-1"
                            onClick={() => excluir(evento)}>
                            Excluir
                          </Button>
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

      {/* Modal para lancar o resultado */}
      <Modal show={!!eventoResultado} onHide={() => setEventoResultado(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Lançar resultado</Modal.Title>
        </Modal.Header>
        {eventoResultado && (
          <Modal.Body>
            <p>Quem venceu <strong>{eventoResultado.timeA} x {eventoResultado.timeB}</strong>?</p>
            <p className="text-muted small">
              Ao confirmar, as apostas pendentes serão atualizadas e os ganhadores receberão o prêmio.
            </p>
            <div className="d-grid gap-2">
              <Button variant="success" onClick={() => confirmarResultado(eventoResultado.timeA)}>
                {eventoResultado.timeA}
              </Button>
              <Button variant="success" onClick={() => confirmarResultado(eventoResultado.timeB)}>
                {eventoResultado.timeB}
              </Button>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </>
  )
}
