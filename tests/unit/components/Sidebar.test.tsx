/**
 * @fileoverview Suíte de testes unitários atualizada para o componente Sidebar.
 * Ajustada para os novos seletores da Identidade Visual Azul e Menu Mobile.
 * Esta versão corrige os erros de correspondência de texto causados pela 
 * nova estrutura de títulos e botões.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../../../components/Sidebar';

describe('Componente Sidebar (components/Sidebar.tsx)', () => {
  const mockAoNavegar = jest.fn();

  beforeEach(() => {
    mockAoNavegar.mockClear();
  });

  /**
   * O cabeçalho agora divide "Educampo" e "Insights AI" em elementos diferentes.
   * Usamos regex ou getAllByText para validar a presença da marca.
   */
  it('deve renderizar o cabeçalho com a marca Educampo', () => {
    render(<Sidebar pathnameAtual="/dashboard" aoNavegar={mockAoNavegar} />);
    // Verifica se a palavra "Educampo" está presente na tela
    expect(screen.getByText(/Educampo/i)).toBeInTheDocument();
  });

  /**
   * Valida se a rota atual recebe o atributo de acessibilidade aria-current.
   */
  it('deve destacar a rota ativa corretamente', () => {
    render(<Sidebar pathnameAtual="/dashboard" aoNavegar={mockAoNavegar} />);
    const botaoDashboard = screen.getByRole('button', { name: /Dashboard/i });
    expect(botaoDashboard).toHaveAttribute('aria-current', 'page');
  });

  /**
   * Valida o disparo da função de navegação ao clicar nos itens.
   */
  it('deve chamar a função aoNavegar ao clicar em um link', () => {
    render(<Sidebar pathnameAtual="/dashboard" aoNavegar={mockAoNavegar} />);
    const botaoSimulacao = screen.getByRole('button', { name: /Simulação/i });
    fireEvent.click(botaoSimulacao);
    expect(mockAoNavegar).toHaveBeenCalledWith('/simulacao');
  });

  /**
   * O botão de colapsar agora exibe o texto "Menu" (em vez de "Recolher").
   * O aria-label continua sendo "Recolher menu".
   */
  it('deve alternar entre expandido e recolhido ao clicar no botão de colapsar', () => {
    render(<Sidebar pathnameAtual="/dashboard" aoNavegar={mockAoNavegar} />);
    
    // Verifica o novo rótulo visual "Menu"
    expect(screen.getByText(/Menu/i)).toBeInTheDocument();

    // Encontra o botão pelo aria-label definido no componente
    const botaoAlternar = screen.getByRole('button', { name: /Recolher menu/i });
    fireEvent.click(botaoAlternar);

    // No modo colapsado, o texto "Menu" deve ser removido do DOM
    expect(screen.queryByText(/Menu/i)).not.toBeInTheDocument();
  });
});