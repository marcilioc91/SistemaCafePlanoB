# 🧾 Sistema de Vendas — Cantina

Sistema web para gerenciamento de vendas de cantina, com controle de clientes, produtos, usuários e registro de vendas.

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | Angular |
| Backend | Java 25 + Spring Boot |
| ORM | Spring Data JPA + Hibernate |
| Banco de dados | SQL Server |
| Build | Maven |
| Utilitários | Lombok |

---

## 🏗️ Arquitetura

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

## 📁 Estrutura do Projeto

```
sistema-vendas/
├── backend/               # Spring Boot (Java)
├── frontend/              # Angular
└── database/
    └── scripts.sql
```

### Backend

```
src/main/java/com/sistemavendas/
├── controller/
│   ├── ClienteController.java
│   ├── ProdutoController.java
│   ├── UsuarioController.java
│   └── VendaController.java
├── service/
│   ├── ClienteService.java
│   ├── ProdutoService.java
│   ├── UsuarioService.java
│   └── VendaService.java
├── repository/
│   ├── ClienteRepository.java
│   ├── ProdutoRepository.java
│   ├── UsuarioRepository.java
│   └── VendaRepository.java
├── entity/
│   ├── Cliente.java
│   ├── Produto.java
│   ├── Usuario.java
│   ├── Venda.java
│   └── VendaProduto.java
├── dto/
│   ├── VendaRequestDTO.java
│   └── VendaProdutoDTO.java
├── config/
│   └── SecurityConfig.java
└── SistemaVendasApplication.java
```

### Frontend

```
src/app/
├── services/
│   ├── produto.service.ts
│   ├── cliente.service.ts
│   └── venda.service.ts
├── pages/
│   ├── produtos/
│   ├── clientes/
│   └── vendas/
└── models/
    ├── produto.ts
    ├── cliente.ts
    └── venda.ts
```

---


## 🔗 Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/produtos` | Lista todos os produtos |
| POST | `/produtos` | Cadastra um novo produto |
| GET | `/clientes` | Lista todos os clientes |
| POST | `/clientes` | Cadastra um novo cliente |
| GET | `/usuarios` | Lista todos os usuários |
| POST | `/usuarios` | Cadastra um novo usuário |
| POST | `/vendas` | Registra uma nova venda |

---

## 🛒 Fluxo de Venda

O registro de uma venda segue as etapas abaixo:

1. Escolher cliente
2. Escolher produtos
3. Definir quantidades
4. Calcular total
5. Salvar venda

O frontend envia o payload para o backend, e o mesmo cria o registro de vendas e baixa o estoque dos itens vendidos.

---

## 📌 Melhorias planejadas

- [ ] Autenticação com JWT
- [ ] Uso de DTOs com MapStruct
- [ ] Paginação nas listagens
- [ ] Relatório de vendas
- [ ] Controle de estoque aprimorado
- [ ] Refatoração para Clean Architecture
