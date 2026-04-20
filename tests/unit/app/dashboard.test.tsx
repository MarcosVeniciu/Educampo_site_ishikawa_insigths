import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '@/app/(painel)/dashboard/page';

/**
 * @file dashboard.test.tsx
 * @description Testes unitários para o dashboard.
 * Focado na validação da renderização dos dados da sessão.
 */

describe('DashboardPage - Visão Geral', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('deve apresentar os dados simulados da fazenda lidos da sessão', () => {
    const mockFarmData = {
      nome_fazenda: 'Quinta da Esperança',
      consultor: 'Dr. Marcos Venicius',
      vacas_em_lactacao_cabecas: 150
    };
    
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'educampo_user') return JSON.stringify(mockFarmData);
      return null;
    });

    render(<DashboardPage />);

    expect(screen.getByText(/Quinta da Esperança/i)).toBeInTheDocument();
    expect(screen.getByText(/Dr. Marcos Venicius/i)).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('deve apresentar os valores de fallback caso a sessão esteja vazia', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    render(<DashboardPage />);

    expect(screen.getByText(/Fazenda Educampo/i)).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });
});