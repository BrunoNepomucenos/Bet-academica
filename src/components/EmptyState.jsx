// Estado vazio reutilizavel: emoji (string ou component), titulo e (opcional) acao.
export default function EmptyState({ emoji = '📭', titulo, descricao, children }) {
  return (
    <div className="empty-state">
      <span className="empty-emoji">
        {typeof emoji === 'string' ? emoji : emoji}
      </span>
      {titulo && <h5 className="mb-1">{titulo}</h5>}
      {descricao && <p className="mb-3">{descricao}</p>}
      {children}
    </div>
  )
}
