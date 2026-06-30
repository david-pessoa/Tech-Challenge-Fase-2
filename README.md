# API de Gerenciamento de Posts
API backend para cadastro de usuários, autenticação via JWT e gerenciamento de posts com controle de perfis.
O sistema permite criar, listar, buscar, atualizar, excluir e marcar posts como visualizados.

## Problema
Em cenários acadêmicos ou de comunicação interna, é comum precisar publicar conteúdos, controlar quem pode criar materiais e registrar quem já visualizou cada postagem.
Sem uma API centralizada, esse fluxo fica disperso e difícil de auditar.

## Solução
Foi construída uma API REST em Node.js para gerenciar usuários, roles, autenticação, posts e visualizações.
A solução organiza o fluxo com Express, TypeORM, PostgreSQL e JWT, além de documentação Swagger disponível em `/docs`.

## Responsabilidades
Neste repositório, a responsabilidade foi desenvolver o backend da aplicação, incluindo:
- modelagem das entidades e migrations
- autenticação com JWT
- autorização por perfil de acesso
- CRUD de posts
- cadastro e login de usuários
- registro de visualização de posts por alunos
- documentação da API

## Funcionalidades
- Cadastro de usuários com senha criptografada
- Login com geração de token JWT
- CRUD de posts com controle de acesso por role
- Busca de posts por termo
- Marcação de post como visualizado por aluno
- Swagger UI para exploração da API

## Tecnologias
- Node.js
- TypeScript
- Express
- PostgreSQL
- TypeORM
- JWT
- bcryptjs
- Zod
- Swagger UI
- Docker e Docker Compose
- Jest e Supertest

## Arquitetura
Fluxo principal da aplicação:

```text
Cliente
    ⬇︎
Rotas Express
    ⬇︎
Middleware de autenticação e autorização
    ⬇︎
Controllers
    ⬇︎
Services
    ⬇︎
Repositories / TypeORM
    ⬇︎
PostgreSQL
```

O `authMiddleware` valida o token JWT e injeta o usuário autenticado na requisição.
As rotas de posts usam `authorizeRoles` para restringir operações de escrita a `PROFESSOR` e `ADMIN`.
Quando um `ALUNO` acessa um post pelo endpoint de detalhe, a visualização é registrada automaticamente.

## Como rodar
### Instalação
```bash
npm install
```

Antes de executar, crie o arquivo `.env` com base em `.env.example` e preencha os valores necessários.

### Como rodar localmente
```bash
npm run dev
```

O projeto executa as migrations na inicialização da aplicação.
Se preferir subir a versão compilada:
```bash
npm run build
npm run start
```

Se quiser rodar as migrations manualmente após compilar:
```bash
npm run build
npm run migration:run
```

### Como rodar com Docker
```bash
docker compose up -d --build
```

Para encerrar os containers:
```bash
docker compose down
```

## Variáveis de ambiente
Crie um arquivo `.env` a partir de [.env.example](./.env.example).

| Variável | Exemplo | Obrigatória | Descrição |
| --- | --- | --- | --- |
| `PORT` | `3000` | Sim (apenas quando rodar localmente) | Porta da API |
| `DB_HOST` | `localhost` ou `postgres` | Sim | Host do banco PostgreSQL |
| `DB_PORT` | `5432` | Não | Porta do banco |
| `DB_USERNAME` | `postgres` | Sim | Usuário do banco |
| `DB_PASSWORD` | `postgres` | Sim | Senha do banco |
| `DB_DATABASE` | `tech_challenge` | Sim | Nome do banco |
| `JWT_SECRET` | `uma-chave-forte` | Sim | Chave usada para assinar o JWT |
| `JWT_EXPIRES_IN` | `1d` | Não | Tempo de expiração do token |

## Endpoints
| Método | Rota | Autenticação | Permissão | Descrição |
| --- | --- | --- | --- | --- |
| `GET` | `/docs` | Não | - | Documentação Swagger da API |
| `POST` | `/api/user` | Sim | `PROFESSOR`, `ADMIN` | Cadastra um novo usuário |
| `POST` | `/api/auth/login` | Não | - | Realiza login e retorna token JWT |
| `GET` | `/api/posts` | Sim | Qualquer usuário autenticado | Lista todos os posts |
| `GET` | `/api/posts/search?termo=...` | Sim | Qualquer usuário autenticado | Busca posts por termo |
| `GET` | `/api/posts/:id` | Sim | Qualquer usuário autenticado | Retorna um post pelo ID e registra visualização se o usuário for `ALUNO` |
| `POST` | `/api/posts` | Sim | `PROFESSOR`, `ADMIN` | Cria um novo post |
| `PUT` | `/api/posts/:id` | Sim | `PROFESSOR`*, `ADMIN` | Atualiza um post |
| `DELETE` | `/api/posts/:id` | Sim | `PROFESSOR`*, `ADMIN` | Remove um post |
| `POST` | `/api/post-visto/:postId/:userId` | Sim | Qualquer usuário autenticado | Marca um post como visualizado |

> [!NOTE]
> *OBS: Quando um usuário professor cria um post, ele será o único professor que poderá editá-lo. Contudo, administradores podem realizar todas as ações de CRUD com qualquer post, mesmo não tendo criado o post.

## Autenticação
A autenticação é feita com JWT.
O endpoint `/api/auth/login` valida matrícula e senha, retorna o token e os dados básicos do usuário.

Nas rotas protegidas, o cliente deve enviar o header:
```http
Authorization: Bearer <token>
```

O middleware `authMiddleware` valida o token, busca o usuário no banco e anexa os dados à requisição.
Depois disso, `authorizeRoles` restringe o acesso conforme o perfil:
- `ALUNO`: leitura de posts e marcação de visualização
- `PROFESSOR` e `ADMIN`: criação, edição e exclusão de posts

## Decisões técnicas
- Usei JWT para manter a API stateless e simplificar a autenticação.
- Usei roles no banco para centralizar a autorização por perfil.
- A visualização de posts fica em uma tabela própria (`post_views`) com restrição de unicidade por usuário e post, evitando duplicidade.
- As migrations são versionadas com TypeORM para manter o schema reproduzível.
- A documentação em OpenAPI facilita testes e consumo da API.

## Melhorias futuras
- Adicionar paginação nas listagens de posts
- Padronizar validações de entrada em todos os endpoints com schemas reutilizáveis
- Implementar refresh token
- Criar seeds automáticas para ambientes de desenvolvimento
- Melhorar o tratamento de erros com respostas mais consistentes
