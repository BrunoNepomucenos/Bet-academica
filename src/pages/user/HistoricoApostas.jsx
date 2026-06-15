import { useState, useEffect } from 'react'
import { Table, Card, Alert } from 'react-bootstrap'
import { listarApostasPorUsuario } from '../../services/apostas.js'
import { listarEventos } from '../../services/eventos.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import StatusBadge from '../../components/StatusBadge.jsx'
import Loader from '../../components/Loader.jsx'

// Historico de apostas do jogador logado, com o status atualizado apos o resultado.
export default function HistoricoApostas() {
  const { usuario } = useAuth()
  const [apostas, setApostas] = useState([])
  const [eventos, setEventos] = useState({})
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      const [listaApostas, listaEventos] = await Promise.all([
        listarApostasPorUsuario(usuario.id),
        listarEventos(),
      ])
      // Indexa eventos por id para exibir o nome dos times no historico.
      const mapa = {}
      listaEventos.forEach((e) => {
        mapa[e.id] = e
      })
      setEventos(mapa)
      setApostas(listaApostas)
      setCarregando(false)
    }
    carregar()
  }, [usuario.id])

  if (carregando) return <Loader texto="Carregando histórico..." />

  return (
    <>
      <h2 className="mb-3">Histórico de Apostas</h2>

      {apostas.length === 0 ? (
        <Alert variant="info">Você ainda não realizou nenhuma aposta.</Alert>
      ) : (
        <Card className="shadow-sm">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th>Evento</th>
                <th>Palpite</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Retorno</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {apostas.map((aposta) => {
                const evento = eventos[aposta.eventoId]
                return (
                  <tr key={aposta.id}>
                    <td>
                      {evento ? `${evento.timeA} x ${evento.timeB}` : 'Evento removido'}
                    </td>
                    <td>{aposta.palpite}</td>
                    <td>R$ {Number(aposta.valor).toFixed(2)}</td>
                    <td><StatusBadge status={aposta.status} /></td>
                    <td className={aposta.status === 'ganha' ? 'text-success fw-bold' : ''}>
                      R$ {Number(aposta.retorno).toFixed(2)}
                    </td>
                    <td>{aposta.data ? new Date(aposta.data).toLocaleDateString('pt-BR') : '-'}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Card>
      )}
    </>
  )
}
