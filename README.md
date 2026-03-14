# BeTalent Payment API - Desafio Back-end

API RESTful para gerenciamento de pagamentos multi-gateway, desenvolvida como parte do processo seletivo da BeTalent.

## 🚀 Tecnologias
- **Framework:** AdonisJS v6 (Node.js)
- **Linguagem:** TypeScript
- **Banco de Dados:** MySQL 8.0
- **Containerização:** Docker & Docker Compose
- **Testes:** Japa
- **Validação:** VineJS
- **ORM:** Lucid

## 📋 Requisitos e Funcionalidades
- **Multi-Gateway:** Integração com múltiplos provedores de pagamento.
- **Fallback Automático:** Caso um gateway falhe, o sistema tenta o próximo baseado na prioridade definida no banco.
- **Cálculo no Back-end:** O valor total da compra é calculado no servidor buscando os preços dos produtos.
- **RBAC (Role Based Access Control):** Controle de acesso por papéis (ADMIN, MANAGER, FINANCE, USER).
- **Gestão de Gateways:** Interface administrativa para ativar/desativar gateways e alterar prioridades.
- **Reembolso:** Suporte a estorno de transações aprovadas.

## 🛠️ Como Instalar e Rodar

### 1. Clonar o Repositório
```bash
git clone <url-do-repositorio>
cd testepratico
```

### 2. Configurar o Ambiente
O projeto utiliza variáveis de ambiente para segurança. Crie o arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

### 3. Rodar com Docker (Recomendado)
O projeto está totalmente Dockerizado. Basta um comando para subir o Banco de Dados, os Mocks dos Gateways e a API:
```bash
docker compose up -d --build
```

### 4. Seeders Iniciais
Após os containers subirem, popule os gateways e o usuário admin inicial utilizando o arquivo compilado:
```bash
docker exec -it betalent-api node build/ace.js migration:run
docker exec -it betalent-api node build/ace.js db:seed
```
*Usuário Admin padrão: admin@betalent.tech / password: admin_password_123*

## 🧪 Rodando Testes (TDD)
O projeto foi desenvolvido utilizando TDD. Para garantir a **facilidade de avaliação**, os testes podem ser executados diretamente por dentro do container da API, sem necessidade de configurar o ambiente localmente.

Com os containers rodando, execute o comando abaixo em um novo terminal:
```bash
docker exec -it betalent-api node ace test
```

## 🛣️ Detalhamento de Rotas (Prefixo: `/api/v1`)

### 🔐 Autenticação (Públicas)
- `POST /api/v1/auth/login`: Realiza o login e retorna o Bearer Token.
- `POST /api/v1/auth/logout`: Invalida o token atual (Requer Token).
- `GET /api/v1/auth/me`: Retorna dados do usuário logado (Requer Token).

### 🛒 Vendas (Públicas)
- `POST /api/v1/transactions`: Realiza uma compra informando lista de produtos.

### 💳 Financeiro (Privadas - ADMIN / FINANCE)
- `GET /api/v1/transactions`: Lista todas as transações.
- `POST /api/v1/transactions/:id/refund`: Realiza o estorno de uma transação aprovada.

### ⚙️ Gateways (Privadas - ADMIN)
- `GET /api/v1/gateways`: Lista os gateways cadastrados.
- `PATCH /api/v1/gateways/:id`: Ativa/desativa ou altera a prioridade de um gateway.

### 📦 Produtos (Privadas - ADMIN / MANAGER / FINANCE)
- `GET /api/v1/products`: Lista todos os produtos.
- `POST /api/v1/products`: Cadastra novo produto.
- `PATCH /api/v1/products/:id`: Atualiza dados do produto.
- `DELETE /api/v1/products/:id`: Remove um produto.

### 👥 Usuários (Privadas - ADMIN / MANAGER)
- `GET /api/v1/users`: Lista usuários do sistema.
- `POST /api/v1/users`: Cria novo usuário com Role.
- `PATCH /api/v1/users/:id`: Atualiza dados do usuário.
- `DELETE /api/v1/users/:id`: Remove um usuário.

### 👤 Clientes (Privadas - ADMIN / MANAGER / FINANCE)
- `GET /api/v1/clients`: Lista todos os clientes.
- `GET /api/v1/clients/:id`: Detalhes do cliente e seu histórico completo de compras.

---
Desenvolvido com ❤️ para o teste prático BeTalent.
