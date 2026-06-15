import { useState, useEffect, useMemo } from 'react'
import { Row, Col, Alert } from 'react-bootstrap'
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
import FiltroEsporte from '../../components/FiltroEsporte.jsx'
import Loader from '../../components/Loader.jsx'

// Tela do jogador: lista eventos, filtra por esporte (EXTRA) e permite apostar.
export default function EventosDisponiveis() {
  const { usuario, atualizarUsuario: atualizarSessao } = useAuth()
  const { notificar } = useToast()

  const [eventos, setEventos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [filtro, setFiltro] = useState('todos')
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

  // Lista de esportes unicos para alimentar o filtro.
  const esportes = useMemo(
    () => [...new Set(eventos.map((e) => e.esporte))],
    [eventos]
  )

  const eventosFiltrados = useMemo(
    () => (filtro === 'todos' ? eventos : eventos.filter((e) => e.esporte === filtro)),
    [eventos, filtro]
  )

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
      notificar('Aposta realizada com sucesso!', 'success')
      setEventoSelecionado(null)
    } catch {
      notificar('Erro ao registrar a aposta.', 'danger')
    }
  }

  if (carregando) return <Loader texto="Carregando eventos..." />

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-end">
        <div>
          <h2 className="mb-1">Eventos Disponíveis</h2>
          <p className="text-muted">Escolha um evento aberto e faça sua aposta fictícia.</p>
        </div>
        <FiltroEsporte esportes={esportes} valor={filtro} onChange={setFiltro} />
      </div>

      {eventosFiltrados.length === 0 ? (
        <Alert variant="info">Nenhum evento encontrado para este filtro.</Alert>
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
