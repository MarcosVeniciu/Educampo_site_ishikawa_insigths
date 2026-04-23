# 🔒 Área Privada / Grupo de Rotas (`(painel)`)

Este diretório utiliza o recurso de **Route Groups** do Next.js (indicado pelos parênteses no nome da pasta `(painel)`). Ele serve para agrupar logicamente rotas que compartilham o mesmo layout estrutural e as mesmas regras de proteção de acesso, **sem adicionar o segmento "painel" na URL final** do navegador.

Ou seja, o arquivo `app/(painel)/dashboard/page.tsx` é acessado simplesmente via `/dashboard`.

---

## 📂 Estrutura de Sub-rotas Protegidas

Todas as pastas contidas neste nível compõem a área de trabalho logada do consultor/produtor. O acesso a qualquer uma delas exige um **Cookie de Sessão válido**.

- **`/dashboard`**: Tela principal de indicadores gerenciais, consolidação de dados e atalhos rápidos.
- **`/diagnostico/[tipo]`**: Rota dinâmica responsável por exibir os Diagramas de Ishikawa (Causa-Raiz) para os 4 pilares (CCS, Hectare, Trabalhador, Produtividade).
- **`/simulacao`**: Ferramenta interativa de projeção de cenários e análise de impacto financeiro/produtivo.
- **`/configuracoes`**: Tela de preferências do usuário e de execução do encerramento de sessão (Logout).

---

## 🧩 O Layout Compartilhado (`layout.tsx`)

O grande trunfo arquitetural deste diretório é o arquivo `layout.tsx`. Ele envelopa todas as páginas filhas. Quando o usuário navega do `/dashboard` para a `/simulacao`, **apenas o conteúdo da página muda**; o Layout (que contém o menu lateral) não é recarregado, mantendo a transição instantânea.

### 💻 Código Estrutural do Layout

Abaixo está a representação padrão do código responsável por orquestrar essa divisão de tela:

```tsx
// app/(painel)/layout.tsx
import React from 'react';
// Importe do seu componente de menu lateral (Sidebar)
import { Sidebar } from '@/components/Sidebar';

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* O Menu Lateral fixo à esquerda */}
      <Sidebar />
      
      {/* A área principal fluida onde as páginas dinâmicas são injetadas */}
      <main className="flex-1 h-full overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}
```

### O que este código faz?
1. **Flexbox CSS**: Usa `flex` e `h-screen` para garantir que a tela ocupe 100% da altura da janela do navegador sem estourar.
2. **Área de Conteúdo (`main`)**: Usa a propriedade `{children}` do React para injetar dinamicamente o HTML gerado pelos arquivos `page.tsx` das sub-rotas no espaço direito da tela.

---

## 🛡️ Proteção por Middleware

Toda a árvore sob `(painel)` é vigiada pelo **Middleware do Next.js** (`middleware.ts` na raiz do projeto).
- Se um usuário não autenticado tentar acessar `/dashboard`, o middleware intercepta o pedido ainda no servidor.
- Ele verifica a ausência do *Cookie HttpOnly* injetado pela rota `/api/auth`.
- A renderização é bloqueada e o usuário sofre um redirecionamento forçado (HTTP 307) para a tela de `/login`, blindando todo o sistema de acessos indevidos por manipulação de URL.