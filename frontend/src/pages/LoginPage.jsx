import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormMessage from "../components/FormMessage";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { useAuth } from "../hooks/useAuth";
import { autenticar } from "../services/api";
import { validarLogin } from "../utils/validacoes";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [carregando, setCarregando] = useState(false);

  function limpar() {
    setEmail("");
    setSenha("");
    setMsg("");
    setOk(false);
  }

  async function realizarLogin() {
    const erroValidacao = validarLogin(email, senha);
    if (erroValidacao) {
      setMsg(erroValidacao);
      setOk(false);
      return;
    }

    setCarregando(true);
    setMsg("");
    try {
      const res = await autenticar(email.trim(), senha);
      if (!res.sucesso) {
        setMsg(res.mensagem || "Erro ao autenticar.");
        setOk(false);
        return;
      }
      if (!res.autenticado) {
        setMsg("Login ou senha inválidos.");
        setOk(false);
        return;
      }
      login(email.trim(), email.trim().split("@")[0]);
      setMsg("Login realizado com sucesso.");
      setOk(true);
      navigate("/");
    } catch {
      setMsg("Não foi possível conectar ao servidor. Verifique se o backend está em execução.");
      setOk(false);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <SiteHeader tagline="Portal do cliente" />
      <main className="conteudo-pagina">
        <h1>Login de clientes</h1>
        <div className="form-card">
          <p>
            Acesso restrito a clientes com contrato ou cadastro ativo. Em caso de dúvida, fale com o seu gestor de conta
            ou utilize os canais do site institucional.
          </p>
          <p>
            <Link to="/trocar-senha">Esqueci minha senha · redefinir acesso</Link>
          </p>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="login-email">Login (e-mail)</label>
            <input
              type="text"
              id="login-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
              autoComplete="username"
            />

            <label htmlFor="login-senha">Senha</label>
            <input
              type="password"
              id="login-senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
            />

            <FormMessage texto={msg} ok={ok} />

            <div className="botoes-linha">
              <button type="button" className="btn btn-primario" onClick={realizarLogin} disabled={carregando}>
                {carregando ? "Autenticando…" : "Realizar Login"}
              </button>
              <button type="button" className="btn btn-secundario" onClick={limpar}>
                Limpar
              </button>
            </div>
          </form>
          <p>
            Ainda não é cliente? <Link to="/cadastro">Solicitar cadastro no portal</Link>
          </p>
          <p>
            <Link to="/">← Voltar ao site institucional</Link>
          </p>
        </div>
      </main>
      <SiteFooter variant="simple" />
    </>
  );
}
