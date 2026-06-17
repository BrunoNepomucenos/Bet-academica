import { useState, useEffect } from 'react'
import { Row, Col, Card, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { listarApostasPorUsuario, listarMovimentacoesPorUsuario } from '../../services/apostas.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import Loader from '../../components/Loader.jsx'
import StatCard from '../../components/StatCard.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import { Hand } from 'lucide-react'

// Icone por tipo de movimentacao no extrato.
const ICONE_MOV = {
  aposta: '🎯',
  premio: '🏆',
  bonus: '🎁',
  recarga: '💳',
  estorno: '↩️',
}

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

  // --- Estatisticas pessoais do jogador, derivadas das suas apostas ---
  const total = apostas.length
  const ganhas = apostas.filter((a) => a.status === 'ganha').length
  const perdidas = apostas.filter((a) => a.status === 'perdida').length
  const pendentes = apostas.filter((a) => a.status === 'pendente').length
  // Soma os retornos das apostas vencedoras (quanto o jogador ja "lucrou").
  const totalGanho = apostas
    .filter((a) => a.status === 'ganha')
    .reduce((s, a) => s + Number(a.retorno), 0)
  // Aproveitamento = % de acertos sobre as apostas ja resolvidas (ignora pendentes).
  // So calcula se houver ganhas/perdidas, senao evita divisao por zero retornando 0.
  const aproveitamento = ganhas + perdidas > 0
    ? Math.round((ganhas / (ganhas + perdidas)) * 100)
    : 0

  return (
    <>
      <div className="page-header">
        <h2>Olá, {usuario.nome.split(' ')[0]}! 
          <div>
            <Hand size={28} className="wave-hand" />
          </div>
          </h2>
        <p className="text-muted mb-0">Acompanhe abaixo o resumo da sua conta.</p>
      </div>

      <Row xs={2} md={4} className="g-3 mb-4">
        <Col><StatCard label="Saldo atual" valor={`R$ ${Number(usuario.saldo).toFixed(2)}`} icone="💰" gradiente="green" /></Col>
        <Col><StatCard label="Total ganho" valor={`R$ ${totalGanho.toFixed(2)}`} icone="🏆" gradiente="purple" /></Col>
        <Col><StatCard label="Apostas feitas" valor={total} icone="🎯" gradiente="blue" /></Col>
        <Col><StatCard label="Aproveitamento" valor={`${aproveitamento}%`} icone="📈" gradiente="amber" /></Col>
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
            <Card.Header className="fw-semibold d-flex justify-content-between align-items-center">
              <span>Extrato de movimentações</span>
              <Link to="/perfil" className="small text-decoration-none">Carteira →</Link>
            </Card.Header>
            <Card.Body className="p-0">
              {movimentacoes.length === 0 ? (
                <EmptyState emoji="🧾" descricao="Sem movimentações ainda." />
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
                        <td className="small">{ICONE_MOV[m.tipo] || '•'} {m.descricao}</td>
                        <td className={m.valor >= 0 ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                          {m.valor >= 0 ? '+' : ''}R$ {Number(m.valor).toFixed(2)}
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
