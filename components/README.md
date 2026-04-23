# 🧩 Componentes (Interface do Usuário)

Este diretório contém todos os componentes visuais e de interface (UI) reutilizáveis da aplicação **Educampo Insights**. 

A arquitetura dos componentes foi pensada para ser modular, altamente responsiva (Mobile-First) e integrada com as ferramentas do ecossistema Next.js, utilizando o **Tailwind CSS** para estilização e **Lucide React** para iconografia.

---

## 📂 Componentes Disponíveis

### 1. `IshikawaCard.tsx` (Card de Diagnóstico)

Este componente é responsável por exibir visualmente o resultado do diagnóstico processado pela Inteligência Artificial para uma categoria (Pilar/M) específica do Diagrama de Ishikawa.

Ele apresenta de forma clara o impacto percentual do pilar no problema principal e lista as causas-raiz identificadas, destacando a severidade de cada uma por meio de cores intuitivas (Verde, Amarelo e Vermelho).

#### 🛠️ Propriedades (Props)

| Propriedade | Tipo | Descrição |
| :--- | :--- | :--- |
| `icone` | `string` | Emoji ou representação visual do pilar (ex: "👷", "📋"). |
| `titulo` | `string` | O nome da categoria (ex: "Mão de Obra", "Método"). |
| `tagStatus` | `string` | Um texto curto indicando a situação (ex: "FATOR LIMITANTE"). |
| `impacto` | `number` | Valor de 0 a 100 que define o peso dessa categoria no problema. A cor do texto do impacto muda automaticamente (Verde < 40, Amarelo 40-70, Vermelho > 70). |
| `causas` | `Array` | Lista de objetos contendo `text` (descrição da causa) e `severity` (`'alta'`, `'media'` ou `'baixa'`). |

#### 💻 Exemplo de Uso

```tsx
import IshikawaCard from '@/components/IshikawaCard';

export default function PainelResultados() {
  const causasEncontradas = [
    { text: "Trabalhador sem qualificação na rotina", severity: "alta" },
    { text: "Turnos excessivamente longos", severity: "media" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <IshikawaCard 
        icone="👷"
        titulo="Mão de Obra"
        tagStatus="Fator Crítico"
        impacto={85}
        causas={causasEncontradas}
      />
    </div>
  );
}
```

---

### 2. `Sidebar.tsx` (Menu de Navegação Lateral)

Este componente atua como a espinha dorsal de navegação do sistema para usuários autenticados. Ele implementa a paleta de cores "Azul Educampo" e possui um comportamento híbrido inteligente:
- **Desktop**: Pode ser expandido ou colapsado (recolhido) para economizar espaço de tela, exibindo apenas ícones.
- **Mobile (Smartphones)**: Transforma-se em um "Drawer" lateral (gaveta) ativado por um botão de hambúrguer fixo no canto superior esquerdo, acompanhado de um backdrop escuro.

Além da navegação, a `Sidebar` está integrada ao **Zustand** (`useAppStore`) e à API de Autenticação (`/api/auth`) para lidar de forma segura com o fluxo de **Logout** (desconexão e limpeza de cookies seguros).

#### 🛠️ Propriedades (Props)

| Propriedade | Tipo | Descrição |
| :--- | :--- | :--- |
| `pathnameAtual` | `string?` | (Opcional) Força a rota atual para fins de teste ou exibição controlada (usado na função de App interna de demonstração). |
| `aoNavegar` | `function?` | (Opcional) Sobrescreve o comportamento padrão de roteamento do Next.js. Útil para capturar eventos de navegação. |

#### 🔗 Integração Interna
A Sidebar lê suas rotas do arquivo de configuração `config/navigation.ts`, o que garante que o menu esteja sempre em sincronia estrutural com o resto da aplicação.

#### 💻 Exemplo de Uso (Layout Principal)

Normalmente, este componente é envolvido no arquivo de layout mestre protegido da aplicação (ex: `app/(painel)/layout.tsx`):

```tsx
import Sidebar from '@/components/Sidebar';

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* O Sidebar gerencia seu próprio estado responsivo */}
      <Sidebar />
      
      {/* Área de conteúdo da aplicação */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
```

---

## 🎨 Estilização e Boas Práticas

- **Tailwind CSS**: Todos os componentes evitam a criação de arquivos `.css` externos. Utiliza-se puramente classes utilitárias do Tailwind para construir o layout (`flex`, `grid`, `rounded-xl`, `shadow`, etc).
- **Diretiva `"use client"`**: Componentes que utilizam hooks de estado (`useState`), hooks de navegação do Next.js (`useRouter`, `usePathname`) ou eventos interativos (como o `onClick` para fechar e abrir o menu) iniciam obrigatoriamente com `'use client'`.
- **Iconografia**: Padrão baseado na biblioteca `lucide-react`, promovendo ícones SVG leves e consistentes em toda a UI.

---

## 🧪 Cobertura de Testes

Os componentes UI possuem testes focados em comportamentos (Accessibility, ARIA states, disparos de eventos) utilizando ferramentas como `@testing-library/react`. 
Sempre que um estado novo for adicionado (como a abertura de um modal via Sidebar), espelhe a atualização no diretório `tests/unit/components/`.