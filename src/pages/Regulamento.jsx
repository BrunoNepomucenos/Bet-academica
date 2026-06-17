import { Scroll, TriangleAlert } from "lucide-react";
import { Card, Accordion, Alert } from 'react-bootstrap'

// EXTRA: pagina de regulamento da plataforma (regras de negocio do sistema).
const REGRAS = [
  {
    titulo: '1. Natureza acadêmica',
    texto:
      'A Bet Acadêmica é uma plataforma 100% fictícia, criada para fins educacionais. Não há dinheiro real, PIX, cartão, gateway de pagamento, criptomoedas ou integração com sites reais de apostas. Todos os valores são simulados.',
  },
  {
    titulo: '2. Perfis de acesso',
    texto:
      'Existem dois perfis: Administrador (cadastra eventos, encerra apostas, lança resultados e concede bônus) e Jogador (visualiza eventos, aposta, acompanha saldo, histórico e ranking). O usuário comum não acessa funções administrativas e o administrador não realiza apostas.',
  },
  {
    titulo: '3. Apostas',
    texto:
      'Apostas só podem ser feitas em eventos com status "aberto". O valor apostado não pode ultrapassar o saldo disponível. Ao apostar, o saldo é debitado e a aposta entra como "pendente".',
  },
  {
    titulo: '4. Encerramento e resultado',
    texto:
      'O administrador pode encerrar as apostas de um evento (bloqueando novas apostas). Ao lançar o resultado, cada aposta pendente é avaliada: palpite correto vira "ganha" (retorno = valor × odd, creditado no saldo) e palpite incorreto vira "perdida".',
  },
  {
    titulo: '5. Cancelamento',
    texto:
      'O jogador pode cancelar uma aposta pendente enquanto o evento ainda estiver aberto. O valor é estornado integralmente ao saldo e a aposta passa a "cancelada".',
  },
  {
    titulo: '6. Bônus e recargas',
    texto:
      'Novos jogadores recebem um bônus de boas-vindas fictício. O administrador pode conceder bônus adicionais. O jogador também pode recarregar saldo fictício pela carteira. Todas as movimentações ficam registradas no extrato.',
  },
]

export default function Regulamento() {
  return (
    <>
      <div className="page-header">
        
        <h2><Scroll size={50} color='#cc7d0f'/> Regulamento da <span className="page-title-accent">Plataforma</span></h2>
        <p className="text-muted mb-0">Regras de funcionamento da Bet Acadêmica.</p>
      </div>

      <Alert variant="warning">
        <strong> <TriangleAlert size={25} color='#cc7d0f' /> Aviso:</strong> esta é uma simulação acadêmica. Nenhum valor é real.
      </Alert>

      <Card className="shadow-sm">
        <Accordion defaultActiveKey="0" flush>
          {REGRAS.map((regra, i) => (
            <Accordion.Item eventKey={String(i)} key={regra.titulo}>
              <Accordion.Header>{regra.titulo}</Accordion.Header>
              <Accordion.Body className="text-muted">{regra.texto}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Card>
    </>
  )
}
