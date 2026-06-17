import { Button } from 'react-bootstrap'

// Seletor de placar: o usuario monta o resultado que acha que vai acontecer,
// aumentando/diminuindo os gols de cada time. Usado tanto na aposta do jogador
// quanto na apuracao do admin (mesma logica nos dois lados).
//
// Props:
//   timeA, timeB - nomes para rotular cada lado
//   a, b         - gols atuais (numeros)
//   onChange     - (novoA, novoB) => void
//   max          - limite de gols por time (padrao 10)
export default function PlacarPicker({ timeA, timeB, a, b, onChange, max = 10 }) {
  const clamp = (n) => Math.max(0, Math.min(max, n))

  function Coluna({ nome, valor, lado }) {
    const set = (v) =>
      lado === 'a' ? onChange(clamp(v), b) : onChange(a, clamp(v))
    return (
      <div className="text-center">
        <div className="text-muted small text-truncate mb-1" style={{ maxWidth: 120 }}>
          {nome}
        </div>
        <div className="d-flex align-items-center gap-2 justify-content-center">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => set(valor - 1)}
            disabled={valor <= 0}
          >
            −
          </Button>
          <span className="fw-bold fs-3" style={{ minWidth: 28 }}>
            {valor}
          </span>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => set(valor + 1)}
            disabled={valor >= max}
          >
            +
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex align-items-end justify-content-center gap-3">
      <Coluna nome={timeA} valor={a} lado="a" />
      <span className="fw-bold fs-4 text-muted pb-2">×</span>
      <Coluna nome={timeB} valor={b} lado="b" />
    </div>
  )
}
