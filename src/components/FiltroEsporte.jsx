import { Form } from 'react-bootstrap'

// EXTRA: filtro de eventos por esporte. Componente controlado e reutilizavel.
export default function FiltroEsporte({ esportes, valor, onChange }) {
  return (
    <Form.Group className="mb-3" style={{ maxWidth: 280 }}>
      <Form.Label className="fw-semibold">Filtrar por esporte</Form.Label>
      <Form.Select value={valor} onChange={(e) => onChange(e.target.value)}>
        <option value="todos">Todos os esportes</option>
        {esportes.map((esporte) => (
          <option key={esporte} value={esporte}>
            {esporte}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  )
}
