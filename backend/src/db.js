import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, "techserv.db");

export const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS cliente (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      nome TEXT NOT NULL,
      cpf TEXT NOT NULL,
      data_nascimento TEXT NOT NULL,
      telefone TEXT,
      estado_civil TEXT NOT NULL,
      escolaridade TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS servico_ti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL,
      prazo_dias INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS solicitacao_servico_ti (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      servico_id INTEGER NOT NULL,
      data_pedido TEXT NOT NULL,
      numero_solicitacao TEXT NOT NULL,
      status TEXT NOT NULL,
      preco REAL NOT NULL,
      data_prevista TEXT NOT NULL,
      FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE,
      FOREIGN KEY (servico_id) REFERENCES servico_ti(id)
    );
  `);

  seedIfEmpty();
}

function seedIfEmpty() {
  const servicosCount = db.prepare("SELECT COUNT(*) AS n FROM servico_ti").get().n;
  if (servicosCount === 0) {
    const insertServico = db.prepare(
      "INSERT INTO servico_ti (nome, preco, prazo_dias) VALUES (@nome, @preco, @prazoDias)"
    );
    const catalogo = [
      { nome: "Suporte gerenciado — estações de trabalho (mensal)", preco: 120.0, prazoDias: 2 },
      { nome: "Projeto e implantação — rede LAN/WLAN e firewall", preco: 450.0, prazoDias: 5 },
      { nome: "Backup gerenciado — ambiente local e nuvem", preco: 89.9, prazoDias: 1 },
      { nome: "Consultoria em segurança — diagnóstico e plano de ação", preco: 1800.0, prazoDias: 14 },
      { nome: "Hospedagem e sustentação — site institucional", preco: 199.0, prazoDias: 3 },
    ];
    for (const s of catalogo) insertServico.run(s);
  }

  const clientesCount = db.prepare("SELECT COUNT(*) AS n FROM cliente").get().n;
  if (clientesCount === 0) {
    db.prepare(
      `INSERT INTO cliente (login, senha, nome, cpf, data_nascimento, telefone, estado_civil, escolaridade)
       VALUES (@login, @senha, @nome, @cpf, @dataNascimento, @telefone, @estadoCivil, @escolaridade)`
    ).run({
      login: "portal.demo@techservsolucoes.com.br",
      senha: "Demo1@x",
      nome: "Helena Martins",
      cpf: "529.982.247-25",
      dataNascimento: "1990-05-15",
      telefone: "(11) 99887-7665",
      estadoCivil: "solteiro",
      escolaridade: "2c",
    });

    const clienteId = db
      .prepare("SELECT id FROM cliente WHERE login = ?")
      .get("portal.demo@techservsolucoes.com.br").id;
    const servicos = db.prepare("SELECT id, nome, preco FROM servico_ti ORDER BY id").all();
    const insertSol = db.prepare(
      `INSERT INTO solicitacao_servico_ti
       (cliente_id, servico_id, data_pedido, numero_solicitacao, status, preco, data_prevista)
       VALUES (@clienteId, @servicoId, @dataPedido, @numeroSolicitacao, @status, @preco, @dataPrevista)`
    );

    const exemplos = [
      { servicoIdx: 4, dataPedido: "10/03/2025", numero: "SOL-2003", status: "Em elaboração", dataPrevista: "13/03/2025" },
      { servicoIdx: 0, dataPedido: "02/01/2025", numero: "SOL-2001", status: "Concluído", dataPrevista: "06/01/2025" },
      { servicoIdx: 2, dataPedido: "28/02/2025", numero: "SOL-2002", status: "Aguardando aprovação", dataPrevista: "03/03/2025" },
    ];
    for (const ex of exemplos) {
      const srv = servicos[ex.servicoIdx];
      insertSol.run({
        clienteId,
        servicoId: srv.id,
        dataPedido: ex.dataPedido,
        numeroSolicitacao: ex.numero,
        status: ex.status,
        preco: srv.preco,
        dataPrevista: ex.dataPrevista,
      });
    }
  }
}
