# 🖥️ Testes de Interface e Rotas (`unit/app/`)

Este diretório foca em testar a renderização dos componentes de interface e as páginas principais do App Router do Next.js de maneira isolada.

---

## 📄 Códigos e Responsabilidades

- **`dashboard.test.tsx`**: Valida a página de Dashboard. Garante a renderização dos dados provenientes da Store, comportamento de fallback de dados, e que a conversão entre o input (`ModelInput`) e a UI funcione como o esperado.
- **`layout.test.tsx`**: Valida a estrutura base (Sidebar + Children). Avalia o contrato de "Confiança Transparente", assegurando que o componente se foca apenas em interface e que não tenta acessar dados ou validações sensíveis exclusivas do middleware de servidor.