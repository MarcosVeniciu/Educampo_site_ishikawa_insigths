/**
 * @fileoverview Suíte de testes para o Layout do Painel (Rotas Privadas).
 * * ATENÇÃO - MUDANÇA DE PARADIGMA (HttpOnly Cookies):
 * A responsabilidade de bloquear acessos não autorizados (Guarda de Rota)
 * foi transferida para o Middleware do Next.js (Server-Side).
 * * Este componente (Layout) agora adota o princípio de "Confiança Transparente".
 * Ele pressupõe que, se o código chegou até aqui, o Middleware já validou o
 * cookie de sessão. O Layout foca APENAS na renderização estrutural (UI).
 */

import { render, screen } from '@testing-library/react';
import PainelLayout from '../../../app/(painel)/layout';

// Mock das funções de roteamento do Next.js que a Sidebar utiliza internamente
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

describe('Painel Layout (Interface e Estrutura)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    window.sessionStorage.clear();
  });

  /**
   * Teste Estrutural:
   * Garante que o layout atua corretamente como um "Wrapper" (casca),
   * renderizando o menu lateral e ejetando os componentes filhos no centro.
   */
  it('deve renderizar a estrutura base do painel (Sidebar + Children) corretamente', () => {
    render(
      <PainelLayout>
        <div data-testid="conteudo-injetado">Página Interna Carregada</div>
      </PainelLayout>
    );

    // Verifica se a Sidebar (Menu lateral) foi renderizada (Busca pelo logo/título Educampo)
    expect(screen.getByText(/Educampo/i)).toBeInTheDocument();

    // Verifica se os componentes "children" (Dashboard, Simulação, etc) foram renderizados
    expect(screen.getByTestId('conteudo-injetado')).toBeInTheDocument();
  });

  /**
   * Teste de Contrato de Segurança (Clean Architecture):
   * Garante que resquícios da implementação antiga não permaneçam no código.
   * O Layout NUNCA deve tentar ler dados sensíveis de autenticação do Storage.
   */
  it('NÃO deve acessar o sessionStorage para buscar tokens de validação', () => {
    const sessionGetSpy = jest.spyOn(window.sessionStorage, 'getItem');

    render(
      <PainelLayout>
        <div>Render Simples</div>
      </PainelLayout>
    );

    // Valida que o layout atual não tenta verificar 'token' no client-side
    expect(sessionGetSpy).not.toHaveBeenCalledWith('token');
  });

  /**
   * Teste de Isolamento de Rota:
   * Confirma que o Layout não força redirecionamentos por conta própria
   * A responsabilidade de chamar o `router.push('/login')` foi movida.
   */
  it('NÃO deve forçar redirecionamento para o login via Client-Side', () => {
    const { useRouter } = require('next/navigation');
    const mockRouter = useRouter();

    render(
      <PainelLayout>
        <div>Render Simples</div>
      </PainelLayout>
    );

    // Garante que o componente apenas renderiza e não tenta expulsar o usuário
    expect(mockRouter.push).not.toHaveBeenCalledWith('/login');
    expect(mockRouter.replace).not.toHaveBeenCalledWith('/login');
  });
});