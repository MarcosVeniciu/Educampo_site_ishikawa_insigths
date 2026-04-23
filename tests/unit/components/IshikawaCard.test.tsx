/**
 * @fileoverview Suíte de testes unitários para o componente IshikawaCard.
 * Valida a renderização dos novos dados analíticos (impacto, tagStatus),
 * a renderização condicional das listas de causas e a aplicação de 
 * estilos dinâmicos baseados no percentual de impacto.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IshikawaCard from '../../../components/IshikawaCard';

describe('Componente IshikawaCard (components/IshikawaCard.tsx)', () => {

  /**
   * Teste de renderização principal: garante que os dados essenciais
   * (título, ícone, tag e impacto) estão visíveis no DOM formatados corretamente.
   */
  it('deve renderizar o cabeçalho (ícone, título, tag e impacto) corretamente', () => {
    render(
      <IshikawaCard
        icone="🚜"
        titulo="Máquinas"
        tagStatus="Fator Crítico"
        impacto={85}
        causas={[]}
      />
    );

    expect(screen.getByText('🚜')).toBeInTheDocument();
    expect(screen.getByText('Máquinas')).toBeInTheDocument();
    expect(screen.getByText('Fator Crítico')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  /**
   * Teste de renderização condicional: garante que as subcausas só aparecem
   * quando explicitamente enviadas nas props, com as suas respectivas severidades.
   */
  it('deve renderizar a lista de causas com badges de severidade quando fornecidas', () => {
    const causasMock = [
      { text: 'Falta de peças', severity: 'alta' as const },
      { text: 'Óleo vencido', severity: 'media' as const }
    ];

    render(
      <IshikawaCard
        icone="🚜"
        titulo="Máquinas"
        tagStatus="Atenção"
        impacto={50}
        causas={causasMock}
      />
    );

    expect(screen.getByText('Falta de peças')).toBeInTheDocument();
    expect(screen.getByText('alta')).toBeInTheDocument();
    expect(screen.getByText('Óleo vencido')).toBeInTheDocument();
    expect(screen.getByText('media')).toBeInTheDocument();
  });

  /**
   * Teste de limite (Edge Case): garante que o componente não tenta
   * renderizar a tag <ul> vazia caso a lista seja omitida.
   */
  it('deve renderizar mensagem de fallback se a lista de causas estiver vazia', () => {
    render(
      <IshikawaCard
        icone="🚜"
        titulo="Máquinas"
        tagStatus="Monitorar"
        impacto={15}
        causas={[]}
      />
    );

    expect(screen.getByText('Nenhuma causa identificada.')).toBeInTheDocument();
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  /**
   * Testes de variação visual: garante que o mapeamento do TailwindCSS
   * no dicionário 'estiloCriticidade' está sendo aplicado no elemento raiz.
   */
  describe('Estilos Dinâmicos Baseados no Impacto', () => {
    it('deve aplicar cor vermelha para impactos maiores que 70%', () => {
      render(<IshikawaCard icone="x" titulo="T" tagStatus="Tag" impacto={71} causas={[]} />);
      const elementoImpacto = screen.getByText('71%');
      expect(elementoImpacto.className).toContain('text-red-600');
    });

    it('deve aplicar cor âmbar para impactos entre 41% e 70%', () => {
      render(<IshikawaCard icone="x" titulo="T" tagStatus="Tag" impacto={50} causas={[]} />);
      const elementoImpacto = screen.getByText('50%');
      expect(elementoImpacto.className).toContain('text-amber-500');
    });

    it('deve aplicar cor esmeralda para impactos menores ou iguais a 40%', () => {
      render(<IshikawaCard icone="x" titulo="T" tagStatus="Tag" impacto={40} causas={[]} />);
      const elementoImpacto = screen.getByText('40%');
      expect(elementoImpacto.className).toContain('text-emerald-500');
    });
  });
});