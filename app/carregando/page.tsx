'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Tractor, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { apiEducampo } from '@/services/apiEducampo'; // <-- IMPORTAÇÃO CORRIGIDA
import { fetchVariaveisReferencia } from '@/services/apiVariaveis';

/**
 * Tela de Carregamento (Fase 4)
 * Orquestra as chamadas assíncronas em paralelo para os 4 diagnósticos
 * e as variáveis de referência, persistindo tudo no estado global do Zustand.
 */
export default function LoadingPage() {
  const router = useRouter();
  const hasFetched = useRef(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [erroFatal, setErroFatal] = useState<string | null>(null);

  // Seletores do Estado Global
  const dadosFazenda = useAppStore((state) => state.dadosFazenda);
  const setDiagnostico = useAppStore((state) => state.setDiagnostico);
  const setReferencias = useAppStore((state) => state.setReferencias);
  const setLoaded = useAppStore((state) => state.setLoaded);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return; // Aguarda o Zustand ler o sessionStorage
    // Evita loop em desenvolvimento por conta do Strict Mode do React
    if (hasFetched.current) return;

    // Função auxiliar para quebrar o loop infinito de redirecionamento
    const forcarLogout = async () => {
      try {
        await fetch('/api/auth', { method: 'DELETE' }); // Apaga o Cookie no Backend
      } catch (e) {}
      sessionStorage.clear(); // Limpa resquícios de estado
      window.location.href = '/login'; // Usa location.href para forçar um recarregamento limpo (bypassa cache do router)
    };

    const inicializarDados = async () => {
      // Segurança: se não houver dados básicos, volta para o login
      if (!dadosFazenda) {
        console.warn('[Loading] Dados da fazenda não encontrados no estado, abortando...');
        await forcarLogout();
        return;
      }

      try {
        hasFetched.current = true;

        // Dispara as requisições em paralelo para reduzir o tempo de espera (Promise.all)
        // CHAMADAS DA API CORRIGIDAS PARA USAR A NOVA CLASSE
        const [
          resTrabalhador,
          resHectare,
          resProdutividade,
          resCcs,
          resRefs
        ] = await Promise.all([
          apiEducampo.diagnosticarTrabalhador(dadosFazenda),
          apiEducampo.diagnosticarHectare(dadosFazenda),
          apiEducampo.diagnosticarProdutividade(dadosFazenda),
          apiEducampo.diagnosticarCcs(dadosFazenda),
          fetchVariaveisReferencia(dadosFazenda.sistema_producao)
        ]);

        // Atualiza a Store Global (que salva automaticamente no sessionStorage)
        setDiagnostico('trabalhador', resTrabalhador);
        setDiagnostico('hectare', resHectare);
        setDiagnostico('produtividade', resProdutividade);
        setDiagnostico('ccs', resCcs);
        setReferencias(resRefs);

        // Notifica que o sistema está pronto e redireciona
        setLoaded(true);
        router.push('/dashboard');

      } catch (error) {
        console.error('[Loading] Erro ao carregar diagnósticos:', error);
        setErroFatal('Não foi possível se conectar à API. Verifique o console para mais detalhes.');
        hasFetched.current = false;
      }
    };

    inicializarDados();
  }, [hasHydrated, dadosFazenda, router, setDiagnostico, setReferencias, setLoaded]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md text-center space-y-8">
        
        {/* Visual de Carregamento */}
        <div className="relative flex justify-center">
          <div className="bg-green-100 p-6 rounded-full animate-pulse border-4 border-green-50">
            {erroFatal ? <AlertTriangle className="w-16 h-16 text-rose-600" /> : <Tractor className="w-16 h-16 text-green-700" />}
          </div>
          {!erroFatal && (
            <div className="absolute -inset-2 flex items-center justify-center">
              <Loader2 className="w-28 h-28 text-green-700/10 animate-spin" />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight italic">
            EDUCAMPO <span className="text-green-700 underline decoration-2">INSIGHTS</span>
          </h1>
          <p className="text-slate-500 leading-relaxed text-sm">
            {erroFatal ? 'Falha ao processar os diagnósticos da fazenda' : 'Nossa IA está processando as métricas da fazenda'} <br />
            <span className="font-bold text-slate-700 underline">{hasHydrated && dadosFazenda?.nome_fazenda ? dadosFazenda.nome_fazenda : 'sua propriedade'}</span>.
          </p>
        </div>

        <div className="space-y-2">
          {erroFatal ? (
            <div className="bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-200 text-sm flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
              <p className="font-semibold text-center">{erroFatal}</p>
              <button 
                onClick={() => { window.location.href = '/login'; }}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg font-bold uppercase tracking-wide text-xs hover:bg-rose-700 transition-colors mt-2 shadow-sm"
              >
                Voltar ao Login
              </button>
            </div>
          ) : (
            <>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner border border-slate-300/50">
                <div className="bg-green-600 h-full animate-[loading_4s_ease-in-out_infinite]" />
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black">
                <span>Mão de Obra</span>
                <span>Hectare</span>
                <span>Saúde</span>
                <span>Vaca</span>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes loading {
          0% { width: 0%; }
          30% { width: 45%; }
          70% { width: 85%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}