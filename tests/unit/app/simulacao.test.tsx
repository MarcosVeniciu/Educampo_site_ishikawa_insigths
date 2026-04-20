import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
// Importação necessária para o comando .toBeInTheDocument()
import '@testing-library/jest-dom';
import SimulacaoPage from '@/app/(painel)/simulacao/page';

/**
 * @file simulacao.test.tsx
 * @description Testes unitários para o simulador financeiro.
 * Ajustado com os valores exatos do cálculo (30.5 dias) e matchers flexíveis.
 */

describe('SimulacaoPage - Cálculos Financeiros', () => {
  it('deve renderizar com os valores iniciais corretos', () => {
    render(<SimulacaoPage />);
    
    // Verifica os rótulos dos inputs iniciais
    expect(screen.getByText('R$ 2.45')).toBeInTheDocument(); 
    expect(screen.getByText('R$ 1.15')).toBeInTheDocument(); 
    expect(screen.getByText('28.5 L')).toBeInTheDocument();  

    /**
     * CORREÇÃO: Valor exato para 2.45 * 28.5 * 85 * 30.5 = 181.021,31.
     * Usamos uma função matcher para ignorar caracteres de espaço especiais do formato de moeda.
     */
    expect(screen.getByText((content) => content.includes('181.021,31'))).toBeInTheDocument();
  });

  it('deve recalcular o faturamento e a margem quando o preço do leite for alterado', () => {
    render(<SimulacaoPage />);
    
    // Seleciona os sliders (Preço do Leite é o primeiro)
    const sliders = screen.getAllByRole('slider');
    const precoLeiteSlider = sliders[0];

    // Alterando o preço de 2.45 para 3.00
    fireEvent.change(precoLeiteSlider, { target: { value: '3.00' } });

    // O texto do rótulo deve atualizar para o novo preço
    expect(screen.getByText('R$ 3.00')).toBeInTheDocument();
    
    /**
     * CORREÇÃO: Novo faturamento exato: 3.00 * 28.5 * 85 * 30.5 = 221.658,75.
     */
    expect(screen.getByText((content) => content.includes('221.658,75'))).toBeInTheDocument();
  });

  it('deve conseguir repor (resetar) os valores iniciais', () => {
    render(<SimulacaoPage />);
    
    const sliders = screen.getAllByRole('slider');
    // Altera o preço para provocar uma mudança
    fireEvent.change(sliders[0], { target: { value: '4.00' } });
    
    // Clica no botão de Resetar
    const btnReset = screen.getByText(/Resetar Valores/i);
    fireEvent.click(btnReset);

    // O valor deve voltar ao padrão de 2.45
    expect(screen.getByText('R$ 2.45')).toBeInTheDocument();
  });
});