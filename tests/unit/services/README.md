# 🔌 Testes de Serviços e APIs (`unit/services/`)

Este diretório é responsável por testar as fachadas de comunicação no Client-Side e garantir os contratos de consumo das APIs.

---

## 📄 Códigos e Responsabilidades

- **`apiEducampo.test.ts`**: Suíte do Facade de Diagnóstico HTTP. É vitalícia por testar dois contratos primários: 1) O envio adequado do payload `ModelInput`, e 2) A presença da _flag_ `credentials: 'include'` no `fetch` garantindo a comunicação correta com os Cookies HttpOnly blindados.