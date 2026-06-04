import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormMessage from "../components/FormMessage";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { cadastrarServicoTI } from "../services/api";
import { validarServicoTI } from "../utils/validacoes";

export default function CadastroServicoPage() {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [prazoDias, setPrazoDias] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [carregando, setCarregando] = useState(false);

  function limpar() {
    setNome("");
    setPreco("");
    setPrazoDias("");
    setMsg("");
    setOk(false);
  }

  async function incluir() {
    const erro = validarServicoTI({ nome, preco, prazoDias });
    if (erro) {
      setMsg(erro);
      setOk(false);
      return;
    }

    setCarregando(true);
    setMsg("");
    try {
      const res = await cadastrarServicoTI({
        nome: nome.trim(),
        preco: Number(String(preco).replace(",", ".")),
        prazoDias: parseInt(prazoDias, 10),
      });
      if (!res.sucesso) {
        setMsg(res.mensagem || "Erro ao cadastrar serviço.");
        setOk(false);
        return;
      }
      setMsg("Serviço de TI cadastrado com sucesso.");
      setOk(true);
      limpar();
    } catch {
      setMsg("Não foi possível conectar ao servidor.");
      setOk(false);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <SiteHeader tagline="Cadastro de serviços de TI" />
      <main className="conteudo-pagina">
        <h1>Cadastro de serviço de TI</h1>
        <div className="form-card form-card--larga">
          <p>
            Inclua um novo item no catálogo utilizado na página de solicitações. Todos os campos são obrigatórios. A
            chave primária é gerada automaticamente pelo servidor (autoincremento).
          </p>
          <form onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="s-nome">Nome do serviço</label>
            <input
              type="text"
              id="s-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Suporte gerenciado — estações de trabalho (mensal)"
            />

            <label htmlFor="s-preco">Preço de referência (R$)</label>
            <input
              type="text"
              id="s-preco"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              inputMode="decimal"
              placeholder="Ex.: 120.00"
            />

            <label htmlFor="s-prazo">Prazo em dias úteis</label>
            <input
              type="number"
              id="s-prazo"
              min="1"
              value={prazoDias}
              onChange={(e) => setPrazoDias(e.target.value)}
              placeholder="Ex.: 2"
            />

            <FormMessage texto={msg} ok={ok} />

            <div className="botoes-linha">
              <button type="button" className="btn btn-primario" onClick={incluir} disabled={carregando}>
                {carregando ? "Salvando…" : "Cadastrar serviço"}
              </button>
              <button type="button" className="btn btn-secundario" onClick={limpar}>
                Limpar
              </button>
              <button type="button" className="btn btn-secundario" onClick={() => navigate("/solicitacao-servicos")}>
                Ir para solicitações
              </button>
            </div>
          </form>
          <p>
            <Link to="/">← Site institucional</Link>
          </p>
        </div>
      </main>
      <SiteFooter variant="simple" />
    </>
  );
}
