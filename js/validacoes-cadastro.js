/**
 * Validações específicas do cadastro de cliente.
 */
(function () {
  var RX_EMAIL =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  /** Somente letras Unicode e espaços (sem caracteres das listas do enunciado). */
  var RX_NOME_OK = /^[\p{L}][\p{L}\s]*$/u;

  function validarDigitosCPF(d) {
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
    var i;
    var s = 0;
    for (i = 0; i < 9; i++) s += parseInt(d.charAt(i), 10) * (10 - i);
    var r = (s * 10) % 11;
    if (r === 10) r = 0;
    if (r !== parseInt(d.charAt(9), 10)) return false;
    s = 0;
    for (i = 0; i < 10; i++) s += parseInt(d.charAt(i), 10) * (11 - i);
    r = (s * 10) % 11;
    if (r === 10) r = 0;
    return r === parseInt(d.charAt(10), 10);
  }

  window.TechServCadastro = {
    validarEmail: function (v) {
      if (!v || !v.trim()) return "O e-mail (login) é obrigatório.";
      if (!RX_EMAIL.test(v.trim())) return "Utilize um e-mail válido no formato nome@domínio.";
      return "";
    },

    validarNome: function (v) {
      if (!v || !v.trim()) return "Informe o nome completo conforme documento.";
      var t = v.trim();
      var partes = t.split(/\s+/).filter(function (p) {
        return p.length > 0;
      });
      if (partes.length < 2) return "Informe nome e sobrenome (pelo menos duas palavras).";
      if (partes[0].length < 2) return "O primeiro nome deve ter no mínimo 2 caracteres.";
      if (!RX_NOME_OK.test(t)) return "O nome não deve conter números ou símbolos.";
      return "";
    },

    /** CPF no formato NNN.NNN.NNN-DD */
    validarCPF: function (formatado) {
      if (!formatado || !formatado.trim()) return "O CPF é obrigatório.";
      var d = formatado.replace(/\D/g, "");
      if (d.length !== 11) return "CPF incompleto. Utilize o formato 000.000.000-00.";
      if (!validarDigitosCPF(d)) return "CPF inválido — confira os dígitos informados.";
      return "";
    },

    /** Aplica máscara e mantém só dígitos na digitação */
    aplicarMascaraCPF: function (input) {
      var v = input.value.replace(/\D/g, "").slice(0, 11);
      var out = "";
      if (v.length > 0) out = v.substring(0, 3);
      if (v.length >= 4) out += "." + v.substring(3, 6);
      if (v.length >= 7) out += "." + v.substring(6, 9);
      if (v.length >= 10) out += "-" + v.substring(9, 11);
      input.value = out;
    },

    validarDataNasc: function (dataISO) {
      if (!dataISO) return "Informe a data de nascimento.";
      var hoje = new Date();
      var nasc = new Date(dataISO + "T12:00:00");
      if (isNaN(nasc.getTime())) return "Data de nascimento inválida.";
      var idade = hoje.getFullYear() - nasc.getFullYear();
      var m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
      if (idade < 18) return "Cadastro permitido apenas para maiores de 18 anos.";
      return "";
    },

    /** Telefone opcional: Brasil DDD + 8 ou 9 dígitos */
    validarTelOpcional: function (v) {
      if (!v || !String(v).trim()) return "";
      var d = String(v).replace(/\D/g, "");
      if (d.length !== 10 && d.length !== 11)
        return "Telefone: informe DDD + número (fixo ou celular) com quantidade válida de dígitos.";
      var ddd = parseInt(d.substring(0, 2), 10);
      if (ddd < 11 || ddd > 99) return "DDD inválido. Utilize código de área entre 11 e 99.";
      return "";
    },

    aplicarMascaraTelefone: function (input) {
      var v = input.value.replace(/\D/g, "").slice(0, 11);
      var out = "";
      if (v.length === 0) {
        input.value = "";
        return;
      }
      var ddd = v.substring(0, 2);
      if (v.length <= 2) {
        out = "(" + ddd;
        if (v.length === 2) out += ")";
      } else if (v.length <= 6) {
        out = "(" + ddd + ") " + v.substring(2);
      } else if (v.length <= 10) {
        /* Fixo: (DD) NNNN-NNNN */
        out = "(" + ddd + ") " + v.substring(2, 6) + "-" + v.substring(6);
      } else {
        /* Celular: (DD) NNNNN-NNNN */
        out = "(" + ddd + ") " + v.substring(2, 7) + "-" + v.substring(7, 11);
      }
      input.value = out;
    },
  };
})();
