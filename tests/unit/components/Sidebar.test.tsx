/**
 * @fileoverview Suíte de testes unitários atualizada para o componente Sidebar.
 * Ajustada para os novos seletores da Identidade Visual Azul e Menu Mobile.
 * Implementa o mock de navegação do Next.js para alinhar-se à refatoração autônoma.
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../../../components/Sidebar';

// Mock das funções de roteamento do Next.js que a Sidebar utiliza internamente.
// Isso evita erros de "NextRouter was not mounted" durante os testes.
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Componente Sidebar (components/Sidebar.tsx)', () => {
  const mockAoNavegar = jest.fn();

  beforeEach(() => {
    mockAoNavegar.mockClear();
  });

  /**
   * O cabeçalho agora divide "Educampo" e "Insights AI" em elementos diferentes.
   */
  it('deve renderizar o cabeçalho com a marca Educampo', () => {
    render(<Sidebar />); // Agora renderiza sem props obrigatórias
    expect(screen.getByText(/Educampo/i)).toBeInTheDocument();
  });

  /**
   * Valida se a rota atual recebe o atributo de acessibilidade aria-current.
   * O teste continua passando props para validar a prioridade lógica do componente.
   */
  it('deve destacar a rota ativa corretamente via props', () => {
    render(<Sidebar pathnameAtual="/dashboard" aoNavegar={mockAoNavegar} />);
    const botaoDashboard = screen.getByRole('button', { name: /Dashboard/i });
    expect(botaoDashboard).toHaveAttribute('aria-current', 'page');
  });

  /**
   * Valida o disparo da função de navegação ao clicar nos itens.
   */
  it('deve chamar a função aoNavegar ao clicar em um link quando a prop é fornecida', () => {
    render(<Sidebar pathnameAtual="/dashboard" aoNavegar={mockAoNavegar} />);
    const botaoSimulacao = screen.getByRole('button', { name: /Simulação/i });
    fireEvent.click(botaoSimulacao);
    expect(mockAoNavegar).toHaveBeenCalledWith('/simulacao');
  });

  /**
   * O botão de colapsar exibe o texto "Menu" e possui aria-label específico.
   */
  it('deve alternar entre expandido e recolhido ao clicar no botão de colapsar', () => {
    render(<Sidebar />);
    
    // Verifica o rótulo visual "Menu"
    expect(screen.getByText(/Menu/i)).toBeInTheDocument();

    // Encontra o botão pelo aria-label
    const botaoAlternar = screen.getByRole('button', { name: /Recolher menu/i });
    fireEvent.click(botaoAlternar);

    // No modo colapsado, o texto "Menu" deve ser removido do DOM
    expect(screen.queryByText(/Menu/i)).not.toBeInTheDocument();
  });
});