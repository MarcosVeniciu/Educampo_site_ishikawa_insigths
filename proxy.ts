/**
 * @fileoverview Proxy de Segurança (Antigo Middleware).
 * Atua como o "Guardião de Rotas" (Route Guard) executando no servidor.
 * * Responsabilidades:
 * 1. Interceptar requisições para rotas protegidas no painel.
 * 2. Verificar a existência do cookie 'token' (HttpOnly).
 * 3. Redirecionar usuários não autenticados para o login.
 * 4. Impedir que usuários logados retornem à página de login.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Configuração das rotas que o Middleware deve observar.
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export function proxy(request: NextRequest) {
  // Obtém o token do Cookie HttpOnly
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/login';
  
  // Lista de prefixos de rotas que exigem autenticação
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/simulacao') || 
    pathname.startsWith('/configuracoes') || 
    pathname.startsWith('/diagnostico') ||
    pathname.startsWith('/carregando');

  // REGRA 1: Redireciona para login se tentar acessar rota protegida sem token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // REGRA 2: Redireciona logados da página de login para a dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export { proxy as middleware };