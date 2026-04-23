# 📦 Testes do Estado Global (`unit/store/`)

Este diretório visa testar o gerenciador de estado (Zustand) responsável pela manipulação dos dados de cache e persistência em memória durante o fluxo do usuário no frontend.

---

## 📄 Códigos e Responsabilidades

- **`useAppStore.test.ts`**: Valida o salvamento dos dados inseridos, cache das requisições ao longo das categorias do Ishikawa e armazenamento seguro (testando o Desacoplamento de Sessão para garantir que não procure no Web Storage). Cobre também os cenários de limpeza total dos dados de estado (`clearData`).