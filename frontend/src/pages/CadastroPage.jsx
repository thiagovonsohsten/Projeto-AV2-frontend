import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormMessage from "../components/FormMessage";
import PoliticaSenha from "../components/PoliticaSenha";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { cadastrarCliente } from "../services/api";
import {
  aplicarMascaraCPF,
  aplicarMascaraTelefone,
  validarCPF,
  validarDataNasc,
  validarEmailCadastro,
  validarNome,
  validarParSenhas,
  validarTelOpcional,
} from "../utils/validacoes";

export default function CadastroPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [conf, setConf] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [nasc, setNasc] = useState("");
  const [tel, setTel] = useState("");
  const [estadoCivil, setEstadoCivil] = useState("solteiro");
  const [escolaridade, setEscolaridade] = useState("2c");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [carregando, setCarregando] = useState(false);

  function limpar() {
    setEmail("");
    setSenha("");
    setConf("");
    setNome("");
    setCpf("");
    setNasc("");
    setTel("");
    setEstadoCivil("solteiro");
    setEscolaridade("2c");
    setMsg("");
    setOk(false);
  }

  async function incluir() {
    const erro =
      validarEmailCadastro(email) ||
      validarParSenhas(senha, conf) ||
      validarNome(nome) ||
      validarCPF(cpf) ||
      validarDataNasc(nasc) ||
      validarTelOpcional(tel);
    if (erro) {
      setMsg(erro);
      setOk(false);
      return;
    }

    setCarregando(true);
    setMsg("");
    try {
      const res = await cadastrarCliente({
        login: email.trim(),
        senha,
        nome,
        cpf,
        dataNascimento: nasc,
        telefone: tel,
        estadoCivil,
        escolaridade,
      });
      if (!res.sucesso) {
        setMsg(res.mensagem || "Erro ao cadastrar.");
        setOk(false);
        return;
      }
      setMsg("Cadastro realizado com sucesso. Você já pode fazer login.");
      setOk(true);
      setTimeout(() => navigate("/login"), 1500);
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
        <h1>Cadastro de clientes</h1>
        <div className="form-card form-card--larga">
          <p>
            Formulário para abertura de cadastro no portal. Os dados serão utilizados apenas para identificação
            contratual, faturamento e comunicações operacionais, conforme nossa política de privacidade e a LGPD.
          </p>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="c-email">E-mail (login)</label>
            <input type="text" id="c-email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="c-senha">Senha</label>
            <input
              type="password"
              id="c-senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="new-password"
            />

            <label htmlFor="c-conf">Confirmação de senha</label>
            <input
              type="password"
              id="c-conf"
              value={conf}
              onChange={(e) => setConf(e.target.value)}
              autoComplete="new-password"
            />

            <PoliticaSenha />

            <label htmlFor="c-nome">Nome completo</label>
            <input type="text" id="c-nome" value={nome} onChange={(e) => setNome(e.target.value)} />

            <label htmlFor="c-cpf">CPF</label>
            <input
              type="text"
              id="c-cpf"
              value={cpf}
              onChange={(e) => setCpf(aplicarMascaraCPF(e.target.value))}
              maxLength={14}
            />

            <label htmlFor="c-nasc">Data de nascimento</label>
            <input type="date" id="c-nasc" value={nasc} onChange={(e) => setNasc(e.target.value)} />

            <label htmlFor="c-tel">Telefone celular / WhatsApp (opcional)</label>
            <input
              type="tel"
              id="c-tel"
              value={tel}
              onChange={(e) => setTel(aplicarMascaraTelefone(e.target.value))}
              maxLength={16}
            />

            <div className="radio-linha">
              <span>Estado civil:</span>
              <br />
              <label>
                <input
                  type="radio"
                  name="ec"
                  value="solteiro"
                  checked={estadoCivil === "solteiro"}
                  onChange={() => setEstadoCivil("solteiro")}
                />{" "}
                Solteiro(a)
              </label>
              <label>
                <input
                  type="radio"
                  name="ec"
                  value="casado"
                  checked={estadoCivil === "casado"}
                  onChange={() => setEstadoCivil("casado")}
                />{" "}
                Casado(a)
              </label>
              <label>
                <input
                  type="radio"
                  name="ec"
                  value="divorciado"
                  checked={estadoCivil === "divorciado"}
                  onChange={() => setEstadoCivil("divorciado")}
                />{" "}
                Divorciado(a)
              </label>
              <label>
                <input
                  type="radio"
                  name="ec"
                  value="viuvo"
                  checked={estadoCivil === "viuvo"}
                  onChange={() => setEstadoCivil("viuvo")}
                />{" "}
                Viúvo(a)
              </label>
            </div>

            <label htmlFor="c-esc">Escolaridade</label>
            <select id="c-esc" value={escolaridade} onChange={(e) => setEscolaridade(e.target.value)}>
              <option value="1i">1º grau incompleto</option>
              <option value="1c">1º grau completo</option>
              <option value="2c">2º grau completo</option>
              <option value="sup">Nível superior</option>
              <option value="pos">Pós-graduado</option>
            </select>

            <FormMessage texto={msg} ok={ok} />

            <div className="botoes-linha">
              <button type="button" className="btn btn-primario" onClick={incluir} disabled={carregando}>
                {carregando ? "Salvando…" : "Incluir"}
              </button>
              <button type="button" className="btn btn-secundario" onClick={limpar}>
                Limpar
              </button>
              <button type="button" className="btn btn-secundario" onClick={() => navigate(-1)}>
                Voltar
              </button>
            </div>
          </form>
          <p>
            <Link to="/login">Já possuo login</Link> · <Link to="/">Site institucional</Link>
          </p>
        </div>
      </main>
      <SiteFooter variant="simple" />
    </>
  );
}
