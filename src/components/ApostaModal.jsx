import { useState, useEffect, useMemo } from 'react'
import { Modal, Button, Form, Alert, Badge } from 'react-bootstrap'
import { getMercados } from '../config/mercados.js'

// Modal de aposta reutilizavel e personalizado por esporte.
// O jogador escolhe (1) o MERCADO (area de aposta: placar, gols, cartoes...),
// (2) a OPCAO dentro do mercado (cada uma com sua odd) e (3) o valor.
// Ao confirmar, devolve { mercado, mercadoNome, palpite, odd, valor } para a
// tela pai processar (debito de saldo, criacao da aposta).
export default function ApostaModal({ evento, saldo, show, onHide, onConfirmar }) {
  const [mercadoId, setMercadoId] = useState('vencedor')
  const [palpite, setPalpite] = useState('')
  const [valor, setValor] = useState('')
  const [erro, setErro] = useState('')

  // Mercados disponiveis para o esporte deste evento.
  const mercados = useMemo(() => getMercados(evento), [evento])

  // Reinicia o formulario sempre que abre para um novo evento.
  useEffect(() => {
    if (evento && mercados.length) {
      setMercadoId(mercados[0].id)
      setPalpite(mercados[0].opcoes[0].label)
      setValor('')
      setErro('')
    }
  }, [evento]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!evento || !mercados.length) return null

  const mercadoAtual = mercados.find((m) => m.id === mercadoId) || mercados[0]
  const opcaoAtual =
    mercadoAtual.opcoes.find((o) => o.label === palpite) || mercadoAtual.opcoes[0]
  const odd = opcaoAtual?.odd || 1
  const valorNumerico = Number(valor)
  const retornoPotencial = valorNumerico > 0 ? (valorNumerico * odd).toFixed(2) : '0.00'

  // Troca de mercado: ja seleciona a primeira opcao do novo mercado.
  function selecionarMercado(m) {
    setMercadoId(m.id)
    setPalpite(m.opcoes[0].label)
    setErro('')
  }

  function confirmar() {
    // Validacoes basicas de saldo e valor.
    if (!palpite) {
      setErro('Selecione uma opcao de aposta.')
      return
    }
    if (!valorNumerico || valorNumerico <= 0) {
      setErro('Informe um valor de aposta valido.')
      return
    }
    if (valorNumerico > saldo) {
      setErro('Saldo insuficiente para esta aposta.')
      return
    }
    onConfirmar({
      mercado: mercadoAtual.id,
      mercadoNome: mercadoAtual.nome,
      palpite,
      odd,
      valor: valorNumerico,
    })
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg" scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="d-flex flex-column">
          <span>
            {evento.timeA} <span className="text-muted">×</span> {evento.timeB}
          </span>
          <small className="text-muted fw-normal">
            {evento.esporte} · {mercados.length} mercados de aposta
          </small>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {erro && <Alert variant="danger">{erro}</Alert>}

        {/* 1) Escolha do mercado (area de aposta) */}
        <Form.Label className="fw-semibold mb-2">Mercado de aposta</Form.Label>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {mercados.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`chip ${mercadoId === m.id ? 'active' : ''}`}
              onClick={() => selecionarMercado(m)}
            >
              {m.icone} {m.nome}
            </button>
          ))}
        </div>

        {/* 2) Opcoes do mercado selecionado, cada uma com sua odd */}
        <div className="mb-3">
          <Form.Label className="fw-semibold mb-1">
            {mercadoAtual.icone} {mercadoAtual.nome}
          </Form.Label>
          <p className="text-muted small mb-2">{mercadoAtual.descricao}</p>
          <div className="d-flex flex-wrap gap-2">
            {mercadoAtual.opcoes.map((o) => {
              const ativo = palpite === o.label
              return (
                <button
                  key={o.label}
                  type="button"
                  className={`btn ${ativo ? 'btn-success' : 'btn-outline-success'} d-flex align-items-center gap-2`}
                  onClick={() => setPalpite(o.label)}
                >
                  <span>{o.label}</span>
                  <Badge bg={ativo ? 'light' : 'success'} text={ativo ? 'success' : 'light'}>
                    {Number(o.odd).toFixed(2)}
                  </Badge>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3) Valor da aposta */}
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
          <div className="d-flex justify-content-between">
            <span>Seu palpite:</span>
            <strong>
              {mercadoAtual.nome} → {palpite}
            </strong>
          </div>
          <div className="d-flex justify-content-between">
            <span>Odd:</span>
            <strong>{Number(odd).toFixed(2)}</strong>
          </div>
          <div className="d-flex justify-content-between">
            <span>Retorno potencial:</span>
            <strong className="text-success">R$ {retornoPotencial}</strong>
          </div>
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
