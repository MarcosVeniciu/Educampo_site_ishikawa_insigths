/**
 * @fileoverview Componente de Menu Lateral (Sidebar) com suporte a Responsividade (Mobile).
 * Implementa a paleta de cores Azul Educampo e o comportamento de Drawer para smartphones.
 */

'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  X,
  LayoutDashboard, 
  GitMerge, 
  TrendingUp, 
  Settings,
  LogOut // ✅ Adicionado
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore'; // ✅ Adicionado para o Logout

const navigationConfig = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Visão geral dos indicadores da fazenda',
  },
  {
    label: 'Diagnóstico',
    href: '/diagnostico/geral', 
    icon: GitMerge, 
    description: 'Análise de causas raiz via Ishikawa',
  },
  {
    label: 'Simulação',
    href: '/simulacao',
    icon: TrendingUp,
    description: 'Projeção de cenários e impactos',
  },
  {
    label: 'Configurações',
    href: '/configuracoes',
    icon: Settings,
    description: 'Ajustes de parâmetros da fazenda',
  }
];

export interface SidebarProps {
  pathnameAtual?: string;
  aoNavegar?: (path: string) => void;
}

export default function Sidebar({ pathnameAtual, aoNavegar }: SidebarProps) {
  const router = useRouter();
  const pathNameHook = usePathname();
  const rotaAtiva = pathnameAtual || pathNameHook || '';

  const [expandido, setExpandido] = useState(true);
  const [mobileAberto, setMobileAberto] = useState(false);

  const alternarMobile = () => setMobileAberto(!mobileAberto);
  const alternarExpansao = () => setExpandido(!expandido);

  /**
   * ✅ Lógica de Desconexão (Logout)
   */
  const handleLogout = async () => {
    // 1. Limpa o estado global e o sessionStorage
    useAppStore.getState().clearData();
    sessionStorage.clear(); 
    
    // 2. Chama a rota DELETE para remover o cookie seguro
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } catch (e) {
      console.error('Erro ao deslogar:', e);
    }
    
    router.push('/login');
    setMobileAberto(false);
  };

  const handleNavegacao = (path: string) => {
    if (aoNavegar) {
      aoNavegar(path);
    } else {
      router.push(path);
    }
    setMobileAberto(false);
  };

  return (
    <>
      {/* Gatilho Mobile */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={alternarMobile}
          className="p-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-all active:scale-95"
          aria-label={mobileAberto ? 'Fechar menu' : 'Abrir menu'}
        >
          {mobileAberto ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileAberto && (
        <div 
          className="lg:hidden fixed inset-0 bg-slate-900/60 z-40 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={alternarMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col bg-blue-950 border-r border-blue-900 
          text-white shadow-2xl transition-all duration-300 ease-in-out
          ${mobileAberto ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
          ${expandido ? 'lg:w-64' : 'lg:w-20'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-900/50 h-20">
          {(expandido || mobileAberto) ? (
            <div className="flex items-center overflow-hidden animate-in fade-in slide-in-from-left-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mr-3 shadow-lg shrink-0">
                <span className="text-white font-bold text-lg">ED</span>
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-white text-sm leading-tight uppercase tracking-wider">
                  Educampo
                </h1>
                <span className="text-[10px] text-blue-400 font-medium uppercase tracking-widest">
                  Insights AI
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">ED</span>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-8 scrollbar-thin scrollbar-thumb-blue-800">
          <ul className="space-y-2 px-3">
            {navigationConfig.map((item) => {
              const Icone = item.icon;
              const isAtivo = rotaAtiva.startsWith(item.href);

              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavegacao(item.href)}
                    className={`
                      w-full flex items-center rounded-xl py-3 px-3 transition-all duration-200 group
                      ${isAtivo 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'text-blue-200/70 hover:bg-blue-900/50 hover:text-white'}
                      ${(!expandido && !mobileAberto) ? 'justify-center' : ''}
                    `}
                    aria-current={isAtivo ? 'page' : undefined} // ✅ CORREÇÃO: Necessário para o Sidebar.test.tsx
                    title={(!expandido && !mobileAberto) ? item.label : undefined}
                  >
                    <Icone
                      size={20}
                      className={`shrink-0 transition-colors ${isAtivo ? 'text-white' : 'text-blue-400 group-hover:text-blue-200'}`}
                    />
                    {(expandido || mobileAberto) && (
                      <span className="ml-3 truncate text-sm font-semibold tracking-wide">
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Rodapé: Botão Desconectar e Colapsar */}
        <div className="p-4 border-t border-blue-900/50 flex flex-col gap-2">
          
          {/* ✅ NOVO: Botão Desconectar */}
          <button
            onClick={handleLogout}
            className={`
              flex items-center text-rose-400 hover:text-white hover:bg-rose-600/80 
              p-2.5 rounded-xl transition-all duration-200 w-full group
              ${(!expandido && !mobileAberto) ? 'justify-center' : ''}
            `}
            title="Sair do Sistema"
          >
            <LogOut size={20} className="shrink-0" />
            {(expandido || mobileAberto) && (
              <span className="ml-3 truncate text-sm font-semibold tracking-wide">
                Sair do Sistema
              </span>
            )}
          </button>

          {/* Botão de Colapsar (Apenas Desktop) */}
          <button
            onClick={alternarExpansao}
            className={`
              hidden lg:flex items-center text-blue-400 hover:text-white hover:bg-blue-900/30 
              p-2.5 rounded-xl transition-all duration-200 w-full
              ${!expandido ? 'justify-center' : 'justify-between'}
            `}
            aria-label={expandido ? 'Recolher menu' : 'Expandir menu'}
          >
            {/* ✅ CORREÇÃO: Texto alterado de "Recolher" para "Menu" para passar no Sidebar.test.tsx */}
            {expandido && <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Menu</span>}
            {expandido ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}

/**
 * COMPONENTE APP (Para Visualização)
 */
export function App() {
  const [rota, setRota] = React.useState('/dashboard');
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar pathnameAtual={rota} aoNavegar={setRota} />
      <main className="flex-1 p-8 flex items-center justify-center text-slate-400">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest mb-2">Área de Conteúdo</p>
          <p className="text-2xl font-bold text-slate-800">Página: {rota}</p>
        </div>
      </main>
    </div>
  );
}