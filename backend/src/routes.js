import { Router } from "express";
import * as clienteService from "./services/clienteService.js";
import * as servicoService from "./services/servicoService.js";
import * as solicitacaoService from "./services/solicitacaoService.js";

const router = Router();

function respostaSucesso(res, dados = {}) {
  return res.json({ sucesso: true, mensagem: "", ...dados });
}

function respostaErro(res, mensagem, status = 400) {
  return res.status(status).json({ sucesso: false, mensagem });
}

router.post("/autenticacao", (req, res) => {
  const { login, senha } = req.body || {};
  if (!login || !senha) {
    return respostaErro(res, "Login e senha são obrigatórios.");
  }
  const autenticado = clienteService.autenticar(login, senha);
  return res.json({ sucesso: true, autenticado, mensagem: "" });
});

router.post("/troca-senha", (req, res) => {
  const { login, senhaAtual, novaSenha } = req.body || {};
  if (!login || !senhaAtual || !novaSenha) {
    return respostaErro(res, "Login, senha atual e nova senha são obrigatórios.");
  }
  const result = clienteService.trocarSenha(login, senhaAtual, novaSenha);
  if (!result.ok) return respostaErro(res, result.mensagem);
  return respostaSucesso(res);
});

router.post("/clientes", (req, res) => {
  const result = clienteService.cadastrarCliente(req.body || {});
  if (!result.ok) return respostaErro(res, result.mensagem);
  return respostaSucesso(res);
});

router.post("/servicos", (req, res) => {
  const result = servicoService.cadastrarServico(req.body || {});
  if (!result.ok) return respostaErro(res, result.mensagem);
  return respostaSucesso(res, { id: result.id });
});

router.get("/servicos", (_req, res) => {
  try {
    const servicos = servicoService.listarServicos();
    return respostaSucesso(res, { servicos });
  } catch (err) {
    return respostaErro(res, err.message || "Erro ao consultar serviços.", 500);
  }
});

router.get("/solicitacoes", (req, res) => {
  const login = req.query.login;
  if (!login) return respostaErro(res, "Informe o login do usuário.");
  const result = solicitacaoService.listarPorLogin(login);
  if (!result.ok) return respostaErro(res, result.mensagem);
  return respostaSucesso(res, { solicitacoes: result.solicitacoes });
});

router.put("/solicitacoes", (req, res) => {
  const { login, solicitacoes } = req.body || {};
  if (!login) return respostaErro(res, "Informe o login do usuário.");
  const result = solicitacaoService.atualizarSolicitacoes(login, solicitacoes);
  if (!result.ok) return respostaErro(res, result.mensagem);
  return respostaSucesso(res);
});

export default router;
