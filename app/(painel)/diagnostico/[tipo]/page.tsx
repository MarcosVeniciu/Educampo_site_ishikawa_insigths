"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Target, TrendingDown, TrendingUp, AlertCircle, Info, ArrowRight } from "lucide-react";
import IshikawaCard from "@/components/IshikawaCard";
import { useAppStore } from "@/store/useAppStore";

const META_INFO: Record<string, { title: string, subtitle: string, indicator: string }> = {
  trabalhador: {
    title: "Produtividade por Trabalhador",
    subtitle: "Análise da eficiência da mão de obra baseada no modelo Ishikawa 6M.",
    indicator: "L/homem/dia"
  },
  hectare: {
    title: "Produtividade por Área",
    subtitle: "Análise da eficiência do uso da terra baseada no modelo Ishikawa 6M.",
    indicator: "L/ha/ano"
  },
  produtividade: {
    title: "Produtividade por Vaca",
    subtitle: "Análise do potencial produtivo individual baseada no modelo Ishikawa 6M.",
    indicator: "L/vaca/dia"
  },
  ccs: {
    title: "Análise de Saúde (CCS)",
    subtitle: "Investigação da qualidade do leite e fatores sanitários via Ishikawa 6M.",
    indicator: "Células/mL"
  }
};

export default function DiagnosticoPage() {
  const params = useParams();
  const router = useRouter();
  const tipo = params.tipo as string;

  const { diagnosticos, dadosFazenda, isLoaded } = useAppStore();
  const meta = META_INFO[tipo] || META_INFO['trabalhador'];
  const dadosDiagnostico = diagnosticos[tipo];

  // Cálculo de exemplo. Substitua pelas lógicas corretas da sua Utils no futuro.
  const valorAtual = useMemo(() => {
    if (!dadosFazenda) return "N/A";
    switch (tipo) {
      case 'trabalhador': return dadosFazenda.funcionarios_qtd > 0 ? Math.round((dadosFazenda.vacas_em_lactacao_cabecas * (dadosFazenda.producao_leite_l_vaca_dia || 15)) / dadosFazenda.funcionarios_qtd) : 0;
      case 'ccs': return dadosFazenda.ccs_celulas_ml || "N/A";
      case 'produtividade': return dadosFazenda.producao_leite_l_vaca_dia || "N/A";
      default: return "---";
    }
  }, [dadosFazenda, tipo]);

  if (!isLoaded || !dadosDiagnostico) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">A montar Dashboard Analítico...</p>
      </div>
    );
  }

  // Ordenar categorias pelo impacto para usar no Ranking
  const categoriasOrdenadas = [...dadosDiagnostico.categories].sort((a, b) => b.impact - a.impact);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      
      {/* SEÇÃO 1: Cabeçalho (Header Azul) */}
      <section className="bg-slate-900 rounded-3xl p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="text-white">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm font-medium">
              <ChevronLeft className="w-4 h-4" /> Voltar para Visão Geral
            </button>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-1">Análise de Causas Raiz</p>
            <h1 className="text-3xl md:text-4xl font-black mb-2">{meta.title}</h1>
            <p className="text-slate-300">{meta.subtitle}</p>
            
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                6 Categorias Analisadas
              </span>
              <span className="bg-red-500/20 border border-red-500/30 text-red-100 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                Atenção Necessária
              </span>
            </div>
          </div>

          <div className="bg-yellow-400 text-slate-900 p-6 rounded-2xl shrink-0 min-w-[200px] text-center shadow-xl transform lg:-translate-y-2">
            <p className="text-xs font-bold tracking-widest uppercase mb-1 opacity-80">Produção Atual</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-black tracking-tighter">{valorAtual}</span>
              <span className="text-lg font-bold">{meta.indicator.split('/')[0]}</span>
            </div>
            <p className="text-sm font-medium mt-1">{meta.indicator}</p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: Alerta Principal */}
      <section className="bg-amber-50 border-2 border-amber-400 rounded-2xl p-5 flex items-start sm:items-center gap-4 shadow-sm">
        <div className="bg-amber-100 p-3 rounded-full text-amber-600 shrink-0">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-amber-900 font-bold text-lg leading-tight uppercase tracking-wide">Efeito a ser corrigido</h2>
          <p className="text-amber-700 font-medium text-sm mt-1">
            Os dados indicam que o indicador de <strong className="font-black text-amber-900">{valorAtual} {meta.indicator}</strong> está sofrendo perdas devido a ineficiências identificadas nas categorias abaixo.
          </p>
        </div>
      </section>

      {/* SEÇÃO 3: KPIs - Impacto (Cards Superiores) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Meta de Referência", value: "25", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Gap (Diferença)", value: "-6,6", icon: TrendingDown, color: "text-red-600", bg: "bg-red-50" },
          { title: "Causas Críticas", value: "4", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Confiança da IA", value: "92%", icon: Info, color: "text-blue-600", bg: "bg-blue-50" },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
            <div className={`p-2 rounded-full mb-3 ${kpi.bg} ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
            <span className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</span>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{kpi.title}</p>
          </div>
        ))}
      </section>

      {/* SEÇÃO 4: O Coração do Dashboard - Metodologia 6M */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 px-2">Metodologia 6M (Causas Raiz)</h2>
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dadosDiagnostico.categories.map((categoria) => (
            <IshikawaCard 
              key={categoria.id}
              icone={categoria.emoji}
              titulo={categoria.label}
              tagStatus={categoria.tag}
              impacto={categoria.impact}
              causas={categoria.causes}
            />
          ))}
        </section>
      </div>

      {/* SEÇÃO 5: Ranking de Impacto */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mt-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Ranking de Prioridade de Ação</h2>
        <div className="space-y-5">
          {categoriasOrdenadas.map((cat, index) => (
            <div key={cat.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 group">
              <div className="flex items-center gap-4 min-w-[250px]">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm">
                  {index + 1}º
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="font-bold text-slate-800">{cat.label}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{cat.causes.length} causas identificadas</p>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="flex-1 w-full flex items-center gap-4">
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      cat.impact > 70 ? 'bg-red-500' : cat.impact > 40 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${cat.impact}%` }}
                  ></div>
                </div>
                <span className="font-black text-slate-700 w-12 text-right">{cat.impact}%</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEÇÃO 6: Legenda e Rodapé */}
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-200 px-2">
        <div className="flex gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Alta (Crítico)</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Média (Atenção)</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Baixa (Monitorar)</div>
        </div>
        <p className="text-xs text-slate-400 italic">
          Análise gerada por Inteligência Artificial (Educampo) baseada no preenchimento do consultor.
        </p>
      </section>

    </div>
  );
}