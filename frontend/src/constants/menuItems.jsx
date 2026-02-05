// src/constants/menuItems.jsx
import {
  LayoutDashboard,
  Heart,
  MessageSquareText,
  Building2,
  Star,
  SlidersHorizontal,
} from "lucide-react";

export const MENU_PRINCIPAL = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Lista de Favoritos", to: "/favoritos", icon: Heart },
  { label: "Mensagens", to: "/mensagens", icon: MessageSquareText },
];

export const MEUS_IMOVEIS = [
  { label: "Lista de Imóveis", to: "/imoveis", icon: Building2 },
  { label: "Meus Favoritos", to: "/meus-favoritos", icon: Star },
  { label: "Personalizar", to: "/personalizar", icon: SlidersHorizontal },
];
