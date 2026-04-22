/**
 * @fileoverview Rota de API para Autenticação (Backend-for-Frontend).
 * Implementa o padrão de segurança baseado em HttpOnly Cookies conforme definido
 * nos contratos de teste da Fase 1.
 * * Responsabilidades:
 * 1. Receber credenciais (email/senha) via POST.
 * 2. Validar credenciais usando o serviço de Mock.
 * 3. Gerar um Cookie seguro (HttpOnly, Secure, SameSite=Strict) para armazenar o token.
 * 4. Impedir a exposição do token no corpo da resposta (prevenção de XSS).
 */

import { NextResponse } from 'next/server';
import { loginMock } from '@/mock/auth';

/**
 * Handler para requisições POST em /api/auth
 * @param request Objeto da requisição Next.js
 * @returns NextResponse com status de sucesso e cabeçalho Set-Cookie ou erro.
 */
export async function POST(request: Request) {
  try {
    // 1. Extração das credenciais do corpo da requisição
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    // 2. Validação com o serviço de Mock (Contrato de Autenticação)
    // Nota: O loginMock lança erro se as credenciais forem inválidas
    const { token, user } = await loginMock(email, password);

    // 3. Preparação da resposta de sucesso
    // Não enviamos o token no JSON, apenas dados públicos do usuário se necessário
    const response = NextResponse.json(
      { 
        message: 'Autenticação realizada com sucesso',
        user: { id: user.id, nome: user.nome, email: user.email }
      },
      { status: 200 }
    );

    /**
     * 4. Configuração do Cookie de Segurança (Contrato de Segurança)
     * - name: 'token' (Conforme esperado pelos testes unitários)
     * - value: o token gerado pelo backend
     * - httpOnly: true -> O JavaScript do navegador (window.document.cookie) NÃO consegue ler.
     * - secure: process.env.NODE_ENV === 'production' -> Só envia via HTTPS em produção.
     * - sameSite: 'strict' -> O cookie só é enviado para este domínio (proteção contra CSRF).
     * - path: '/' -> Disponível em toda a aplicação.
     * - maxAge: 86400 -> Expira em 24 horas (em segundos).
     */
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 horas
    });

    return response;

  } catch (error: any) {
    // Tratamento de falhas de autenticação (Credenciais inválidas)
    const errorMessage = error.message || 'Falha na autenticação';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 401 }
    );
  }
}

/**
 * Opcional: Rota de Logout para limpar o cookie
 */
export async function DELETE() {
  const response = NextResponse.json(
    { message: 'Sessão encerrada com sucesso' },
    { status: 200 }
  );

  // Remove o cookie definindo uma data de expiração no passado
  response.cookies.set({
    name: 'token',
    value: '',
    path: '/',
    expires: new Date(0),
  });

  return response;
}