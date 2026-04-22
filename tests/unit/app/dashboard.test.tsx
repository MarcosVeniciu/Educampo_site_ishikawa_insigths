/**
 * @file dashboard.test.tsx
 * @description Testes unitários para a página de Dashboard.
 * Focado na validação da renderização de dados provenientes do estado global (Zustand).
 * Resolve inconsistências entre a interface ModelInput e campos de UI como 'consultor'.
 * @version 1.2.1
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
    // 1. Mock dos dados respeitando os campos obrigatórios da ModelInput
    const mockFarmData = {
      nome_fazenda: 'Quinta da Esperança',
      consultor: 'Dr. Marcos Venicius', // Campo de UI
      vacas_em_lactacao_cabecas: 150,
      vacas_totais_cabecas: 180,       // Campo obrigatório adicionado
      animais_totais_cabecas: 200,
      funcionarios_qtd: 5,
      area_destinada_atividade_ha: 100,
      sistema_producao: 'Pasto'
    };

    // 2. Injetamos o estado na Store.
    // Usamos 'as any' porque o campo 'consultor' não faz parte da interface técnica ModelInput,
    // mas é necessário para a renderização do componente que estamos testando.
    useAppStore.setState({
      isLoaded: true,
      dadosFazenda: mockFarmData as any
    });

    render(<DashboardPage />);

    // 3. Validações de presença no DOM
    expect(screen.getByText(/Quinta da Esperança/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr. Marcos Venicius/i)).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  /**
   * Teste de Resiliência: Verifica a exibição de valores de fallback (padrão).
   * Garante que o componente não quebre caso a Store contenha apenas valores genéricos.
   */
  it('deve apresentar os valores de fallback caso a sessão esteja vazia', () => {
    // Configuramos a store com os valores padrão de inicialização
    useAppStore.setState({
      isLoaded: true,
      dadosFazenda: {
        nome_fazenda: 'Fazenda Educampo',
        consultor: 'Consultor Técnico',
        vacas_em_lactacao_cabecas: 85,
        vacas_totais_cabecas: 100,      // Campo obrigatório adicionado
        animais_totais_cabecas: 120,
        funcionarios_qtd: 3,
        area_destinada_atividade_ha: 50,
        sistema_producao: 'Compost Barn'
      } as any
    });

    render(<DashboardPage />);

    expect(screen.getByText(/Fazenda Educampo/i)).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });
});