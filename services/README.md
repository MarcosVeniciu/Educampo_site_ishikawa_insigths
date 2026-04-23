# 🔌 Camada de Serviços (Frontend Services)

Este diretório atua como a **Camada de Comunicação** do Frontend (Client-Side) no projeto Educampo Insights. Ele concentra toda a lógica de chamadas HTTP, integração com APIs e o padrão **Facade** para interagir com o nosso BFF (Backend-For-Frontend) ou bases de dados externas.

---

## 🎯 Responsabilidades e Arquitetura

O objetivo fundamental desta camada é isolar os componentes visuais (React) e a store (Zustand) das complexidades do transporte e busca de dados. As principais responsabilidades incluem:
- **Centralização de Endpoints**: Todo e qualquer `fetch` deve ser encapsulado aqui.
- **Tipagem e Contratos**: Validação, conversão de entrada de dados e tipagem rigorosa dos retornos (Typescript).
- **Segurança de Sessão**: Garantir a configuração `credentials: 'include'` nas chamadas de rede para permitir a injeção automática de **Cookies HttpOnly**, mantendo o sistema livre de exposição de tokens na memória.
- **Fallbacks e Mocks**: Capacidade de prover respostas simuladas de forma transparente caso a API principal fique indisponível, garantindo resiliência da interface do usuário.

---

## 📂 Módulos de Serviço

Cada serviço é agrupado por domínio/responsabilidade. Clique nos links abaixo para acessar a documentação detalhada, métodos disponíveis e contratos de cada um:

- **🩺 API Educampo (Diagnósticos)**  
  Fachada de comunicação principal com o BFF. Responsável por empacotar os dados da fazenda informados pelo usuário, enviá-los e receber a árvore de causas (Ishikawa) calculada pela Inteligência Artificial.

- **📊 API Variáveis (Benchmarks)**  
  Serviço que provê os referenciais e metas de mercado (potencial por vaca, área, limites de CCS, etc.) balizados especificamente para o sistema de produção da propriedade.

---

## 💻 Integração no Projeto

Por padrão, a invocação das classes ou métodos expostos neste diretório é feita primariamente dentro das *Actions* da nossa **Store (Zustand)** ou dentro de hooks isolados nas páginas, garantindo que o UI aguarde passivamente a resposta do serviço.