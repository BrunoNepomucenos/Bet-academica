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
import ConfirmModal from '../../components/ConfirmModal.jsx'
import EmptyState from '../../components/EmptyState.jsx'

const eventoVazio = {
  timeA: '',
  timeB: '',
  esporte: 'Futebol',
  data: '',
  oddA: 1.5,
  oddB: 2.0,
}

// Tela do administrador: cadastra/edita eventos, encerra apostas e lanca o resultado.
export default function EventosAdmin() {
  const { notificar } = useToast()
  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [form, setForm] = useState(eventoVazio)
  const [editandoId, setEditandoId] = useState(null)

  const [eventoResultado, setEventoResultado] = useState(null)
  const [eventoExcluir, setEventoExcluir] = useState(null)

  // Ao montar a tela, busca os eventos uma vez.
  useEffect(() => {
    carregar()
  }, [])

  // Recarrega a lista de eventos da API (chamada apos cada acao que muda os dados).
  async function carregar() {
    setCarregando(true)
    setEventos(await listarEventos())
    setCarregando(false)
  }

  // Controlador unico do formulario: usa o "name" de cada campo para atualizar
  // apenas aquela propriedade do objeto "form", mantendo o resto intacto.
  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  // Entra no modo edicao: guarda o id e preenche o formulario com os dados do evento.
  function iniciarEdicao(evento) {
    setEditandoId(evento.id)
    setForm({
      timeA: evento.timeA,
      timeB: evento.timeB,
      esporte: evento.esporte,
      data: evento.data,
      oddA: evento.oddA,
      oddB: evento.oddB,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Sai do modo edicao e limpa o formulario, voltando ao estado de cadastro.
  function cancelarEdicao() {
    setEditandoId(null)
    setForm(eventoVazio)
  }

  // Cadastro de novo evento ou atualizacao de um existente.
  async function salvar(e) {
    e.preventDefault()
    try {
      const dados = { ...form, oddA: Number(form.oddA), oddB: Number(form.oddB) }
      if (editandoId) {
        await atualizarEvento(editandoId, dados)
        notificar('Evento atualizado com sucesso!', 'success')
      } else {
        await criarEvento({ ...dados, status: 'aberto', resultado: '' })
        notificar('Evento cadastrado com sucesso!', 'success')
      }
      cancelarEdicao()
      carregar()
    } catch {
      notificar('Erro ao salvar evento.', 'danger')
    }
  }

  // Encerra as apostas: muda o status para 'encerrado' (bloqueia novas apostas,
  // mas o evento ainda nao tem resultado).
  async function encerrarApostas(evento) {
    await atualizarEvento(evento.id, { status: 'encerrado' })
    notificar('Apostas encerradas para este evento.', 'warning')
    carregar()
  }

  // Exclui de vez o evento selecionado no modal de confirmacao.
  async function confirmarExclusao() {
    try {
      await removerEvento(eventoExcluir.id)
      notificar('Evento removido.', 'info')
      setEventoExcluir(null)
      carregar()
    } catch {
      notificar('Erro ao remover evento.', 'danger')
    }
  }

  // Processa o resultado: define vencedor, atualiza apostas e credita os ganhadores.
  async function confirmarResultado(vencedor) {
    const evento = eventoResultado
    try {
      // 1) Pega todas as apostas feitas neste evento.
      const apostas = await listarApostasPorEvento(evento.id)

      // 2) Percorre aposta por aposta para apurar quem ganhou/perdeu.
      for (const aposta of apostas) {
        // Ignora apostas que ja foram resolvidas ou canceladas (so processa pendentes).
        if (aposta.status !== 'pendente') continue

        // Acertou se o palpite do jogador foi o time vencedor escolhido pelo admin.
        const acertou = aposta.palpite === vencedor
        // Premio = valor apostado x odd (so quem acertou ganha; arredonda a 2 casas).
        const retorno = acertou ? Number((aposta.valor * (aposta.odd || 1)).toFixed(2)) : 0

        // Marca a aposta como ganha ou perdida e grava o retorno.
        await atualizarAposta(aposta.id, {
          status: acertou ? 'ganha' : 'perdida',
          retorno,
        })

        // Se acertou, credita o premio no saldo do jogador e lanca no extrato.
        if (acertou) {
          // Busca o saldo atual do jogador antes de somar (evita usar valor desatualizado).
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

      // 3) Por fim, fecha o evento: status 'finalizado' e registra o vencedor.
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
      <div className="page-header">
        <h2>Gerenciamento de <span className="page-title-accent">Eventos</span></h2>
        <p className="text-muted mb-0">Cadastre, edite, encerre apostas e lance resultados.</p>
      </div>

      <Row className="g-4">
        {/* Formulario de cadastro/edicao */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="fw-semibold">
              {editandoId ? '✏️ Editar evento' : '➕ Cadastrar evento'}
            </Card.Header>
            <Card.Body>
              <Form onSubmit={salvar}>
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
                <div className="d-grid gap-2">
                  <Button type="submit" variant="success">
                    {editandoId ? 'Salvar alterações' : 'Cadastrar'}
                  </Button>
                  {editandoId && (
                    <Button variant="outline-secondary" onClick={cancelarEdicao}>
                      Cancelar edição
                    </Button>
                  )}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Lista de eventos */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="fw-semibold">Eventos cadastrados ({eventos.length})</Card.Header>
            <Card.Body className="p-0">
              {carregando ? (
                <Loader />
              ) : eventos.length === 0 ? (
                <EmptyState emoji="🏟️" titulo="Nenhum evento cadastrado" descricao="Use o formulário ao lado para criar o primeiro." />
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
                          {evento.timeA} × {evento.timeB}
                          <div className="small text-muted">
                            {new Date(evento.data).toLocaleDateString('pt-BR')}
                            {evento.resultado && ` · Vencedor: ${evento.resultado}`}
                          </div>
                        </td>
                        <td>{evento.esporte}</td>
                        <td><StatusBadge status={evento.status} /></td>
                        <td className="text-end">
                          {evento.status !== 'finalizado' && (
                            <Button size="sm" variant="outline-secondary" className="me-1 mb-1"
                              onClick={() => iniciarEdicao(evento)}>
                              Editar
                            </Button>
                          )}
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
                            onClick={() => setEventoExcluir(evento)}>
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
            <p>Quem venceu <strong>{eventoResultado.timeA} × {eventoResultado.timeB}</strong>?</p>
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

      {/* Confirmacao de exclusao */}
      <ConfirmModal
        show={!!eventoExcluir}
        titulo="Excluir evento"
        mensagem={
          eventoExcluir
            ? `Tem certeza que deseja excluir "${eventoExcluir.timeA} × ${eventoExcluir.timeB}"? Esta ação não pode ser desfeita.`
            : ''
        }
        textoConfirmar="Excluir"
        onConfirmar={confirmarExclusao}
        onHide={() => setEventoExcluir(null)}
      />
    </>
  )
}
