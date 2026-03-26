# 🧾 Sistema de Vendas — Cantina

Sistema web para gerenciamento de vendas de cantina, com controle de clientes, produtos, usuários e registro de vendas.

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | Angular |
| Backend | Java 21 + Spring Boot |
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

## ⚙️ Configuração

### Banco de dados

No arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=sistemavendas
spring.datasource.username=sa
spring.datasource.password=123456

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
```

### Dependências Maven (pom.xml)

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>com.microsoft.sqlserver</groupId>
        <artifactId>mssql-jdbc</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
</dependencies>
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

O frontend envia o seguinte payload para o backend:

```json
{
  "clienteId": 1,
  "usuarioCpf": "12345678900",
  "produtos": [
    {
      "produtoId": 1,
      "quantidade": 2
    }
  ]
}
```

O backend então:

1. Cria o registro na tabela `VENDA`
2. Cria os registros na tabela `VENDA_PRODUTO`
3. Baixa o estoque dos produtos vendidos

---

## 🗃️ Modelo de Dados

| Tabela | Campos principais |
|---|---|
| `CLIENTE` | id, nome, cpf, telefone, obs |
| `PRODUTO` | id, nome, preco, estoque |
| `USUARIO` | cpf, nome, email, senha, dataCriacao |
| `VENDA` | id, cliente_id, usuario_cpf, dataVenda |
| `VENDA_PRODUTO` | id, venda_id, produto_id, quantidade, precoUnitario |

---

## 🚀 Como executar

### Backend

```bash
# Na pasta /backend
mvn spring-boot:run
```

A API ficará disponível em `http://localhost:8080`.

### Frontend

```bash
# Na pasta /frontend
npm install
ng serve
```

A aplicação ficará disponível em `http://localhost:4200`.

---

## 📌 Melhorias planejadas

- [ ] Autenticação com JWT
- [ ] Uso de DTOs com MapStruct
- [ ] Paginação nas listagens
- [ ] Relatório de vendas
- [ ] Controle de estoque aprimorado
- [ ] Refatoração para Clean Architecture
