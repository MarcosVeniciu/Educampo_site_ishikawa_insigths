# 🔐 Tela de Login (`/login`)

Este diretório contém a página inicial e de autenticação da aplicação (`page.tsx`). Ela serve como a porta de entrada segura para o Educampo Insights, implementando o lado cliente da arquitetura de **HttpOnly Cookies**.

---

## 🎯 Objetivo

Prover uma interface amigável e reativa para a coleta de credenciais do usuário, validá-las junto à API de Autenticação (BFF) e preparar o estado global da aplicação antes de redirecionar o usuário para a esteira de carregamento e, posteriormente, ao Dashboard.

---

## ⚙️ Funcionamento e Fluxo de Autenticação

O componente atua estritamente no lado do cliente (`'use client'`) e executa as seguintes etapas durante a submissão do formulário:

1. **Comunicação com o BFF**: 
   Dispara uma requisição `POST` para `/api/auth` enviando `email` e `password`. Se o login for bem-sucedido, o BFF injetará silenciosamente um Cookie `HttpOnly` no navegador (invisível para este componente).

2. **Tratamento de Erros**: 
   Caso as credenciais sejam inválidas, a requisição retorna um erro (ex: `400` ou `401`), o carregamento é interrompido e uma mensagem de erro estilizada é exibida diretamente na interface.

3. **População de Estado Global (Mock Atual)**: 
   Após o sucesso, a página acessa a store do Zustand (`useAppStore.getState()`) e preenche os dados base da propriedade rural (`setFazenda`). 
   *⚠️ Nota: Atualmente, os dados da fazenda injetados aqui estão "hardcoded" (Mockados). No futuro, esses dados deverão vir do payload de sucesso da própria API ou de um endpoint de perfil subsequente.*

4. **Preparação para Transição**: 
   Garante que a flag de sistema pronto (`isLoaded`) seja definida como `false`, assegurando que o fluxo de loading do sistema seja disparado adequadamente.

5. **Redirecionamento Roteado**: 
   Utiliza o `useRouter` do Next.js para empurrar o usuário para a rota `/carregando`, delegando a próxima fase do sistema para o orquestrador de chamadas de IA.

---

## 🛡️ Segurança Adotada

- **Sem Tokens Expostos**: O componente não manipula, não lê e não armazena tokens JWT (como no `localStorage`). O gerenciamento da sessão é delegado integralmente aos cabeçalhos HTTP do navegador graças à implementação da rota `/api/auth`.
- **Controle de UI contra Duplos Cliques**: O formulário desabilita os inputs e o botão de envio (`disabled={loading}`) enquanto aguarda a resposta do servidor, prevenindo *Race Conditions* e requisições duplicadas.

---

## 🎨 UX e Elementos Visuais

- **Design Mobile-First**: O card centralizado se adapta graciosamente a telas de smartphones e desktops utilizando classes utilitárias do Tailwind CSS.
- **Feedback Visual Ativo**: 
  - Transições suaves nos botões (`active:scale-[0.98]`).
  - Spinner nativo construído com SVG e `animate-spin` enquanto ocorre a validação.
  - Alerta de erro com animações de entrada do Tailwind (`animate-in fade-in slide-in-from-top-1`).