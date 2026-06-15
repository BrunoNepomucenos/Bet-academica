import { Card, Button, Row, Col } from 'react-bootstrap'
import StatusBadge from './StatusBadge.jsx'

// Emoji ilustrativo por esporte (apenas visual).
const ICONE_ESPORTE = {
  Futebol: '⚽',
  Basquete: '🏀',
  Vôlei: '🏐',
  Tênis: '🎾',
  'E-Sports': '🎮',
}

// Card reutilizavel de evento. Usado na tela do jogador.
// onApostar so e exibido quando o evento esta aberto.
export default function EventoCard({ evento, onApostar }) {
  const dataFmt = new Date(evento.data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <Card className="evento-card h-100 is-hoverable">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="badge bg-light text-dark border">
            {ICONE_ESPORTE[evento.esporte] || '🏆'} {evento.esporte}
          </span>
          <StatusBadge status={evento.status} />
        </div>

        <Card.Title className="text-center my-2 evento-vs">
          {evento.timeA} <span className="text-muted">×</span> {evento.timeB}
        </Card.Title>

        <Row className="g-2 mb-3">
          <Col xs={6}>
            <div className="odd-box">
              <span className="odd-team">{evento.timeA}</span>
              <span className="odd-value">{Number(evento.oddA).toFixed(2)}</span>
            </div>
          </Col>
          <Col xs={6}>
            <div className="odd-box">
              <span className="odd-team">{evento.timeB}</span>
              <span className="odd-value">{Number(evento.oddB).toFixed(2)}</span>
            </div>
          </Col>
        </Row>

        <p className="text-center text-muted small mb-3">📅 {dataFmt}</p>

        {evento.resultado && (
          <p className="text-center fw-bold text-success mb-3">
            🏆 Vencedor: {evento.resultado}
          </p>
        )}

        <div className="mt-auto">
          {evento.status === 'aberto' ? (
            <Button variant="success" className="w-100" onClick={() => onApostar(evento)}>
              💸 Apostar
            </Button>
          ) : (
            <Button variant="secondary" className="w-100" disabled>
              {evento.status === 'encerrado' ? '🔒 Apostas encerradas' : '✅ Evento finalizado'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
