export const formatPriceBRL = (price) => {
  const value = Number(price ?? 0);
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const getStatusLabel = (status) => {
  const map = {
    AVAILABLE: "Disponível",
    RESERVED: "Reservado",
    SOLD: "Vendido",
  };
  return map[status] || status || "-";
};

export const getStatusTone = (status) => {
  const map = {
    AVAILABLE: "active",
    RESERVED: "pending",
    SOLD: "inactive",
  };
  return map[status] || "default";
};
