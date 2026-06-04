import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormMessage from "../components/FormMessage";
import PoliticaSenha from "../components/PoliticaSenha";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { trocarSenha } from "../services/api";
import { validarEmailLogin, validarParSenhas } from "../utils/validacoes";

export default function TrocarSenhaPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [conf, setConf] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [carregando, setCarregando] = useState(false);

  function limpar() {
    setLogin("");
    setSenhaAtual("");
    setNovaSenha("");
    setConf("");
    setMsg("");
    setOk(false);
  }

  async function realizarTroca() {
    const eLogin = validarEmailLogin(login);
    if (eLogin) {
      setMsg(eLogin);
      setOk(false);
      return;
    }
    if (!senhaAtual) {
      setMsg("Informe a senha atual.");
      setOk(false);
      return;
    }
    const eSenha = validarParSenhas(novaSenha, conf);
    if (eSenha) {
      setMsg(eSenha);
      setOk(false);
      return;
    }

    setCarregando(true);
    setMsg("");
    try {
      const res = await trocarSenha(login.trim(), senhaAtual, novaSenha);
      if (!res.sucesso) {
        setMsg(res.mensagem || "Não foi possível trocar a senha.");
        setOk(false);
        return;
      }
      setMsg("Senha alterada com sucesso.");
      setOk(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch {
      setMsg("Não foi possível conectar ao servidor.");
      setOk(false);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="conteudo-pagina">
        <h1>Troca de senha de clientes</h1>
        <div className="form-card">
          <p>
            Utilize o mesmo e-mail cadastrado como login e informe a senha atual. Após a validação, você retornará ao
            login.
          </p>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="t-login">Login (e-mail)</label>
            <input
              type="text"
              id="t-login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              inputMode="email"
              autoComplete="username"
            />

            <label htmlFor="t-senha-atual">Senha atual</label>
            <input
              type="password"
              id="t-senha-atual"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              autoComplete="current-password"
            />

            <label htmlFor="t-senha">Nova senha</label>
            <input
              type="password"
              id="t-senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              autoComplete="new-password"
            />

            <label htmlFor="t-conf">Confirmação da senha</label>
            <input
              type="password"
              id="t-conf"
              value={conf}
              onChange={(e) => setConf(e.target.value)}
              autoComplete="new-password"
            />

            <PoliticaSenha />
            <FormMessage texto={msg} ok={ok} />

            <div className="botoes-linha">
              <button type="button" className="btn btn-primario" onClick={realizarTroca} disabled={carregando}>
                {carregando ? "Processando…" : "Troca Senha"}
              </button>
              <button type="button" className="btn btn-secundario" onClick={limpar}>
                Limpar
              </button>
            </div>
          </form>
          <p>
            <Link to="/login">← Voltar ao login</Link>
          </p>
        </div>
      </main>
      <SiteFooter variant="simple" />
    </>
  );
}
