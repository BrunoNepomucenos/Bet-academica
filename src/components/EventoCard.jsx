import { Card, Button, Row, Col } from 'react-bootstrap'
import StatusBadge from './StatusBadge.jsx'

// Card reutilizavel de evento. Usado na tela do jogador.
// onApostar so e exibido quando o evento esta aberto.
export default function EventoCard({ evento, onApostar }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="badge bg-light text-dark border">{evento.esporte}</span>
          <StatusBadge status={evento.status} />
        </div>

        <Card.Title className="text-center my-2">
          {evento.timeA} <span className="text-muted">x</span> {evento.timeB}
        </Card.Title>

        <Row className="text-center small text-muted mb-2">
          <Col>Odd {evento.timeA}: <strong>{evento.oddA}</strong></Col>
          <Col>Odd {evento.timeB}: <strong>{evento.oddB}</strong></Col>
        </Row>

        <p className="text-center text-muted small mb-3">
          Data: {new Date(evento.data).toLocaleDateString('pt-BR')}
        </p>

        {evento.resultado && (
          <p className="text-center fw-bold text-success mb-3">
            Vencedor: {evento.resultado}
          </p>
        )}

        <div className="mt-auto">
          {evento.status === 'aberto' ? (
            <Button variant="success" className="w-100" onClick={() => onApostar(evento)}>
              Apostar
            </Button>
          ) : (
            <Button variant="secondary" className="w-100" disabled>
              {evento.status === 'encerrado' ? 'Apostas encerradas' : 'Evento finalizado'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
