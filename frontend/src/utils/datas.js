export function adicionarDiasUteis(data, n) {
  const d = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  let faltam = n;
  while (faltam > 0) {
    d.setDate(d.getDate() + 1);
    const diaSem = d.getDay();
    if (diaSem !== 0 && diaSem !== 6) faltam--;
  }
  return d;
}

export function formatMoney(n) {
  return (
    "R$ " +
    Number(n).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function formatDataBR(d) {
  const dia = String(d.getDate()).padStart(2, "0");
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export function parseDataBR(s) {
  const p = s.split("/");
  if (p.length !== 3) return 0;
  const d = new Date(parseInt(p[2], 10), parseInt(p[1], 10) - 1, parseInt(p[0], 10));
  return d.getTime();
}

export function ordenarPorDataPedido(lista) {
  return [...lista].sort((a, b) => parseDataBR(a.dataPedido) - parseDataBR(b.dataPedido));
}

export function proximoNumeroSolicitacao(solicitacoes) {
  let max = 0;
  for (const s of solicitacoes) {
    const n = parseInt(String(s.numeroSolicitacao).replace(/\D/g, ""), 10);
    if (!isNaN(n) && n > max) max = n;
  }
  return max + 1;
}
