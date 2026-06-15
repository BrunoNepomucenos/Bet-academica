import { useState, useEffect } from 'react'
import { Row, Col, Card, ProgressBar } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { listarEventos } from '../../services/eventos.js'
import { listarApostas } from '../../services/apostas.js'
import { listarJogadores } from '../../services/usuarios.js'
import Loader from '../../components/Loader.jsx'

// EXTRA: painel estatistico do administrador (resumo da plataforma).
export default function AdminDashboard() {
  const [eventos, setEventos] = useState([])
  const [apostas, setApostas] = useState([])
  const [jogadores, setJogadores] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      const [ev, ap, jg] = await Promise.all([
        listarEventos(),
        listarApostas(),
        listarJogadores(),
      ])
      setEventos(ev)
      setApostas(ap)
      setJogadores(jg)
      setCarregando(false)
    }
    carregar()
  }, [])

  if (carregando) return <Loader texto="Carregando painel..." />

  const volumeApostado = apostas.reduce((soma, a) => soma + Number(a.valor), 0)
  const ganhas = apostas.filter((a) => a.status === 'ganha').length
  const perdidas = apostas.filter((a) => a.status === 'perdida').length
  const pendentes = apostas.filter((a) => a.status === 'pendente').length
  const totalApostas = apostas.length || 1

  const cards = [
    { titulo: 'Eventos', valor: eventos.length, cor: 'primary' },
    { titulo: 'Jogadores', valor: jogadores.length, cor: 'info' },
    { titulo: 'Apostas', valor: apostas.length, cor: 'dark' },
    { titulo: 'Volume apostado', valor: `R$ ${volumeApostado.toFixed(2)}`, cor: 'success' },
  ]

  // Distribuicao de eventos por esporte para o grafico de barras.
  const porEsporte = eventos.reduce((acc, ev) => {
    acc[ev.esporte] = (acc[ev.esporte] || 0) + 1
    return acc
  }, {})

  return (
    <>
      <h2 className="mb-1">Painel do Administrador</h2>
      <p className="text-muted">Visão geral da plataforma Bet Acadêmica.</p>

      <Row xs={2} md={4} className="g-3 mb-4">
        {cards.map((c) => (
          <Col key={c.titulo}>
            <Card bg={c.cor} text="white" className="shadow-sm h-100">
              <Card.Body>
                <Card.Subtitle className="mb-2 small">{c.titulo}</Card.Subtitle>
                <Card.Title className="fs-4">{c.valor}</Card.Title>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="fw-semibold">Apostas por status</Card.Header>
            <Card.Body>
              <p className="mb-1 small">Ganhas ({ganhas})</p>
              <ProgressBar variant="success" now={(ganhas / totalApostas) * 100} className="mb-3" />
              <p className="mb-1 small">Perdidas ({perdidas})</p>
              <ProgressBar variant="danger" now={(perdidas / totalApostas) * 100} className="mb-3" />
              <p className="mb-1 small">Pendentes ({pendentes})</p>
              <ProgressBar variant="info" now={(pendentes / totalApostas) * 100} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="fw-semibold">Eventos por esporte</Card.Header>
            <Card.Body>
              {Object.entries(porEsporte).map(([esporte, qtd]) => (
                <div key={esporte} className="mb-3">
                  <p className="mb-1 small">{esporte} ({qtd})</p>
                  <ProgressBar variant="primary" now={(qtd / eventos.length) * 100} />
                </div>
              ))}
              <Link to="/admin/eventos" className="btn btn-success btn-sm mt-2">
                Gerenciar eventos
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
