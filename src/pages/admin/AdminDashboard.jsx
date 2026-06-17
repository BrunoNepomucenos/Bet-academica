import { useState, useEffect } from 'react'
import { Row, Col, Card, ProgressBar, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { listarEventos } from '../../services/eventos.js'
import { listarApostas } from '../../services/apostas.js'
import { listarJogadores } from '../../services/usuarios.js'
import Loader from '../../components/Loader.jsx'
import StatCard from '../../components/StatCard.jsx'

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

  // --- Indicadores calculados a partir dos dados carregados (derivados, nao guardados em estado) ---
  // Soma de tudo que foi apostado na plataforma.
  const volumeApostado = apostas.reduce((soma, a) => soma + Number(a.valor), 0)
  // Contagem de apostas por status, para as barras de progresso.
  const ganhas = apostas.filter((a) => a.status === 'ganha').length
  const perdidas = apostas.filter((a) => a.status === 'perdida').length
  const pendentes = apostas.filter((a) => a.status === 'pendente').length
  // "|| 1" evita divisao por zero ao calcular as porcentagens quando nao ha apostas.
  const totalApostas = apostas.length || 1
  const eventosAbertos = eventos.filter((e) => e.status === 'aberto').length

  // Distribuicao de eventos por esporte para o grafico de barras.
  const porEsporte = eventos.reduce((acc, ev) => {
    acc[ev.esporte] = (acc[ev.esporte] || 0) + 1
    return acc
  }, {})

  // Top 5 jogadores por saldo.
  const topJogadores = [...jogadores].sort((a, b) => b.saldo - a.saldo).slice(0, 5)

  return (
    <>
      <div className="page-header">
        <h2>Painel do <span className="page-title-accent">Administrador</span></h2>
        <p className="text-muted mb-0">Visão geral da plataforma Bet Acadêmica.</p>
      </div>

      <Row xs={2} md={4} className="g-3 mb-4">
        <Col><StatCard label="Eventos" valor={`${eventos.length}`} icone="🏟️" gradiente="blue" /></Col>
        <Col><StatCard label="Jogadores" valor={jogadores.length} icone="👥" gradiente="purple" /></Col>
        <Col><StatCard label="Apostas" valor={apostas.length} icone="🎯" gradiente="dark" /></Col>
        <Col><StatCard label="Volume apostado" valor={`R$ ${volumeApostado.toFixed(2)}`} icone="💰" gradiente="green" /></Col>
      </Row>

      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="fw-semibold">Apostas por status</Card.Header>
            <Card.Body>
              <p className="mb-1 small">✅ Ganhas ({ganhas})</p>
              <ProgressBar variant="success" now={(ganhas / totalApostas) * 100} className="mb-3" />
              <p className="mb-1 small">❌ Perdidas ({perdidas})</p>
              <ProgressBar variant="danger" now={(perdidas / totalApostas) * 100} className="mb-3" />
              <p className="mb-1 small">⏳ Pendentes ({pendentes})</p>
              <ProgressBar variant="info" now={(pendentes / totalApostas) * 100} />
              <p className="text-muted small mt-3 mb-0">
                {eventosAbertos} evento(s) aberto(s) para apostas.
              </p>
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

        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Header className="fw-semibold d-flex justify-content-between align-items-center">
              <span>🏆 Top jogadores por saldo</span>
              <Link to="/admin/bonus" className="small text-decoration-none">Conceder bônus →</Link>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Jogador</th>
                    <th>E-mail</th>
                    <th className="text-end">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {topJogadores.map((j, i) => (
                    <tr key={j.id}>
                      <td>{['🥇', '🥈', '🥉'][i] || i + 1}</td>
                      <td>{j.nome}</td>
                      <td className="small text-muted">{j.email}</td>
                      <td className="text-end fw-semibold">R$ {Number(j.saldo).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
