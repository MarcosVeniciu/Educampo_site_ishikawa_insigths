# 🧱 Testes de Componentes (`unit/components/`)

Este diretório contém os testes unitários focados na camada de apresentação (UI). Aqui validamos componentes visuais de forma isolada (como Botões, Inputs, Cards de Indicadores, Modais e Gráficos), garantindo que funcionem independentemente da página em que estão inseridos.

---

## 🎯 Focos de Validação

- **Renderização de Props**: Validar se o componente é montado corretamente na tela (DOM) refletindo fielmente as propriedades injetadas.
- **Interações (User Events)**: Simular o comportamento do usuário (cliques, digitação, navegação por teclado) para assegurar que eventos como `onClick` e `onChange` sejam acionados corretamente.
- **Acessibilidade e Semântica**: Garantir que as tags certas foram usadas e que elementos interativos sejam acessíveis (`roles`, `aria-labels`).
- **Feedback Visual e Estados**: Checar mudanças condicionais na interface, como exibição de *spinners* de carregamento, mensagens de erro e desativação de botões (`disabled`).