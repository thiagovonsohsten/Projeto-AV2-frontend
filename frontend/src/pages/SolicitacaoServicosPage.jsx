import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import FormMessage from "../components/FormMessage";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import TabelaSolicitacoes from "../components/TabelaSolicitacoes";
import { useAuth } from "../hooks/useAuth";
import { atualizarSolicitacoes, listarServicosTI, listarSolicitacoes } from "../services/api";
import {
  adicionarDiasUteis,
  formatDataBR,
  formatMoney,
  ordenarPorDataPedido,
  proximoNumeroSolicitacao,
} from "../utils/datas";

export default function SolicitacaoServicosPage() {
  const { isLoggedIn, email, name } = useAuth();
  const [servicos, setServicos] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [servicoIdx, setServicoIdx] = useState(0);
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    setMsg("");
    try {
      const [resServicos, resSol] = await Promise.all([listarServicosTI(), listarSolicitacoes(email)]);
      if (!resServicos.sucesso) {
        setMsg(resServicos.mensagem || "Erro ao carregar catálogo.");
        return;
      }
      setServicos(resServicos.servicos || []);
      if (!resSol.sucesso) {
        setMsg(resSol.mensagem || "Erro ao carregar solicitações.");
        setSolicitacoes([]);
        return;
      }
      const lista = ordenarPorDataPedido(
        (resSol.solicitacoes || []).map((s) => ({
          dataPedido: s.dataPedido,
          numeroSolicitacao: s.numeroSolicitacao,
          nomeServico: s.nomeServico,
          status: s.status,
          preco: s.preco,
          dataPrevista: s.dataPrevista,
          servicoId: s.servicoId,
        }))
      );
      setSolicitacoes(lista);
    } catch {
      setMsg("Não foi possível conectar ao servidor.");
    } finally {
      setCarregando(false);
    }
  }, [email]);

  useEffect(() => {
    if (isLoggedIn) carregarDados();
  }, [isLoggedIn, carregarDados]);

  const servicoSelecionado = servicos[servicoIdx] || null;

  const resumo = useMemo(() => {
    if (!servicoSelecionado) return null;
    const hoje = new Date();
    const prev = adicionarDiasUteis(hoje, servicoSelecionado.prazoDias);
    return {
      preco: formatMoney(servicoSelecionado.preco),
      prazo:
        servicoSelecionado.prazoDias +
        " dia(s) úteis (prazo para início da entrega, conforme fila)",
      dataPrevista: formatDataBR(prev),
    };
  }, [servicoSelecionado]);

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  function incluirSolicitacao() {
    if (!servicoSelecionado) return;
    const hoje = new Date();
    const prev = adicionarDiasUteis(hoje, servicoSelecionado.prazoDias);
    const numero = proximoNumeroSolicitacao(solicitacoes);
    const nova = {
      dataPedido: formatDataBR(hoje),
      numeroSolicitacao: `SOL-${numero}`,
      nomeServico: servicoSelecionado.nome,
      status: "Em elaboração",
      preco: servicoSelecionado.preco,
      dataPrevista: formatDataBR(prev),
      servicoId: servicoSelecionado.id,
    };
    setSolicitacoes((prevLista) => ordenarPorDataPedido([...prevLista, nova]));
    setMsg("");
  }

  function excluirLinha(idx) {
    setSolicitacoes((prevLista) => prevLista.filter((_, i) => i !== idx));
  }

  async function salvarNoServidor() {
    setSalvando(true);
    setMsg("");
    setOk(false);
    try {
      const payload = solicitacoes.map((s) => ({
        servicoId: s.servicoId,
        dataPedido: s.dataPedido,
        numeroSolicitacao: s.numeroSolicitacao,
        status: s.status,
        preco: s.preco,
        dataPrevista: s.dataPrevista,
      }));
      const res = await atualizarSolicitacoes(email, payload);
      if (!res.sucesso) {
        setMsg(res.mensagem || "Erro ao salvar solicitações.");
        return;
      }
      setMsg("Solicitações atualizadas com sucesso no servidor.");
      setOk(true);
      await carregarDados();
    } catch {
      setMsg("Não foi possível conectar ao servidor.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <>
      <SiteHeader tagline="Gestão de solicitações de serviço" showNav />

      <main className="conteudo-pagina">
        <h1>Solicitação de serviços de TI</h1>
        <p>
          Registre pedidos de serviço avulso ou recorrente. Valores e prazos são referência de catálogo; a confirmação
          comercial e o agendamento técnico são formalizados pela equipe após análise do chamado.
        </p>

        {carregando ? (
          <p>Carregando catálogo e solicitações…</p>
        ) : (
          <>
            <section className="secao-bloco" aria-labelledby="titulo-user">
              <h2 id="titulo-user">Identificação da sessão</h2>
              <p>
                <span className="info-usuario">
                  <label>Nome:</label> {name || "—"}
                </span>
                <br />
                <span className="info-usuario">
                  <label>Login (e-mail):</label> {email || "—"}
                </span>
              </p>
            </section>

            <section className="secao-bloco" aria-labelledby="titulo-hist">
              <h2 id="titulo-hist">Histórico de solicitações</h2>
              <p>
                Pedidos do usuário logado. A tabela é ordenada pela data do pedido. Use <strong>Excluir</strong> para
                remover linhas localmente e, em seguida, <strong>Salvar no servidor</strong> para persistir.
              </p>
              <TabelaSolicitacoes solicitacoes={solicitacoes} onExcluir={excluirLinha} />
              <div className="botoes-linha" style={{ marginTop: "1rem" }}>
                <button type="button" className="btn btn-primario" onClick={salvarNoServidor} disabled={salvando}>
                  {salvando ? "Salvando…" : "Salvar solicitações no servidor"}
                </button>
              </div>
              <FormMessage texto={msg} ok={ok} />
            </section>

            <section className="secao-bloco" aria-labelledby="titulo-novo">
              <h2 id="titulo-novo">Abrir nova solicitação</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="combo-servico">Serviço desejado (catálogo)</label>
                <select
                  id="combo-servico"
                  value={servicoIdx}
                  onChange={(e) => setServicoIdx(parseInt(e.target.value, 10))}
                >
                  {servicos.map((s, i) => (
                    <option key={s.id} value={i}>
                      {s.nome}
                    </option>
                  ))}
                </select>

                {resumo && (
                  <>
                    <p>
                      <strong>Valor de referência:</strong> {resumo.preco}
                    </p>
                    <p>
                      <strong>Prazo estimado:</strong> {resumo.prazo}
                    </p>
                    <p>
                      <strong>Data prevista (após dias úteis):</strong> {resumo.dataPrevista}
                    </p>
                    <p>
                      <strong>Status inicial:</strong> Em elaboração
                    </p>
                  </>
                )}

                <button type="button" className="btn btn-primario" onClick={incluirSolicitacao}>
                  Registrar na lista de solicitações
                </button>
              </form>
            </section>
          </>
        )}
      </main>
      <SiteFooter variant="simple" />
    </>
  );
}
