# 🛠️ Serviço API Educampo (Frontend Facade)

Este diretório contém a camada de serviço do Frontend (Client-Side) responsável por centralizar a comunicação com a nossa API. Ele atua como uma **Fachada (Facade)** para interagir de forma segura e padronizada com o **BFF (Backend-For-Frontend)** localizado em [`app/api/diagnostico`](../../app/api/diagnostico/README.md).

---

## 🔗 Relação com a API de Diagnósticos (BFF)

Enquanto a rota `app/api/diagnostico` atua como um **Proxy Reverso** no servidor Node.js (Next.js) para proteger chaves de API e conversar com o modelo de IA (FastAPI), este serviço (`services/apiEducampo`) é o **Cliente HTTP** executado no navegador do usuário.

**O fluxo é o seguinte:**
1. O usuário preenche os dados na interface (Store).
2. A interface chama um método deste serviço (`apiEducampo.diagnosticar...`).
3. Este serviço empacota os dados e faz um `fetch` para o BFF local (`/api/diagnostico/...`), anexando automaticamente o Cookie de Sessão.
4. O BFF valida, repassa para a IA, recebe a resposta e devolve para este serviço.

---

## 🛡️ Contrato de Segurança (Cookies HttpOnly)

Este módulo possui uma configuração crítica de cibersegurança: **`credentials: 'include'`**.
Todas as requisições `fetch` nativas feitas por esta classe instruem o navegador a anexar automaticamente o cookie `token` (que é *HttpOnly* e invisível para o JavaScript). Isso garante que o usuário está devidamente autenticado ao acessar o BFF, sem a necessidade de manipular tokens no `localStorage`.

---

## 📂 Estrutura do Diretório

- **`index.ts`**: Arquivo principal contendo a classe `ApiEducampoService` (Singleton) que exporta os métodos de comunicação HTTP.
- **`types.ts`**: Contém as definições de tipagem rigorosas (Interfaces `ModelInput` e `DiagramaSaida`) que espelham os contratos documentados no BFF.
- **`mocks.ts`**: Estruturas de dados simuladas (`mockTrabalhador`, `mockHectare`, etc.) baseadas nos Diagramas de Ishikawa (PDFs), utilizadas exclusivamente para garantir a integridade dos testes unitários.

---

## 🛠️ Métodos Disponíveis

A instância exportada `apiEducampo` possui os seguintes métodos, todos retornando uma `Promise<DiagramaSaida>`:

| Método | Endpoint BFF Alvo | Foco do Diagnóstico |
| :--- | :--- | :--- |
| `diagnosticarCcs(dados)` | `POST /api/diagnostico/ccs` | Contagem de Células Somáticas / Saúde Mamária |
| `diagnosticarHectare(dados)` | `POST /api/diagnostico/hectare` | Eficiência e produtividade por área (L/ha/dia) |
| `diagnosticarTrabalhador(dados)` | `POST /api/diagnostico/trabalhador` | Eficiência da mão de obra (L/trabalhador/dia) |
| `diagnosticarProdutividade(dados)`| `POST /api/diagnostico/produtividade` | Produção por animal (L/vaca/dia) |

---

## 💻 Exemplo de Uso (Componentes / Store)

A utilização preferencial é injetar esse serviço dentro de ações do Zustand ou requisições de página/componente:

```typescript
import { apiEducampo } from '@/services/apiEducampo';
import { ModelInput } from '@/services/apiEducampo/types';

async function buscarDiagnostico() {
  const payload: ModelInput = {
    nome_fazenda: "Fazenda Esperança",
    sistema_producao: "Compost Barn",
    vacas_em_lactacao_cabecas: 80,
    vacas_totais_cabecas: 100,
    animais_totais_cabecas: 150,
    funcionarios_qtd: 3,
    area_destinada_atividade_ha: 40,
    producao_leite_l_vaca_dia: 25,
    ccs_celulas_ml: 400
  };

  try {
    // O serviço já cuidará dos cabeçalhos, cookies de sessão e conversão JSON
    const resultado = await apiEducampo.diagnosticarCcs(payload);
    
    console.log("Categorias de Ishikawa recebidas:", resultado.categories);
  } catch (error) {
    console.error("Falha ao obter diagnóstico:", error);
  }
}
```

---

## ❌ Tratamento de Erros

A camada base do serviço captura respostas que não são `ok` (ex: status `401 Unauthorized` ou `500 Internal Server Error` emitidos pelo BFF) e lança erros detalhados. Se um `401` for detectado, o sistema reportará "Sessão expirada ou inválida".