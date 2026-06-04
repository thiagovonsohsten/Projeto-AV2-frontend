import { db } from "../db.js";

export function listarServicos() {
  return db
    .prepare("SELECT id, nome, preco, prazo_dias AS prazoDias FROM servico_ti ORDER BY id")
    .all();
}

export function cadastrarServico(dados) {
  if (!dados.nome?.trim()) {
    return { ok: false, mensagem: "O nome do serviço é obrigatório." };
  }
  const preco = Number(dados.preco);
  const prazoDias = parseInt(dados.prazoDias, 10);
  if (Number.isNaN(preco) || preco < 0) {
    return { ok: false, mensagem: "Informe um preço válido." };
  }
  if (Number.isNaN(prazoDias) || prazoDias < 1) {
    return { ok: false, mensagem: "Informe um prazo em dias úteis válido (mínimo 1)." };
  }

  try {
    const info = db
      .prepare("INSERT INTO servico_ti (nome, preco, prazo_dias) VALUES (?, ?, ?)")
      .run(dados.nome.trim(), preco, prazoDias);
    return { ok: true, id: info.lastInsertRowid };
  } catch (err) {
    return { ok: false, mensagem: err.message || "Erro ao cadastrar serviço de TI." };
  }
}
