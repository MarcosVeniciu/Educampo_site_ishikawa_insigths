/**
 * @fileoverview Página de Login principal do sistema Educampo Insights.
 * Responsável por capturar credenciais, gerenciar estados de autenticação,
 * persistir o token de sessão e redirecionar usuários para o dashboard.
 * * Integra-se ao serviço de mock (/mock/auth.ts) para simulação de API.
 * @module pages/LoginPage
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Importação do serviço de simulação de autenticação.
 * O loginMock valida as credenciais contra um banco de dados estático.
 */
import { loginMock } from '../../mock/auth';

/**
 * Componente funcional LoginPage.
 * Renderiza o formulário de acesso e gerencia a lógica de entrada no sistema.
 * * @returns {JSX.Element} A interface de login renderizada.
 */
export default function LoginPage() {
  const router = useRouter();
  
  // --- Estados do Formulário ---
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  // --- Estados de Interface (UX) ---
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  /**
   * Manipula o envio do formulário de login.
   * Executa a validação via mock, armazena dados de sessão no localStorage
   * e realiza o roteamento em caso de sucesso.
   * * @param {React.FormEvent} e - Evento de submissão do formulário.
   * @async
   * @throws {Error} Exibe mensagens de erro capturadas da lógica de mock.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o refresh padrão da página
    
    setMensagemErro(null);
    setEstaCarregando(true);

    try {
      /**
       * Chamada assíncrona ao serviço de mock.
       * @constant {AuthResponse} resposta - Contém o token JWT e dados do usuário.
       */
      const resposta = await loginMock(email, senha);
      
      // Persistência local para controle de acesso em outras páginas
      localStorage.setItem('@Educampo:token', resposta.token);
      localStorage.setItem('@Educampo:user', JSON.stringify(resposta.user));

      // Redirecionamento programático para a área restrita
      router.push('/dashboard');
      
    } catch (erro: any) {
      // Captura mensagens específicas (ex: "Usuário não encontrado") enviadas pelo mock
      setMensagemErro(erro.message || 'Ocorreu um erro inesperado ao autenticar.');
    } finally {
      // Garante que o estado de carregamento seja encerrado idependente do resultado
      setEstaCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-gray-900">
      
      {/* Seção de Branding/Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-xl bg-green-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl tracking-tighter">ED</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Educampo Insights
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Acesse a plataforma de diagnóstico e simulação
        </p>
      </div>

      {/* Card de Formulário */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* Campo E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Endereço de E-mail
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 outline-none border transition-all"
                  placeholder="exemplo@fazenda.com.br"
                  disabled={estaCarregando}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha de Acesso
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5 outline-none border transition-all"
                  placeholder="••••••••"
                  disabled={estaCarregando}
                />
              </div>
            </div>

            {/* Alerta de Erro - Renderização Condicional */}
            {mensagemErro && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700 font-medium">{mensagemErro}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Submissão com Estado Loading */}
            <button
              type="submit"
              disabled={estaCarregando}
              className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200
                ${estaCarregando 
                  ? 'bg-green-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 active:transform active:scale-[0.98]'}`}
            >
              {estaCarregando ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                  Verificando...
                </>
              ) : 'Entrar no sistema'}
            </button>
            
          </form>

          {/* Rodapé do Card */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 text-xs">Suporte Educampo</span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <a href="#" className="font-medium text-green-600 hover:text-green-500 text-xs transition-colors">
                Precisa de ajuda com o acesso?
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}