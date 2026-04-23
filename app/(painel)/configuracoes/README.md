# ⚙️ Tela de Configurações (`/configuracoes`)

Este diretório contém a página de configurações gerais da aplicação (`page.tsx`), localizada dentro do escopo de rotas privadas do painel administrativo `(painel)`.

---

## 🎯 Objetivo

Prover uma interface dedicada para que o usuário (consultor) possa gerenciar suas preferências, visualizar os dados base da propriedade atual vinculada à sessão e realizar o **Encerramento Seguro da Sessão (Logout)**.

---

## ⚙️ Funcionalidades e Fluxos

1. **Visualização de Dados Atuais**: 
   A página conecta-se à store global (`Zustand`) para exibir o resumo das informações da fazenda que estão em análise no momento (como nome da propriedade e sistema de produção).

2. **Gerenciamento de Sessão (Logout Seguro)**:
   - Ao acionar a ação de "Sair", o componente dispara uma requisição `DELETE` para a rota `/api/auth` (BFF).
   - Essa chamada no servidor destrói ativamente o **Cookie HttpOnly**, revogando o acesso.
   - Paralelamente, no lado do cliente, o estado global é limpo (`useAppStore.getState().reset()` ou equivalente) para garantir que nenhum dado residual permaneça na memória ou no `sessionStorage`.
   - O usuário é então ejetado de volta para a rota base `/login`.

---

## 🛡️ Segurança e Proteção

- **Herança de Proteção (Middleware)**: Por estar aninhada na pasta `(painel)`, o acesso a esta rota é rigorosamente auditado pelo **Middleware** do Next.js no servidor. Se o cookie for inválido, a renderização é abortada antes mesmo do componente carregar.
- **Clean State**: O mecanismo de logout assegura a deleção mútua de estado (Servidor e Cliente), mitigando riscos de vazamento de dados locais após a saída de um consultor que utilize dispositivos compartilhados.

---

## 🎨 UX e Elementos Visuais

- **Integração com o Layout Base**: O componente é renderizado automaticamente dentro da área útil da `main`, respeitando o Menu Lateral (`Sidebar`) definido no layout pai.
- **Design System Tailwind**: Utilização de *Cards* para separar as seções (Perfil do Consultor, Dados da Propriedade, Ações da Conta).
- **Prevenção de Erros**: O botão de logout pode possuir modais de confirmação e *spinners* de carregamento (feedback de UI) para prevenir cliques acidentais e manter o usuário informado durante o encerramento.