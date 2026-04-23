# ⚙️ APIs Baseadas em Next.js (BFF - Backend-For-Frontend)

Este diretório contém as rotas de API internas da aplicação **Educampo Insights**, construídas utilizando as *Route Handlers* nativas do Next.js.

A nossa arquitetura adota o padrão **BFF (Backend-For-Frontend)**, atuando como uma camada intermediária de segurança e formatação entre a interface do usuário (Client) e os serviços reais de Backend, Banco de Dados ou Modelos de Inteligência Artificial (ex: FastAPI).

---

## 🎯 Por que usamos um BFF?

A implementação desta camada intermediária nos proporciona três vantagens fundamentais:
1. **Proteção de Credenciais**: Chaves de API (API Keys), URIs de banco de dados e tokens sensíveis não são expostos publicamente no código do navegador.
2. **Segurança de Sessão Avançada**: Permite o gerenciamento seguro da autenticação do lado do servidor através de **Cookies HttpOnly**, o que bloqueia o acesso dos tokens pelo JavaScript mitigando riscos de ataques XSS.
3. **Adequação de Dados**: Possibilita formatar, unificar ou limpar os dados provindos de diversos microsserviços pesados especificamente para a estrutura em que o frontend precisa consumi-los.

---

## 📂 Rotas Disponíveis

Atualmente, o sistema conta com dois domínios principais de API. Abaixo está um resumo de cada um (você pode clicar nos diretórios correspondentes para ver suas próprias documentações técnicas):

### 1. [🔐 API de Autenticação (`/api/auth`)](./auth/README.md)
Responsável pelo gerenciamento do fluxo de sessão dos usuários, provendo blindagem dos acessos com cookies encriptados.
- **`POST /api/auth`**: Valida credenciais simuladas (Mocks) e injeta o token seguro de sessão no navegador de forma invisível.
- **`DELETE /api/auth`**: Encerra a sessão ativamente e limpa os rastros no navegador.

*Nota: Esta API atualmente opera com serviços simulados de login (mocks), mas possui toda a base de segurança pronta para a transição transparente para um servidor real de produção.*

### 2. [🩺 API de Diagnóstico (`/api/diagnostico`)](./diagnostico/README.md)
Atua como o proxy reverso e intermediador exclusivo entre o input de fazenda do cliente e a Inteligência Artificial.
Empacota os dados preenchidos nos formulários de diagnóstico e faz um "despacho" sigiloso para a API do modelo de Ishikawa de maneira protegida.

Endpoints disponíveis de processamento:
- **`POST /api/diagnostico/ccs`**: Contagem de Células Somáticas / Saúde Mamária.
- **`POST /api/diagnostico/hectare`**: Eficiência de produção e uso da área.
- **`POST /api/diagnostico/trabalhador`**: Eficiência de mão de obra envolvida.
- **`POST /api/diagnostico/produtividade`**: Produção e capacidade direta por vaca no sistema.

---

## 🛡️ Contratos de Segurança Integrados

Todas as comunicações feitas da Camada de Serviços Front-end (`services/`) para este diretório obedecem aos seguintes princípios:

- **`credentials: 'include'`**: O frontend é instruído a enviar os cookies restritos gerados por este BFF de volta em cada chamada.
- **Cookies Seguros**: Todas as rotas que manipulam acesso devolvem os tokens em cabeçalhos `Set-Cookie` restritivos (`HttpOnly`, `Secure` e `SameSite=Strict`).
- **Sanitização**: As rotas fazem o controle inicial de tipagem em cima da requisição originária do cliente para evitar corrupção das rotas de backend verdadeiras.

---

💡 **Dica de Desenvolvimento:** Ao criar uma nova sub-rota de API, certifique-se de registrar um breve resumo do endpoint aqui para manter o índice do diretório sempre atualizado e fácil de explorar.