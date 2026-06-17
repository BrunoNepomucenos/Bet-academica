import {Joystick, TriangleAlert} from "lucide-react";
export default function Footer() {
  return (
    <footer className="bet-footer mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-center">
        <span>
          <Joystick size={25} color='#00a870' /> <strong>Bet Acadêmica</strong> — projeto acadêmico em React
        </span>
        <span className="small">
          <TriangleAlert size={25} color='#cc7d0f' /> Plataforma 100% fictícia · sem dinheiro real, PIX ou cartão · uso educacional
        </span>
        <span className="small">
          👨‍💻 Criado por <strong>Bruno Souza</strong> e <strong>Cícero Gomes</strong> · © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}
