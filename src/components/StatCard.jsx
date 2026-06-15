import { Card } from 'react-bootstrap'

// Card de estatistica reutilizavel (usado nos dashboards do admin e do jogador).
// gradiente: 'green' | 'purple' | 'blue' | 'dark' | 'amber' | 'red'
const GRADIENTES = {
  green: 'bg-grad-green',
  purple: 'bg-grad-purple',
  blue: 'bg-grad-blue',
  dark: 'bg-grad-dark',
  amber: 'bg-grad-amber',
  red: 'bg-grad-red',
}

export default function StatCard({ label, valor, icone, gradiente = 'green' }) {
  return (
    <Card className={`stat-card is-hoverable h-100 ${GRADIENTES[gradiente] || GRADIENTES.green}`}>
      <Card.Body>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{valor}</div>
        {icone && <span className="stat-icon">{icone}</span>}
      </Card.Body>
    </Card>
  )
}
