/**
 * Página de troca de senha: textos de regras, validação e limpar.
 */
document.addEventListener("DOMContentLoaded", function () {
  var okEl = document.getElementById("chars-ok");
  var naoEl = document.getElementById("chars-nao");
  if (okEl) okEl.textContent = window.TechServSenha.textoCaracteresPermitidos;
  if (naoEl) naoEl.textContent = window.TechServSenha.textoCaracteresProibidos;

  function el(id) {
    return document.getElementById(id);
  }
  function mostrarMsg(elemento, texto, ok) {
    elemento.textContent = texto;
    elemento.className = "msg-form" + (ok ? " ok" : texto ? " erro" : "");
  }

  el("btn-limpar-troca").addEventListener("click", function () {
    el("t-login").value = "";
    el("t-senha").value = "";
    el("t-conf").value = "";
    mostrarMsg(el("msg-troca"), "", false);
    el("t-login").focus();
  });

  el("btn-troca").addEventListener("click", function () {
    var login = el("t-login").value;
    var senha = el("t-senha").value;
    var conf = el("t-conf").value;
    var eLogin = window.TechServLogin.validarEmail(login);
    if (eLogin) {
      mostrarMsg(el("msg-troca"), eLogin, false);
      return;
    }
    var e2 = TechServSenha.validarParSenhas(senha, conf);
    if (e2) {
      mostrarMsg(el("msg-troca"), e2, false);
      return;
    }
    mostrarMsg(el("msg-troca"), "", false);
    alert("Validação realizada com sucesso");
    window.history.back();
  });
});
