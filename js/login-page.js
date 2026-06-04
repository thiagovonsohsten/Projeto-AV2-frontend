/**
 * Página de login: validação, limpar e redirecionamento.
 */
document.addEventListener("DOMContentLoaded", function () {
  function el(id) {
    return document.getElementById(id);
  }
  function mostrarMsg(elemento, texto, ok) {
    elemento.textContent = texto;
    elemento.className = "msg-form" + (ok ? " ok" : texto ? " erro" : "");
  }

  el("btn-limpar-login").addEventListener("click", function () {
    el("login-email").value = "";
    el("login-senha").value = "";
    mostrarMsg(el("msg-login"), "", false);
    el("login-email").focus();
  });

  el("btn-login").addEventListener("click", function () {
    var email = el("login-email").value;
    var senha = el("login-senha").value;
    var msg = window.TechServLogin.validar(email, senha);
    if (msg) {
      mostrarMsg(el("msg-login"), msg, false);
      return;
    }
    mostrarMsg(el("msg-login"), "", false);
    alert("Validação realizada com sucesso");
    window.TechServAuth.setLoggedIn(email.trim(), email.trim().split("@")[0]);
    window.location.href = "index.html";
  });
});
