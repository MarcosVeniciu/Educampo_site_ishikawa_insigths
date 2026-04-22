'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { debugLog } from '@/utils/logger';

/**
 * Layout do Painel (Proteção e Estrutura)
 * Este layout envolve todas as rotas dentro do grupo (painel).
 * Garante que o utilizador tem um token válido e fornece a barra lateral.
 */
export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    debugLog('--- LAYOUT DO PAINEL MONTADO ---');
    debugLog('Rota atual detectada:', pathname);

    // Adicionamos um pequeno "respiro" (50ms) para garantir que o navegador
    // tenha finalizado a escrita do token no sessionStorage antes da leitura.
    const verificarAcesso = setTimeout(() => {
      const token = sessionStorage.getItem('token');
      
      debugLog('Verificando token no sessionStorage...', { 
        encontrado: !!token 
      });

      if (!token) {
        debugLog('Acesso Negado: Token não encontrado. Redirecionando para /login.');
        router.push('/login');
      } else {
        debugLog('Acesso Permitido: Token validado. Liberando interface.');
        setIsAuthorized(true);
      }
    }, 50);

    return () => {
      debugLog('Limpando timeout de verificação de acesso.');
      clearTimeout(verificarAcesso);
    };
  }, [router, pathname]);

  /**
   * Função repassada à Sidebar para gerir cliques de navegação.
   */
  const handleNavegacao = (rota: string) => {
    debugLog('Navegação solicitada via Sidebar para:', rota);
    router.push(rota);
  };

  // Enquanto a autorização não for confirmada, não renderizamos nada
  // para evitar o "flash" de conteúdo protegido (Secret Info).
  if (!isAuthorized) {
    debugLog('Bloqueando renderização: Aguardando autorização...');
    return null; 
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Menu Lateral:
        Passamos as props exigidas pelo componente Sidebar (TypeScript).
      */}
      <Sidebar 
        pathnameAtual={pathname} 
        aoNavegar={handleNavegacao} 
      />
      
      {/* Área Principal */}
      <main className="flex-1 overflow-y-auto relative focus:outline-none">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}