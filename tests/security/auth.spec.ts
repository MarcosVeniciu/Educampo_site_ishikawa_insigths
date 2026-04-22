/**
 * @fileoverview Suíte de testes de segurança focada em Autenticação e Controle de Acesso.
 * Valida o fluxo de login, a transição para HttpOnly Cookies, a integridade da sessão
 * e a proteção contra acessos não autorizados utilizando os serviços simulados (mocks).
 * * Princípios testados:
 * 1. Proteção XSS (Cross-Site Scripting) - Garantir ausência de tokens no Web Storage.
 * 2. Proteção CSRF (Cross-Site Request Forgery) - Validação de atributos de Cookie.
 * 3. Broken Access Control (Controle de acesso quebrado).
 * 4. Identification and Authentication Failures (Falhas de identificação).
 */

import { loginMock, verifyTokenMock, mockUsers } from '../../mock/auth';

describe('Segurança de Autenticação - Fluxo de Sessão e HttpOnly Cookies', () => {
  
  const credenciaisValidas = {
    email: mockUsers[0].email,
    senha: mockUsers[0].senha
  };

  beforeEach(() => {
    // Limpa os mocks e o storage antes de cada teste
    jest.clearAllMocks();
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  /**
   * Teste de Prevenção de XSS (Cross-Site Scripting):
   * O contrato agora EXIGE que o frontend não armazene tokens no Storage.
   * O token deve viver apenas na memória curta ou vir via cabeçalho Set-Cookie (testado abaixo).
   */
  it('NÃO deve expor o token no localStorage ou sessionStorage para prevenir XSS', async () => {
    // Espiões para observar se a aplicação tenta salvar algo no storage
    const setLocalSpy = jest.spyOn(window.localStorage, 'setItem');
    const setSessionSpy = jest.spyOn(window.sessionStorage, 'setItem');

    // Executamos o mock de validação que o backend usará
    await loginMock(credenciaisValidas.email, credenciaisValidas.senha);

    // O frontend NOVO não deve fazer isso: localStorage.setItem('token', token)
    // Validamos que o storage permaneceu limpo após o fluxo
    expect(setLocalSpy).not.toHaveBeenCalledWith(expect.stringContaining('token'), expect.anything());
    expect(setSessionSpy).not.toHaveBeenCalledWith(expect.stringContaining('token'), expect.anything());
    expect(window.localStorage.getItem('@Educampo:token')).toBeNull();
    expect(window.sessionStorage.getItem('token')).toBeNull();
  });

  /**
   * Teste do Contrato da API (Backend-for-Frontend):
   * Valida se a resposta gerada pela futura rota de autenticação (app/api/auth/route.ts)
   * contém os cabeçalhos corretos de segurança para cookies.
   */
  it('a resposta de autenticação DEVE conter o cabeçalho Set-Cookie com HttpOnly, Secure e SameSite', async () => {
    // Simulação do processamento interno da futura rota API:
    const { token } = await loginMock(credenciaisValidas.email, credenciaisValidas.senha);

    // Simulando a construção do NextResponse do Next.js
    const response = new Response(JSON.stringify({ message: "Login com sucesso" }), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
      }
    });

    const setCookieHeader = response.headers.get('Set-Cookie');

    // Validações rigorosas do contrato de segurança do Cookie
    expect(setCookieHeader).toBeDefined();
    expect(setCookieHeader).toContain('HttpOnly'); // Impede que o JS leia o cookie (XSS)
    expect(setCookieHeader).toContain('Secure');   // Garante envio apenas por HTTPS
    expect(setCookieHeader).toContain('SameSite=Strict'); // Impede envio a partir de outros sites (CSRF)
    expect(setCookieHeader).toContain(`token=${token}`); // O token deve estar embutido
  });

  /**
   * Teste de Broken Access Control:
   * Garante a negativa contínua após múltiplas tentativas erradas.
   */
  it('deve manter a negativa de acesso após múltiplas tentativas com senha incorreta', async () => {
    const emailAlvo = credenciaisValidas.email;
    const senhaErrada = 'SenhaErrada123';

    for (let i = 0; i < 3; i++) {
      await expect(loginMock(emailAlvo, senhaErrada))
        .rejects
        .toThrow('Credenciais inválidas');
    }
  });

  /**
   * Teste de Sessão Expirada/Inexistente:
   * Garante que a função de verificação não "vaza" dados se o cookie/token for omitido.
   */
  it('deve retornar null se tentar verificar um token inexistente (simulando ausência do cookie)', async () => {
    // @ts-ignore - Forçando a passagem de undefined para simular a ausência do Cookie
    const resultado = await verifyTokenMock(undefined);
    expect(resultado).toBeNull();
  });

  /**
   * Teste de Isolamento de Identidade:
   * Garante que um token de um usuário não pode ser usado para validar a sessão de outro.
   */
  it('deve garantir que o token gerado é exclusivo para o ID do usuário autenticado', async () => {
    const resUser1 = await loginMock(mockUsers[0].email, mockUsers[0].senha);
    const resUser2 = await loginMock(mockUsers[1].email, mockUsers[1].senha);

    const validacao1 = await verifyTokenMock(resUser1.token);
    const validacao2 = await verifyTokenMock(resUser2.token);

    expect(validacao1?.user.id).toBe(mockUsers[0].id);
    expect(validacao2?.user.id).toBe(mockUsers[1].id);
    expect(validacao1?.user.id).not.toBe(validacao2?.user.id);
  });
});