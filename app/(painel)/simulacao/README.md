# 📈 Tela de Simulação (`/simulacao`)

Este diretório contém a página de **Simulação e Projeção de Cenários** da aplicação (`page.tsx`), localizada dentro do escopo de rotas privadas do painel administrativo `(painel)`.

---

## 🎯 Objetivo

Prover uma interface interativa avançada para que o usuário (consultor) possa simular cenários hipotéticos ("What-If"). A ferramenta permite ajustar variáveis-chave da fazenda e visualizar instantaneamente o impacto projetado nos indicadores de produtividade, eficiência e saúde do rebanho, utilizando como base os diagnósticos gerados previamente pela Inteligência Artificial.

---

## ⚙️ Funcionalidades e Fluxos

1. **Ajuste Dinâmico de Parâmetros**: 
   O usuário pode manipular controles na interface para simular alterações em dados técnicos, como:
   - Aumento ou redução do número de vacas em lactação.
   - Modificação da área destinada à atividade (ha).
   - Alterações na quantidade de funcionários e produtividade por cabeça.

2. **Cálculo de Impacto em Tempo Real**: 
   A página reage instantaneamente às mudanças nos inputs, recalculando os cenários e comparando-os com a "Linha de Base" (os dados atuais reais da fazenda mantidos no estado global via `Zustand`).

3. **Análise Comparativa Visual**:
   Exibição de métricas comparativas (Cenário Atual vs. Cenário Projetado) para facilitar a tomada de decisão estratégica do produtor rural e do consultor na priorização de investimentos e mudanças de manejo.

---

## 🛡️ Integração e Dependências de Estado

- **Dependência do Diagnóstico Base**: A simulação consome ativamente o contexto gerado na esteira de carregamento da IA. Sem os dados originais da fazenda (populados pela tela de configurações e login), os deltas de projeção não podem ser calculados com precisão.
- **Herança de Segurança**: Assim como todas as páginas sob a raiz `(painel)`, a renderização desta tela depende do Middleware Next.js, exigindo um cookie de sessão válido (`HttpOnly`).

---

## 🎨 UX e Elementos Visuais

- **Feedback Comparativo (Deltas)**: Utilização de tipografia e cores semânticas (como setas verdes apontando para cima indicando melhoria e setas vermelhas para perdas) nas comparações.
- **Gráficos e Interatividade**: Emprego de bibliotecas de gráficos (ex: Recharts) e componentes deslizantes (*sliders*) para tornar a simulação uma experiência altamente tátil e responsiva.
- **Design System Integrado**: Segue a paleta e os padrões definidos pelo Tailwind CSS, respeitando o espaço útil ao lado do `Sidebar`.