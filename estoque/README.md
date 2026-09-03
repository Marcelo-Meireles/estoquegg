# Sistema de Controle de Estoque

Projeto integrador Full Stack da **Gran Faculdade** para gerenciamento de produtos, fornecedores e seus relacionamentos.

O sistema permite cadastrar, listar, editar e excluir produtos e fornecedores. Também permite associar vários fornecedores a um produto, consultar os vínculos existentes e remover associações quando necessário.

## Tecnologias

| Camada | Tecnologias |
|---|---|
| Backend | NestJS, TypeORM, SQLite e Multer |
| Frontend | React, Vite, Axios e React Router |
| Validação | class-validator e class-transformer |
| Controle de versão | Git e GitHub |

## Funcionalidades

### Produtos

- Cadastro de produtos
- Listagem de produtos
- Consulta de produto por identificador
- Edição de produto
- Exclusão de produto
- Validação para impedir código de barras duplicado
- Campos para nome, código de barras, descrição, quantidade em estoque, categoria, validade e imagem opcional

### Fornecedores

- Cadastro de fornecedores
- Listagem de fornecedores
- Consulta de fornecedor por identificador
- Edição de fornecedor
- Exclusão de fornecedor
- Validação para impedir CNPJ duplicado
- Campos para nome da empresa, CNPJ, endereço, telefone, e-mail e contato principal

### Associação produto-fornecedor

- Associação de um fornecedor a um produto
- Listagem dos fornecedores associados a um produto
- Desassociação de fornecedor
- Bloqueio de associação duplicada

### Upload de imagem

- Endpoint para envio de imagens de produto
- Aceita somente arquivos de imagem
- Limite de 5 MB por arquivo

## Estrutura do projeto

```text
estoque/
├── backend/
│   ├── src/
│   │   ├── associacao/
│   │   ├── fornecedor/
│   │   ├── produto/
│   │   └── upload/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── api.js
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Pré-requisitos

Antes de iniciar, instale:

- Node.js 24 ou versão LTS compatível
- npm
- Git, caso queira versionar ou atualizar o projeto pelo GitHub

Verifique as instalações:

```bash
node -v
npm -v
git --version
```

## Como executar

### 1. Backend

Abra um terminal na pasta do backend:

```bash
cd estoque/backend
npm install
npm run start:dev
```

A API estará disponível em:

```text
http://localhost:3000
```

### 2. Frontend

Abra outro terminal na pasta do frontend:

```bash
cd estoque/frontend
npm install
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```

Mantenha os dois terminais em execução durante os testes locais.

## Endpoints da API

### Produtos

| Método | Rota | Descrição |
|---|---|---|
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos/:id` | Busca um produto pelo ID |
| POST | `/produtos` | Cadastra um produto |
| PUT | `/produtos/:id` | Atualiza um produto |
| DELETE | `/produtos/:id` | Remove um produto |

### Fornecedores

| Método | Rota | Descrição |
|---|---|---|
| GET | `/fornecedores` | Lista todos os fornecedores |
| GET | `/fornecedores/:id` | Busca um fornecedor pelo ID |
| POST | `/fornecedores` | Cadastra um fornecedor |
| PUT | `/fornecedores/:id` | Atualiza um fornecedor |
| DELETE | `/fornecedores/:id` | Remove um fornecedor |

### Associação

| Método | Rota | Descrição |
|---|---|---|
| POST | `/produtos/:produtoId/fornecedores/:fornecedorId` | Associa um fornecedor a um produto |
| GET | `/produtos/:produtoId/fornecedores` | Lista fornecedores associados ao produto |
| DELETE | `/produtos/:produtoId/fornecedores/:fornecedorId` | Desassocia um fornecedor do produto |

### Upload

| Método | Rota | Descrição |
|---|---|---|
| POST | `/upload` | Envia uma imagem usando o campo `file` do formulário multipart |

## Regras de negócio

- O CNPJ de cada fornecedor deve ser único.
- O código de barras de cada produto deve ser único.
- Um fornecedor não pode ser associado mais de uma vez ao mesmo produto.
- Os campos obrigatórios devem ser preenchidos antes do cadastro.
- A imagem do produto é opcional.

## Cenários validados

- Cadastro de fornecedor com sucesso
- Bloqueio de fornecedor com CNPJ duplicado
- Validação de campos obrigatórios de fornecedor
- Cadastro de produto com sucesso
- Bloqueio de produto com código de barras duplicado
- Validação de campos obrigatórios de produto
- Associação de fornecedor a produto
- Bloqueio de associação duplicada
- Desassociação de fornecedor
- Inicialização e build do backend e frontend

## Comandos úteis

### Build do backend

```bash
cd estoque/backend
npm run build
```

### Build do frontend

```bash
cd estoque/frontend
npm run build
```

### Atualizar a cópia local

```bash
git pull origin main
```

## Possíveis problemas

### `npm` não é reconhecido

Instale o Node.js LTS e abra um novo terminal. Se o PowerShell bloquear `npm.ps1`, execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Backend não inicia

Remova as dependências e reinstale:

```powershell
Remove-Item -Recurse -Force .\node_modules
Remove-Item -Force .\package-lock.json
npm cache verify
npm install
npm run start:dev
```

## Autor

Desenvolvido por **Marcelo Meireles** como parte do Projeto Integrador Full Stack da Gran Faculdade.

## Licença

Projeto acadêmico para fins educacionais.
