"use client";

import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  User, 
  Home, 
  Users, 
  BarChart3, 
  CheckCircle,
  AlertCircle
} from "lucide-react";

/**
 * @file page.tsx (Configurações)
 * @description Página de gestão de dados da fazenda.
 * Permite ao consultor atualizar os parâmetros técnicos que servem de entrada 
 * para os diagnósticos de IA e cálculos de simulação.
 */

interface FarmFormData {
  nome_fazenda: string;
  consultor: string;
  sistema_producao: string;
  vacas_em_lactacao_cabecas: number;
  vacas_totais_cabecas: number;
  animais_totais_cabecas: number;
  funcionarios_qtd: number;
  area_destinada_atividade_ha: number;
}

/**
 * SettingsPage - Componente de Configurações
 * @returns {JSX.Element} Formulário de gestão de dados técnicos.
 */
export default function App() {
  const [formData, setFormData] = useState<FarmFormData | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Carrega os dados iniciais do mock guardados na sessão
    const savedUser = sessionStorage.getItem("educampo_user");
    if (savedUser) {
      setFormData(JSON.parse(savedUser));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    // Simulação de salvamento
    setTimeout(() => {
      if (formData) {
        sessionStorage.setItem("educampo_user", JSON.stringify(formData));
        setStatus({ type: 'success', message: 'Dados da fazenda atualizados com sucesso!' });
      } else {
        setStatus({ type: 'error', message: 'Erro ao tentar guardar as alterações.' });
      }
      setIsSubmitting(false);
      
      // Limpa a mensagem após 3 segundos
      setTimeout(() => setStatus({ type: null, message: '' }), 3000);
    }, 1000);
  };

  if (!formData) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Configurações da Fazenda
          </h2>
          <p className="text-slate-500">Mantenha os indicadores zootécnicos e cadastrais atualizados.</p>
        </div>
      </header>

      {/* Feedback Alert */}
      {status.type && (
        <div className={`p-4 rounded-xl flex items-center gap-3 border ${
          status.type === 'success' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
            : 'bg-red-50 border-red-100 text-red-700'
        }`}>
          {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{status.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Informações Básicas */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" />
                Dados Identificadores
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Nome da Propriedade</label>
                  <input 
                    name="nome_fazenda"
                    value={formData.nome_fazenda}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Consultor Responsável</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      name="consultor"
                      value={formData.consultor}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Sistema de Produção</label>
                  <select 
                    name="sistema_producao"
                    value={formData.sistema_producao}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  >
                    <option value="Compost Barn">Compost Barn</option>
                    <option value="Free Stall">Free Stall</option>
                    <option value="Pasto">Pasto</option>
                    <option value="Semiconfinado">Semiconfinado</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100"></div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Parâmetros Técnicos (Zootécnicos)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Vacas em Lactação (Cab.)</label>
                  <input 
                    type="number"
                    name="vacas_em_lactacao_cabecas"
                    value={formData.vacas_em_lactacao_cabecas}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Vacas Totais (Cab.)</label>
                  <input 
                    type="number"
                    name="vacas_totais_cabecas"
                    value={formData.vacas_totais_cabecas}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Área Destinada (ha)</label>
                  <input 
                    type="number"
                    name="area_destinada_atividade_ha"
                    value={formData.area_destinada_atividade_ha}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Funcionários (Qtd.)</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                    <input 
                      type="number"
                      name="funcionarios_qtd"
                      value={formData.funcionarios_qtd}
                      onChange={handleChange}
                      className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Coluna de Ações Laterais */}
        <section className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl space-y-6">
            <h4 className="font-bold text-sm uppercase tracking-widest text-blue-400">Resumo da Gestão</h4>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Status da Fazenda</span>
                <span className="font-bold text-emerald-400 uppercase text-xs">Ativa</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Sincronização IA</span>
                <span className="font-bold text-blue-400 uppercase text-xs">Automática</span>
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 p-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>

          <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
            <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              <strong>Importante:</strong> Alterar o número de vacas ou a área impactará diretamente os diagnósticos de produtividade já gerados.
            </p>
          </div>
        </section>

      </form>
    </div>
  );
}