/**
 * @fileoverview Testes de segurança focados na validação e sanitização de inputs.
 * Garante que payloads de XSS, HTML Injection e SQL Injection sejam tratados como texto comum.
 * @version 1.1.1
 * @description Sincronização de labels e textos de botões com o componente LoginPage.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Mock virtual do Next.js Navigation.
 * IMPORTANTE: Este mock deve ser declarado ANTES da importação do componente LoginPage
 * para que o Jest intercepte a chamada de módulo corretamente.
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
  usePathname() {
    return '';
  },
}), { virtual: true });

// Importação do componente após o mock estar registado
import LoginPage from '../../app/login/page';

/**
 * Coleção de payloads comuns utilizados em ataques de injeção.
 */
const payloadsAtaque = {
  xss: '<script>alert("xss")</script>',
  htmlInjection: '<img src=x onerror=alert(1)>',
  sqlBasic: "' OR '1'='1",
};

describe('Segurança de Inputs - Página de Login', () => {

  /**
   * Verifica se o sistema neutraliza scripts maliciosos no campo de e-mail.
   * Correção: Label alterada para "E-mail do Consultor" e botão para "Acessar Painel".
   */
  it('deve tratar scripts injetados no campo de e-mail como texto comum', async () => {
    render(<LoginPage />);
    
    const inputEmail = screen.getByLabelText(/E-mail do Consultor/i) as HTMLInputElement;
    const botaoEntrar = screen.getByRole('button', { name: /Acessar Painel/i });

    fireEvent.change(inputEmail, { target: { value: payloadsAtaque.xss } });
    fireEvent.click(botaoEntrar);

    await waitFor(() => {
      expect(inputEmail.value).toBe(payloadsAtaque.xss);
    });
  });

  /**
   * Garante que tags HTML injetadas não sejam renderizadas como elementos reais.
   * Correção: Labels "E-mail do Consultor" e "Senha", e botão "Acessar Painel".
   */
  it('não deve permitir a renderização de tags HTML injetadas nas mensagens de erro', async () => {
    render(<LoginPage />);
    
    const inputEmail = screen.getByLabelText(/E-mail do Consultor/i);
    const inputSenha = screen.getByLabelText(/Senha/i);
    const botaoEntrar = screen.getByRole('button', { name: /Acessar Painel/i });

    fireEvent.change(inputEmail, { target: { value: 'ataque@teste.com' } });
    fireEvent.change(inputSenha, { target: { value: payloadsAtaque.htmlInjection } });
    fireEvent.click(botaoEntrar);

    await waitFor(() => {
      // Verifica se a tag <img> com onerror não foi criada no DOM
      const imagemInjetada = document.querySelector('img[onerror]');
      expect(imagemInjetada).toBeNull();
      // O texto deve aparecer como string literal ou disparar o erro de "Usuário não encontrado"
      expect(screen.getByText(/Usuário não encontrado/i)).toBeInTheDocument();
    }, { timeout: 2500 });
  });

  /**
   * Testa a resiliência contra caracteres de escape de SQL.
   */
  it('deve lidar com caracteres de escape de SQL sem quebrar a interface', async () => {
    render(<LoginPage />);
    
    const inputEmail = screen.getByLabelText(/E-mail do Consultor/i);
    const inputSenha = screen.getByLabelText(/Senha/i);
    const botaoEntrar = screen.getByRole('button', { name: /Acessar Painel/i });

    fireEvent.change(inputEmail, { target: { value: 'usuario@teste.com' } });
    fireEvent.change(inputSenha, { target: { value: payloadsAtaque.sqlBasic } });
    
    fireEvent.click(botaoEntrar);

    await waitFor(() => {
      expect(screen.getByText(/Usuário não encontrado/i)).toBeInTheDocument();
    }, { timeout: 2500 });
  });

  /**
   * Valida o desempenho da UI com inputs massivos.
   */
  it('não deve travar a interface ao receber um input extremamente longo', () => {
    render(<LoginPage />);
    const inputEmail = screen.getByLabelText(/E-mail do Consultor/i);
    
    const textoGigante = 'A'.repeat(3000);
    
    const inicio = performance.now();
    fireEvent.change(inputEmail, { target: { value: textoGigante } });
    const fim = performance.now();
    
    // O processamento do input deve ser inferior a 100ms
    expect(fim - inicio).toBeLessThan(100); 
  });
});