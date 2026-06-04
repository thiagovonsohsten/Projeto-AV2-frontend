import { db } from "../db.js";

export function autenticar(login, senha) {
  const cliente = db.prepare("SELECT senha FROM cliente WHERE login = ?").get(login?.trim());
  if (!cliente) return false;
  return cliente.senha === senha;
}

export function trocarSenha(login, senhaAtual, novaSenha) {
  if (!autenticar(login, senhaAtual)) {
    return { ok: false, mensagem: "Login ou senha atual inválidos." };
  }
  const result = db
    .prepare("UPDATE cliente SET senha = ? WHERE login = ?")
    .run(novaSenha, login?.trim());
  if (result.changes === 0) {
    return { ok: false, mensagem: "Não foi possível atualizar a senha." };
  }
  return { ok: true };
}

export function cadastrarCliente(dados) {
  const login = dados.login?.trim();
  const existe = db.prepare("SELECT id FROM cliente WHERE login = ?").get(login);
  if (existe) {
    return { ok: false, mensagem: "Já existe um cliente cadastrado com este login (e-mail)." };
  }

  try {
    db.prepare(
      `INSERT INTO cliente (login, senha, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade)
       VALUES (@login, @senha, @nome, @cpf, @dataNascimento, @telefone, @estadoCivil, @escolaridade)`
    ).run({
      login,
      senha: dados.senha,
      nome: dados.nome?.trim(),
      cpf: dados.cpf,
      dataNascimento: dados.dataNascimento,
      telefone: dados.telefone || null,
      estadoCivil: dados.estadoCivil,
      escolaridade: dados.escolaridade,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, mensagem: err.message || "Erro ao cadastrar cliente." };
  }
}

export function buscarPorLogin(login) {
  return db
    .prepare(
      `SELECT id, login, nome, cpf, data_nascimento AS dataNascimento, telefone, estado_civil AS estadoCivil, escolaridade
       FROM cliente WHERE login = ?`
    )
    .get(login?.trim());
}
