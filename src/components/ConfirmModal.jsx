import { Modal, Button } from 'react-bootstrap'

// Modal de confirmacao reutilizavel (ex.: excluir evento, cancelar aposta).
export default function ConfirmModal({
  show,
  titulo = 'Confirmar ação',
  mensagem,
  textoConfirmar = 'Confirmar',
  variantConfirmar = 'danger',
  onConfirmar,
  onHide,
}) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{mensagem}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancelar</Button>
        <Button variant={variantConfirmar} onClick={onConfirmar}>{textoConfirmar}</Button>
      </Modal.Footer>
    </Modal>
  )
}
