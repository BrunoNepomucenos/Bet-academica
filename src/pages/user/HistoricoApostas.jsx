import { useState, useEffect, useMemo } from "react";
import { Table, Card, Button, Form, InputGroup } from "react-bootstrap";
import {
  listarApostasPorUsuario,
  atualizarAposta,
  registrarMovimentacao,
} from "../../services/apostas.js";
import { listarEventos } from "../../services/eventos.js";
import { atualizarUsuario } from "../../services/usuarios.js";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useToast } from "../../contexts/ToastContext.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import Loader from "../../components/Loader.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import ConfirmModal from "../../components/ConfirmModal.jsx";

const FILTROS = [
  { id: "todos", rotulo: "Todas" },
  { id: "pendente", rotulo: "Pendentes" },
  { id: "ganha", rotulo: "Ganhas" },
  { id: "perdida", rotulo: "Perdidas" },
  { id: "cancelada", rotulo: "Canceladas" },
];

// Historico de apostas do jogador, com filtros, busca e cancelamento de pendentes.
export default function HistoricoApostas() {
  const { usuario, atualizarUsuario: atualizarSessao } = useAuth();
  const { notificar } = useToast();
  const [apostas, setApostas] = useState([]);
  const [eventos, setEventos] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [busca, setBusca] = useState("");
  const [apostaCancelar, setApostaCancelar] = useState(null);

  useEffect(() => {
    carregar();
  }, [usuario.id]);

  async function carregar() {
    setCarregando(true);
    const [listaApostas, listaEventos] = await Promise.all([
      listarApostasPorUsuario(usuario.id),
      listarEventos(),
    ]);
    const mapa = {};
    listaEventos.forEach((e) => {
      mapa[e.id] = e;
    });
    setEventos(mapa);
    setApostas(listaApostas.reverse());
    setCarregando(false);
  }

  // Aposta pode ser cancelada se estiver pendente e o evento ainda estiver aberto.
  function podeCancelar(aposta) {
    const evento = eventos[aposta.eventoId];
    return aposta.status === "pendente" && evento?.status === "aberto";
  }

  async function confirmarCancelamento() {
    const aposta = apostaCancelar;
    try {
      const novoSaldo = Number(usuario.saldo) + Number(aposta.valor);
      await atualizarAposta(aposta.id, { status: "cancelada" });
      await atualizarUsuario(usuario.id, { saldo: novoSaldo });
      await registrarMovimentacao({
        usuarioId: usuario.id,
        tipo: "estorno",
        valor: Number(aposta.valor),
        descricao: "Estorno por cancelamento de aposta",
        data: new Date().toISOString().slice(0, 10),
      });
      atualizarSessao({ saldo: novoSaldo });
      notificar("Aposta cancelada e valor estornado!", "success");
      setApostaCancelar(null);
      carregar();
    } catch {
      notificar("Erro ao cancelar a aposta.", "danger");
    }
  }

  const apostasFiltradas = useMemo(() => {
    return apostas.filter((a) => {
      const evento = eventos[a.eventoId];
      const nome = evento ? `${evento.timeA} ${evento.timeB}` : "";
      const casaFiltro = filtro === "todos" || a.status === filtro;
      const casaBusca =
        !busca ||
        nome.toLowerCase().includes(busca.toLowerCase()) ||
        a.palpite.toLowerCase().includes(busca.toLowerCase());
      return casaFiltro && casaBusca;
    });
  }, [apostas, eventos, filtro, busca]);

  if (carregando) return <Loader texto="Carregando histórico..." />;

  return (
    <>
      <div className="page-header">
        <h2>
          Histórico de <span className="page-title-accent">Apostas</span>
        </h2>
        <p className="text-muted mb-0">
          Acompanhe o status de todas as suas apostas.
        </p>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-3">
        <div className="d-flex flex-wrap gap-2">
          {FILTROS.map((f) => (
            <span
              key={f.id}
              className={`chip ${filtro === f.id ? "active" : ""}`}
              onClick={() => setFiltro(f.id)}
            >
              {f.rotulo}
            </span>
          ))}
        </div>
        <InputGroup className="w-100 w-md-auto" style={{ maxWidth: 280 }}>
          <InputGroup.Text>🔎</InputGroup.Text>
          <Form.Control
            placeholder="Buscar evento ou palpite"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </InputGroup>
      </div>

      {apostasFiltradas.length === 0 ? (
        <Card className="shadow-sm">
          <EmptyState
            emoji="🎲"
            titulo="Nenhuma aposta encontrada"
            descricao="Ajuste os filtros ou faça sua primeira aposta."
          />
        </Card>
      ) : (
        <Card className="shadow-sm">
          <Table responsive hover className="mb-0 align-middle">
            <thead className="table-dark">
              <tr>
                <th>Evento</th>
                <th>Palpite</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Retorno</th>
                <th>Data</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {apostasFiltradas.map((aposta) => {
                const evento = eventos[aposta.eventoId];
                return (
                  <tr key={aposta.id}>
                    <td>
                      {evento
                        ? `${evento.timeA} × ${evento.timeB}`
                        : "Evento removido"}
                    </td>
                    <td>{aposta.palpite}</td>
                    <td>R$ {Number(aposta.valor).toFixed(2)}</td>
                    <td>
                      <StatusBadge status={aposta.status} />
                    </td>
                    <td
                      className={
                        aposta.status === "ganha" ? "text-success fw-bold" : ""
                      }
                    >
                      R$ {Number(aposta.retorno).toFixed(2)}
                    </td>
                    <td>
                      {aposta.data
                        ? new Date(aposta.data).toLocaleDateString("pt-BR")
                        : "-"}
                    </td>
                    <td className="text-end">
                      {podeCancelar(aposta) ? (
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => setApostaCancelar(aposta)}
                        >
                          Cancelar
                        </Button>
                      ) : (
                        <span className="text-muted small">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      )}

      <ConfirmModal
        show={!!apostaCancelar}
        titulo="Cancelar aposta"
        mensagem={
          apostaCancelar
            ? `Deseja cancelar esta aposta? O valor de R$ ${Number(apostaCancelar.valor).toFixed(2)} será estornado ao seu saldo.`
            : ""
        }
        textoConfirmar="Sim, cancelar"
        onConfirmar={confirmarCancelamento}
        onHide={() => setApostaCancelar(null)}
      />
    </>
  );
}
