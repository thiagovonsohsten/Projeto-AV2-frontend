/**
 * Validação da página de login (e-mail + senha não vazia).
 */
(function () {
  var RX_EMAIL =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  window.TechServLogin = {
    validarEmail: function (login) {
      if (!login || !login.trim()) return "Informe o e-mail cadastrado como login.";
      if (!RX_EMAIL.test(login.trim())) return "Digite um endereço de e-mail válido (formato nome@domínio).";
      return "";
    },

    validar: function (login, senha) {
      var e = this.validarEmail(login);
      if (e) return e;
      if (!senha) return "Informe a senha de acesso.";
      return "";
    },
  };
})();
