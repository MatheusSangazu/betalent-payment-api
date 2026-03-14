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

## 🧪 Rodando Testes
Para executar os testes automatizados:
```bash
docker exec -it betalent-api npm test
```

## 🛣️ Detalhamento de Rotas

### Públicas
- `POST /api/login`: Autenticação de usuários.
- `POST /api/transactions`: Realizar uma nova compra informando lista de produtos.

### Privadas (Requerem Bearer Token)
- **Gateways (ADMIN):**
  - `GET /api/gateways`: Listar gateways.
  - `PATCH /api/gateways/:id`: Alterar status ou prioridade.
- **Transações (ADMIN/FINANCE):**
  - `GET /api/transactions`: Listar histórico com filtros.
  - `POST /api/transactions/:id/refund`: Realizar estorno.
- **Produtos (ADMIN/MANAGER/FINANCE):**
  - `CRUD /api/products`: Gerenciamento de catálogo.
- **Usuários (ADMIN/MANAGER):**
  - `CRUD /api/users`: Gestão de membros da equipe.
- **Clientes (ADMIN/MANAGER/FINANCE):**
  - `GET /api/clients`: Listar todos.
  - `GET /api/clients/:id`: Perfil detalhado com histórico de compras.

---
Desenvolvido com ❤️ para o teste prático BeTalent.
