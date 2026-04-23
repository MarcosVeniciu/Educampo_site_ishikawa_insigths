# 🛡️ Testes de Segurança (`security/`)

Este diretório foca exclusivamente nas validações que garantem as políticas e os contratos de cibersegurança da aplicação (Proteção de Identidade e Sessão).

---

## 📄 Códigos e Responsabilidades

### `auth.spec.ts`
Valida minuciosamente o fluxo de autenticação, transição para sessões controladas e mitigação de vulnerabilidades comuns:
- **Proteção XSS**: Assegura que a aplicação frontend não armazena tokens no Web Storage (`localStorage` ou `sessionStorage`).
- **Proteção CSRF e Tráfego Seguro**: Confirma se os retornos da API contêm corretamente os atributos `HttpOnly`, `Secure` e `SameSite=Strict`.
- **Controle de Acesso Quebrado**: Garante negativas de acesso contínuas em casos de falha.
- **Isolamento de Identidade**: Valida se cada token gerado é intransferível e único por usuário.