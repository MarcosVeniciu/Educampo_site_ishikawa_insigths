import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useParams, useRouter } from 'next/navigation';
import DiagnosticoPage from '@/app/(painel)/diagnostico/[tipo]/page';

/**
 * @file diagnostico.test.tsx
 * @description Testes unitários para a página dinâmica de diagnóstico.
 * Utiliza virtual mocks para os parâmetros da URL do Next.js.
 */

// Mock das funções de navegação com suporte virtual
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(() => ({ back: jest.fn() })),
}), { virtual: true });

// Mock do IshikawaCard
jest.mock('@/components/IshikawaCard', () => {
  return function DummyCard({ label }: { label: string }) {
    return <div data-testid={`ishikawa-card-${label}`}>{label}</div>;
  };
});

describe('DiagnosticoPage - Rotas Dinâmicas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve apresentar o estado de carregamento inicial', () => {
    (useParams as jest.Mock).mockReturnValue({ tipo: 'trabalhador' });
    render(<DiagnosticoPage />);
    
    expect(screen.getByText(/A IA está analisando os dados/i)).toBeInTheDocument();
  });

  it('deve renderizar os dados do diagnóstico após o loading', async () => {
    (useParams as jest.Mock).mockReturnValue({ tipo: 'trabalhador' });
    
    render(<DiagnosticoPage />);

    // Aguarda a resolução do estado de loading simulado
    await waitFor(() => {
      expect(screen.queryByText(/A IA está analisando os dados/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Produção por Trabalhador')).toBeInTheDocument();
    expect(screen.getByTestId('ishikawa-card-Mão de Obra')).toBeInTheDocument();
  });
});