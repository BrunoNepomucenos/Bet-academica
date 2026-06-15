import { Spinner } from 'react-bootstrap'

// Indicador de carregamento reutilizavel.
export default function Loader({ texto = 'Carregando...' }) {
  return (
    <div className="text-center py-5">
      <Spinner animation="border" variant="success" />
      <p className="mt-2 text-muted">{texto}</p>
    </div>
  )
}
