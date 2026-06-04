import { Link } from "react-router-dom";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import YouTubeFacade from "../components/YouTubeFacade";
import { useAuth } from "../hooks/useAuth";
import "../home.css";

export default function HomePage() {
  const { isLoggedIn } = useAuth();

  return (
    <div id="pagina-inicial">
      <table className="layout-tabela-principal" style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ padding: 0, verticalAlign: "top" }}>
              <SiteHeader
                homeBrand
                showNav
                tagline={
                  <>
                    Outsourcing de TI, projetos e suporte para empresas que precisam de{" "}
                    <em>estabilidade, segurança e previsibilidade de custos</em>.
                  </>
                }
              />
            </td>
          </tr>
          <tr>
            <td style={{ padding: 0, verticalAlign: "top" }}>
              <main className="conteudo-pagina">
                <section aria-labelledby="historia-titulo">
                  <h2 id="historia-titulo">Nossa história</h2>
                  <div className="history-scroll">
                    <p>
                      A <strong>TechServ Soluções</strong> foi fundada em 2012 em Recife, com foco em{" "}
                      <strong>outsourcing de TI</strong> e projetos sob medida para PMEs dos setores de serviços,
                      varejo e indústria leve.
                    </p>
                    <p>
                      Hoje mantemos equipe própria de campo e NOC, parcerias com fabricantes e integradores, e processos
                      inspirados em <em>ITIL</em> e boas práticas de segurança, em linha com a <strong>LGPD</strong>.
                    </p>
                    <p>
                      Clientes cadastrados acessam o <strong>portal</strong> para abrir solicitações e acompanhar
                      serviços.
                    </p>
                  </div>
                </section>

                <section aria-labelledby="video-titulo">
                  <h2 id="video-titulo">Vídeo institucional</h2>
                  <YouTubeFacade />
                  <p className="video-ajuda">
                    <small>
                      Alternativa:{" "}
                      <a
                        href="https://www.youtube.com/watch?v=jQx6wItPuSo"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        abrir no YouTube
                      </a>
                      .
                    </small>
                  </p>
                </section>

                <section className="secao-servicos" aria-labelledby="servicos-titulo">
                  <h2 id="servicos-titulo" className="titulo-servicos">
                    Serviços
                  </h2>
                  <p className="servicos-lead">
                    Ofertas com <strong>escopo fechado ou contrato mensal</strong>, com documentação de entrega e
                    canais formais de comunicação.
                  </p>
                  <div className="servicos-cards">
                    <article className="servico-item">
                      <h3>Suporte e service desk</h3>
                      <p className="servico-resumo">
                        Primeiro nível com classificação de incidente e requisição, escalonamento técnico e comunicação
                        formal ao negócio.
                      </p>
                    </article>
                    <article className="servico-item">
                      <h3>Redes e conectividade</h3>
                      <p className="servico-resumo">
                        Projeto, implantação e suporte evolutivo de LAN, WLAN e acesso remoto.
                      </p>
                    </article>
                    <article className="servico-item">
                      <h3>Nuvem, backup e recuperação</h3>
                      <p className="servico-resumo">
                        Proteção de dados e cargas de trabalho em ambiente híbrido.
                      </p>
                    </article>
                    <article className="servico-item">
                      <h3>Segurança da informação e LGPD</h3>
                      <p className="servico-resumo">
                        Controles técnicos e organizacionais para reduzir risco operacional.
                      </p>
                    </article>
                  </div>
                </section>

                {isLoggedIn && (
                  <p className="portal-atalhos">
                    <Link to="/solicitacao-servicos" className="btn btn-primario">
                      Abrir solicitações de serviço
                    </Link>{" "}
                    <Link to="/cadastro-servico" className="btn btn-secundario">
                      Cadastrar serviço no catálogo
                    </Link>
                  </p>
                )}
              </main>
            </td>
          </tr>
          <tr>
            <td style={{ padding: 0, verticalAlign: "top" }}>
              <SiteFooter />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
