"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import IshikawaCard from "@/components/IshikawaCard";

/**
 * @file page.tsx (Diagnóstico Dinâmico)
 * @description Esta página utiliza rotas dinâmicas do Next.js para renderizar
 * diferentes análises de Ishikawa (6M) com base no parâmetro da URL.
 * * Fluxo:
 * 1. Captura o [tipo] da URL (ex: trabalhador, hectare, ccs).
 * 2. Busca os dados (nesta fase, simulados) correspondentes.
 * 3. Renderiza a coleção de IshikawaCards.
 */

// Interface para os dados do diagnóstico
interface DiagnosticData {
  title: string;
  description: string;
  indicator: string;
  value: string;
  status: "bom" | "alerta" | "critico";
  categories: any[]; // Estrutura esperada pelo IshikawaCard
}

/**
 * Componente da Página de Diagnóstico
 * @returns {JSX.Element} Interface dinâmica de análise técnica.
 */
export default function DiagnosticoPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<DiagnosticData | null>(null);
  const [loading, setLoading] = useState(true);

  const tipo = params.tipo as string;

  useEffect(() => {
    /**
     * Simulação de Fetch de Dados.
     * Na Fase Final, aqui será feita a chamada para a API FastAPI.
     */
    const fetchDiagnostic = () => {
      setLoading(true);
      
      // Simulação de delay da rede
      setTimeout(() => {
        // Mock de dados baseado no tipo
        const mockData: Record<string, DiagnosticData> = {
          trabalhador: {
            title: "Produção por Trabalhador",
            description: "Análise da eficiência produtiva em relação à mão de obra disponível.",
            indicator: "L/homem/dia",
            value: "420 L",
            status: "alerta",
            categories: [
              {
                id: "mao-de-obra",
                label: "Mão de Obra",
                emoji: "👥",
                impact: 85,
                color: "#b91c1c",
                light: "#fef2f2",
                border: "#fca5a5",
                tag: "Fator Crítico",
                causes: [
                  { text: "Falta de treinamento em rotinas de ordenha", severity: "alta", detail: "Gera atrasos e perda de padrão técnico." },
                  { text: "Alta rotatividade de peões", severity: "media", detail: "Dificulta a manutenção de processos." }
                ]
              },
              {
                id: "metodo",
                label: "Método",
                emoji: "📋",
                impact: 40,
                color: "#d97706",
                light: "#fffbeb",
                border: "#fef3c7",
                tag: "Otimização Necessária",
                causes: [
                  { text: "Fluxo de manejo ineficiente", severity: "media", detail: "Deslocamentos desnecessários dos animais." }
                ]
              }
            ]
          },
          ccs: {
            title: "Qualidade do Leite (CCS)",
            description: "Análise da saúde do rebanho e higiene dos processos de ordenha.",
            indicator: "Células Somáticas / mL",
            value: "580k",
            status: "critico",
            categories: [
              {
                id: "material",
                label: "Material",
                emoji: "🧪",
                impact: 92,
                color: "#b91c1c",
                light: "#fef2f2",
                border: "#fca5a5",
                tag: "Risco Sanitário",
                causes: [
                  { text: "Detergente de limpeza vencido", severity: "alta", detail: "Limpeza ineficiente das tubulações." }
                ]
              }
            ]
          }
        };

        // Fallback para tipos não mapeados no mock
        setData(mockData[tipo] || mockData["trabalhador"]);
        setLoading(false);
      }, 600);
    };

    if (tipo) fetchDiagnostic();
  }, [tipo]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">A IA está analisando os dados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Navegação e Título */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-full border border-transparent hover:border-slate-200 transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{data?.title}</h2>
            <p className="text-sm text-slate-500">{data?.description}</p>
          </div>
        </div>

        {/* Badge de Status Geral */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border font-bold text-xs uppercase tracking-widest ${
          data?.status === 'bom' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
          data?.status === 'alerta' ? 'bg-amber-50 text-amber-600 border-amber-100' :
          'bg-red-50 text-red-600 border-red-100'
        }`}>
          {data?.status === 'bom' && <CheckCircle2 className="w-4 h-4" />}
          {data?.status === 'alerta' && <Info className="w-4 h-4" />}
          {data?.status === 'critico' && <AlertTriangle className="w-4 h-4" />}
          Status: {data?.status}
        </div>
      </div>

      {/* Indicador Principal */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="text-center md:text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Indicador Atual</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-800 tracking-tight">{data?.value}</span>
            <span className="text-slate-400 font-medium">{data?.indicator}</span>
          </div>
        </div>
        <div className="h-px w-full md:h-12 md:w-px bg-slate-100"></div>
        <p className="text-sm text-slate-500 leading-relaxed max-w-xl text-center md:text-left italic">
          &quot;Os dados sugerem que as variações no 6M estão impactando a eficiência técnica da fazenda. 
          Consulte as causas raízes abaixo para priorizar o plano de ação.&quot;
        </p>
      </section>

      {/* Grid de Cards Ishikawa (6M) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.categories.map((category) => (
          <IshikawaCard 
            key={category.id}
            {...category}
          />
        ))}
      </section>

      {/* Rodapé de Ação */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-center gap-3">
        <Info className="w-4 h-4 text-blue-500" />
        <span className="text-xs text-blue-700 font-medium text-center">
          Este diagnóstico é gerado por IA com base nos dados fornecidos pelo consultor. 
          Verifique as causas presencialmente na fazenda.
        </span>
      </div>
    </div>
  );
}