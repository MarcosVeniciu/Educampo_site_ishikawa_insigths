import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
// Importação essencial para resolver o erro "toBeInTheDocument is not a function"
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';
import PainelLayout from '@/app/(painel)/layout';

/**
 * @file layout.test.tsx
 * @description Testes unitários para o Layout Protegido da Fase 4.
 * Corrigido com virtual mocks para next/navigation e suporte a jest-dom.
 */

// Mock do hook de roteamento do Next.js com a flag virtual para evitar erros de resolução
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}), { virtual: true });

// Mock do componente Sidebar
jest.mock('@/components/Sidebar', () => {
  return function DummySidebar() {
    return <div data-testid="mock-sidebar">Menu Lateral</div>;
  };
});

describe('PainelLayout - Proteção de Rotas', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('deve redirecionar para /login se não existir um token ativo', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    render(
      <PainelLayout>
        <div data-testid="conteudo-secreto">Informação Sensível</div>
      </PainelLayout>
    );

    // queryByTestId deve retornar null enquanto redireciona
    expect(screen.queryByTestId('conteudo-secreto')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('deve renderizar o Sidebar e o conteúdo protegido caso o token seja válido', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('token_valido');

    render(
      <PainelLayout>
        <div data-testid="conteudo-secreto">Informação Sensível</div>
      </PainelLayout>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mock-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('conteudo-secreto')).toBeInTheDocument();
    });
  });
});