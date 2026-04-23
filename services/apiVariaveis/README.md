# 📊 Serviço API Variáveis (Benchmarks & Metas)

Este diretório contém a camada de serviço do Frontend responsável por fornecer as variáveis de referência, metas de mercado (potenciais) e benchmarks zootécnicos, ajustados de acordo com o sistema de produção da fazenda.

---

## 🎯 Objetivo

Fornecer os parâmetros técnicos (como potencial de litros por vaca, por área, por trabalhador, limites de CCS e preço base do leite) que são utilizados pelos componentes de **Dashboard** e **Simulador** para calcular os "Gaps" (diferença entre o desempenho atual do produtor e o cenário ideal de mercado).

Atualmente, o serviço simula o comportamento de uma API assíncrona para buscar esses valores dinamicamente.

---

## 📂 Estrutura do Diretório

- **`index.ts`**: Contém as definições de tipagem do TypeScript (`Range`, `VariaveisReferencia`, `ReferenciasGlobais`) e a função principal `fetchVariaveisReferencia`, que simula o tempo de resposta de uma requisição HTTP.
- **`mocks.ts`**: Base de dados simulada com os parâmetros de referência extraídos dos documentos técnicos de Ishikawa, separados por sistema de produção (ex: "Pasto", "Confinamento", "Padrao").

---

## 🧮 Tipos Principais (Interfaces)

### `VariaveisReferencia`
Estrutura que encapsula os alvos e limites ideais de uma propriedade:
- **`potencialVaca`**: Range (mín. e máx.) de Litros/Vaca/Dia esperado.
- **`potencialArea`**: Range (mín. e máx.) de Litros/Hectare/Dia esperado.
- **`potencialTrabalhador`**: Range (mín. e máx.) de Litros/Trabalhador/Dia esperado.
- **`limiteCcs`**: Limite máximo tolerado de Células Somáticas antes que ocorram penalidades financeiras ou perdas por mastite clínica.
- **`precoLeiteReferencia`**: Preço base (R$/Litro) para projeções financeiras na simulação.

---

## 💻 Exemplo de Uso

A função principal pode ser invocada passando o sistema de produção do usuário para resgatar os parâmetros corretos daquele nicho.

```typescript
import { fetchVariaveisReferencia } from '@/services/apiVariaveis';

async function carregarMetasDaFazenda() {
  try {
    // Passando o sistema de produção para resgatar metas específicas
    const metas = await fetchVariaveisReferencia("Confinamento");
    
    console.log("Alvo Mínimo de L/Vaca/Dia:", metas.potencialVaca.min);
    console.log("Alvo Máximo de L/Vaca/Dia:", metas.potencialVaca.max);
    console.log("Limite de CCS para o sistema:", metas.limiteCcs);
  } catch (error) {
    console.error("Erro ao carregar variáveis de referência:", error);
  }
}
```

---

## 🔄 Transição para Produção Real

No momento, o `fetchVariaveisReferencia` utiliza um `setTimeout` para simular o delay de uma requisição de rede e carrega dados dos mocks. Em um cenário real de produção (caso estas referências fiquem em um Banco de Dados no servidor em vez de hardcoded), este método deve ser atualizado para realizar um `fetch` verdadeiro à API Backend/BFF.