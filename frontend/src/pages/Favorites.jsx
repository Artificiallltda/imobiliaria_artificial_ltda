// src/pages/Favorites.jsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { favoritesMock } from "../mocks/favoritesMock.jsx";
import { Button, Card, Modal, StatusTag, useToast } from "../components/ui/index.js";

// TODO - Substituir dados mockados futuramente pela API
// TODO - Persistir favoritos no backend
// TODO - Integrar atalho de contato com chat

export default function Favorites() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // TODO - Substituir dados mockados futuramente pela API
  // Esses dados estão sendo usados apenas para desenvolvimento do frontend
  const [favorites, setFavorites] = useState(favoritesMock);

  const [contactOpen, setContactOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const total = useMemo(() => favorites.length, [favorites]);

  const handleContact = (property) => {
    setSelected(property);
    setContactOpen(true);
  };

  const handleRemove = (id) => {
    // TODO - Persistir favoritos no backend
    setFavorites((prev) => prev.filter((p) => p.id !== id));
    toast({ type: "success", message: "Removido dos favoritos (mock)." });
  };

  const goToProperties = () => {
    // Se você tiver uma rota real de imóveis, troque para ela.
    // Hoje no seu App existe "/imoveis".
    navigate("/imoveis");
  };

  return (
    <div className="page">
      <div className="favorites-header">
        <div>
          <h2>Favoritos</h2>
          <p className="muted">Imóveis salvos para você retomar depois (mock).</p>
        </div>

        <span className="results-pill">{total} favorito(s)</span>
      </div>

      {favorites.length === 0 ? (
        <Card className="favorites-empty" variant="flat">
          <h3>Nenhum favorito ainda</h3>
          <p className="muted">
            Salve imóveis para acessar rapidamente depois.
          </p>

          <div className="favorites-empty-actions">
            <Button onClick={goToProperties}>Ver lista de imóveis</Button>
          </div>
        </Card>
      ) : (
        <div className="favorites-grid">
          {favorites.map((p) => (
            <Card key={p.id} className="fav-card" variant="flat">
              <div className="fav-cover">
                <div className="fav-cover-placeholder" />
                <StatusPill status={p.status} />
              </div>

              <div className="fav-content">
                <div className="fav-top">
                  <div>
                    <div className="fav-title">{p.title}</div>
                    <div className="fav-sub">{p.location}</div>
                  </div>

                  <div className="fav-id">{p.id}</div>
                </div>

                <div className="fav-price">{p.price}</div>

                <div className="fav-actions">
                  <Button variant="outline" onClick={() => handleRemove(p.id)}>
                    Remover
                  </Button>

                  <Button onClick={() => handleContact(p)}>
                    Falar com corretor
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={contactOpen}
        title="Contato"
        onClose={() => setContactOpen(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setContactOpen(false)}>
              Fechar
            </Button>
            <Button
              onClick={() => {
                // TODO - Integrar atalho de contato com chat
                setContactOpen(false);
                toast({
                  type: "warning",
                  message: "Atalho de contato acionado (mock).",
                });

                // Se quiser, pode navegar direto para mensagens:
                // navigate("/mensagens");
              }}
            >
              Iniciar conversa
            </Button>
          </>
        }
      >
        <div className="favorites-modal">
          <p>
            Você está prestes a iniciar contato sobre:
          </p>

          <div className="favorites-modal-card">
            <div className="fav-title">{selected?.title}</div>
            <div className="fav-sub">{selected?.location}</div>
            <div className="fav-price">{selected?.price}</div>
          </div>

          <p className="muted" style={{ marginTop: 10 }}>
            *Sem tempo real nesta etapa. No futuro isso abrirá o chat com o corretor.
          </p>
        </div>
      </Modal>
    </div>
  );
}

function StatusPill({ status }) {
  // usa seu StatusTag do design system (caso ele já estilize)
  // se o seu StatusTag não tiver variações por texto, ele ainda serve como “badge”
  const dsStatus =
    status === "Ativo" ? "active" : status === "Reservado" ? "pending" : "inactive";

  return (
    <StatusTag status={dsStatus} className="fav-badge">
      {status}
    </StatusTag>
  );
}
