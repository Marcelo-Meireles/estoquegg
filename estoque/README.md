# Sistema de Controle de Estoque
Projeto Integrador Full Stack — Gran Faculdade

## Stack
- **Backend:** NestJS + TypeORM + SQLite (better-sqlite3)
- **Frontend:** React + Vite

## Como rodar

### Backend (porta 3000)
```bash
cd backend
npm run start:dev
```

### Frontend (porta 5173)
```bash
cd frontend
npm run dev
```

Acesse: http://localhost:5173

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /produtos | Lista todos os produtos |
| POST | /produtos | Cadastra produto |
| PUT | /produtos/:id | Atualiza produto |
| DELETE | /produtos/:id | Remove produto |
| GET | /fornecedores | Lista todos os fornecedores |
| POST | /fornecedores | Cadastra fornecedor |
| PUT | /fornecedores/:id | Atualiza fornecedor |
| DELETE | /fornecedores/:id | Remove fornecedor |
| POST | /produtos/:id/fornecedores/:fid | Associa fornecedor ao produto |
| DELETE | /produtos/:id/fornecedores/:fid | Desassocia fornecedor do produto |
| GET | /produtos/:id/fornecedores | Lista fornecedores do produto |
