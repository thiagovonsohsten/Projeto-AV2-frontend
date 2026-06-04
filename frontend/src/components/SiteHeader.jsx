import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function SiteHeader({ tagline, showNav = false, homeBrand = false }) {
  const { isLoggedIn } = useAuth();

  return (
    <header className="site-header">
      <div className="logo-wrap">
        <Link to="/">
          <img src="/assets/img/logo.svg" alt="Logo TechServ Soluções" width="120" height="48" />
        </Link>
        {homeBrand ? (
          <div>
            <h1 className="titulo-marca-header">TechServ Soluções</h1>
            {tagline && <p className="tagline">{tagline}</p>}
          </div>
        ) : (
          tagline && <span className="tagline">{tagline}</span>
        )}
      </div>
      {showNav && (
        <nav className="nav-principal" aria-label="Principal">
          <Link to="/login">Área do cliente</Link>
          <Link to="/cadastro">Cadastro</Link>
          <Link to="/cadastro-servico">Cadastrar serviço TI</Link>
          {isLoggedIn && <Link to="/solicitacao-servicos">Solicitações de serviço</Link>}
        </nav>
      )}
    </header>
  );
}
