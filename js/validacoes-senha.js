/**
 * Regras de senha compartilhadas (cadastro e troca de senha).
 */
(function () {
  var PERMITIDOS = /[@#$%&*!?/\\|_\-+.=]/;
  /* Caracteres proibidos pelo enunciado (inclui aspas tipográficas comuns). */
  var PROIBIDOS = /[¨{}\[\]´`~^:;<>,"'\u201c\u201d\u2018\u2019«»„‚]/;

  function validarRegraSenha(senha) {
    if (!senha || !String(senha).trim()) return "Informe a senha.";
    if (senha.length < 6) return "A senha deve ter no mínimo 6 caracteres.";
    if (!/[0-9]/.test(senha)) return "Inclua ao menos um algarismo (0–9).";
    if (!/[A-Z]/.test(senha)) return "Inclua ao menos uma letra maiúscula (A–Z).";
    if (!PERMITIDOS.test(senha))
      return "Inclua ao menos um caractere especial da lista de permitidos nesta página.";
    if (PROIBIDOS.test(senha))
      return "Remova caracteres que constam na lista de proibidos nesta página.";
    return "";
  }

  window.TechServSenha = {
    mensagemRegraSenha: validarRegraSenha,

    validarParSenhas: function (senha, confirmacao) {
      var e = validarRegraSenha(senha);
      if (e) return e;
      if (!confirmacao) return "Repita a senha no campo de confirmação.";
      if (senha !== confirmacao) return "A confirmação não coincide com a senha informada.";
      return "";
    },

    /** Caracteres listados explicitamente no enunciado (para texto de ajuda). */
    textoCaracteresPermitidos:
      "@ # $ % & * ! ? / \\ | - _ + . =",
    textoCaracteresProibidos:
      "¨ { } [ ] ´ ` ~ ^ : ; < > , “ ‘",
  };
})();
