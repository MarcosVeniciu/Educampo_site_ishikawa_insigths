# 📦 Gerenciamento de Estado Global (Store)

Este diretório contém a lógica de gerenciamento de estado global do frontend da aplicação Educampo Insights, utilizando **[Zustand](https://github.com/pmndrs/zustand)**.

---

## 🎯 Arquitetura e Segurança (Fase 4)

O estado da aplicação foi desenhado com um foco estrito em **Separação de Responsabilidades** e **Segurança**:
- **Apenas Dados de Negócio**: A store armazena *exclusivamente* dados da fazenda (`dadosFazenda`), resultados da inteligência artificial (`diagnosticos`) e metas/referências da API.
- **Zero Tokens (HttpOnly)**: Com a adoção de cookies `HttpOnly`, a store **não** gerencia, lê ou armazena tokens de autenticação (JWT). O controle de sessão é feito silenciosamente pelo navegador nas requisições ao backend.
- **Persistência em Memória de Curto Prazo**: O estado é persistido no `sessionStorage` através do middleware `persist` do Zustand. Isso garante que os dados sobrevivam a recarregamentos de página (F5) para não quebrar a experiência do usuário, mas sejam descartados com segurança assim que a aba do navegador for fechada.

---

## 📂 Estrutura do Diretório

- **`useAppStore.ts`**: Arquivo principal que exporta o hook `useAppStore`, contendo a definição da interface de estado (`AppState`) e as ações (actions) para manipulá-lo.

---

## 🧠 Estrutura do Estado (`AppState`)

### 🗃️ Variáveis de Estado (State)
- **`dadosFazenda`**: Guarda as configurações da propriedade (número de vacas, sistema de produção, etc.) informadas pelo usuário no setup ou login.
- **`diagnosticos`**: Cache em memória dos resultados de Ishikawa gerados pela API, indexados por pilar (ex: `ccs`, `hectare`, `trabalhador`). Evita requisições duplicadas durante a navegação.
- **`referencias`**: Limites e metas da API usados para balizar os medidores e gráficos.
- **`isLoaded`**: Flag de controle para orquestrar e liberar a UI após as telas de carregamento simultâneo (`/carregando`).

### 🛠️ Ações (Actions)
- `setFazenda(dados)`: Salva os dados inseridos/carregados.
- `setDiagnostico(tipo, resultado)`: Adiciona o diagnóstico de uma categoria específica no cache.
- `setReferencias(refs)`: Guarda os benchmarks.
- `setLoaded(booleano)`: Atualiza a flag de carregamento global.
- `clearData()`: Apaga completamente os dados sensíveis da fazenda da memória e do `sessionStorage` (vital para as rotinas de *Logout*).

---

## 💻 Exemplo de Uso

A leitura e escrita no estado global pode ser feita dentro de qualquer componente React invocando o hook `useAppStore`:

```tsx
import { useAppStore } from '@/store/useAppStore';

export default function PainelDashboard() {
  // 1. Lendo dados do estado (Reativo)
  const dadosFazenda = useAppStore((state) => state.dadosFazenda);
  const isLoaded = useAppStore((state) => state.isLoaded);

  // 2. Resgatando uma action para alterar o estado
  const clearData = useAppStore((state) => state.clearData);

  const handleLogout = () => {
    clearData(); // Limpa os dados sensíveis da fazenda
    sessionStorage.clear(); // Limpa resquícios no storage
    // ... lógica de logout da API
  };

  if (!isLoaded) return <p>Processando inteligência...</p>;

  return (
    <div>
      <h1>Visão da Fazenda: {dadosFazenda?.nome_fazenda}</h1>
      <button onClick={handleLogout}>Sair do Sistema</button>
    </div>
  );
}
```

---

## 🧪 Testes Unitários

A validação da store garante que o fluxo em memória funcione corretamente e, principalmente, assegura o contrato em que nenhuma chave de autenticação seja vazada ou manipulada pela store.

Para visualizar a cobertura ou testar o comportamento, consulte:
`tests/unit/store/useAppStore.test.ts`