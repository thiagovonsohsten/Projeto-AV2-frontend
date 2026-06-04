import { formatMoney } from "../utils/datas";

export default function TabelaSolicitacoes({ solicitacoes, onExcluir }) {
  return (
    <div className="tabela-wrapper">
      <table className="tabela-dados">
        <thead>
          <tr>
            <th scope="col">Data do pedido</th>
            <th scope="col">Nº solicitação</th>
            <th scope="col">Serviço</th>
            <th scope="col">Status</th>
            <th scope="col">Preço</th>
            <th scope="col">Data prevista</th>
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {solicitacoes.length === 0 ? (
            <tr>
              <td colSpan={7}>Nenhuma solicitação registrada.</td>
            </tr>
          ) : (
            solicitacoes.map((s, idx) => (
              <tr key={`${s.numeroSolicitacao}-${idx}`}>
                <td>{s.dataPedido}</td>
                <td>{s.numeroSolicitacao}</td>
                <td>{s.nomeServico}</td>
                <td>{s.status}</td>
                <td className="col-num">{formatMoney(s.preco)}</td>
                <td>{s.dataPrevista}</td>
                <td>
                  <button type="button" className="btn btn-secundario" onClick={() => onExcluir(idx)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
