/**
 * @fileoverview Testes de segurança focados na validação e sanitização de inputs.
 * Garante que payloads de XSS, HTML Injection e SQL Injection sejam tratados como texto comum.
 * @version 1.1.1
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

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

import LoginPage from '../../app/login/page';

const payloadsAtaque = {
  xss: '<script>alert("xss")</script>',
  htmlInjection: '<img src=x onerror=alert(1)>',
  sqlBasic: "' OR '1'='1",
};

describe('Segurança de Inputs - Página de Login', () => {

  // CORREÇÃO: Simulação do backend para que o fetch não quebre no jsdom
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'Usuário não encontrado' }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('não deve permitir a renderização de tags HTML injetadas nas mensagens de erro', async () => {
    render(<LoginPage />);
    
    const inputEmail = screen.getByLabelText(/E-mail do Consultor/i);
    const inputSenha = screen.getByLabelText(/Senha/i);
    const botaoEntrar = screen.getByRole('button', { name: /Acessar Painel/i });

    fireEvent.change(inputEmail, { target: { value: 'ataque@teste.com' } });
    fireEvent.change(inputSenha, { target: { value: payloadsAtaque.htmlInjection } });
    fireEvent.click(botaoEntrar);

    await waitFor(() => {
      const imagemInjetada = document.querySelector('img[onerror]');
      expect(imagemInjetada).toBeNull();
      expect(screen.getByText(/Usuário não encontrado/i)).toBeInTheDocument();
    }, { timeout: 2500 });
  });

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

  it('não deve travar a interface ao receber um input extremamente longo', () => {
    render(<LoginPage />);
    const inputEmail = screen.getByLabelText(/E-mail do Consultor/i);
    
    const textoGigante = 'A'.repeat(3000);
    
    const inicio = performance.now();
    fireEvent.change(inputEmail, { target: { value: textoGigante } });
    const fim = performance.now();
    
    expect(fim - inicio).toBeLessThan(100); 
  });
});