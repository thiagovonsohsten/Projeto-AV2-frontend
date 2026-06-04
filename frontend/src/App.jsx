import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import CadastroPage from "./pages/CadastroPage";
import CadastroServicoPage from "./pages/CadastroServicoPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SolicitacaoServicosPage from "./pages/SolicitacaoServicosPage";
import TrocarSenhaPage from "./pages/TrocarSenhaPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<CadastroPage />} />
          <Route path="/trocar-senha" element={<TrocarSenhaPage />} />
          <Route path="/solicitacao-servicos" element={<SolicitacaoServicosPage />} />
          <Route path="/cadastro-servico" element={<CadastroServicoPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
