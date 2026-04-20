import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
// Importação necessária para o comando .toBeInTheDocument()
import '@testing-library/jest-dom';
import ConfiguracoesPage from '@/app/(painel)/configuracoes/page';

/**
 * @file configuracoes.test.tsx
 * @description Teste de persistência e formulários da página de Configurações.
 * Ajustado para suportar matchers do DOM e sincronia de estados (act).
 */

describe('ConfiguracoesPage - Gestão de Dados', () => {
  const mockInitialData = {
    nome_fazenda: 'Fazenda Teste',
    consultor: 'Consultor TDD',
    sistema_producao: 'Pasto',
    vacas_em_lactacao_cabecas: 50,
  };

  beforeEach(() => {
    sessionStorage.clear();
    jest.useFakeTimers(); 
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('deve carregar os dados iniciais a partir do sessionStorage', () => {
    sessionStorage.setItem('educampo_user', JSON.stringify(mockInitialData));
    
    render(<ConfiguracoesPage />);

    const inputNome = screen.getByDisplayValue('Fazenda Teste');
    const inputConsultor = screen.getByDisplayValue('Consultor TDD');
    
    expect(inputNome).toBeInTheDocument();
    expect(inputConsultor).toBeInTheDocument();
  });

  it('deve permitir a edição de campos e guardar as alterações no sessionStorage', async () => {
    sessionStorage.setItem('educampo_user', JSON.stringify(mockInitialData));
    
    render(<ConfiguracoesPage />);

    const inputNome = screen.getByDisplayValue('Fazenda Teste');
    fireEvent.change(inputNome, { target: { value: 'Fazenda Atualizada', name: 'nome_fazenda' } });

    const btnSalvar = screen.getByText(/Salvar Alterações/i);
    fireEvent.click(btnSalvar);

    // CORREÇÃO: Envolver o avanço de tempo no act() para processar a mudança de estado do React
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(screen.getByText(/Dados da fazenda atualizados com sucesso/i)).toBeInTheDocument();
    });

    const savedData = JSON.parse(sessionStorage.getItem('educampo_user') || '{}');
    expect(savedData.nome_fazenda).toBe('Fazenda Atualizada');
  });
});