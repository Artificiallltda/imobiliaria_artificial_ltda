// src/pages/Leads.jsx
import { useMemo, useState } from "react";
import { leadsMock } from "../mocks/leadsMock.jsx";
import StatusTag from "../components/ui/Leads/StatusTag.jsx";

const STATUS_OPTIONS = ["Todos", "Novo", "Em contato", "Convertido", "Perdido"];

export default function Leads() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");

  // TODO - Substituir dados mockados futuramente pela API
  // Esses dados estão sendo usados apenas para desenvolvimento do frontend
  const leads = leadsMock;

  // TODO - Aplicar filtros e busca via backend quando a API estiver disponível
  // No futuro: enviar query/status para API e receber a lista já filtrada/paginada
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return leads.filter((lead) => {
      const matchText =
        !q ||
        lead.nome?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q);

      const matchStatus = status === "Todos" || lead.status === status;

      return matchText && matchStatus;
    });
  }, [leads, query, status]);

  return (
    <div className="page">
      {/* Cabeçalho */}
      <div className="leads-header">
        <div>
          <h2>Leads</h2>
          <p className="muted">
            Acompanhe o funil de atendimento (dados mockados).
          </p>
        </div>

        <span className="results-pill">
          {filtered.length} resultado(s)
        </span>
      </div>

      {/* Filtros */}
      <section className="panel">
        <div className="leads-controls">
          <div className="control">
            <label>Buscar</label>
            <input
              className="leads-input"
              placeholder="Buscar por nome ou e-mail..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="control">
            <label>Status</label>
            <select
              className="leads-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-outline leads-clear"
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("Todos");
            }}
          >
            Limpar
          </button>
        </div>
      </section>

      {/* Desktop: tabela */}
      <section className="panel leads-table-wrap">
        <div className="leads-table-scroll">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Status</th>
                <th>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id}>
                  <td className="lead-name">
                    <div className="lead-primary">{lead.nome}</div>
                    <div className="lead-secondary">{lead.id}</div>
                  </td>
                  <td>{lead.email}</td>
                  <td>{lead.telefone}</td>
                  <td>
                    <StatusTag status={lead.status}>
                      {lead.status}
                    </StatusTag>
                  </td>
                  <td>{formatDateBR(lead.criadoEm)}</td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="leads-empty">
                    Nenhum lead encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mobile: cards */}
      <section className="leads-cards">
        {filtered.map((lead) => (
          <div key={lead.id} className="lead-card">
            <div className="lead-card-top">
              <div>
                <div className="lead-primary">{lead.nome}</div>
                <div className="lead-secondary">{lead.email}</div>
              </div>
              <StatusTag status={lead.status}>
                {lead.status}
              </StatusTag>
            </div>

            <div className="lead-card-row">
              <span className="lead-k">Telefone</span>
              <span className="lead-v">{lead.telefone}</span>
            </div>

            <div className="lead-card-row">
              <span className="lead-k">Criado em</span>
              <span className="lead-v">{formatDateBR(lead.criadoEm)}</span>
            </div>

            <div className="lead-card-row">
              <span className="lead-k">ID</span>
              <span className="lead-v">{lead.id}</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

function formatDateBR(iso) {
  // YYYY-MM-DD -> DD/MM/YYYY
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
