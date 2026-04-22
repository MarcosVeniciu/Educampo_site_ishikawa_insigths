"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Info, AlertTriangle, CheckCircle2 } from "lucide-react";
import IshikawaCard from "@/components/IshikawaCard";
import { useAppStore } from "@/store/useAppStore";
import { 
  calcularProducaoTotal, 
  calcularLitrosPorHectare, 
  calcularLitrosPorTrabalhador, 
  avaliarStatus 
} from "@/utils/calculos";

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

  const tipo = params.tipo as string;
  
  const diagnosticos = useAppStore((state) => state.diagnosticos);
  const dadosFazenda = useAppStore((state) => state.dadosFazenda);
  const isLoaded = useAppStore((state) => state.isLoaded);

  const [loading, setLoading] = useState(true);

  // Transforma o status matemático (baixo/medio/alto) em status visual para a UI
  const mapStatus = (resultado: 'baixo' | 'medio' | 'alto', invert: boolean = false): "bom" | "alerta" | "critico" => {
    if (invert) return resultado === 'baixo' ? 'bom' : resultado === 'alto' ? 'critico' : 'alerta';
    return resultado === 'alto' ? 'bom' : resultado === 'baixo' ? 'critico' : 'alerta';
  };

  const data = useMemo<DiagnosticData | null>(() => {
    if (!dadosFazenda || !diagnosticos[tipo]) return null;

    const producaoTotal = calcularProducaoTotal(
      dadosFazenda.vacas_em_lactacao_cabecas,
      dadosFazenda.producao_leite_l_vaca_dia || 0
    );

    let title = "";
    let description = "";
    let indicator = "";
    let value = "";
    let status: "bom" | "alerta" | "critico" = "alerta";

    switch (tipo) {
      case "trabalhador":
        title = "Produção por Trabalhador";
        description = "Análise da eficiência produtiva em relação à mão de obra disponível.";
        indicator = "L/homem/dia";
        const valTrab = calcularLitrosPorTrabalhador(producaoTotal, dadosFazenda.funcionarios_qtd);
        value = valTrab.toFixed(0) + " L";
        status = mapStatus(avaliarStatus(valTrab, 300, 600)); // Limites base de exemplo
        break;
      case "hectare":
        title = "Produção por Hectare";
        description = "Análise da eficiência produtiva em relação à área utilizada.";
        indicator = "L/ha/dia";
        const valHa = calcularLitrosPorHectare(producaoTotal, dadosFazenda.area_destinada_atividade_ha);
        value = valHa.toFixed(0) + " L";
        status = mapStatus(avaliarStatus(valHa, 15, 30));
        break;
      case "ccs":
        title = "Qualidade do Leite (CCS)";
        description = "Análise da saúde do rebanho e higiene dos processos de ordenha.";
        indicator = "Células Somáticas / mL";
        const valCcs = dadosFazenda.ccs_celulas_ml || 0;
        value = (valCcs / 1000).toFixed(0) + "k";
        status = mapStatus(avaliarStatus(valCcs, 200000, 400000, true), true); // Invertido: CCS baixo = bom
        break;
      case "produtividade":
        title = "Produtividade por Vaca";
        description = "Análise do volume de leite produzido individualmente.";
        indicator = "L/vaca/dia";
        const valProd = dadosFazenda.producao_leite_l_vaca_dia || 0;
        value = valProd.toFixed(1) + " L";
        status = mapStatus(avaliarStatus(valProd, 15, 25));
        break;
    }

    return {
      title,
      description,
      indicator,
      value,
      status,
      categories: diagnosticos[tipo].categories // <-- LÊ AS CAUSAS REAIS DA IA
    };
  }, [tipo, dadosFazenda, diagnosticos]);

  useEffect(() => {
    if (isLoaded && !dadosFazenda) {
      // Prevenção caso o usuário recarregue a página (F5) e o Zustand não tenha hidratado
      router.push('/carregando');
    } else if (data) {
      setLoading(false);
    }
  }, [isLoaded, dadosFazenda, data, router]);

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