'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { loginMock } from '../../mock/auth';
import { debugLog } from '@/utils/logger';

/**
 * Página de Login - Educampo Insights
 * Responsável pela autenticação inicial e geração do token de sessão.
 */
export default function LoginPage() {
  const router = useRouter();
  
  // Estados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [estaCarregando, setEstaCarregando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  /**
   * Executa a lógica de autenticação
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemErro(null);
    setEstaCarregando(true);
    
    debugLog('--- INICIANDO FLUXO DE LOGIN ---');
    debugLog('Tentativa de login para:', email);

    try {
      // 1. Validação das credenciais no Mock de Autenticação
      const resposta = await loginMock(email, senha);
      
      // Nova verificação de segurança!
      if (!resposta || !resposta.token) {
         throw new Error("Credenciais inválidas. Verifique o seu e-mail e palavra-passe.");
      }

      debugLog('Autenticação no Mock bem-sucedida! Resposta recebida.', { 
        userId: resposta.user.id, 
        fazenda: resposta.user.fazenda 
     });

      // 2. Armazenamento do Token
      sessionStorage.setItem('token', resposta.token);
      
      debugLog('Token guardado com sucesso no sessionStorage.');

      // 3. Redirecionamento
      router.push('/carregando');
      
    } catch (erro: any) {
      debugLog('Erro na tentativa de login:', erro.message || erro);
      setMensagemErro(erro.message || 'Erro ao autenticar. Verifique os seus dados.');
    } finally {
      setEstaCarregando(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-gray-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* Logotipo Educampo */}
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <span className="text-2xl font-bold text-white">ED</span>
          </div>
        </div>
        <h2 className="mt-8 text-center text-3xl font-black leading-9 tracking-tight text-gray-900 italic">
          Educampo <span className="text-blue-600">Insights</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500 font-medium">
          Plataforma de Diagnóstico Estratégico
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="bg-white px-8 py-10 shadow-2xl ring-1 ring-gray-900/5 sm:rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Campo de E-mail */}
            <div>
              <label htmlFor="email" className="block text-sm font-bold leading-6 text-gray-900">
                E-mail do Consultor / Produtor
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                  placeholder="exemplo@educampo.com.br"
                />
              </div>
            </div>

            {/* Campo de Senha */}
            <div>
              <label htmlFor="senha" className="block text-sm font-bold leading-6 text-gray-900">
                Palavra-passe
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="senha"
                  type="password"
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Alerta de Erro */}
            {mensagemErro && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="font-medium">{mensagemErro}</span>
              </div>
            )}

            {/* Botão de Submissão */}
            <div>
              <button
                type="submit"
                disabled={estaCarregando}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-blue-600 px-3 py-3.5 text-sm font-bold leading-6 text-white shadow-lg hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {estaCarregando ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>A autenticar...</span>
                  </>
                ) : (
                  'Aceder ao Painel'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-gray-400">
              © 2024 SEBRAE Educampo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}