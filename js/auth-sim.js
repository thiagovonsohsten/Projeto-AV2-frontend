/**
 * Simulação de sessão do cliente (sem backend).
 * Usa sessionStorage para mostrar link "Solicitar serviços" e dados na página de pedidos.
 */
(function () {
  var AUTH = "techservLoggedIn";
  var EMAIL = "techservUserEmail";
  var NAME = "techservUserName";

  window.TechServAuth = {
    isLoggedIn: function () {
      return sessionStorage.getItem(AUTH) === "1";
    },

    setLoggedIn: function (email, displayName) {
      sessionStorage.setItem(AUTH, "1");
      sessionStorage.setItem(EMAIL, email);
      var nome = displayName && displayName.trim() ? displayName.trim() : email.split("@")[0];
      sessionStorage.setItem(NAME, nome);
    },

    getEmail: function () {
      return sessionStorage.getItem(EMAIL) || "";
    },

    getName: function () {
      return sessionStorage.getItem(NAME) || "";
    },
  };
})();
