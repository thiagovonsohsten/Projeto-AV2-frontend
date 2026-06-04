import { db } from "../db.js";
import { buscarPorLogin } from "./clienteService.js";

export function listarPorLogin(login) {
  const cliente = buscarPorLogin(login);
  if (!cliente) {
    return { ok: false, mensagem: "Cliente não encontrado para o login informado." };
  }

  const rows = db
    .prepare(
      `SELECT s.id, s.data_pedido AS dataPedido, s.numero_solicitacao AS numeroSolicitacao,
              s.status, s.preco, s.data_prevista AS dataPrevista, s.servico_id AS servicoId,
              st.nome AS nomeServico, st.prazo_dias AS prazoDias
       FROM solicitacao_servico_ti s
       INNER JOIN servico_ti st ON st.id = s.servico_id
       WHERE s.cliente_id = ?
       ORDER BY s.data_pedido`
    )
    .all(cliente.id);

  return { ok: true, solicitacoes: rows };
}

export function atualizarSolicitacoes(login, solicitacoes) {
  const cliente = buscarPorLogin(login);
  if (!cliente) {
    return { ok: false, mensagem: "Cliente não encontrado para o login informado." };
  }

  const apagar = db.prepare("DELETE FROM solicitacao_servico_ti WHERE cliente_id = ?");
  const inserir = db.prepare(
    `INSERT INTO solicitacao_servico_ti
     (cliente_id, servico_id, data_pedido, numero_solicitacao, status, preco, data_prevista)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  );

  const transacao = db.transaction((lista) => {
    apagar.run(cliente.id);
    for (const item of lista) {
      const servicoId = item.servicoId;
      const existe = db.prepare("SELECT id FROM servico_ti WHERE id = ?").get(servicoId);
      if (!existe) {
        throw new Error(`Serviço de TI id ${servicoId} não encontrado.`);
      }
      inserir.run(
        cliente.id,
        servicoId,
        item.dataPedido,
        item.numeroSolicitacao,
        item.status,
        Number(item.preco),
        item.dataPrevista
      );
    }
  });

  try {
    transacao(Array.isArray(solicitacoes) ? solicitacoes : []);
    return { ok: true };
  } catch (err) {
    return { ok: false, mensagem: err.message || "Erro ao atualizar solicitações." };
  }
}
