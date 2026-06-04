/**
 * Página de cadastro: máscaras, validação e botões.
 */
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("cad-chars-ok").textContent = TechServSenha.textoCaracteresPermitidos;
  document.getElementById("cad-chars-nao").textContent = TechServSenha.textoCaracteresProibidos;

  function el(id) {
    return document.getElementById(id);
  }
  function msg(elemento, t, ok) {
    elemento.textContent = t;
    elemento.className = "msg-form" + (ok ? " ok" : t ? " erro" : "");
  }

  el("c-cpf").addEventListener("input", function () {
    TechServCadastro.aplicarMascaraCPF(el("c-cpf"));
  });
  el("c-tel").addEventListener("input", function () {
    TechServCadastro.aplicarMascaraTelefone(el("c-tel"));
  });

  el("btn-limpar-cad").addEventListener("click", function () {
    el("c-email").value = "";
    el("c-senha").value = "";
    el("c-conf").value = "";
    el("c-nome").value = "";
    el("c-cpf").value = "";
    el("c-nasc").value = "";
    el("c-tel").value = "";
    document.querySelector('input[name="ec"][value="solteiro"]').checked = true;
    el("c-esc").value = "2c";
    msg(el("msg-cadastro"), "", false);
    el("c-email").focus();
  });

  el("btn-voltar").addEventListener("click", function () {
    window.history.back();
  });

  el("btn-incluir").addEventListener("click", function () {
    var e =
      TechServCadastro.validarEmail(el("c-email").value) ||
      TechServSenha.validarParSenhas(el("c-senha").value, el("c-conf").value) ||
      TechServCadastro.validarNome(el("c-nome").value) ||
      TechServCadastro.validarCPF(el("c-cpf").value) ||
      TechServCadastro.validarDataNasc(el("c-nasc").value) ||
      TechServCadastro.validarTelOpcional(el("c-tel").value);
    if (e) {
      msg(el("msg-cadastro"), e, false);
      return;
    }
    msg(el("msg-cadastro"), "", false);
    alert("Validação realizada com sucesso");
  });
});
