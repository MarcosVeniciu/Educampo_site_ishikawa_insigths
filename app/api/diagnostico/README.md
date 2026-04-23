# 🩺 API de Diagnósticos (BFF / Proxy Educampo)

Este diretório contém as rotas da API no padrão **Backend-For-Frontend (BFF)** do Next.js. 
Essas rotas atuam como um **Proxy Reverso** entre o Client-Side (Navegador) e a API Real (FastAPI/Backend), com IA integrada, garantindo uma comunicação segura através da injeção de credenciais de servidor e repasse de Cookies `HttpOnly`.

---

## 📂 Árvore de Diretórios

A arquitetura é dividida em 4 endpoints distintos, todos com o mesmo padrão de comunicação (mesmo *Payload* de entrada e mesma estrutura de saída), porém com focos analíticos diferentes.

```text
app/api/diagnostico/
├── ccs/
│   └── route.ts          # Diagnóstico focado em Contagem de Células Somáticas / Saúde Mamária
├── hectare/
│   └── route.ts          # Diagnóstico focado na eficiência e produtividade por área (L/ha/dia)
├── produtividade/
│   └── route.ts          # Diagnóstico focado na produção por animal (L/vaca/dia)
├── trabalhador/
│   └── route.ts          # Diagnóstico focado na eficiência da mão de obra (L/trabalhador/dia)
└── README.md             # Documentação unificada da API
```

---

## 🔗 Endpoints Disponíveis

Todos os endpoints aceitam exclusivamente requisições **POST**.

- **`POST /api/diagnostico/ccs`**
- **`POST /api/diagnostico/hectare`**
- **`POST /api/diagnostico/produtividade`**
- **`POST /api/diagnostico/trabalhador`**

---

## 🛡️ Segurança e Fluxo

Essas rotas não geram os dados sozinhas, nem utilizam Mocks. Elas executam o seguinte fluxo:
1. Recebem o body do frontend.
2. Extraem o `x-api-token` dos headers e/ou capturam as credenciais configuradas em ambiente seguro (`.env`).
3. Fazem o repasse (*forward*) do cabeçalho de `Cookie` para garantir a manutenção da sessão do usuário.
4. Disparam uma requisição `fetch` para o domínio real (`API_URL`).
5. Retornam os dados gerados pela Inteligência Artificial do Educampo para o frontend.

---

## 📦 Contratos de Dados (Payloads)

### Entrada (`ModelInput` JSON)
Corpo da requisição exigido ao realizar a chamada POST:

```json
{
  "nome_fazenda": "Fazenda Esperança",
  "sistema_producao": "Compost Barn",
  "vacas_em_lactacao_cabecas": 80,
  "vacas_totais_cabecas": 100,
  "animais_totais_cabecas": 150,
  "funcionarios_qtd": 3,
  "area_destinada_atividade_ha": 40,
  "producao_leite_l_vaca_dia": 25,
  "ccs_celulas_ml": 400
}
```
*Nota: `producao_leite_l_vaca_dia` e `ccs_celulas_ml` são campos opcionais, mas recomendados dependendo do endpoint acionado.*

### Saída (`DiagramaSaida` JSON)
Estrutura retornada pelo modelo contendo os pilares e as causas raiz para a construção do **Diagrama de Ishikawa**:

```json
{
  "categories": [
    {
      "id": "mao-de-obra",
      "label": "Mão de Obra",
      "emoji": "👷",
      "impact": 85,
      "tag": "Fator limitante",
      "causes": [
        {
          "text": "Trabalhador sem qualificação",
          "severity": "alta",
          "detail": "Falta de treinamento adequado na rotina de ordenha resulta em alta CCS. Ação sugerida: Implementar POP (Procedimento Operacional Padrão) e capacitação contínua."
        }
      ]
    },
    {
      "id": "metodo",
      "label": "Método",
      "emoji": "📋",
      "impact": 40,
      "tag": "Necessita revisão",
      "causes": [
        {
          "text": "Rotina inconsistente",
          "severity": "media",
          "detail": "A ordenha não ocorre nos mesmos horários diariamente..."
        }
      ]
    }
  ]
}
```

---

## ❌ Tratamento de Erros

Caso a API Real falhe ou não responda adequadamente, o Proxy retornará um status `500` com os detalhes da falha capturada:

`{ "error": "Erro ao processar diagnóstico", "details": "Erro na API real: 401" }`