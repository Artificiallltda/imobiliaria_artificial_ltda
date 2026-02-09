// src/components/ui/Leads/StatusTag.jsx

// Componente específico para exibir status de Leads
export default function StatusTag({ status }) {
  const map = {
    "Novo": "novo",
    "Em contato": "contato",
    "Convertido": "convertido",
    "Perdido": "perdido",
  };

  const cls = map[status] || "novo";

  return (
    <span className={`status-tag status-${cls}`}>
      {status}
    </span>
  );
}
