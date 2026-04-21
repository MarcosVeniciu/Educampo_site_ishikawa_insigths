'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Tractor } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { fetchDiagnostico } from '@/services/apiEducampo';
import { fetchVariaveisReferencia } from '@/services/apiVariaveis';

/**
 * Tela de Carregamento (Fase 4)
 * Orquestra as chamadas assíncronas em paralelo para os 4 diagnósticos
 * e as variáveis de referência, persistindo tudo no estado global do Zustand.
 */
export default function LoadingPage() {
  const router = useRouter();
  const hasFetched = useRef(false);

  // Seletores do Estado Global
  const dadosFazenda = useAppStore((state) => state.dadosFazenda);
  const setDiagnostico = useAppStore((state) => state.setDiagnostico);
  const setReferencias = useAppStore((state) => state.setReferencias);
  const setLoaded = useAppStore((state) => state.setLoaded);

  useEffect(() => {
    // Evita loop em desenvolvimento por conta do Strict Mode do React
    if (hasFetched.current) return;

    const inicializarDados = async () => {
      // Segurança: se não houver dados básicos, volta para o login
      if (!dadosFazenda) {
        router.push('/login');
        return;
      }

      try {
        hasFetched.current = true;

        // Dispara as requisições em paralelo para reduzir o tempo de espera (Promise.all)
        const [
          resTrabalhador,
          resHectare,
          resProdutividade,
          resCcs,
          resRefs
        ] = await Promise.all([
          fetchDiagnostico('trabalhador', dadosFazenda),
          fetchDiagnostico('hectare', dadosFazenda),
          fetchDiagnostico('produtividade', dadosFazenda),
          fetchDiagnostico('ccs', dadosFazenda),
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
        // Em caso de erro crítico, retorna ao login ou mostra erro amigável
        router.push('/login');
      }
    };

    inicializarDados();
  }, [dadosFazenda, router, setDiagnostico, setReferencias, setLoaded]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md text-center space-y-8">
        
        {/* Visual de Carregamento */}
        <div className="relative flex justify-center">
          <div className="bg-green-100 p-6 rounded-full animate-pulse border-4 border-green-50">
            <Tractor className="w-16 h-16 text-green-700" />
          </div>
          <div className="absolute -inset-2 flex items-center justify-center">
            <Loader2 className="w-28 h-28 text-green-700/10 animate-spin" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight italic">
            EDUCAMPO <span className="text-green-700 underline decoration-2">INSIGHTS</span>
          </h1>
          <p className="text-slate-500 leading-relaxed text-sm">
            Nossa IA está processando as métricas da fazenda <br />
            <span className="font-bold text-slate-700 underline">{dadosFazenda?.nome_fazenda || 'sua propriedade'}</span>.
          </p>
        </div>

        {/* Barra de Progresso Animada */}
        <div className="space-y-2">
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden shadow-inner border border-slate-300/50">
            <div className="bg-green-600 h-full animate-[loading_4s_ease-in-out_infinite]" />
          </div>
          <div className="flex justify-between text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black">
            <span>Mão de Obra</span>
            <span>Hectare</span>
            <span>Saúde</span>
            <span>Vaca</span>
          </div>
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