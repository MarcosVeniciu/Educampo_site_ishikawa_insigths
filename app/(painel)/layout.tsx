'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar'; // Certifique-se de que o caminho deste componente está correto

/**
 * Layout do Painel (Fase 4 - Proteção e Estrutura)
 * Este layout envolve todas as rotas dentro de (painel), garantindo que
 * o usuário esteja autenticado e exibindo o menu lateral (Sidebar).
 */
export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Verifica a existência do token no sessionStorage para proteger a rota
    const token = sessionStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Bloqueia a renderização do conteúdo da página e da Sidebar enquanto verifica o token
  if (!isAuthorized) {
    return null; 
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Menu Lateral que aparecerá em todas as telas do painel */}
      <Sidebar />
      
      {/* Área principal onde o conteúdo das páginas (Dashboard, Diagnóstico, etc) será renderizado */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}