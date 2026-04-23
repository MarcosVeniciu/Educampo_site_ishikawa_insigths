# 🌾 Educampo Insights

Bem-vindo ao repositório do **Educampo Insights**, uma plataforma avançada de diagnóstico zootécnico e gerencial para propriedades rurais. O sistema utiliza Inteligência Artificial para analisar dados da fazenda e gerar **Diagramas de Ishikawa (Causa-Raiz)**, além de permitir simulações de cenários projetados.

---

## 🚀 Tecnologias Utilizadas

- **Framework Core**: Next.js (App Router)
- **Estilização**: Tailwind CSS
- **Gerenciamento de Estado**: Zustand
- **Ícones**: Lucide React
- **Testes**: Jest + React Testing Library
- **Padrão de API**: Backend-For-Frontend (BFF) com rotas internas.
- **Integração Backend/IA**: FastAPI (acessado via proxy pelo BFF)

---

## 🏗️ Arquitetura e Segurança

O projeto foi desenhado focando em alta performance e segurança rígida de nível de produção:

- **Zero-Token-Exposure**: O client-side não manipula tokens JWT. Toda a sessão é baseada em **Cookies HttpOnly**, com autenticação roteada pelo nosso BFF (`/api/auth`).
- **Proteção contra XSS e CSRF**: A política de cookies utiliza as flags `secure` e `sameSite: 'strict'`, blindando o acesso e falsificação de requisições.
- **Proteção por Middleware**: As rotas privadas (`/dashboard`, `/diagnostico`, etc.) são blindadas no servidor pelo Middleware do Next.js.
- **Zero-Fetch na Navegação (Fase 4)**: A orquestração pesada de APIs ocorre centralizada na tela `/carregando`. Os dados gerados pela IA são injetados no estado global (Zustand), tornando a navegação subsequente pelo painel instantânea.
- **Componentes Híbridos**: Utilização inteligente de *Server Components* para o roteamento estrutural e *Client Components* para páginas interativas.

---

##  Estrutura do Projeto e Documentação Modular

Este repositório é amplamente documentado. **Cada diretório principal possui seu próprio `README.md`** detalhando suas regras de negócio e funcionamento. Recomendamos a leitura na seguinte ordem:

1. **`/app`**: O coração do roteamento (App Router). Contém a orquestração de login, a tela de `/carregando` e o BFF (`/api`).
2. **`/app/(painel)`**: O grupo de rotas protegidas (Dashboard, Diagnósticos, Simulação). Compartilha um Layout fixo injetado com a Sidebar.
3. **`/components`**: A biblioteca interna de componentes UI *Mobile-First* responsivos (ex: `IshikawaCard`, `Sidebar`).
4. **`/config`**: Centralização de configurações estáticas e mapeamento global (ex: `navigation.ts` para renderizar menus e rotas).
5. **`/services`**: Camada Facade de comunicação HTTP no Client-Side. Garante o tráfego seguro de cookies para o BFF (`credentials: 'include'`).
6. **`/utils`**: O motor de cálculos matemáticos, financeiros e zootécnicos do sistema.

---

## ⚠️ Status da Autenticação (Mock)

No momento, a rota `/api/auth` **está utilizando um serviço de Mock** (`mock/auth`) para simular o login e a geração de token. 
Apesar da validação ser simulada, a **arquitetura de segurança já é a versão final** de produção (geração correta de headers HTTP). 

*Para implantar o sistema definitivo:* Basta substituir o método `loginMock` no arquivo `app/api/auth/route.ts` por uma chamada real à sua API externa/Banco de Dados e injetar o token verdadeiro gerado.

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos
- Node.js (v18+ recomendado)
- NPM ou Yarn

### Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/MarcosVeniciu/Educampo_site_ishikawa_insigths.git

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente (Crie um arquivo .env na raiz)
# Exemplo:
# NODE_ENV=development
# API_URL=https://api-real-educampo.com

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

---

## 🧪 Testes Unitários

Este repositório possui forte cobertura de testes unitários garantida via **Jest** e **React Testing Library**. As suítes garantem estabilidade nas seguintes áreas:
- **Regras de Negócio (`/utils`)**: Validação matemática de fórmulas zootécnicas e métricas.
- **Componentes e Layouts (`/components` e `/app/layout.tsx`)**: Acessibilidade e inibição de vazamento de dados de sessão.
- **Configurações (`/config`)**: Integridade de rotas e navegação.

Para rodar toda a suíte de testes, utilize:
```bash
npm run test
```