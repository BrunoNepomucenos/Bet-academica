// Rodape simples e reutilizavel com aviso academico (sem dinheiro real).
export default function Footer() {
  return (
    <footer className="bet-footer mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-center">
        <span>
          🎯 <strong>Bet Acadêmica</strong> — projeto acadêmico em React
        </span>
        <span className="small">
          ⚠️ Plataforma 100% fictícia · sem dinheiro real, PIX ou cartão · uso educacional
        </span>
        <span className="small">© {new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
