import { useState, useEffect } from 'react'
import { Row, Col, Card, Table, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { listarApostasPorUsuario, listarMovimentacoesPorUsuario } from '../../services/apostas.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import Loader from '../../components/Loader.jsx'

// Painel-resumo do jogador: saldo, estatisticas e extrato (EXTRA) de movimentacoes.
export default function UserDashboard() {
  const { usuario } = useAuth()
  const [apostas, setApostas] = useState([])
  const [movimentacoes, setMovimentacoes] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      const [listaApostas, listaMov] = await Promise.all([
        listarApostasPorUsuario(usuario.id),
        listarMovimentacoesPorUsuario(usuario.id),
      ])
      setApostas(listaApostas)
      setMovimentacoes(listaMov.reverse())
      setCarregando(false)
    }
    carregar()
  }, [usuario.id])

  if (carregando) return <Loader texto="Carregando painel..." />

  const total = apostas.length
  const ganhas = apostas.filter((a) => a.status === 'ganha').length
  const perdidas = apostas.filter((a) => a.status === 'perdida').length
  const pendentes = apostas.filter((a) => a.status === 'pendente').length

  const cards = [
    { titulo: 'Saldo atual', valor: `R$ ${Number(usuario.saldo).toFixed(2)}`, cor: 'success' },
    { titulo: 'Bônus recebido', valor: `R$ ${Number(usuario.bonus || 0).toFixed(2)}`, cor: 'info' },
    { titulo: 'Apostas feitas', valor: total, cor: 'dark' },
    { titulo: 'Apostas ganhas', valor: ganhas, cor: 'primary' },
  ]

  return (
    <>
      <h2 className="mb-1">Olá, {usuario.nome.split(' ')[0]}! 👋</h2>
      <p className="text-muted">Acompanhe abaixo o resumo da sua conta.</p>

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
        <Col md={5}>
          <Card className="shadow-sm h-100">
            <Card.Header className="fw-semibold">Resumo das apostas</Card.Header>
            <Card.Body>
              <p className="mb-2">✅ Ganhas: <strong>{ganhas}</strong></p>
              <p className="mb-2">❌ Perdidas: <strong>{perdidas}</strong></p>
              <p className="mb-3">⏳ Pendentes: <strong>{pendentes}</strong></p>
              <Link to="/eventos" className="btn btn-success btn-sm me-2">Apostar agora</Link>
              <Link to="/historico" className="btn btn-outline-secondary btn-sm">Ver histórico</Link>
            </Card.Body>
          </Card>
        </Col>

        <Col md={7}>
          <Card className="shadow-sm h-100">
            <Card.Header className="fw-semibold">Extrato de movimentações</Card.Header>
            <Card.Body className="p-0">
              {movimentacoes.length === 0 ? (
                <Alert variant="light" className="m-3 mb-0">Sem movimentações ainda.</Alert>
              ) : (
                <Table responsive hover className="mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimentacoes.slice(0, 8).map((m) => (
                      <tr key={m.id}>
                        <td className="small">{m.descricao}</td>
                        <td className={m.valor >= 0 ? 'text-success' : 'text-danger'}>
                          R$ {Number(m.valor).toFixed(2)}
                        </td>
                        <td className="small">
                          {m.data ? new Date(m.data).toLocaleDateString('pt-BR') : '-'}
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
