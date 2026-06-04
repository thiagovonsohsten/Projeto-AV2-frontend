# TechServ Soluções — AV2 (React + API REST + SQLite)

Projeto da AV2 baseado no escopo da AV1 (TechServ), com frontend em **React** (Hooks, sem manipulação direta do DOM) e backend **Node.js + Express + SQLite**.

## Estrutura

| Pasta | Descrição |
|-------|-----------|
| `frontend/` | Aplicação React (Vite) — páginas, componentes, validações e consumo da API |
| `backend/` | API REST, regras de negócio e banco SQLite (`backend/data/techserv.db`) |
| `css/`, `*.html`, `js/` | Artefatos originais da AV1 (referência); a aplicação ativa é o `frontend/` |

## Requisitos

- Node.js 18+

## Como executar

### 1. Backend (terminal 1)

```bash
cd backend
npm install
npm run dev
```

API em `http://localhost:3001` — rotas sob `/api`.

### 2. Frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`. O Vite faz proxy de `/api` para o backend.

## Usuário de demonstração

Após o primeiro start do backend (seed automático):

| Campo | Valor |
|-------|--------|
| Login | `portal.demo@techservsolucoes.com.br` |
| Senha | `Demo1@x` |

## Endpoints REST (`/api`)

| Método | Rota | Função |
|--------|------|--------|
| POST | `/autenticacao` | Verificar credenciais — retorno: `autenticado` (boolean) |
| POST | `/troca-senha` | `login`, `senhaAtual`, `novaSenha` |
| POST | `/clientes` | Cadastro de cliente |
| POST | `/servicos` | Cadastro de serviço de TI (id autoincremento) |
| GET | `/servicos` | Lista todos os serviços |
| GET | `/solicitacoes?login=` | Solicitações do usuário |
| PUT | `/solicitacoes` | Substitui todas as solicitações do usuário |

Respostas padrão: `{ sucesso, mensagem, ...dados }`.

## Páginas React

- `/` — Site institucional (layout AV1)
- `/login` — Autenticação via API
- `/trocar-senha` — Troca com senha atual e nova
- `/cadastro` — Cadastro de cliente
- `/solicitacao-servicos` — Carrinho/solicitações (catálogo e histórico via API + botão salvar)
- `/cadastro-servico` — Cadastro de serviço de TI com validação no React

## Build de produção

```bash
cd frontend && npm run build
cd backend && npm start
```

Configure o servidor estático do `frontend/dist` com proxy reverso para `/api` apontando ao backend.

## Tabelas (SQLite)

- **cliente** — dados pessoais, login e senha
- **servico_ti** — catálogo (`id` autoincremento)
- **solicitacao_servico_ti** — FK para `cliente` e `servico_ti`
