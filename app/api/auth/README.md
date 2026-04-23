# Documentação da Rota de Autenticação (BFF)

Este diretório contém a rota de API de autenticação (`route.ts`) desenvolvida nativamente no Next.js. Ela atua como um padrão **Backend-for-Frontend (BFF)**. Sua principal responsabilidade é intermediar o login e gerenciar de forma segura a sessão do usuário na aplicação utilizando cookies blindados.

---

## ⚠️ Estado Atual: Implementação Baseada em Mock

No momento, a autenticação **ESTÁ UTILIZANDO UM SERVIÇO DE MOCK** (simulação).
As credenciais são validadas através da função `loginMock` (importada de `@/mock/auth`), que simula um tempo de resposta e gera um token fictício caso o e-mail e a senha coincidam com os usuários hardcoded de teste.

### 🔄 É necessário usar uma API real depois?
**Sim.** Em um ambiente de produção real, o mock precisará ser substituído. Para fazer a transição para uma autenticação real:
1. Exclua ou substitua a chamada `await loginMock(email, password)`.
2. Faça uma requisição (ex: `fetch` ou `axios`) para o seu servidor/banco de dados real (como uma API FastAPI, Node.js, Firebase ou AWS Cognito).
3. Pegue o token JWT gerado pelo seu servidor real e mantenha a lógica atual de injeção desse token dentro da propriedade `response.cookies.set(...)`. A segurança de cookies atual já está pronta para a produção.

---

## Endpoints Disponíveis

### 1. `POST /api/auth` (Login)
Recebe as credenciais do usuário, realiza a validação e injeta o cookie de sessão no navegador.

- **Corpo da Requisição (JSON)**:
  ```json
  {
    "email": "usuario@exemplo.com",
    "password": "senha_segura"
  }
  ```
- **Sucesso (200 OK)**: Retorna dados inofensivos do usuário (ID, nome, email) e injeta silenciosamente o cabeçalho HTTP `Set-Cookie` com o token.
- **Erro (400 / 401)**: Retorna um status de falha com uma mensagem de validação sem vazar dados sensíveis.

### 2. `DELETE /api/auth` (Logout)
Usado para encerrar ativamente a sessão do usuário no cliente.

- **Comportamento**: Ele instrui o navegador a destruir o cookie atual enviando um cabeçalho `Set-Cookie` com a propriedade `expires` configurada para uma data no passado (ex: 01/01/1970).
- **Retorno (200 OK)**: `{ "message": "Sessão encerrada com sucesso" }`

---

## 🛡️ Contratos de Segurança Aplicados (Já prontos para Produção)
Embora a validação seja *Mock*, a arquitetura de proteção é real. A rota implementa as seguintes diretrizes essenciais de segurança cibernética:

- **Proteção contra XSS**: O token de acesso nunca é exposto em formato JSON de resposta. É armazenado no navegador com a *flag* `httpOnly: true`, o que bloqueia completamente extensões do navegador ou códigos JavaScript (`document.cookie`) maliciosos de lerem esse token.
- **Proteção contra CSRF**: É utilizada a política `sameSite: 'strict'`, assegurando que o cookie com o token só seja repassado para o servidor caso a requisição se origine do mesmo domínio/site exato.
- **Tráfego Seguro (Secure)**: Dinamicamente verifica a variável `NODE_ENV`. Se for ambiente de produção, impõe a regra de que o cookie de sessão só pode transitar em redes criptografadas (HTTPS).