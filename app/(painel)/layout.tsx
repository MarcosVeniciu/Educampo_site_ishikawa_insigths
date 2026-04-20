"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

/**
 * @file layout.tsx
 * @description Layout principal para o grupo de rotas protegidas (painel).
 * * Este componente implementa a lógica de "Shift-Left" na segurança:
 * 1. Verifica a autenticação antes de renderizar o conteúdo sensível.
 * 2. Garante que o Sidebar esteja presente em todas as sub-rotas do painel.
 * 3. Centraliza o esqueleto visual (Header + Conteúdo).
 * * @module app/(painel)/layout
 */

interface PainelLayoutProps {
  children: React.ReactNode;
}

/**
 * PainelLayout - Componente de Layout Protegido
 * * @param {PainelLayoutProps} props - Elementos filhos que representam as páginas internas.
 * @returns {JSX.Element | null} Retorna a estrutura do painel ou redireciona o utilizador.
 */
export default function PainelLayout({ children }: PainelLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    /**
     * @function verifyAccess
     * @description Checa a existência do token no sessionStorage.
     * Na Fase 4, utilizamos o token gerado pelo mock/auth.ts durante o login.
     */
    const verifyAccess = () => {
      try {
        const token = sessionStorage.getItem("educampo_token");

        if (!token) {
          // Se não houver token, bloqueia o acesso e manda para o login
          router.push("/login");
        } else {
          setIsAuth(true);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAccess();
  }, [router]);

  // Estado de carregamento enquanto o Next.js verifica a sessão
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent shadow-sm"></div>
          <p className="text-sm font-medium text-slate-500 animate-pulse">
            A carregar ambiente seguro...
          </p>
        </div>
      </div>
    );
  }

  // Proteção adicional: se não estiver autenticado, não renderiza os componentes filhos
  if (!isAuth) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Componente Global de Navegação Lateral */}
      <Sidebar 
        pathnameAtual={pathname || ""} 
        aoNavegar={(path) => router.push(path)} 
      />
      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Global do Painel */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center px-8 justify-between shrink-0 shadow-sm z-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none mb-1">
              Plataforma de Diagnóstico
            </span>
            <h1 className="text-sm font-semibold text-slate-700 uppercase tracking-wider leading-none">
              Insights Educampo
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800">Ambiente de Consultoria</span>
              <span className="text-[10px] text-slate-400">Versão Protótipo v1.0</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
              <span className="text-[10px] font-bold text-blue-600">ED</span>
            </div>
          </div>
        </header>

        {/* Área de Visualização das Páginas (Dashboard, Diagnóstico, etc) */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-slate-50/50">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}