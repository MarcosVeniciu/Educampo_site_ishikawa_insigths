# 📱 Diretório Raiz da Aplicação (`/app`)

Este é o diretório principal do frontend da aplicação **Educampo Insights**, construído utilizando o **Next.js App Router**. 
Ele é responsável por definir toda a árvore de rotas (páginas), layouts compartilhados e os endpoints da nossa API intermediária (BFF).

---

## 📂 Estrutura de Diretórios e Códigos

A arquitetura de pastas segue as convenções do Next.js (onde pastas definem as rotas da URL e arquivos como `page.tsx` e `layout.tsx` definem a interface).

### 1. 🔒 Rotas Privadas (`/(painel)`)
Um **Route Group** (indicado pelos parênteses) que agrupa as páginas logadas da aplicação sem adicionar `/painel` na URL. Todas as páginas aqui compartilham um `layout.tsx` que contém o menu lateral (Sidebar) e são protegidas por Middleware.
- **`/dashboard`**: Tela gerencial principal com o resumo dos 4 pilares da fazenda.
- **`/diagnostico/[tipo]`**: Rota dinâmica que exibe os Diagramas de Ishikawa (Causas e Efeitos) gerados pela IA.
- **`/simulacao`**: Ferramenta interativa de cenários (*What-if*) para projetar impactos financeiros e produtivos.
- **`/configuracoes`**: Gerenciamento de preferências do usuário e execução do Logout seguro.

### 2. ⚙️ Backend-For-Frontend (`/api`)
Atua como um Proxy Reverso e camada de segurança entre o navegador e o backend real (FastAPI/IA).
- **`/api/auth`**: Gerencia o Login e Logout, convertendo credenciais em **Cookies HttpOnly** para segurança máxima contra ataques XSS e CSRF. (Atualmente utilizando Mocks de dados).
- **`/api/diagnostico`**: Contém as sub-rotas (`/ccs`, `/hectare`, `/produtividade`, `/trabalhador`) que repassam de forma segura as requisições para a Inteligência Artificial do Educampo, ocultando tokens de API do navegador.

### 3. ⏳ Orquestração de Dados (`/carregando`)
Página de transição crucial (Fase 4 do fluxo). Após o login, o usuário é enviado para cá. A página dispara chamadas simultâneas (Promises) para a `/api/diagnostico`, salva as respostas da IA no estado global (Zustand) e, só então, redireciona o usuário para o `/dashboard`.

### 4. 🔐 Autenticação (`/login`)
Ponto de entrada público da aplicação. Coleta as credenciais do usuário, comunica-se com a `/api/auth` e gerencia os estados iniciais da fazenda antes de iniciar a sessão.

---

## 🏗️ Arquitetura e Padrões Adotados

- **Server Components vs Client Components**: 
  - Arquivos de roteamento estrutural e layouts (como o `app/(painel)/layout.tsx`) priorizam ser *Server Components* por padrão, melhorando a performance e o SEO.
  - Páginas altamente interativas (como `/simulacao` e `/login`) utilizam a diretiva `"use client"` no topo do arquivo para acessar hooks (`useState`, `useAppStore`) e eventos do navegador.
  
- **Segurança de Sessão (*Zero-Token-Exposure*)**:
  Nenhum token JWT é armazenado no `localStorage` ou manipulado no cliente. A pasta `app/api/auth` gerencia inteiramente a sessão através de cabeçalhos de resposta HTTP (`Set-Cookie: httpOnly; secure; sameSite=strict`), e as páginas protegidas validam esse cookie via Middleware (localizado na raiz do projeto).

- **Gerenciamento de Estado**:
  As páginas não fazem *fetch* de dados isoladamente (evitando redundância). A lógica é centralizada: a página `/carregando` busca os dados e os injeta na Store Global (`Zustand`), tornando a navegação entre `/dashboard`, `/diagnostico` e `/simulacao` praticamente instantânea (*Zero-Fetch na navegação*).

---

## 📄 Arquivos Especiais do Next.js

Dentro dos diretórios acima, você encontrará comumente os seguintes arquivos reservados do Next.js:
- `page.tsx`: A interface de usuário (UI) principal exclusiva de uma rota.
- `layout.tsx`: A UI compartilhada entre uma rota e seus filhos (ex: Cabeçalhos, Menus).
- `route.ts`: Utilizado exclusivamente na pasta `/api` para criar endpoints HTTP customizados (GET, POST, DELETE).
- `README.md`: Documentação específica detalhando o escopo e regras de negócio daquela rota (presentes em quase todos os subdiretórios).