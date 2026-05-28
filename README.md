# Sistema Porto Cabral — Cantina

Sistema web e desktop para gerenciamento de vendas de cantina, com controle de clientes, produtos, usuários, auditoria e relatórios.

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | Angular 21.2 (Standalone Components) |
| UI Components | Angular Material 21.2 + Bootstrap 5.3.8 |
| Backend | Java 25 + Spring Boot 4.0.4 |
| ORM | Spring Data JPA + Hibernate |
| Banco de dados | SQL Server |
| Build | Maven (backend) · Angular CLI (frontend) |
| Desktop | Electron 41.5 + NSIS (Windows installer) |
| Utilitários | Lombok · ngx-mask · BCryptPasswordEncoder |

---

## Arquitetura

```
Angular (Frontend)
        ↓
REST API (HTTP / JSON)
        ↓
Spring Boot (Backend)
        ↓
JPA / Hibernate
        ↓
SQL Server
```

---

## Estrutura do Projeto

```
sistema-porto-cabral/
├── backend/               # Spring Boot (Java)
├── frontend/              # Angular + Electron
├── Annotations/
│   └── novaEstrutura.sql  # Scripts do banco de dados
└── build-release.bat      # Build do app desktop
```

### Backend

```
src/main/java/com/sistemaportocabral/backend/
├── config/
│   └── SecurityConfig.java           # BCrypt + CORS
├── controller/
│   ├── AuditoriaController.java
│   ├── ClienteController.java
│   ├── ProdutoController.java
│   ├── SpaController.java
│   ├── UsuarioController.java
│   └── VendaController.java
├── dto/
│   ├── AtualizarPerfilDTO.java
│   ├── CadastroRequestDTO.java
│   ├── LoginRequestDTO.java
│   ├── PagamentoRequestDTO.java
│   ├── RelatorioInventarioItemDTO.java
│   ├── ResetSenhaDTO.java
│   ├── VendaProdutoRequestDTO.java
│   └── VendaRequestDTO.java
├── entity/
│   ├── AuditoriaLog.java
│   ├── Cliente.java
│   ├── PerfilUsuario.java            # Enum: ADMIN, OPERADOR
│   ├── Pessoa.java
│   ├── Produto.java
│   ├── Usuario.java
│   ├── Venda.java
│   └── VendaItem.java
├── repository/
│   ├── AuditoriaLogRepository.java
│   ├── ClienteRepository.java
│   ├── PessoaRepository.java
│   ├── ProdutoRepository.java
│   ├── UsuarioRepository.java
│   └── VendaRepository.java
├── service/
│   ├── AuditoriaService.java
│   ├── ClienteService.java
│   ├── ProdutoService.java
│   ├── UsuarioService.java
│   └── VendaService.java
├── util/
│   └── ValidacaoUtil.java            # Validação de CPF e email
└── SistemaPortoCabralApplication.java
```

### Frontend

```
src/app/
├── guards/
│   ├── auth.guard.ts                 # loginGuard
│   └── login.guard.ts                # adminGuard
├── models/
│   ├── auditoria.ts
│   ├── cliente.ts
│   ├── produto.ts
│   ├── usuario.ts
│   └── venda.ts
├── pages/
│   ├── auditoria/
│   ├── cadastro-modal/
│   ├── clientes/
│   ├── gerenciar-usuarios/
│   ├── historico-vendas/
│   ├── home/
│   ├── login/
│   ├── produto-form/
│   ├── produtos/
│   ├── relatorio-inventario/
│   └── vendas/
├── services/
│   ├── auth.service.ts
│   ├── auditoria.service.ts
│   ├── cliente.service.ts
│   ├── produto.service.ts
│   └── venda.service.ts
├── footer/
└── utils/
    └── utils.ts
```

---

## Endpoints da API

### Autenticação (`/auth`)

| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| POST | `/auth/login` | Autenticar usuário | Todos |
| POST | `/auth/cadastro` | Cadastrar novo usuário | Todos |
| GET | `/auth/usuarios` | Listar usuários | ADMIN |
| PATCH | `/auth/usuarios/{id}/reset-senha` | Redefinir senha | ADMIN |
| PATCH | `/auth/usuarios/{id}/perfil` | Alterar perfil | ADMIN |

### Clientes (`/clientes`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/clientes` | Listar todos |
| POST | `/clientes` | Criar cliente |
| PUT | `/clientes/{id}` | Atualizar cliente |
| DELETE | `/clientes/{id}` | Excluir cliente |

### Produtos (`/produtos`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/produtos` | Listar todos (ordenado por nome) |
| POST | `/produtos` | Criar produto |
| PUT | `/produtos/{id}` | Atualizar produto |
| DELETE | `/produtos/{id}` | Excluir produto |

### Vendas (`/vendas`)

| Método | Rota | Descrição | Perfil |
|---|---|---|---|
| POST | `/vendas` | Realizar nova venda | Todos |
| GET | `/vendas` | Listar todas | Todos |
| GET | `/vendas/cliente/{clienteId}` | Listar por cliente | Todos |
| PATCH | `/vendas/{id}/pagamento` | Atualizar pagamento | Todos |
| PUT | `/vendas/{id}/itens` | Editar itens da venda | Todos |
| GET | `/vendas/relatorio/inventario` | Relatório de inventário | ADMIN |

### Auditoria (`/auditoria`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/auditoria` | Listar logs (filtro opcional por `usuarioId`) |

---

## Banco de Dados

### Diagrama simplificado

```
PESSOA ──────┬── USUARIO
             └── CLIENTE ── VENDA ── VENDA_ITEM ── PRODUTO
                                 └── AUDITORIA_LOG
```

### Tabelas

| Tabela | Campos principais |
|---|---|
| `PESSOA` | id, nome, cpf (unique), telefone |
| `USUARIO` | id, pessoa_id, usuario_login, email, senha (BCrypt), perfil, data_criacao |
| `CLIENTE` | id, pessoa_id, obs |
| `PRODUTO` | id, nome, preco, preco_custo, estoque |
| `VENDA` | id, cliente_id, usuario_id, forma_pagamento, valor_pago, data_venda |
| `VENDA_ITEM` | id, venda_id, produto_id, quantidade, preco_unitario |
| `AUDITORIA_LOG` | id, usuario_id, usuario_nome, tipo_operacao, descricao, data_hora |

---

## Perfis de Usuário

| Perfil | Acesso |
|---|---|
| `OPERADOR` | Clientes, produtos, vendas, histórico, auditoria |
| `ADMIN` | Tudo acima + relatório de inventário + gerenciar usuários |

---

## Fluxo de Venda

1. Selecionar cliente (autocomplete)
2. Adicionar produtos ao carrinho
3. Confirmar forma de pagamento e valor pago
4. Backend cria a venda, baixa o estoque e registra a auditoria

### Formas de pagamento suportadas

`DINHEIRO` · `PIX` · `CARTAO_CREDITO` · `CARTAO_DEBITO` · `VOUCHER` · `PENDENTE`

---

## Funcionalidades

- **Autenticação**: login com BCrypt, sessão em sessionStorage, guards de rota
- **Cadastro**: cria automaticamente Pessoa + Usuário + Cliente
- **Clientes**: CRUD, visualização de histórico de compras, exclusão em cascata
- **Produtos**: CRUD, controle de estoque com validação anti-negativo
- **Vendas**: carrinho dinâmico, cálculo de total, confirmação de pagamento
- **Histórico de vendas**: agrupado por cliente, filtros por mês/ano/status, edição de itens e pagamentos
- **Relatório de inventário**: receita, custo e lucro por produto (ADMIN)
- **Auditoria**: log de todas as operações com filtros por usuário e data
- **Gerenciar usuários**: reset de senha e alteração de perfil (ADMIN)
- **App desktop**: instalador NSIS para Windows via Electron

---

## Executar localmente

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Porta padrão: `8080`

### Frontend

```bash
cd frontend
npm install
npm start
```

Porta padrão: `4200`

### App desktop (Electron)

```bash
cd frontend
npm run electron
```

### Build de distribuição

```bat
build-release.bat
```
