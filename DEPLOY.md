# Guia de Empacotamento — Opção 2 (jpackage)

> Resultado final: um instalador `.exe` do Windows que embute o Angular dentro do Spring Boot e
> inclui o Java (JRE) no próprio instalador. O usuário instala e abre pelo navegador em `localhost:8080`.

---

## Pré-requisitos

| Ferramenta | Versão mínima | Observação |
|---|---|---|
| JDK | 17+ | `jpackage` está incluso — **não é o JRE** |
| Maven | 3.8+ | Para buildar o backend |
| Node / npm | 18+ | Para buildar o frontend |
| WiX Toolset | 3.x | Necessário no Windows para gerar `.exe` — [download](https://wixtoolset.org/releases/) |

Verifique se o `jpackage` está disponível:
```bash
jpackage --version
```

---

## Passo 1 — Configurar o output do Angular

Em `frontend/angular.json`, altere o `outputPath` do build para apontar à pasta `static` do backend:

```json
"outputPath": "../backend/src/main/resources/static"
```

> Isso faz com que `ng build` já coloque os arquivos no lugar certo automaticamente.

---

## Passo 2 — Adicionar fallback de rota no Spring Boot

O Angular usa roteamento pelo lado do cliente. Se o usuário acessar `/home` diretamente,
o Spring Boot vai responder 404 porque não conhece essa rota.

Crie um controller no backend que redireciona qualquer rota desconhecida para o `index.html`:

```java
// src/main/java/.../controller/SpaController.java
@Controller
public class SpaController {
    @RequestMapping(value = "{path:[^\\.]*}")
    public String redirecionar() {
        return "forward:/index.html";
    }
}
```

---

## Passo 3 — Buildar o Angular

```bash
cd frontend
ng build --configuration production
```

Os arquivos gerados já vão para `backend/src/main/resources/static/`.

---

## Passo 4 — Buildar o JAR do Spring Boot

```bash
cd backend
mvn clean package -DskipTests
```

O JAR estará em `backend/target/backend-0.0.1-SNAPSHOT.jar`.

Antes de continuar, teste localmente:
```bash
java -jar backend/target/backend-0.0.1-SNAPSHOT.jar
```
Acesse `http://localhost:8080` e confirme que o sistema abre corretamente.

---

## Passo 5 — Gerar o instalador com jpackage

Execute a partir da raiz do projeto:

```bash
jpackage \
  --input backend/target \
  --main-jar backend-0.0.1-SNAPSHOT.jar \
  --name "SistemaCafe" \
  --app-version "1.0.0" \
  --vendor "Seu Nome" \
  --win-shortcut \
  --win-menu \
  --type exe
```

O instalador `SistemaCafe-1.0.0.exe` será gerado na pasta atual.

### Opções úteis do jpackage

| Flag | O que faz |
|---|---|
| `--icon icone.ico` | Ícone do atalho/instalador |
| `--win-dir-chooser` | Deixa o usuário escolher a pasta de instalação |
| `--type app-image` | Gera uma pasta pronta (sem instalador, não precisa do WiX) |
| `--dest ./saida` | Define onde o instalador será gerado |

---

## Observações importantes

**Banco de dados:** se o projeto usa banco de dados local (H2, SQLite), ele já fica embutido.
Se usa PostgreSQL, MySQL ou similar, o banco precisa estar acessível na máquina onde o sistema rodar — o `jpackage` não empacota o banco.

**Porta 8080:** o sistema continuará usando a porta 8080. Se ela estiver ocupada na máquina do usuário, será necessário configurar outra porta em `application.properties`:
```properties
server.port=8081
```

**Atualização:** para distribuir uma nova versão, repita os passos 3 a 5 e distribua o novo `.exe`.
O instalador substituirá a versão anterior se o usuário rodar por cima.
