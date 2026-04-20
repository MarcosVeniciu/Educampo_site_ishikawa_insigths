"use client";

import React, { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  Activity,
  ArrowRight
} from "lucide-react";

/**
 * @file page.tsx (Dashboard)
 * @description Página inicial do painel administrativo.
 * Exibe um resumo dos indicadores da fazenda e atalhos rápidos para os diagnósticos.
 * Segue a identidade visual azul do Educampo.
 */

interface DashboardStats {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

/**
 * DashboardPage - Componente da Página Inicial
 * @returns {JSX.Element} Estrutura da página de visão geral.
 */
export default function DashboardPage() {
  const [farmData, setFarmData] = useState<any>(null);

  useEffect(() => {
    // Recupera os dados da fazenda mockada salvos no login
    const savedUser = sessionStorage.getItem("educampo_user");
    if (savedUser) {
      setFarmData(JSON.parse(savedUser));
    }
  }, []);

  const stats: DashboardStats[] = [
    { 
      label: "Produção Diária", 
      value: "2.450 L", 
      change: "+5.2%", 
      icon: <Activity className="w-5 h-5 text-blue-600" /> 
    },
    { 
      label: "Vacas em Lactação", 
      value: farmData?.vacas_em_lactacao_cabecas || "85", 
      change: "Estável", 
      icon: <Users className="w-5 h-5 text-blue-600" /> 
    },
    { 
      label: "Produtividade / Vaca", 
      value: "28.8 L/dia", 
      change: "+1.4%", 
      icon: <TrendingUp className="w-5 h-5 text-blue-600" /> 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <section>
        <h2 className="text-2xl font-bold text-slate-800">
          Olá, {farmData?.consultor || "Consultor"}
        </h2>
        <p className="text-slate-500">
          Bem-vindo ao painel da <span className="font-semibold text-blue-600">{farmData?.nome_fazenda || "Fazenda Educampo"}</span>.
        </p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                {stat.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                stat.change.includes("+") ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-500"
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* Main Content Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quick Diagnostics */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-blue-600" />
              Diagnósticos 6M Disponíveis
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Produção por Trabalhador", desc: "Análise de eficiência da mão de obra.", route: "/diagnostico/trabalhador" },
              { title: "Produção por Área (ha)", desc: "Aproveitamento da terra e piquetes.", route: "/diagnostico/hectare" },
              { title: "Qualidade do Leite (CCS)", desc: "Saúde do rebanho e higiene.", route: "/diagnostico/ccs" },
              { title: "Produtividade Geral", desc: "Visão técnica macro da operação.", route: "/diagnostico/produtividade" },
            ].map((item, idx) => (
              <a 
                key={idx} 
                href={item.route}
                className="group p-5 bg-white border border-slate-200 rounded-xl hover:border-blue-300 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h4>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-all transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* System Info / Status */}
        <section className="space-y-4">
          <h3 className="font-bold text-slate-800">Status do Sistema</h3>
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">API Conectada</span>
              </div>
              <p className="text-sm text-slate-300">
                A inteligência artificial está pronta para analisar os seus dados zootécnicos.
              </p>
              <div className="pt-4 border-t border-slate-800">
                <p className="text-[10px] text-slate-500 mb-1">ÚLTIMA SINCRONIZAÇÃO</p>
                <p className="text-xs font-mono">20/04/2026 - 18:42</p>
              </div>
            </div>
            {/* Efeito visual de fundo */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl"></div>
          </div>
        </section>

      </div>
    </div>
  );
}