/**
 * @fileoverview Testes de segurança focados na validação e sanitização de inputs.
 * Garante que payloads de XSS, HTML Injection e SQL Injection sejam tratados como texto comum.
 * * @version 1.1.0
 * @description Corrigido erro de resolução do módulo 'next/navigation' e ordem de hoisting do Jest.
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

// Agora importamos o componente, após o mock estar registrado
import LoginPage from '../../app/login/page';

/**
 * Coleção de payloads comuns utilizados em ataques de injeção para testes de estresse e segurança.
 */
const payloadsAtaque = {
  xss: '<script>alert("xss")</script>',
  htmlInjection: '<img src=x onerror=alert(1)>',
  sqlBasic: "' OR '1'='1",
};

describe('Segurança de Inputs - Página de Login', () => {

  /**
   * Verifica se o sistema neutraliza scripts maliciosos, tratando-os como strings literais.
   */
  it('deve tratar scripts injetados no campo de e-mail como texto comum', async () => {
    render(<LoginPage />);
    
    const inputEmail = screen.getByLabelText(/Endereço de E-mail/i) as HTMLInputElement;
    const botaoEntrar = screen.getByRole('button', { name: /Entrar no sistema/i });

    fireEvent.change(inputEmail, { target: { value: payloadsAtaque.xss } });
    fireEvent.click(botaoEntrar);

    await waitFor(() => {
      expect(inputEmail.value).toBe(payloadsAtaque.xss);
    });
  });

  /**
   * Garante que o sistema não processe tags HTML injetadas via inputs durante a exibição de erros.
   */
  it('não deve permitir a renderização de tags HTML injetadas nas mensagens de erro', async () => {
    render(<LoginPage />);
    
    const inputEmail = screen.getByLabelText(/Endereço de E-mail/i);
    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    const botaoEntrar = screen.getByRole('button', { name: /Entrar no sistema/i });

    // Preenchimento necessário para satisfazer a validação 'required' do HTML5
    fireEvent.change(inputEmail, { target: { value: 'ataque@teste.com' } });
    fireEvent.change(inputSenha, { target: { value: payloadsAtaque.htmlInjection } });
    fireEvent.click(botaoEntrar);

    // Timeout estendido para aguardar a latência artificial do loginMock (1200ms)
    await waitFor(() => {
      const imagemInjetada = document.querySelector('img[onerror]');
      expect(imagemInjetada).toBeNull();
      expect(screen.getByText(/Usuário não encontrado/i)).toBeInTheDocument();
    }, { timeout: 2500 });
  });

  /**
   * Testa a resiliência da interface contra caracteres de escape de SQL.
   */
  it('deve lidar com caracteres de escape de SQL sem quebrar a interface', async () => {
    render(<LoginPage />);
    
    const inputEmail = screen.getByLabelText(/Endereço de E-mail/i);
    const inputSenha = screen.getByLabelText(/Senha de Acesso/i);
    const botaoEntrar = screen.getByRole('button', { name: /Entrar no sistema/i });

    fireEvent.change(inputEmail, { target: { value: 'usuario@teste.com' } });
    fireEvent.change(inputSenha, { target: { value: payloadsAtaque.sqlBasic } });
    
    fireEvent.click(botaoEntrar);

    await waitFor(() => {
      expect(screen.getByText(/Usuário não encontrado/i)).toBeInTheDocument();
    }, { timeout: 2500 });
  });

  /**
   * Valida o desempenho e estabilidade da UI ao processar volumes massivos de dados.
   */
  it('não deve travar a interface ao receber um input extremamente longo', () => {
    render(<LoginPage />);
    const inputEmail = screen.getByLabelText(/Endereço de E-mail/i);
    
    const textoGigante = 'A'.repeat(3000);
    
    const inicio = performance.now();
    fireEvent.change(inputEmail, { target: { value: textoGigante } });
    const fim = performance.now();
    
    // O processamento do input deve ser quase instantâneo (< 100ms)
    expect(fim - inicio).toBeLessThan(100); 
  });
});