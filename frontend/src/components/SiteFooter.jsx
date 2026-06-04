export default function SiteFooter({ variant = "full" }) {
  if (variant === "simple") {
    return (
      <footer className="site-footer">
        <p style={{ margin: 0 }}>
          <small>TechServ Soluções — portal de serviços (AV2)</small>
        </p>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <h2 style={{ fontSize: "1rem", margin: "0 0 0.5rem" }}>Fale conosco</h2>
      <ul>
        <li>
          Telefone fixo (comercial e SAC): <a href="tel:+551135672000">(11) 3567-2000</a> — seg. a sex., 8h30–18h
        </li>
        <li>
          WhatsApp corporativo:{" "}
          <a href="https://wa.me/5511998877665" rel="noopener noreferrer">
            (11) 99887-7665
          </a>
        </li>
        <li>
          E-mail:{" "}
          <a href="mailto:contato@techservsolucoes.com.br?subject=Contato%20TechServ">
            contato@techservsolucoes.com.br
          </a>{" "}
          (propostas, contratos e suporte administrativo)
        </li>
      </ul>
      <p>
        <strong>Endereço sede:</strong> Av. Boa Viagem, 1520 — Sala 704 — Boa Viagem, Recife/PE — CEP 51011-000
      </p>
      <p style={{ marginBottom: "0.35rem" }}>
        <strong>Meios de pagamento aceitos</strong>
      </p>
      <div className="pagamentos">
        <img src="/assets/img/pag-pix.png" alt="Pagamento via Pix" width="80" height="36" />
        <img src="/assets/img/pag-cartao.png" alt="Cartões de crédito e débito" width="80" height="36" />
        <img src="/assets/img/pag-boleto.png" alt="Boleto bancário" width="80" height="36" />
      </div>
    </footer>
  );
}
