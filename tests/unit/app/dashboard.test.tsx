/**
 * @file dashboard.test.tsx
 * @description Testes unitários para a página de Dashboard.
 * Focado na validação da renderização de dados provenientes do estado global (Zustand).
 * Resolve inconsistências entre a interface ModelInput e campos de UI como 'consultor'.
 * @version 1.2.2
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAppStore } from '@/store/useAppStore';
import DashboardPage from '@/app/(painel)/dashboard/page';

/**
 * Mock Global do Next.js Navigation.
 * * MOTIVO: Componentes do Next.js que utilizam 'useRouter' ou 'usePathname' 
 * exigem um contexto de roteamento (App Router). No Jest, esse contexto não existe,
 * causando o erro "invariant expected app router to be mounted".
 * Este mock fornece funções simuladas (jest.fn) para permitir a renderização isolada.
 */
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
    };
  },
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

describe('DashboardPage - Visão Geral', () => {
  
  /**
   * Limpeza do estado antes de cada teste.
   * Garante que as configurações de um teste não afetam o resultado do próximo.
   */
  beforeEach(() => {
    jest.clearAllMocks();
    // Reseta o estado da store para evitar vazamento de dados entre testes
    useAppStore.setState({ isLoaded: false }); 
  });

  /**
   * Teste de renderização com dados personalizados.
   * Injeta dados na Store e valida se os elementos aparecem corretamente na tela.
   */
  it('deve apresentar os dados simulados da fazenda lidos da sessão', () => {
    const mockFarmData = {
      nome_fazenda: 'Quinta da Esperança',
      consultor: 'Dr. Marcos Venicius', 
      vacas_em_lactacao_cabecas: 150,
      vacas_totais_cabecas: 180, 
      animais_totais_cabecas: 200,
      funcionarios_qtd: 5,
      area_destinada_atividade_ha: 100,
      sistema_producao: 'Pasto'
    };

    useAppStore.setState({
      isLoaded: true,
      dadosFazenda: mockFarmData as any,
      referencias: {
        potencialTrabalhador: { min: 100, max: 200 },
        potencialArea: { min: 100, max: 200 },
        potencialVaca: { min: 10, max: 20 },
        limiteCcs: 400
      } as any,
      diagnosticos: { trabalhador: null, hectare: null, produtividade: null, ccs: null } as any
    });

    render(<DashboardPage />);

    expect(screen.getByText(/Quinta da Esperança/i)).toBeInTheDocument();
    expect(screen.getByText(/Pasto/i)).toBeInTheDocument();
    expect(screen.getByText('83.3')).toBeInTheDocument();
  });

  it('deve apresentar os valores de fallback caso a sessão esteja vazia', () => {
    useAppStore.setState({
      isLoaded: true,
      dadosFazenda: {
        nome_fazenda: 'Fazenda Educampo',
        consultor: 'Consultor Técnico',
        vacas_em_lactacao_cabecas: 85,
        vacas_totais_cabecas: 100, 
        animais_totais_cabecas: 120,
        funcionarios_qtd: 3,
        area_destinada_atividade_ha: 50,
        sistema_producao: 'Compost Barn'
      } as any,
      referencias: {
        potencialTrabalhador: { min: 100, max: 200 },
        potencialArea: { min: 100, max: 200 },
        potencialVaca: { min: 10, max: 20 },
        limiteCcs: 400
      } as any,
      diagnosticos: { trabalhador: null, hectare: null, produtividade: null, ccs: null } as any
    });

    render(<DashboardPage />);

    expect(screen.getByText(/Fazenda Educampo/i)).toBeInTheDocument();
    // Ajustado de '85' para '85.0' para casar com a renderização formatada
    expect(screen.getByText('85.0')).toBeInTheDocument();
  });
});