'use client';

/**
 * @fileoverview Página de Login do Educampo Insights.
 * Implementa a interface de autenticação utilizando HttpOnly Cookies (Fase 2).
 * * Mudanças Estruturais para VS Code:
 * 1. Utiliza useRouter de 'next/navigation' para navegação SPA otimizada.
 * 2. Remove completamente a manipulação manual de localStorage/sessionStorage.
 * 3. Delega a persistência do token ao navegador via cabeçalho Set-Cookie da API local.
 * 4. Foca no contrato de segurança estabelecido nos testes da Fase 1.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  // Estados locais para controle do formulário e feedback
  const [email, setEmail] = useState('produtor@educampo.com.br');
  const [password, setPassword] = useState('senha123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();

  /**
   * Processa a submissão do login enviando os dados para a API Route local.
   * @param e Evento de submissão do formulário.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Requisição para o nosso Backend-for-Frontend (BFF)
      // O servidor (/api/auth) validará as credenciais e retornará o cabeçalho Set-Cookie
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // 2. Validação da resposta
      if (!response.ok) {
        throw new Error(data.error || 'Falha na autenticação. Verifique e-mail e senha.');
      }

      // 3. Redirecionamento em caso de sucesso
      // Como o cookie HttpOnly foi definido pela resposta HTTP, o Middleware 
      // do Next.js agora permitirá o acesso às rotas protegidas automaticamente.
      router.push('/dashboard');
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        
        {/* Identidade Visual */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 mb-4">
            <svg 
              className="w-8 h-8 text-emerald-700" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Educampo Insights</h1>
          <p className="text-sm text-slate-500 mt-2">Acesse seus diagnósticos de produção</p>
        </div>

        {/* Formulário de Autenticação */}
        <form onSubmit={handleLogin} className="space-y-5">
          
          {/* Alerta de Erro de Negócio ou Conexão */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg flex items-start animate-in fade-in slide-in-from-top-1">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Campo de E-mail */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              E-mail corporativo
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
              placeholder="exemplo@educampo.com.br"
              required
            />
          </div>

          {/* Campo de Senha */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Senha de acesso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Ação de Login */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 flex justify-center items-center rounded-xl text-white font-semibold shadow-sm transition-all ${
              loading 
                ? 'bg-emerald-800/80 cursor-wait' 
                : 'bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] shadow-emerald-200 hover:shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validando acesso...
              </>
            ) : (
              'Acessar Painel'
            )}
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">
            Ambiente Seguro Educampo &bull; Versão 2.0 (HttpOnly)
          </p>
        </form>
      </div>
    </div>
  );
}