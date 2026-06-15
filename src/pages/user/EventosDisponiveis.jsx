import { useState, useEffect, useMemo } from 'react'
import { Row, Col, Form, InputGroup } from 'react-bootstrap'
import { listarEventos } from '../../services/eventos.js'
import {
  criarAposta,
  registrarMovimentacao,
} from '../../services/apostas.js'
import { atualizarUsuario } from '../../services/usuarios.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import EventoCard from '../../components/EventoCard.jsx'
import ApostaModal from '../../components/ApostaModal.jsx'
import Loader from '../../components/Loader.jsx'
import EmptyState from '../../components/EmptyState.jsx'

// Tela do jogador: lista eventos, filtra por esporte (EXTRA), busca e permite apostar.
export default function EventosDisponiveis() {
  const { usuario, atualizarUsuario: atualizarSessao } = useAuth()
  const { notificar } = useToast()

  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState('todos')
  const [busca, setBusca] = useState('')
  const [soAbertos, setSoAbertos] = useState(false)
  const [eventoSelecionado, setEventoSelecionado] = useState(null)

  useEffect(() => {
    carregarEventos()
  }, [])

  async function carregarEventos() {
    setCarregando(true)
    const dados = await listarEventos()
    setEventos(dados)
    setCarregando(false)
  }

  // Lista de esportes unicos para alimentar o filtro (chips).
  const esportes = useMemo(
    () => ['todos', ...new Set(eventos.map((e) => e.esporte))],
    [eventos]
  )

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((e) => {
      const casaEsporte = filtro === 'todos' || e.esporte === filtro
      const casaBusca =
        !busca ||
        `${e.timeA} ${e.timeB}`.toLowerCase().includes(busca.toLowerCase())
      const casaStatus = !soAbertos || e.status === 'aberto'
      return casaEsporte && casaBusca && casaStatus
    })
  }, [eventos, filtro, busca, soAbertos])

  // Processa a aposta: debita saldo, cria a aposta e registra a movimentacao.
  async function confirmarAposta({ palpite, valor, odd }) {
    try {
      const novoSaldo = usuario.saldo - valor

      await criarAposta({
        usuarioId: usuario.id,
        eventoId: eventoSelecionado.id,
        palpite,
        valor,
        odd,
        status: 'pendente',
        retorno: 0,
        data: new Date().toISOString().slice(0, 10),
      })

      await atualizarUsuario(usuario.id, { saldo: novoSaldo })

      await registrarMovimentacao({
        usuarioId: usuario.id,
        tipo: 'aposta',
        valor: -valor,
        descricao: `Aposta em ${eventoSelecionado.timeA} x ${eventoSelecionado.timeB} (palpite: ${palpite})`,
        data: new Date().toISOString().slice(0, 10),
      })

      atualizarSessao({ saldo: novoSaldo })
      notificar('Aposta realizada com sucesso! 🎉', 'success')
      setEventoSelecionado(null)
    } catch {
      notificar('Erro ao registrar a aposta.', 'danger')
    }
  }

  if (carregando) return <Loader texto="Carregando eventos..." />

  return (
    <>
      <div className="page-header">
        <h2>Eventos <span className="page-title-accent">Disponíveis</span></h2>
        <p className="text-muted mb-0">Escolha um evento aberto e faça sua aposta fictícia.</p>
      </div>

      {/* Filtros: chips de esporte + busca + toggle */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
        <div className="d-flex flex-wrap gap-2">
          {esportes.map((esp) => (
            <span
              key={esp}
              className={`chip ${filtro === esp ? 'active' : ''}`}
              onClick={() => setFiltro(esp)}
            >
              {esp === 'todos' ? 'Todos' : esp}
            </span>
          ))}
        </div>
        <div className="d-flex align-items-center gap-3">
          <Form.Check
            type="switch"
            id="so-abertos"
            label="Só abertos"
            checked={soAbertos}
            onChange={(e) => setSoAbertos(e.target.checked)}
          />
          <InputGroup style={{ maxWidth: 260 }}>
            <InputGroup.Text>🔎</InputGroup.Text>
            <Form.Control
              placeholder="Buscar time..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </InputGroup>
        </div>
      </div>

      {eventosFiltrados.length === 0 ? (
        <EmptyState
          emoji="🔍"
          titulo="Nenhum evento encontrado"
          descricao="Tente outro esporte ou limpe a busca."
        />
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {eventosFiltrados.map((evento) => (
            <Col key={evento.id}>
              <EventoCard evento={evento} onApostar={setEventoSelecionado} />
            </Col>
          ))}
        </Row>
      )}

      <ApostaModal
        evento={eventoSelecionado}
        saldo={usuario.saldo}
        show={!!eventoSelecionado}
        onHide={() => setEventoSelecionado(null)}
        onConfirmar={confirmarAposta}
      />
    </>
  )
}
