import { useState, useEffect } from 'react'
import { Card, Table } from 'react-bootstrap'
import { listarJogadores } from '../../services/usuarios.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import Loader from '../../components/Loader.jsx'
import EmptyState from '../../components/EmptyState.jsx'

// EXTRA: ranking de jogadores ordenado pelo saldo ficticio.
export default function Ranking() {
  const { usuario } = useAuth()
  const [jogadores, setJogadores] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function carregar() {
      const lista = await listarJogadores()
      lista.sort((a, b) => b.saldo - a.saldo)
      setJogadores(lista)
      setCarregando(false)
    }
    carregar()
  }, [])

  if (carregando) return <Loader texto="Carregando ranking..." />

  const medalhas = ['🥇', '🥈', '🥉']

  return (
    <>
      <div className="page-header">
        <h2>Ranking de <span className="page-title-accent">Jogadores</span></h2>
        <p className="text-muted mb-0">Classificação pelo saldo fictício acumulado.</p>
      </div>

      {jogadores.length === 0 ? (
        <EmptyState emoji="🏆" titulo="Sem jogadores" descricao="Nenhum jogador cadastrado ainda." />
      ) : (
        <Card className="border-2 border-success rounded-0 shadow-sm">
          <Table responsive hover className="mb-0 align-middle text-center ">
            <thead className="table-dark">
              <tr>
                <th>Posição</th>
                <th className="text-start">Jogador</th>
                <th>Bônus</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {jogadores.map((jogador, indice) => (
                <tr
                  key={jogador.id}
                  className={jogador.id === usuario.id ? 'table-success' : ''}
                >
                  <td className="fs-5">{medalhas[indice] || indice + 1}</td>
                  <td className="text-start">
                    {jogador.nome}
                    {jogador.id === usuario.id && (
                      <span className="badge bg-success ms-2">você</span>
                    )}
                  </td>
                  <td className="text-info small">R$ {Number(jogador.bonus || 0).toFixed(2)}</td>
                  <td className="fw-bold">R$ {Number(jogador.saldo).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </>
  )
}
