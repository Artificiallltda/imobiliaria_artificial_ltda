// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Sobre from "./pages/Sobre";

function Page({ title }) {
  return (
    <div className="page">
      <h2>{title}</h2>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Menu Principal */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/favoritos" element={<Page title="Lista de Favoritos" />} />
          <Route path="/mensagens" element={<Page title="Mensagens" />} />

          {/* Meus Imóveis */}
          <Route path="/imoveis" element={<Page title="Lista de Imóveis" />} />
          <Route path="/meus-favoritos" element={<Page title="Meus Favoritos" />} />
          <Route path="/personalizar" element={<Page title="Personalizar" />} />

          {/* Institucional */}
          <Route path="/sobre" element={<Sobre />} />

          {/* 404 */}
          <Route path="*" element={<Page title="404 - Não encontrado" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
