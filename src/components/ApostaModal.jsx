import { useState, useEffect } from 'react'
import { Modal, Button, Form, ToggleButton, ButtonGroup, Alert } from 'react-bootstrap'

// Modal de aposta reutilizavel. Recebe o evento e o saldo, valida e devolve
// o palpite + valor para a tela pai processar (debito de saldo, criacao da aposta).
export default function ApostaModal({ evento, saldo, show, onHide, onConfirmar }) {
  const [palpite, setPalpite] = useState('')
  const [valor, setValor] = useState('')
  const [erro, setErro] = useState('')

  // Reinicia o formulario sempre que abre para um novo evento.
  useEffect(() => {
    if (evento) {
      setPalpite(evento.timeA)
      setValor('')
      setErro('')
    }
  }, [evento])

  if (!evento) return null

  const valorNumerico = Number(valor)
  const odd = palpite === evento.timeA ? evento.oddA : evento.oddB
  const retornoPotencial = valorNumerico > 0 ? (valorNumerico * odd).toFixed(2) : '0.00'

  function confirmar() {
    // Validacoes basicas de saldo e valor.
    if (!valorNumerico || valorNumerico <= 0) {
      setErro('Informe um valor de aposta valido.')
      return
    }
    if (valorNumerico > saldo) {
      setErro('Saldo insuficiente para esta aposta.')
      return
    }
    onConfirmar({ palpite, valor: valorNumerico, odd })
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {evento.timeA} x {evento.timeB}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {erro && <Alert variant="danger">{erro}</Alert>}

        <Form.Label className="fw-semibold">Quem vai vencer?</Form.Label>
        <div className="mb-3">
          <ButtonGroup className="w-100">
            {[evento.timeA, evento.timeB].map((time) => (
              <ToggleButton
                key={time}
                id={`palpite-${time}`}
                type="radio"
                variant="outline-success"
                name="palpite"
                value={time}
                checked={palpite === time}
                onChange={(e) => setPalpite(e.currentTarget.value)}
              >
                {time}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Valor da aposta (R$)</Form.Label>
          <Form.Control
            type="number"
            min="1"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ex.: 100"
          />
          <Form.Text className="text-muted">
            Saldo disponível: R$ {Number(saldo).toFixed(2)}
          </Form.Text>
        </Form.Group>

        <Alert variant="light" className="border mb-0">
          Odd: <strong>{odd}</strong> &middot; Retorno potencial:{' '}
          <strong className="text-success">R$ {retornoPotencial}</strong>
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="success" onClick={confirmar}>
          Confirmar aposta
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
