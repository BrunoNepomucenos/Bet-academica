import { Badge } from 'react-bootstrap'

// Mapeia cada status (de evento ou aposta) para uma cor do Bootstrap.
const cores = {
  aberto: 'success',
  encerrado: 'warning',
  finalizado: 'secondary',
  pendente: 'info',
  ganha: 'success',
  perdida: 'danger',
  cancelada: 'secondary',
}

const rotulos = {
  aberto: '🟢 Aberto',
  encerrado: '🔒 Apostas encerradas',
  finalizado: '🏁 Finalizado',
  pendente: '⏳ Pendente',
  ganha: '✅ Ganha',
  perdida: '❌ Perdida',
  cancelada: '↩️ Cancelada',
}

// Componente reutilizavel usado nas telas de eventos e apostas.
export default function StatusBadge({ status }) {
  return <Badge bg={cores[status] || 'light'}>{rotulos[status] || status}</Badge>
}
