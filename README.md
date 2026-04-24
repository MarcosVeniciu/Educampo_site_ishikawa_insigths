<details>
<summary>Instruções para Assistentes de IA (clique para expandir)</summary>

Olá IA! Este projeto foca em performance. 
Preste atenção às seguintes diretrizes cruciais deste projeto:

1. **Testes como Contrato (A Lei)**: Primeiro criamos os testes (unitários, segurança, etc.) para definir como o código deve funcionar. Só após os testes estarem prontos iniciamos a implementação. O código deve se adaptar para passar nos testes. NUNCA altere o teste apenas porque o código falhou; o código é que deve se adaptar a ele. Em caso de mudança de requisitos, altere o teste primeiro e, depois, o código.
2. **DocStrings Obrigatórias**: Todo código gerado (inclusive os de testes) deve conter DocStrings. Essa é a documentação para que os programadores entendam *como* o código está fazendo o que se propõe.
3. **Documentação via README.md**: Todo diretório deve ter um `README.md` explicando detalhadamente *o que* o código faz (para programadores e não-programadores). Um único README engloba todos os arquivos daquele diretório. Para os subdiretórios, explique-os brevemente indicando seus propósitos e inclua obrigatoriamente o link em markdown para seus respectivos READMEs.
</details>

---
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

## 📝 Documentação e Padronização de Código

Temos regras estritas para a documentação técnica deste sistema, atuando em duas frentes complementares:

### 1. DocStrings no Código (O *Como*)
Todo arquivo de código criado neste projeto (seja regra de negócio, integração ou **testes**) deve obrigatoriamente incluir **DocStrings** em seu conteúdo. A DocString é a documentação que será usada pelos programadores que venham a mexer nesse código, com foco exclusivo em explicar detalhadamente **como** o código está fazendo o que se propõe.

### 2. README.md por Diretório (O *O Que*)
Todo diretório e código gerado deve ser coberto por um arquivo `README.md`. O propósito principal do README é explicar detalhadamente para programadores e não-programadores **o que** o código está fazendo (não é necessário detalhar a parte do "como", pois isso fica a cargo da DocString).
- **Agrupamento**: Caso o diretório possua mais de um arquivo de código, o `README.md` daquele diretório deve englobar a explicação de todos os códigos do mesmo nível em um único arquivo.
- **Navegação e Subdiretórios**: O README pai deve explicar de forma breve qual o propósito dos seus subdiretórios e dos códigos presentes neles (sem detalhar a fundo), e **deve incluir o link** para o README específico desses subdiretórios e arquivos. Por exemplo, ao citar um diretório interno de cálculos, inclua o link direto no formato markdown: `**calculos/**`.

### 3. Leitura Recomendada de Arquitetura
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

## 🧪 Testes Unitários e de Segurança (Os Testes são a "Lei")

Neste projeto, adotamos uma abordagem estrita onde **os testes funcionam como um tipo de contrato**. 

1. **Definição do Contrato**: Normalmente quando criamos um código primeiro fazemos o código e depois os testes. Aqui ocorre o inverso: **primeiro definimos como o código deve funcionar e então criamos os testes** para esse cenário.
2. **Adaptação do Código**: Quando os testes estiverem prontos é que começamos a implementação do código que os utilizará. O código deve ser perfeitamente adaptado e corrigido para que se encaixe nos requisitos estritos dos testes.
3. **Imutabilidade**: Os testes **não devem ser alterados em hipótese alguma** só porque o código não funcionou como o teste definiu. **Os testes são a Lei e o código é que deve se adaptar a eles.**
4. **Mudanças no Projeto**: Em caso de alguma alteração real de negócio que mude o funcionamento pretendido do código, **primeiro devemos mudar os testes** e, somente depois, alterar o código da aplicação.

Contamos com forte cobertura via **Jest** e **React Testing Library**. Nossas suítes garantem blindagem nestas áreas vitais:
- **Regras de Negócio (`/utils`)**: Validação matemática de fórmulas zootécnicas e métricas.
- **Componentes e Layouts (`/components` e `/app/layout.tsx`)**: Acessibilidade e inibição de vazamento de dados de sessão.
- **Configurações (`/config`)**: Integridade de rotas e navegação.

Para rodar toda a suíte de testes, utilize:
```bash
npm run test
```