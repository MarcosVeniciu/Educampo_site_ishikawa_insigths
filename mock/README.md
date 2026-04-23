# 🎭 Mock (Simulação de Dados e Serviços)

Este diretório contém bancos de dados simulados e serviços fictícios utilizados pela aplicação Educampo Insights.

A principal função deste módulo é permitir o desenvolvimento fluido do frontend e a execução de testes automatizados de interface e segurança (TDD e Shift-Left Testing) de forma isolada, sem depender da disponibilidade de uma API real (como FastAPI ou um banco de dados).

---

## 📂 Estrutura do Diretório

- **`auth.ts`**: Contém a simulação completa do fluxo de autenticação, geração de tokens e controle de acesso.

---

## 🛠️ Principais Recursos (`auth.ts`)

### 👥 Usuários Simulados (`mockUsers`)
Um array contendo os usuários de teste da aplicação, simulando uma base de dados real, com seus respectivos perfis (`PRODUTOR`, `TECNICO`, `ADMIN`) e credenciais de acesso.

### 🔐 Simulação de Login (`loginMock`)
Função assíncrona que simula o endpoint de login.
- Valida as credenciais fornecidas (e-mail e senha).
- Introduz uma latência artificial aleatória para simular o tempo de resposta de rede e servidor.
- Gera e retorna um **Token JWT Fictício** codificado em Base64 e os dados inofensivos do usuário.

### 🛡️ Validação de Sessão (`verifyTokenMock`)
Função que simula o middleware de proteção de rotas privadas.
- Recebe o token JWT fictício.
- Decodifica o payload com segurança (suportando tanto o ambiente do Node.js quanto o do Navegador).
- Retorna os dados do usuário se o token for válido e corresponder a um usuário ativo.

---

## 💡 Exemplo de Integração (BFF)

Esses mocks são consumidos principalmente pelas rotas internas BFF (Backend-For-Frontend) localizadas em `app/api/...`:

```typescript
import { loginMock } from '@/mock/auth';

// Dentro do handler da rota /api/auth
const { token, user } = await loginMock(email, password);
// Em seguida, injeta o token nos cookies...
```

---

## ⚠️ ATENÇÃO - Ambiente de Produção

**Esta é uma estrutura temporária para viabilizar o desenvolvimento e testes.**
Em um cenário de produção real, as chamadas para funções como `loginMock` e `verifyTokenMock` deverão ser substituídas por integrações de fato (ex: requisições HTTP `fetch`) direcionadas ao backend verdadeiro (FastAPI, Node.js, AWS Cognito, etc.). As senhas presentes neste diretório são estritamente fictícias.