import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useParams, useRouter } from 'next/navigation';
import DiagnosticoPage from '@/app/(painel)/diagnostico/[tipo]/page';
import { useAppStore } from '@/store/useAppStore';

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
  return function DummyCard({ titulo }: { titulo: string }) {
    return <div data-testid={`ishikawa-card-${titulo}`}>{titulo}</div>;
  };
});

describe('DiagnosticoPage - Rotas Dinâmicas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reseta o estado global para o estado de "carregamento" inicial
    useAppStore.setState({
      isLoaded: false,
      diagnosticos: {} as any,
      dadosFazenda: null
    });
  });

  it('deve apresentar o estado de carregamento inicial', () => {
    (useParams as jest.Mock).mockReturnValue({ tipo: 'trabalhador' });
    render(<DiagnosticoPage />);
    
    expect(screen.getByText(/A montar Dashboard Analítico/i)).toBeInTheDocument();
  });

  it('deve renderizar os dados do diagnóstico após o loading', async () => {
    (useParams as jest.Mock).mockReturnValue({ tipo: 'trabalhador' });
    
    // Preenche a store simulando que a API terminou de carregar os dados globais
    useAppStore.setState({
      isLoaded: true,
      dadosFazenda: {
        funcionarios_qtd: 2,
        vacas_em_lactacao_cabecas: 50,
        producao_leite_l_vaca_dia: 15
      } as any,
      diagnosticos: {
        trabalhador: {
          categories: [
            { id: '1', label: 'Mão de Obra', emoji: '👥', impact: 85, tag: 'Crítico', causes: [] }
          ]
        }
      } as any
    });

    render(<DiagnosticoPage />);

    // Aguarda a resolução do estado de loading simulado
    await waitFor(() => {
      expect(screen.queryByText(/A montar Dashboard Analítico/i)).not.toBeInTheDocument();
    });

    // O novo título na configuração da página é "Produtividade por Trabalhador"
    expect(screen.getByText('Produtividade por Trabalhador')).toBeInTheDocument();
    expect(screen.getByTestId('ishikawa-card-Mão de Obra')).toBeInTheDocument();
  });
});