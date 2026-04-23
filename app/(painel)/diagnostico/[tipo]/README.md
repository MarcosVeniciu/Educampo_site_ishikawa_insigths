# 🔍 Tela de Detalhes do Diagnóstico (`/diagnostico/[tipo]`)

Este diretório contém a página dinâmica de visualização aprofundada dos diagnósticos da fazenda (`page.tsx`). Por ser uma rota dinâmica (`[tipo]`), ela é capaz de renderizar a análise para qualquer um dos 4 pilares do sistema com base no parâmetro da URL:
- `/diagnostico/ccs` (Saúde Mamária)
- `/diagnostico/hectare` (Uso da Terra)
- `/diagnostico/produtividade` (Produção por Animal)
- `/diagnostico/trabalhador` (Mão de Obra)

---

## 🎯 Objetivo

Apresentar ao usuário o **Diagrama de Ishikawa (Espinha de Peixe)** gerado pela Inteligência Artificial. A página traduz o JSON complexo da API em uma interface visual rica, listando as causas-raiz dos problemas, classificando suas severidades e cruzando essas informações com os dados base da propriedade para calcular o impacto financeiro/produtivo.

---

## 📊 Origem e Tratamento de Dados

A página lida com uma arquitetura híbrida de dados, combinando respostas reais da IA, dados de contexto da store global e cálculos dinâmicos em tempo real.

### 1. Dados Reais (Consumidos da API via Estado Global)
A estrutura principal do diagnóstico é **100% real e gerada dinamicamente pela IA**. Esses dados não são mockados nesta tela; eles foram buscados na fase de `/carregando` e lidos da store do Zustand (`useAppStore.getState().diagnosticos[tipo]`).
- **O que é exibido:** Categorias do Ishikawa (ex: Mão de Obra, Método, Meio Ambiente), Causas Específicas, Nível de Severidade (Alta, Média, Baixa) e Textos de Detalhamento/Plano de Ação.
- **Comportamento:** Se o usuário der F5 na página e o estado for perdido, a página deve tratar graciosamente a ausência desse dado (geralmente redirecionando de volta ao Dashboard ou recarregando o fetch).

### 2. Dados Calculados (Variáveis com Risco de Zeramento)
A página apresenta cards de "Impacto Projetado" ou "Potencial de Ocorrência". Estes são **Calculados no Client-Side**.
- **Como é feito:** O cálculo cruza o impacto percentual sugerido pela IA com os dados absolutos da fazenda (`dadosFazenda` na Store).
  - *Exemplo de Cálculo:* `Impacto Financeiro = (Vacas em Lactação * Produção Média * Preço do Leite) * (Fator de Perda da IA / 100)`.
- **⚠️ Comportamento de Fallback (Valores Zerados):**
  Como os cálculos dependem de variáveis inseridas anteriormente pelo usuário (ou obtidas no login), **caso falte alguma informação na base de dados** (ex: o usuário não preencheu o "Preço do Leite" ou "Área Destinada"), a matemática falhará.
  - A página é programada para tratar `NaN` (Not a Number) ou `undefined`.
  - Nesses casos, o cálculo sofrerá um "Fallback para Zero" (exibindo `R$ 0,00` ou `0 Litros/dia`) ou ocultará o card de impacto para não exibir métricas irreais/quebradas.

### 3. Dados Mockados (Simulações e Hardcodes Atuais)
Até que a integração com o Backend final esteja totalmente concluída, alguns elementos secundários desta página ainda podem ser Mocks visuais:
- **Gráficos Históricos:** Mini-gráficos de tendência (ex: "Evolução da CCS nos últimos 6 meses") podem conter dados *hardcoded* (`[200, 250, 400, 380...]`) para fins de preenchimento de interface (UI Placeholder).
- **O Input Inicial:** Vale lembrar que os dados base da fazenda (`dadosFazenda`) que alimentam os cálculos atualmente estão sendo injetados de forma estática no momento do Mock de Login (`/login`), conforme documentado na rota de autenticação.

---

## ⚙️ Dinâmica da Interface

A renderização é condicional baseada na propriedade `params.tipo`:

1. **Identidade Visual:** A página adapta cores e ícones nativamente. 
   - `ccs` -> Vermelho/Rosa (Alerta de saúde)
   - `hectare` -> Verde (Terra/Produtividade)
   - `produtividade` -> Azul (Volume/Leite)
   - `trabalhador` -> Laranja (Mão de Obra/Esforço)

2. **Mapeamento do JSON (Ishikawa):** 
   O componente percorre o array `categories` do `DiagramaSaida` gerando um layout em "Grid" ou "Espinhas", onde cada categoria abre um card (ou um *Accordion*) listando suas respectivas `causes`.

---

## 🛡️ Segurança e Integridade

- **Validação de Rota:** Assim como as demais telas do `(painel)`, o acesso é protegido por Middleware.
- **Proteção de Renderização:** Se um usuário digitar na URL um tipo inválido (ex: `/diagnostico/financeiro` - que não existe na nossa árvore suportada), a página deve realizar um *Early Return* ou acionar o componente `notFound()` do Next.js.