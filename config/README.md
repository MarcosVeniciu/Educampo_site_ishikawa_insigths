# ⚙️ Config (Configurações do Sistema)

Este diretório é responsável por centralizar todas as configurações estáticas, utilitários base estruturais e mapeamentos globais do sistema Educampo Insights.

A extração de configurações (como a estrutura de menus e rotas) para este diretório facilita a manutenção, garante consistência em toda a aplicação e simplifica a renderização dinâmica de componentes visuais, como Sidebar e Headers.

---

## 🎯 Objetivo

Fornecer uma fonte única de verdade para parâmetros estruturais do frontend, evitando dados _hardcoded_ espalhados pelos múltiplos componentes e páginas do Next.js (App Router).

---

## 📂 Estrutura do Diretório e Arquivos

- **`navigation.ts`**: Arquivo principal focado na configuração de rotas protegidas e na estrutura do menu lateral (Sidebar).

---

## 🧭 Navegação (`navigation.ts`)

Este módulo gerencia as rotas vitais do sistema e sua representação visual na interface.

### 🧩 Tipos e Estruturas de Dados
- **`NavItem`**: Interface que estabelece o contrato visual para um link do sistema, exigindo um título (`label`), um caminho raiz absoluto (`href`) e um ícone importado da biblioteca `lucide-react`.

### 🗺️ Mapeamento de Rotas (`navigationConfig`)
É a constante (Array) que dita a disposição e a ordem exata das páginas do menu:
- **Dashboard** (`/dashboard`): Visão geral do negócio.
- **Diagnóstico** (`/diagnostico/geral`): Análises detalhadas do modelo Ishikawa.
- **Simulação** (`/simulacao`): Projeções de cenários e impactos.
- **Configurações** (`/configuracoes`): Parâmetros e dados de propriedade.

### 🛠️ Funções Utilitárias
- **`getActiveNavInfo(pathname)`**: Uma função que intercepta o caminho atual da URL do usuário e busca sua equivalência no `navigationConfig`. É amplamente utilizada para extrair dinamicamente o título (`label`) ou o `icon` da seção atual para exibição em componentes de Cabeçalho (Header) ou Breadcrumbs, tendo suporte nativo ao reconhecimento de sub-rotas.

---

## 🧪 Cobertura de Testes

Para evitar a remoção acidental de páginas fundamentais do sistema por outros desenvolvedores e garantir que a detecção de rotas ativas opere de maneira confiável, as configurações deste diretório são blindadas por testes unitários via **Jest**.

Os testes localizam-se em:
`tests/unit/config/navigation.test.ts`