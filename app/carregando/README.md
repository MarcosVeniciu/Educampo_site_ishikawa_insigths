# ⏳ Tela de Carregamento (`/carregando`)

Este diretório contém a página de transição e carregamento da aplicação (`page.tsx`), atuando como o orquestrador principal (Fase 4 do fluxo) entre a coleta de dados básicos da fazenda e a exibição do Dashboard interativo.

---

## 🎯 Objetivo

Prover uma experiência fluida e imersiva de *Loading* para o usuário enquanto o sistema resolve requisições complexas em segundo plano. Em vez de bloquear a interface do usuário ou exibir *spinners* pipocando isoladamente em cada gráfico do dashboard, a arquitetura centraliza a espera nesta página para garantir que o Dashboard só seja renderizado quando 100% dos dados já estiverem preenchidos e formatados.

---

## ⚙️ Funcionamento e Orquestração

O componente realiza as seguintes etapas lógicas automáticas logo após a montagem do componente:

1. **Validação de Hidratação e Segurança**: 
   Verifica se a store global (`Zustand`) já leu o `sessionStorage` e se os `dadosFazenda` existem. Se um usuário tentar acessar esta rota diretamente (via URL) sem ter preenchido os formulários, a página aborta o carregamento, força um *logout* de segurança na API (`DELETE /api/auth`), limpa o navegador e o redireciona de volta para o `/login`.

2. **Busca Paralela Massiva (`Promise.all`)**: 
   Dispara simultaneamente **5 requisições** para os serviços do Frontend (`apiEducampo`) para reduzir drasticamente o tempo total de espera:
   - 🚜 Diagnóstico de Mão de Obra (Trabalhador)
   - 📏 Diagnóstico de Uso da Terra (Hectare)
   - 🐄 Diagnóstico de Produção (Produtividade/Vaca)
   - 🩺 Diagnóstico de Saúde Mamária (CCS)
   - 📊 Variáveis de Referência e Benchmarks de Mercado

3. **Persistência de Estado Global**: 
   Salva todas as respostas geradas pela IA e formatadas pelo BFF diretamente no estado global (`useAppStore`).

4. **Redirecionamento**: 
   Seta a flag de sistema pronto (`setLoaded(true)`) e utiliza o `useRouter` do Next.js para enviar o usuário ao `/dashboard`.

---

## ❌ Tratamento de Erros e Resiliência

Caso qualquer uma das *Promises* da API falhe ou a conexão caia durante o processo:
- O fluxo de redirecionamento para o dashboard é cancelado para evitar uma tela quebrada.
- A interface interrompe as animações e troca o ícone principal por um aviso de erro crítico.
- Uma mensagem clara de "Falha ao processar os diagnósticos da fazenda" é exibida.
- Um botão de *fallback* vermelho é habilitado, permitindo que o usuário volte com segurança ao Login (limpando o estado sujo) para tentar novamente.

---

## 🎨 UX e Elementos Visuais

- **Ícones**: Emprego da biblioteca **Lucide React** (`Tractor` central acompanhado por um `Loader2` girando em background).
- **Tailwind CSS**: Estilizações avançadas com `animate-pulse`, `animate-spin` e inserção dinâmica de uma barra de carregamento no rodapé utilizando *keyframes* globais (`animate-[loading_4s...]`).
- **Personalização Dinâmica**: A página lê o nome da propriedade preenchida nos passos anteriores e injeta na tela para transmitir uma experiência mais engajadora (ex: *"Nossa IA está processando as métricas da fazenda **Vale Verde**"*).