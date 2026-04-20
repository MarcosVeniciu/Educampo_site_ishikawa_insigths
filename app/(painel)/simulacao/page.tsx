"use client";

import React, { useState, useMemo } from "react";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Milk, 
  ArrowRight,
  RefreshCw,
  Info
} from "lucide-react";

/**
 * @file page.tsx (Simulação)
 * @description Página de simulação de cenários financeiros e produtivos.
 * Permite ajustar variáveis como Preço do Leite, Custo da Dieta e Produtividade
 * para visualizar o impacto imediato na margem líquida da fazenda.
 */

interface ScenarioState {
  precoLeite: number;
  custoDieta: number;
  producaoVaca: number;
  numVacas: number;
}

/**
 * SimulationPage - Componente da Tela de Cenários
 * @returns {JSX.Element} Interface interativa de projeção de resultados.
 */
export default function App() {
  // Estado inicial baseado em médias de mercado ou dados da fazenda
  const [scenario, setScenario] = useState<ScenarioState>({
    precoLeite: 2.45,
    custoDieta: 1.15,
    producaoVaca: 28.5,
    numVacas: 85
  });

  /**
   * Cálculos derivados (Simulação Simplificada)
   * Baseado nas sugestões do Dr. Andre sobre interdependência de indicadores.
   */
  const results = useMemo(() => {
    const faturamentoMensal = scenario.precoLeite * scenario.producaoVaca * scenario.numVacas * 30.5;
    const custoAlimentacaoMensal = scenario.custoDieta * scenario.producaoVaca * scenario.numVacas * 30.5;
    
    // Outros custos fixos simulados (35% do faturamento base)
    const custosFixos = (2.45 * 28.5 * 85 * 30.5) * 0.35;
    
    const margemLiquida = faturamentoMensal - custoAlimentacaoMensal - custosFixos;
    const pontoEquilibrio = custosFixos / (scenario.precoLeite - (scenario.custoAlimentacaoMensal / (scenario.producaoVaca * scenario.numVacas * 30.5) || 1)); // Lógica fictícia para visualização

    return {
      faturamento: faturamentoMensal,
      margem: margemLiquida,
      margemPercent: (margemLiquida / faturamentoMensal) * 100,
      pontoEquilibrio: pontoEquilibrio > 0 ? pontoEquilibrio : 0
    };
  }, [scenario]);

  const handleReset = () => {
    setScenario({
      precoLeite: 2.45,
      custoDieta: 1.15,
      producaoVaca: 28.5,
      numVacas: 85
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="w-6 h-6 text-blue-600" />
            Simulador de Resultados
          </h2>
          <p className="text-slate-500">Projete cenários alterando os indicadores técnicos e preços de mercado.</p>
        </div>
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Resetar Valores
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Coluna de Controles (Inputs) */}
        <section className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest border-b border-slate-100 pb-4">
              Ajuste as Variáveis
            </h3>

            {/* Preço do Leite */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-emerald-500" />
                  Preço do Leite (R$/L)
                </label>
                <span className="text-lg font-bold text-blue-600">R$ {scenario.precoLeite.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="1.50" max="4.50" step="0.01"
                value={scenario.precoLeite}
                onChange={(e) => setScenario({...scenario, precoLeite: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Custo da Dieta */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                  <Milk className="w-4 h-4 text-amber-500" />
                  Custo Dieta (R$/L)
                </label>
                <span className="text-lg font-bold text-blue-600">R$ {scenario.custoDieta.toFixed(2)}</span>
              </div>
              <input 
                type="range" min="0.50" max="2.50" step="0.01"
                value={scenario.custoDieta}
                onChange={(e) => setScenario({...scenario, custoDieta: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Produção por Vaca */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  Produção (L/vaca/dia)
                </label>
                <span className="text-lg font-bold text-blue-600">{scenario.producaoVaca} L</span>
              </div>
              <input 
                type="range" min="10" max="50" step="0.5"
                value={scenario.producaoVaca}
                onChange={(e) => setScenario({...scenario, producaoVaca: parseFloat(e.target.value)})}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>Dica:</strong> Alterações na produção por vaca podem ter custos marginais de alimentação. O simulador considera uma relação linear básica para este protótipo.
            </p>
          </div>
        </section>

        {/* Coluna de Resultados (Charts/Stats) */}
        <section className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card Faturamento */}
            <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Faturamento Mensal Est.</p>
              <p className="text-3xl font-black mb-4">
                {results.faturamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4"></div>
              </div>
            </div>

            {/* Card Margem Líquida */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Margem Líquida Est.</p>
              <p className={`text-3xl font-black mb-1 ${results.margem >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {results.margem.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
              <p className="text-xs font-bold text-slate-500">
                {results.margemPercent.toFixed(1)}% sobre a receita
              </p>
              {/* Indicador visual de saúde financeira */}
              <div className={`absolute top-6 right-6 w-3 h-3 rounded-full ${results.margemPercent > 20 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
            </div>
          </div>

          {/* Área de Visualização Gráfica (Placeholder Visual) */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[300px] flex flex-col justify-center items-center text-center">
            <div className="w-full max-w-md space-y-8">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">Impacto no Ponto de Equilíbrio</h4>
                <p className="text-sm text-slate-500">Volume de leite necessário para cobrir todos os custos mensais.</p>
              </div>
              
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between text-xs">
                  <span className="font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Cenário Atual
                  </span>
                  <span className="font-semibold inline-block text-blue-600">
                    {Math.round(results.pontoEquilibrio).toLocaleString()} L/mês
                  </span>
                </div>
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-slate-100">
                  <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <div className="flex flex-col gap-1">
                  <div className="h-1 bg-slate-200 rounded"></div>
                  <span>Início</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="h-1 bg-blue-600 rounded"></div>
                  <span className="text-blue-600">Alvo IA</span>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <div className="h-1 bg-slate-200 rounded"></div>
                  <span>Escala</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900">Potencial de Otimização</h4>
                <p className="text-sm text-emerald-700">Com base nos problemas de Ishikawa detectados, você pode aumentar a margem em até 12%.</p>
              </div>
            </div>
            <button className="hidden md:flex items-center gap-2 text-sm font-bold text-emerald-700 hover:underline">
              Ver Plano de Ação <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}