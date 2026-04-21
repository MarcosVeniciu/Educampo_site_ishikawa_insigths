# **Documentação de Implementação: Fluxo de Carregamento e Dashboard**

## **1\. Visão Geral da Arquitetura**

O objetivo desta arquitetura é resolver o problema de latência de chamadas à LLM (API Educampo) e centralizar a lógica de negócios (cálculos) e o estado da aplicação.

O fluxo principal do usuário será:

1. app/login/page.tsx: Usuário insere credenciais.  
2. app/carregando/page.tsx (Nova): Tela de transição. Realiza o fetch assíncrono em paralelo de todos os diagnósticos e variáveis mockadas.  
3. **Estado Global / SessionStorage**: Armazena os resultados para consumo imediato.  
4. app/(painel)/dashboard/page.tsx: Consome os dados do estado global e renderiza instantaneamente, sem novos loadings.

## **2\. Padrão Facade para Serviços (APIs)**

As requisições externas não devem ser feitas diretamente nos componentes. Elas ficarão centralizadas no diretório services/.

### **Estrutura de Diretórios Sugerida:**

/services  
  /apiEducampo  
    ├── index.ts        // Padrão Facade: Exporta as funções de fetch (ex: fetchDiagnostico)  
    ├── mocks.ts        // Contém os objetos de resposta mockados baseados nos PDFs dos professores  
    └── types.ts        // Tipagens TypeScript (ex: DiagramaSaida)  
  /apiVariaveis  
    ├── index.ts        // Função para buscar potenciais e referências  
    ├── mocks.ts        // JSON com variáveis como metas de Litros/ha, Litros/trab.  
    └── types.ts

### **Exemplo de Implementação (services/apiEducampo/index.ts):**

import { mockCcs, mockHectare, mockTrabalhador, mockProdutividade } from './mocks';  
import { DiagramaSaida } from './types';

export async function fetchDiagnostico(tipo: 'ccs' | 'hectare' | 'trabalhador' | 'produtividade'): Promise\<DiagramaSaida\> {  
  // Simula a latência da rede e da IA (ex: 2 segundos)  
  return new Promise((resolve) \=\> {  
    setTimeout(() \=\> {  
      switch (tipo) {  
        case 'ccs': return resolve(mockCcs);  
        case 'hectare': return resolve(mockHectare);  
        case 'trabalhador': return resolve(mockTrabalhador);  
        case 'produtividade': return resolve(mockProdutividade);  
      }  
    }, 2000);  
  });  
}

## **3\. Camada de Cálculos (utils/calculos.ts)**

Nenhuma tela deve realizar cálculos matemáticos. Toda a lógica de negócio deve ser exportada como funções puras, facilitando a testabilidade.

* calcularProducaoTotal(vacasLactacao, producaoVaca)  
* calcularLitragemPorHectare(producaoTotal, area)  
* calcularLitragemPorTrabalhador(producaoTotal, qtdFuncionarios)  
* avaliarStatus(valorAtual, potencialMin, potencialMax) \-\> Retorna "baixo" | "medio" | "alto"  
* obterPilarMaiorImpacto(categorias) \-\> Processa o array de Ishikawa da API e retorna a string do pilar principal.  
* contarCausasAltaSeveridade(categorias) \-\> Faz o .reduce() e .filter() nas respostas da API.

## **4\. Gerenciamento de Estado (Camada Invisível)**

Para evitar "prop drilling" e requisições duplicadas, utilize um gerenciador de estado (Recomenda-se **Zustand** por ser leve no Next.js, ou a **Context API** nativa do React).

* **O que o estado deve guardar?**  
  * dadosFazenda: nome, sistema, área, vacas, funcionários.  
  * diagnosticos: Objeto com os 4 retornos da API Educampo.  
  * variaveisReferencia: Retorno da API de Variáveis (potenciais).  
* A tela de Configurações atualizará a store. Ao ser atualizada, a store dispara uma re-renderização na Dashboard instantaneamente.

## **5\. Estrutura das Novas Telas**

### **Tela de Carregamento (app/carregando/page.tsx)**

* **UI:** Um spinner ou animação centralizada usando as cores primárias do sistema (\#15803d / verde padrão).  
* **Comportamento (useEffect):**  
  * Dispara Promise.all() contendo as requisições para a apiEducampo (4 chamadas) e apiVariaveis (1 chamada).  
  * Ao finalizar (.then), salva tudo no Estado Global e no sessionStorage.  
  * Usa o useRouter().push('/dashboard') para redirecionar.

### **Tela de Dashboard (app/(painel)/dashboard/page.tsx)**

* **Comportamento:** Lê os dados sincronamente do Estado Global. Se o estado estiver vazio (ex: usuário atualizou a página com F5), tenta ler do sessionStorage ou redireciona de volta para /carregando.  
* **Layout:**  
  * **Header:** Lê nome\_fazenda e sistema\_producao do estado.  
  * **Indicadores Principais (Cards):** Chama os métodos de utils/calculos.ts usando os dados base da fazenda para renderizar a produção atual.  
  * **Atalhos (Cards Ishikawa):** Passa os dados de Ishikawa obtidos na API e os potenciais obtidos na API de Variáveis para o componente renderizar o resumo (Pilar de impacto, Severidade, etc).