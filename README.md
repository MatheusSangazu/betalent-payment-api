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

## 🛠️ Pré-requisitos
Antes de começar, você precisará ter instalado em sua máquina:
- [Docker](https://www.docker.com/get-started) & [Docker Compose](https://docs.docker.com/compose/install/)
- Um cliente para testes de API (Recomendado: [Postman](https://www.postman.com/))

## 🚀 Como Instalar e Rodar

### 1. Clonar o Repositório
```bash
git clone https://github.com/MatheusSangazu/betalent-payment-api
```

### 2. Configurar o Ambiente
O projeto utiliza variáveis de ambiente para segurança. Crie o arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

### 3. Inicializar Dependências e TypeScript
Antes de subir os containers, entre na pasta da aplicação e instale as dependências locais para garantir que o TypeScript e os comandos do AdonisJS (Ace) funcionem corretamente:

```bash
cd betalent-payment-api
npm install
cd ..
```

### 4. Rodar com Docker (Recomendado)
Certifique-se de estar na **raiz do projeto** (onde está o arquivo `docker-compose.yml`) e execute:
```bash
docker compose up -d --build
```

### 4. Setup do Banco de Dados
Após os containers subirem, você precisa criar as tabelas e popular os dados iniciais:
```bash
# 1. Cria as tabelas no banco de dados
docker exec -it betalent-api node ace migration:run

# 2. Popula gateways, produtos e usuário admin
docker exec -it betalent-api node ace db:seed
```
*   **O que o seed cria:** Gateways 1 e 2, 3 produtos de exemplo e um usuário Admin.
*   **Usuário Admin padrão:** `admin@betalent.tech` / **password:** `admin_password_123`

## 🤓🧗 Desafios e Aprendizados

Durante o desenvolvimento deste desafio, enfrentei alguns obstáculos técnicos interessantes que me ajudaram a evoluir a arquitetura do projeto:

### 1. Isolamento de Dados em Testes Automatizados
Um dos maiores desafios foi garantir que os testes automatizados não interferissem no ambiente de uso manual (Postman).
- **Problema:** Um dos testes exige desativar todos os gateways para validar o erro de configuração. Ao rodar esse teste, o banco de dados principal ficava com os gateways desligados, quebrando os testes manuais no Postman logo em seguida.
- **Solução Sênior:** Implementei **Transações Globais com Rollback** nos hooks de teste do AdonisJS. Agora, cada teste abre uma transação, realiza suas operações e sofre um rollback automático ao final. Isso garante que o banco de dados MySQL permaneça sempre no estado original do seeder, permitindo que a avaliação via Postman ocorra sem atritos logo após a execução da suíte de testes.

### 2. Paridade de Ambiente (MySQL vs SQLite)
Inicialmente cogitei usar SQLite para os testes por ser mais rápido, mas decidi manter o **MySQL 8.0** também na suíte de testes.
- **Motivo:** Garantir 100% de paridade entre o que é testado e o que roda em produção, evitando comportamentos divergentes em tipos de dados específicos ou constraints de banco.

### 3. Orquestração de Microserviços
Integrar dois gateways diferentes com comportamentos de autenticação e payloads distintos (um em inglês, outro em português) exigiu uma abstração sólida usando o **Adapter Pattern**, facilitando o escalonamento para novos gateways no futuro.

## 🧪 Rodando Testes (TDD)
O projeto foi desenvolvido utilizando TDD. Para garantir a **máxima integridade e isolamento dos dados**, os testes utilizam um banco de dados MySQL dedicado (`betalent_db_test`), o que garante:
- **Isolamento Total:** Rodar os testes **não apaga ou modifica** os dados que você criou no banco principal (`betalent_db`) via Postman.
- **Confiabilidade:** Os testes rodam diretamente no motor MySQL 8.0, garantindo paridade total com o ambiente de produção.

> **Nota sobre o Framework de Testes:** Utilizamos o **Japa** (japa.dev), que é a biblioteca de testes oficial e padrão recomendada pelo ecossistema AdonisJS v6. O nome é uma marca registrada do framework e não possui qualquer conotação negativa no contexto de desenvolvimento de software.

Com os containers rodando, execute o comando abaixo em um novo terminal:
```bash
docker exec -it betalent-api node ace test
```

## 💡 Solução de Problemas

### Conflito de Nomes de Container
Se você encontrar um erro dizendo que o nome do container já está em uso, execute:
```bash
docker compose down
docker rm -f betalent-gateways-mock betalent-api betalent-mysql
docker compose up -d --build
```

## 🚹 Testando com Postman
Para facilitar a sua avaliação, disponibilizamos uma **Collection do Postman** já configurada com todas as rotas da API.

1.  Importe o arquivo `betalent_payment_api_collection.json` (na raiz deste repositório) no seu Postman.
2.  A collection já vem com as variáveis `base_url` pré-configuradas.
3.  **Dica:** Ao realizar o login, o token será salvo automaticamente na variável `{{token}}` da collection, permitindo testar as rotas privadas sem esforço.

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
