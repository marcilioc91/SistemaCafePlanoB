# Relatório de Modificações — Integração Frontend × Backend

## Problema

O frontend (Angular 21) e o backend (Spring Boot 4) estavam estruturados mas **não se comunicavam**. Os principais bloqueios eram:

1. O `HttpClient` do Angular não estava registrado como provider — qualquer chamada HTTP falharia com `NullInjectorError`
2. O backend não tinha configuração de CORS — requisições do frontend (porta 4200) para o backend (porta 8080) seriam bloqueadas pelo navegador
3. A maioria dos controllers e services do backend estavam vazios (stubs) — apenas `ProdutoController/ProdutoService` funcionavam
4. Os DTOs de Venda estavam vazios, impossibilitando o recebimento dos dados do frontend
5. O `ClienteService` do frontend estava vazio e o model `Cliente` não tinha campos definidos
6. O `UsuarioRepository` usava `Integer` como tipo da PK, mas a entidade `Usuario` usa `String` (CPF)

---

## Modificações Realizadas

### Frontend

| Arquivo | Alteração |
|---------|-----------|
| `src/app/app.config.ts` | Adicionado `provideHttpClient(withFetch())` aos providers para habilitar o `HttpClient` em toda a aplicação |
| `src/app/services/cliente.service.ts` | Implementado com métodos `listar()` e `salvar()` apontando para `http://localhost:8080/clientes` |
| `src/app/models/cliente.ts` | Convertido de `class` vazia para `interface` com campos: `id`, `nome`, `cpf`, `telefone`, `obs` (espelhando a entidade do backend) |

### Backend — Configuração

| Arquivo | Alteração |
|---------|-----------|
| `config/SecurityConfig.java` | Implementado com `@Configuration` e `WebMvcConfigurer` habilitando CORS para origens `localhost:4200` e `localhost:4000`, métodos GET/POST/PUT/DELETE/OPTIONS |

### Backend — Controllers

| Arquivo | Alteração |
|---------|-----------|
| `controller/ClienteController.java` | Implementado com `@RestController` em `/clientes`, endpoints GET (listar) e POST (salvar) |
| `controller/UsuarioController.java` | Implementado com `@RestController` em `/auth`, endpoint POST `/login` com validação de credenciais e resposta 401 para login inválido |
| `controller/VendaController.java` | Implementado com `@RestController` em `/vendas`, endpoint POST recebendo `VendaRequestDTO` |

### Backend — Services

| Arquivo | Alteração |
|---------|-----------|
| `service/ClienteService.java` | Implementado com métodos `listar()` e `salvar()` usando `ClienteRepository` |
| `service/UsuarioService.java` | Implementado com método `autenticar(cpf, senha)` que busca usuário por CPF e valida senha |
| `service/VendaService.java` | Implementado com método `realizarVenda()` usando `@Transactional`: cria a venda, persiste itens em `VendaProduto` com preço unitário do produto, e atualiza o estoque |

### Backend — DTOs

| Arquivo | Alteração |
|---------|-----------|
| `dto/VendaRequestDTO.java` | Implementado com campos `clienteId`, `usuarioCpf` e `List<VendaProdutoRequestDTO> produtos` (compatível com o JSON enviado pelo frontend) |
| `dto/VendaProdutoRequestDTO.java` | Implementado com campos `produtoId` e `quantidade` |

### Backend — Repository

| Arquivo | Alteração |
|---------|-----------|
| `repository/UsuarioRepository.java` | Corrigido tipo genérico de `JpaRepository<Usuario, Integer>` para `JpaRepository<Usuario, String>`, pois a PK da entidade `Usuario` é o campo `cpf` (String) |

---

## Mapeamento de Endpoints (Frontend → Backend)

| Frontend Service | Método | URL Backend | Controller | Status |
|-----------------|--------|-------------|------------|--------|
| `AuthService.login()` | POST | `/auth/login` | `UsuarioController` | Implementado |
| `ProdutoService.listar()` | GET | `/produtos` | `ProdutoController` | Já existia |
| `ProdutoService.salvar()` | POST | `/produtos` | `ProdutoController` | Já existia |
| `VendaService.realizarVenda()` | POST | `/vendas` | `VendaController` | Implementado |
| `ClienteService.listar()` | GET | `/clientes` | `ClienteController` | Implementado |
| `ClienteService.salvar()` | POST | `/clientes` | `ClienteController` | Implementado |

---

## Observações

- A autenticação implementada é básica (comparação direta de CPF/senha). Para produção, recomenda-se usar Spring Security com hashing de senhas (BCrypt) e tokens JWT.
- O `application.properties` não foi alterado pois já existe localmente com dados sensíveis (não versionado).
- As URLs da API estão hardcoded nos services do frontend. Para múltiplos ambientes, considerar usar `environment.ts` do Angular.
