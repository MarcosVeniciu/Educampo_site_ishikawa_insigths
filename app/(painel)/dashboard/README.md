# 📊 Tela Principal do Painel (Dashboard) (`/dashboard`)

Este diretório contém a página central da aplicação (`page.tsx`), atuando como o "Hub" principal de visualização gerencial após a conclusão da esteira de carregamento da Inteligência Artificial.

---

## 🎯 Objetivo

Fornecer uma visão macro e consolidada da saúde e eficiência da propriedade rural. O Dashboard não detalha exaustivamente as causas-raiz (papel delegado à rota dinâmica `/diagnostico/[tipo]`), mas sim apresenta um resumo executivo (KPIs) dos 4 pilares analisados (Mão de Obra, Uso da Terra, Produtividade Animal e Saúde Mamária/CCS), evidenciando rapidamente onde estão os maiores gargalos e oportunidades de melhoria.

---

## 📊 Orquestração e Consumo de Dados

A tela assume que todos os dados pesados já foram resolvidos, construindo sua interface baseada puramente na leitura reativa do estado global:

1. **Leitura da Store (`useAppStore`)**: 
   Consome os `dadosFazenda` (para dados brutos como total de vacas e sistema de produção) e os `diagnosticos` (respostas da IA processadas na rota `/carregando`).
2. **Consolidação de Métricas**:
   A página itera sobre os 4 diagnósticos presentes no Zustand para somar indicadores globais, como:
   - Número total de causas identificadas.
   - Quantidade de alertas críticos (Severidade Alta).
   - Índice Geral de Eficiência da Fazenda (Score consolidado).
3. **Cálculo de *Gaps* (Deltas)**:
   Cruza os valores atuais da fazenda com as metas de referência de mercado (`VariaveisReferencia`), exibindo o quão distante o produtor está do seu potencial máximo para o seu respectivo sistema de produção.

---

## ⚙️ Funcionalidades Principais

- **Cards de Resumo (Visão 360º)**: Blocos visuais dedicados a cada um dos 4 pilares. Eles mudam de cor dinamicamente (Verde, Amarelo, Vermelho) com base no cruzamento do impacto da IA com as referências do mercado.
- **Roteamento Interno**: Atua como o ponto de partida (Menu Principal) para acessar as "Análises de Causa Raiz" (Diagramas de Ishikawa) ou a "Simulação de Cenários" (`/simulacao`).
- **Fallback e Resiliência**: Caso o usuário acesse esta rota diretamente via URL em uma nova aba e o estado global esteja vazio (sem os dados da IA), a página identifica a ausência da flag `isLoaded` e redireciona ou orienta o usuário de volta para o fluxo adequado de entrada.

---

## 🛡️ Integração e Segurança

- **Rota Protegida**: Pertence ao grupo `(painel)`, o que significa que o Next.js Middleware barra acessos sem um *Cookie HttpOnly* válido gerado no `/login`.
- **Performance e *Zero-Fetch***: Como a orquestração de APIs ocorre no `/carregando`, esta página tem tempo de carregamento de dados (Client-Side) praticamente nulo, garantindo uma transição instantânea e uma experiência de usuário (UX) extremamente ágil.

---

## 🎨 UX e Elementos Visuais

- **Gráficos Resumidos**: Utilização de bibliotecas de gráficos (como Recharts ou Chart.js) para exibir medidores (*Gauges*) ou gráficos de radar cruzando as 4 dimensões.
- **Tipografia de Impacto**: Foco na exibição de números grandes (Métricas de Vaidade e KPIs) para facilitar a leitura rápida pelo consultor no campo, utilizando o Design System construído com Tailwind CSS.
- **Identidade Visual Temática**: Manutenção das cores semânticas estabelecidas (ex: Vermelho para CCS, Verde para Hectare) para criar consistência cognitiva durante a navegação.