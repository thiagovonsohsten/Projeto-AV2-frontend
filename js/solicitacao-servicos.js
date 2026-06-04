/**
 * Página de solicitação de serviços: tabela dinâmica e combo de preços/prazos.
 */
(function () {
  /** prazoDias = quantidade de dias úteis (seg–sex), conforme enunciado */
  var SERVICOS = [
    { nome: "Suporte gerenciado — estações de trabalho (mensal)", preco: 120.0, prazoDias: 2 },
    { nome: "Projeto e implantação — rede LAN/WLAN e firewall", preco: 450.0, prazoDias: 5 },
    { nome: "Backup gerenciado — ambiente local e nuvem", preco: 89.9, prazoDias: 1 },
    { nome: "Consultoria em segurança — diagnóstico e plano de ação", preco: 1800.0, prazoDias: 14 },
    { nome: "Hospedagem e sustentação — site institucional", preco: 199.0, prazoDias: 3 },
  ];

  /** Soma N dias úteis a partir de `data` (ignora sábado e domingo). */
  function adicionarDiasUteis(data, n) {
    var d = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    var faltam = n;
    while (faltam > 0) {
      d.setDate(d.getDate() + 1);
      var diaSem = d.getDay();
      if (diaSem !== 0 && diaSem !== 6) faltam--;
    }
    return d;
  }

  function formatMoney(n) {
    return (
      "R$ " +
      n.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  function formatDataBR(d) {
    var dia = String(d.getDate()).padStart(2, "0");
    var mes = String(d.getMonth() + 1).padStart(2, "0");
    var ano = d.getFullYear();
    return dia + "/" + mes + "/" + ano;
  }

  function parseDataBR(s) {
    var p = s.split("/");
    if (p.length !== 3) return 0;
    var d = new Date(parseInt(p[2], 10), parseInt(p[1], 10) - 1, parseInt(p[0], 10));
    return d.getTime();
  }

  function proximoNumero() {
    var tbody = document.getElementById("corpo-tabela-solicitacoes");
    var max = 0;
    for (var i = 0; i < tbody.rows.length; i++) {
      var txt = tbody.rows[i].cells[1].textContent;
      var n = parseInt(txt.replace(/\D/g, ""), 10);
      if (!isNaN(n) && n > max) max = n;
    }
    return max + 1;
  }

  function ordenarTbodyPorData() {
    var tbody = document.getElementById("corpo-tabela-solicitacoes");
    var rows = Array.prototype.slice.call(tbody.rows);
    rows.sort(function (a, b) {
      return parseDataBR(a.cells[0].textContent) - parseDataBR(b.cells[0].textContent);
    });
    rows.forEach(function (tr) {
      tbody.appendChild(tr);
    });
  }

  function bindExcluir(tr) {
    var btn = tr.querySelector("button.excluir-linha");
    if (btn)
      btn.addEventListener("click", function () {
        tr.remove();
      });
  }

  function atualizarResumoCombo() {
    var sel = document.getElementById("combo-servico");
    var idx = parseInt(sel.value, 10);
    var s = SERVICOS[idx];
    document.getElementById("label-preco").textContent = formatMoney(s.preco);
    document.getElementById("label-prazo").textContent =
      s.prazoDias + " dia(s) úteis (prazo para início da entrega, conforme fila)";
    var hoje = new Date();
    var prev = adicionarDiasUteis(hoje, s.prazoDias);
    document.getElementById("label-data-prevista").textContent = formatDataBR(prev);
  }

  document.addEventListener("DOMContentLoaded", function () {
    var nameEl = document.getElementById("label-nome-usuario");
    var emailEl = document.getElementById("label-email-usuario");
    if (window.TechServAuth) {
      if (nameEl) nameEl.textContent = TechServAuth.getName() || "Helena Martins (ambiente de demonstração)";
      if (emailEl)
        emailEl.textContent =
          TechServAuth.getEmail() || "portal.demo@techservsolucoes.com.br";
    }

    var sel = document.getElementById("combo-servico");
    if (sel) {
      sel.innerHTML = "";
      for (var i = 0; i < SERVICOS.length; i++) {
        var op = document.createElement("option");
        op.value = String(i);
        op.textContent = SERVICOS[i].nome;
        sel.appendChild(op);
      }
      sel.addEventListener("change", atualizarResumoCombo);
      atualizarResumoCombo();
    }

    var tbody = document.getElementById("corpo-tabela-solicitacoes");
    if (tbody) {
      var linhasFixas = tbody.querySelectorAll("tr");
      for (var j = 0; j < linhasFixas.length; j++) bindExcluir(linhasFixas[j]);
      ordenarTbodyPorData();
    }

    var btnAdd = document.getElementById("btn-incluir-solicitacao");
    if (btnAdd) {
      btnAdd.addEventListener("click", function () {
        var idx = parseInt(document.getElementById("combo-servico").value, 10);
        var s = SERVICOS[idx];
        var hoje = new Date();
        var prev = adicionarDiasUteis(hoje, s.prazoDias);
        var tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" +
          formatDataBR(hoje) +
          "</td><td>SOL-" +
          proximoNumero() +
          "</td><td>" +
          s.nome +
          "</td><td>Em elaboração</td><td class=\"col-num\">" +
          formatMoney(s.preco) +
          "</td><td>" +
          formatDataBR(prev) +
          "</td><td><button type=\"button\" class=\"btn btn-secundario excluir-linha\">Excluir</button></td>";
        tbody.appendChild(tr);
        bindExcluir(tr);
        ordenarTbodyPorData();
      });
    }
  });
})();
