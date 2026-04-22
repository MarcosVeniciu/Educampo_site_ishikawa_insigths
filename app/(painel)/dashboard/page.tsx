/**
 * @file page.tsx
 * @description Dashboard do Produtor (Fase 5).
 * Organizada conforme as imagens de proposta de design (fdff9b.png e fe0a1e.png).
 * Consome o estado global do Zustand e processa indicadores via Utils.
 * * CORREÇÃO: Implementação de 'hasHydrated' e 'useEffect' para redirecionamento seguro.
 * Isso impede que o sistema tente redirecionar o usuário antes do Zustand recuperar
 * os dados do sessionStorage, resolvendo o loop infinito entre Dashboard e Carregamento.
 * @version 1.1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Map, 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  ChevronRight, 
  Target,
  Tractor,
  Thermometer
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import * as calc from '@/utils/calculos';

export default function DashboardPage() {
  const router = useRouter();
  const { dadosFazenda, diagnosticos, referencias, isLoaded } = useAppStore();
  
  // ✅ ESTADO DE HIDRATAÇÃO: Garante que o componente espere o Zustand ler o storage
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  /**
   * ✅ PROTEÇÃO DE ROTA (Efeito de Redirecionamento Seguro)
   * Só executa a lógica de redirecionamento após a hidratação completa.
   */
  useEffect(() => {
    if (!hasHydrated) return;

    if (!isLoaded || !dadosFazenda || !referencias) {
      router.push('/carregando');
    }
  }, [hasHydrated, isLoaded, dadosFazenda, referencias, router]);

  /**
   * Enquanto os dados não estão prontos, a hidratação não ocorreu 
   * ou o redirecionamento está em curso, retornamos null.
   */
  if (!hasHydrated || !isLoaded || !dadosFazenda || !referencias) {
    return null;
  }

  // Cálculos de Indicadores de Topo (KPIs)
  const producaoTotal = calc.calcularProducaoTotal(
    dadosFazenda.vacas_em_lactacao_cabecas, 
    dadosFazenda.producao_leite_l_vaca_dia || 0
  );
  
  const taxaLactacao = calc.calcularTaxaLactacao(
    dadosFazenda.vacas_em_lactacao_cabecas, 
    dadosFazenda.vacas_totais_cabecas
  );

  // Ajustado para o nome correto do campo conforme a API
  const lotacaoGlobal = dadosFazenda.animais_totais_cabecas / dadosFazenda.area_destinada_atividade_ha;

  /**
   * Sub-componente: Card de Indicador Principal
   */
  const KpiCard = ({ title, value, unit, icon: Icon, colorClass }: any) => (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all">
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">{title}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-slate-800">{value}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>
        </div>
      </div>
    </div>
  );

  /**
   * Sub-componente: Card de Atalho de Diagnóstico (Design fe0a1e.png)
   */
  const AtalhoDiagnostico = ({ tipo, titulo, icon: Icon, atual, metrica, diagnostico, potencial }: any) => {
    if (!diagnostico) return null;

    const causasCriticas = calc.contarCausasAltaSeveridade(diagnostico.categories);
    const pilarImpacto = calc.obterPilarMaiorImpacto(diagnostico.categories);
    const status = calc.avaliarStatus(atual, potencial.min, potencial.max, tipo === 'ccs');

    const statusMap = {
      baixo: { label: 'Baixo', color: 'bg-red-500 text-white', ring: 'ring-red-100' },
      medio: { label: 'Médio', color: 'bg-amber-500 text-white', ring: 'ring-amber-100' },
      alto: { label: 'Alto', color: 'bg-green-600 text-white', ring: 'ring-green-100' }
    };

    return (
      <div 
        onClick={() => router.push(`/diagnostico/${tipo}`)}
        className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-green-500 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
      >
        {/* Cabeçalho do Atalho */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center group-hover:bg-green-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm border border-slate-200 group-hover:border-green-200">
              <Icon className="w-5 h-5 text-slate-600 group-hover:text-green-600" />
            </div>
            <h3 className="font-black text-slate-700 tracking-tight uppercase text-xs">{titulo}</h3>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
        </div>

        {/* Resumo de Dados */}
        <div className="p-5 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Produção Atual</p>
              <p className="text-3xl font-black text-slate-800 leading-none">
                {atual.toLocaleString('pt-BR')} 
                <span className="text-xs font-bold text-slate-400 ml-1 uppercase">{metrica}</span>
              </p>
            </div>
            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ring-4 ${statusMap[status].color} ${statusMap[status].ring}`}>
              {statusMap[status].label}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-red-500" />
                <span className="text-[10px] font-black text-red-700 uppercase tracking-tighter">Severidade</span>
              </div>
              <p className="text-xs font-bold text-red-900">{causasCriticas} causas críticas</p>
            </div>
            
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-blue-500" />
                <span className="text-[10px] font-black text-blue-700 uppercase tracking-tighter">Impacto</span>
              </div>
              <p className="text-xs font-bold text-blue-900 truncate">
                {pilarImpacto?.impact}% - {pilarImpacto?.label.split(' ')[0]}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-dashed border-slate-200 flex items-center gap-3">
            <div className="bg-slate-100 p-1.5 rounded-full">
              <Target className="w-3 h-3 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              <span className="font-black text-slate-700 uppercase tracking-tighter">Potencial da propriedade:</span> <br />
              {potencial.min} - {potencial.max} {metrica}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* Cabeçalho de Identificação */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-200 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-green-700">
            <Tractor className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Sistema de Gestão</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
            Dashboard <span className="text-green-700">Educampo</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Fazenda: <span className="text-slate-800 font-bold">{dadosFazenda.nome_fazenda}</span> • 
            Sistema: <span className="bg-slate-200 px-2 py-0.5 rounded text-xs text-slate-700 font-bold uppercase tracking-widest">{dadosFazenda.sistema_producao}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="bg-amber-100 p-3 rounded-xl text-amber-700">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Dados Atualizados</p>
            <p className="text-lg font-black text-slate-700">Sessão Ativa</p>
          </div>
        </div>
      </header>

      {/* Seção 1: Indicadores Principais (KPIs) */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard 
          title="Produção Diária" 
          value={producaoTotal.toLocaleString('pt-BR')} 
          unit="L/Dia" 
          icon={TrendingUp} 
          colorClass="bg-green-600 shadow-lg shadow-green-100" 
        />
        <KpiCard 
          title="Taxa de Lactação" 
          value={taxaLactacao.toFixed(1)} 
          unit="%" 
          icon={Thermometer} 
          colorClass="bg-blue-600 shadow-lg shadow-blue-100" 
        />
        <KpiCard 
          title="Lotação Global" 
          value={lotacaoGlobal.toFixed(2)} 
          unit="Cab/Ha" 
          icon={Map} 
          colorClass="bg-slate-800 shadow-lg shadow-slate-100" 
        />
        <KpiCard 
          title="Qualidade Leite" 
          value={dadosFazenda.ccs_celulas_ml?.toLocaleString('pt-BR')} 
          unit="CCS (Mil)" 
          icon={AlertCircle} 
          colorClass="bg-red-600 shadow-lg shadow-red-100" 
        />
      </section>

      {/* Seção 2: Atalhos de Diagnóstico (Grid Principal) */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 bg-green-700 rounded-full" />
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Atalhos de Diagnóstico</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AtalhoDiagnostico 
            tipo="trabalhador"
            titulo="Eficiência do Trabalhador"
            icon={Users}
            atual={calc.calcularLitrosPorTrabalhador(producaoTotal, dadosFazenda.funcionarios_qtd)}
            metrica="L/trab"
            diagnostico={diagnosticos.trabalhador}
            potencial={referencias.potencialTrabalhador}
          />
          
          <AtalhoDiagnostico 
            tipo="hectare"
            titulo="Eficiência por Área"
            icon={Map}
            atual={calc.calcularLitrosPorHectare(producaoTotal, dadosFazenda.area_destinada_atividade_ha)}
            metrica="L/ha"
            diagnostico={diagnosticos.hectare}
            potencial={referencias.potencialArea}
          />

          <AtalhoDiagnostico 
            tipo="produtividade"
            titulo="Produção por Vaca"
            icon={TrendingUp}
            atual={dadosFazenda.producao_leite_l_vaca_dia || 0}
            metrica="L/vaca"
            diagnostico={diagnosticos.produtividade}
            potencial={referencias.potencialVaca}
          />

          <AtalhoDiagnostico 
            tipo="ccs"
            titulo="Saúde Mamária (CCS)"
            icon={Activity}
            atual={dadosFazenda.ccs_celulas_ml || 0}
            metrica="Mil/mL"
            diagnostico={diagnosticos.ccs}
            potencial={{ min: 100, max: referencias.limiteCcs }}
          />
        </div>
      </div>
    </div>
  );
}