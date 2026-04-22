/**
 * @fileoverview Layout Base do Painel Administrativo (Rotas Privadas).
 * Refatoração da Fase 3 (HttpOnly Cookies e Middleware).
 * * * MUDANÇA DE PARADIGMA:
 * - Este componente não atua mais como "Guarda de Rota".
 * - A segurança e o bloqueio de acessos não autorizados agora são
 * feitos exclusivamente no servidor pelo `middleware.ts`.
 * - O Layout agora é um componente estrutural puramente visual,
 * garantindo melhor performance e ausência de "flicker" (piscar de tela).
 */

import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* Menu Lateral (Sidebar)
        O componente Sidebar gerencia sua própria responsividade e os links de navegação.
      */}
      <Sidebar />

      {/* Área Principal de Conteúdo (Children)
        Ocupa o restante da tela (flex-1) e permite rolagem vertical independente (overflow-y-auto).
        Aqui serão injetados os componentes: /dashboard, /simulacao, /diagnostico, etc.
      */}
      <main className="flex-1 relative overflow-y-auto">
        <div className="mx-auto max-w-7xl w-full">
          {children}
        </div>
      </main>

    </div>
  );
}