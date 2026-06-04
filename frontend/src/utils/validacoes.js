const RX_EMAIL =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const RX_NOME_OK = /^[\p{L}][\p{L}\s]*$/u;
const PERMITIDOS_SENHA = /[@#$%&*!?/\\|_\-+.=]/;
const PROIBIDOS_SENHA = /[¨{}\[\]´`~^:;<>,"'\u201c\u201d\u2018\u2019«»„‚]/;

export const textoCaracteresPermitidos = "@ # $ % & * ! ? / \\ | - _ + . =";
export const textoCaracteresProibidos = "¨ { } [ ] ´ ` ~ ^ : ; < > , “ ‘";

function validarDigitosCPF(d) {
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(d.charAt(i), 10) * (10 - i);
  let r = (s * 10) % 11;
  if (r === 10) r = 0;
  if (r !== parseInt(d.charAt(9), 10)) return false;
  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(d.charAt(i), 10) * (11 - i);
  r = (s * 10) % 11;
  if (r === 10) r = 0;
  return r === parseInt(d.charAt(10), 10);
}

export function validarEmailLogin(login) {
  if (!login || !login.trim()) return "Informe o e-mail cadastrado como login.";
  if (!RX_EMAIL.test(login.trim())) return "Digite um endereço de e-mail válido (formato nome@domínio).";
  return "";
}

export function validarLogin(login, senha) {
  const e = validarEmailLogin(login);
  if (e) return e;
  if (!senha) return "Informe a senha de acesso.";
  return "";
}

export function validarRegraSenha(senha) {
  if (!senha || !String(senha).trim()) return "Informe a senha.";
  if (senha.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
  if (!/[0-9]/.test(senha)) return "Inclua ao menos um algarismo (0–9).";
  if (!/[A-Z]/.test(senha)) return "Inclua ao menos uma letra maiúscula (A–Z).";
  if (!PERMITIDOS_SENHA.test(senha))
    return "Inclua ao menos um caractere especial da lista de permitidos nesta página.";
  if (PROIBIDOS_SENHA.test(senha))
    return "Remova caracteres que constam na lista de proibidos nesta página.";
  return "";
}

export function validarParSenhas(senha, confirmacao) {
  const e = validarRegraSenha(senha);
  if (e) return e;
  if (!confirmacao) return "Repita a senha no campo de confirmação.";
  if (senha !== confirmacao) return "A confirmação não coincide com a senha informada.";
  return "";
}

export function validarEmailCadastro(v) {
  if (!v || !v.trim()) return "O e-mail (login) é obrigatório.";
  if (!RX_EMAIL.test(v.trim())) return "Utilize um e-mail válido no formato nome@domínio.";
  return "";
}

export function validarNome(v) {
  if (!v || !v.trim()) return "Informe o nome completo conforme documento.";
  const t = v.trim();
  const partes = t.split(/\s+/).filter((p) => p.length > 0);
  if (partes.length < 2) return "Informe nome e sobrenome (pelo menos duas palavras).";
  if (partes[0].length < 2) return "O primeiro nome deve ter no mínimo 2 caracteres.";
  if (!RX_NOME_OK.test(t)) return "O nome não deve conter números ou símbolos.";
  return "";
}

export function validarCPF(formatado) {
  if (!formatado || !formatado.trim()) return "O CPF é obrigatório.";
  const d = formatado.replace(/\D/g, "");
  if (d.length !== 11) return "CPF incompleto. Utilize o formato 000.000.000-00.";
  if (!validarDigitosCPF(d)) return "CPF inválido — confira os dígitos informados.";
  return "";
}

export function aplicarMascaraCPF(valor) {
  const v = valor.replace(/\D/g, "").slice(0, 11);
  let out = "";
  if (v.length > 0) out = v.substring(0, 3);
  if (v.length >= 4) out += "." + v.substring(3, 6);
  if (v.length >= 7) out += "." + v.substring(6, 9);
  if (v.length >= 10) out += "-" + v.substring(9, 11);
  return out;
}

export function validarDataNasc(dataISO) {
  if (!dataISO) return "Informe a data de nascimento.";
  const hoje = new Date();
  const nasc = new Date(dataISO + "T12:00:00");
  if (isNaN(nasc.getTime())) return "Data de nascimento inválida.";
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  if (idade < 18) return "Cadastro permitido apenas para maiores de 18 anos.";
  return "";
}

export function validarTelOpcional(v) {
  if (!v || !String(v).trim()) return "";
  const d = String(v).replace(/\D/g, "");
  if (d.length !== 10 && d.length !== 11)
    return "Telefone: informe DDD + número (fixo ou celular) com quantidade válida de dígitos.";
  const ddd = parseInt(d.substring(0, 2), 10);
  if (ddd < 11 || ddd > 99) return "DDD inválido. Utilize código de área entre 11 e 99.";
  return "";
}

export function aplicarMascaraTelefone(valor) {
  const v = valor.replace(/\D/g, "").slice(0, 11);
  if (v.length === 0) return "";
  const ddd = v.substring(0, 2);
  if (v.length <= 2) return "(" + ddd + (v.length === 2 ? ")" : "");
  if (v.length <= 6) return "(" + ddd + ") " + v.substring(2);
  if (v.length <= 10) return "(" + ddd + ") " + v.substring(2, 6) + "-" + v.substring(6);
  return "(" + ddd + ") " + v.substring(2, 7) + "-" + v.substring(7, 11);
}

export function validarServicoTI({ nome, preco, prazoDias }) {
  if (!nome?.trim()) return "O nome do serviço é obrigatório.";
  const p = String(preco).trim();
  if (!p) return "O preço de referência é obrigatório.";
  const precoNum = Number(p.replace(",", "."));
  if (Number.isNaN(precoNum) || precoNum < 0) return "Informe um preço válido.";
  const prazo = String(prazoDias).trim();
  if (!prazo) return "O prazo em dias úteis é obrigatório.";
  const prazoNum = parseInt(prazo, 10);
  if (Number.isNaN(prazoNum) || prazoNum < 1) return "Informe um prazo em dias úteis válido (mínimo 1).";
  return "";
}
