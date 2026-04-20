/**
 * @fileoverview Suíte de testes unitários para o componente IshikawaCard.
 * Valida a renderização condicional (subcausas), a aplicação de estilos
 * dinâmicos baseados na criticidade e a interatividade (onClick) com
 * suporte a acessibilidade (a11y).
 */

// As dependências abaixo são resolvidas localmente pelo seu ambiente Node/Jest
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IshikawaCard from '../../../components/IshikawaCard';

describe('Componente IshikawaCard (components/IshikawaCard.tsx)', () => {

  /**
   * Teste de renderização principal: garante que os dados essenciais (título e causa)
   * estão visíveis no DOM.
   */
  it('deve renderizar o título e a causa principal corretamente', () => {
    render(
      <IshikawaCard
        titulo="Máquinas"
        causaPrincipal="Falta de manutenção preventiva"
        criticidade="alta"
      />
    );

    // screen.getByText procura pelo texto exato na tela
    expect(screen.getByText('Máquinas')).toBeInTheDocument();
    expect(screen.getByText('Falta de manutenção preventiva')).toBeInTheDocument();
  });

  /**
   * Teste de renderização condicional: garante que as subcausas só aparecem
   * quando explicitamente enviadas nas props.
   */
  it('deve renderizar a lista de subcausas quando fornecidas', () => {
    const subCausasMock = ['Peças desgastadas', 'Óleo vencido'];
    render(
      <IshikawaCard
        titulo="Máquinas"
        causaPrincipal="Falta de manutenção"
        criticidade="media"
        subCausas={subCausasMock}
      />
    );

    expect(screen.getByText('Peças desgastadas')).toBeInTheDocument();
    expect(screen.getByText('Óleo vencido')).toBeInTheDocument();
  });

  /**
   * Teste de limite (Edge Case): garante que o componente não tenta
   * renderizar a tag <ul> vazia caso a lista seja omitida.
   */
  it('não deve renderizar a área de subcausas se a lista estiver vazia ou não for fornecida', () => {
    const { container } = render(
      <IshikawaCard
        titulo="Máquinas"
        causaPrincipal="Falta de manutenção"
        criticidade="baixa"
      />
    );

    // Busca pela tag <ul> dentro do componente renderizado
    const listas = container.querySelectorAll('ul');
    expect(listas.length).toBe(0);
  });

  /**
   * Teste de interatividade e acessibilidade: se o card for clicável,
   * ele deve agir e se anunciar como um botão para leitores de tela.
   */
  it('deve disparar a função onClick quando clicado e possuir role="button"', () => {
    const onClickMock = jest.fn(); // Cria uma função "espiã" (mock) do Jest
    render(
      <IshikawaCard
        titulo="Meio Ambiente"
        causaPrincipal="Chuva excessiva"
        criticidade="alta"
        onClick={onClickMock}
      />
    );

    // O componente deve ter assumido o papel de botão devido ao onClick
    const card = screen.getByRole('button');
    
    // Simula um clique de usuário
    fireEvent.click(card);

    // Verifica se a função espiã foi chamada exatamente 1 vez
    expect(onClickMock).toHaveBeenCalledTimes(1);
    // Verifica o tabIndex para navegação via teclado
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  /**
   * Teste de segurança de acessibilidade: garante que se não for clicável,
   * ele não confunda os leitores de tela.
   */
  it('deve possuir role="article" se não for interativo (sem onClick)', () => {
    render(
      <IshikawaCard
        titulo="Meio Ambiente"
        causaPrincipal="Chuva excessiva"
        criticidade="baixa"
      />
    );

    const card = screen.getByRole('article');
    expect(card).toBeInTheDocument();
    expect(card).not.toHaveAttribute('tabIndex');
  });

  /**
   * Testes de variação visual: garante que o mapeamento do TailwindCSS
   * no dicionário 'estiloCriticidade' está sendo aplicado no elemento raiz.
   */
  describe('Estilos de Criticidade', () => {
    it('deve aplicar a borda vermelha para criticidade alta', () => {
      render(
        <IshikawaCard titulo="Teste" causaPrincipal="Teste" criticidade="alta" />
      );
      const card = screen.getByRole('article');
      expect(card.className).toContain('border-red-500');
    });

    it('deve aplicar a borda amarela (amber) para criticidade média', () => {
      render(
        <IshikawaCard titulo="Teste" causaPrincipal="Teste" criticidade="media" />
      );
      const card = screen.getByRole('article');
      expect(card.className).toContain('border-amber-500');
    });

    it('deve aplicar a borda azul para criticidade baixa', () => {
      render(
        <IshikawaCard titulo="Teste" causaPrincipal="Teste" criticidade="baixa" />
      );
      const card = screen.getByRole('article');
      expect(card.className).toContain('border-blue-500');
    });
  });
});