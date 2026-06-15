import { useState, useEffect } from 'react'
import { Card, Table, Alert } from 'react-bootstrap'
import { listarJogadores } from '../../services/usuarios.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import Loader from '../../components/Loader.jsx'

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
      <h2 className="mb-1">Ranking de Jogadores</h2>
      <p className="text-muted">Classificação pelo saldo fictício acumulado.</p>

      {jogadores.length === 0 ? (
        <Alert variant="info">Nenhum jogador cadastrado.</Alert>
      ) : (
        <Card className="shadow-sm">
          <Table responsive hover className="mb-0 align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>Posição</th>
                <th className="text-start">Jogador</th>
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
