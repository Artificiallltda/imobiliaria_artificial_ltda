// src/router/index.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "../components/Layout";

// páginas mock (pode trocar pelos seus componentes reais)
const Page = ({ title }) => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    <p className="mt-2 text-gray-600">Conteúdo mockado.</p>
  </div>
);

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },

      { path: "/dashboard", element: <Page title="Dashboard" /> },
      { path: "/favoritos", element: <Page title="Lista de Favoritos" /> },
      { path: "/mensagens", element: <Page title="Mensagens" /> },

      { path: "/imoveis", element: <Page title="Lista de Imóveis" /> },
      { path: "/meus-favoritos", element: <Page title="Meus Favoritos" /> },
      { path: "/personalizar", element: <Page title="Personalizar" /> },

      { path: "*", element: <Page title="404 - Não encontrado" /> },
    ],
  },
]);
