const API_BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data.mensagem) {
    data.mensagem = "Falha na comunicação com o servidor.";
    data.sucesso = false;
  }
  return data;
}

export function autenticar(login, senha) {
  return request("/autenticacao", {
    method: "POST",
    body: JSON.stringify({ login, senha }),
  });
}

export function trocarSenha(login, senhaAtual, novaSenha) {
  return request("/troca-senha", {
    method: "POST",
    body: JSON.stringify({ login, senhaAtual, novaSenha }),
  });
}

export function cadastrarCliente(cliente) {
  return request("/clientes", {
    method: "POST",
    body: JSON.stringify(cliente),
  });
}

export function cadastrarServicoTI(servico) {
  return request("/servicos", {
    method: "POST",
    body: JSON.stringify(servico),
  });
}

export function listarServicosTI() {
  return request("/servicos");
}

export function listarSolicitacoes(login) {
  return request(`/solicitacoes?login=${encodeURIComponent(login)}`);
}

export function atualizarSolicitacoes(login, solicitacoes) {
  return request("/solicitacoes", {
    method: "PUT",
    body: JSON.stringify({ login, solicitacoes }),
  });
}
