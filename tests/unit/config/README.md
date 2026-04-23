# ⚙️ Testes de Configuração (`unit/config/`)

Este diretório contém testes para as configurações estáticas, utilitários base e lógicas de estrutura do sistema.

---

## 📄 Códigos e Responsabilidades

- **`navigation.test.ts`**: Valida a integridade do menu lateral (`navigationConfig`) e garante o comportamento ideal da detecção de rota ativa. Verifica obrigatoriedades do contrato (ícones, links, labels) e impede que rotas vitais sejam perdidas.