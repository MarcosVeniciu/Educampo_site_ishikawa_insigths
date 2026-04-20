/**
 * @fileoverview Suíte de testes de segurança focada em Autenticação e Controle de Acesso.
 * Valida o fluxo de login, a integridade do token de sessão e a proteção contra
 * acessos não autorizados utilizando os serviços simulados (mocks).
 * * Princípios testados:
 * 1. Broken Access Control (Controle de acesso quebrado).
 * 2. Identification and Authentication Failures (Falhas de identificação).
 */

import { loginMock, verifyTokenMock, mockUsers } from '../../mock/auth';

describe('Segurança de Autenticação - Fluxo de Sessão', () => {
  
  const credenciaisValidas = {
    email: mockUsers[0].email,
    senha: mockUsers[0].senha
  };

  /**
   * Teste de Integridade do Token:
   * Garante que o token gerado pelo sistema de login contém as informações
   * necessárias para identificar o usuário, mas não expõe a senha.
   */
  it('deve gerar um token que permite a identificação correta do usuário logado', async () => {
    const { token, user } = await loginMock(credenciaisValidas.email, credenciaisValidas.senha);
    
    expect(token).toBeDefined();
    expect(token.length).toBeGreaterThan(20);

    // Valida o token gerado usando o serviço de verificação
    const usuarioValidado = await verifyTokenMock(token);
    
    expect(usuarioValidado).not.toBeNull();
    expect(usuarioValidado?.id).toBe(user.id);
    expect(usuarioValidado).not.toHaveProperty('senha');
  });

  /**
   * Teste de Resiliência:
   * Verifica se o sistema rejeita tokens malformados ou manipulados.
   */
  it('deve rejeitar tokens inválidos ou manipulados durante a verificação', async () => {
    const tokensInvalidos = [
      'token-totalmente-errado',
      'mock_jwt_token_header.payload_INVALIDO.signature',
      '',
      'null'
    ];

    for (const token of tokensInvalidos) {
      const resultado = await verifyTokenMock(token);
      expect(resultado).toBeNull();
    }
  });

  /**
   * Teste de Segurança de Fluxo (Brute Force Simulation):
   * Embora o mock não tenha um banco de dados real, validamos que múltiplas
   * falhas seguidas retornam o erro correto de credenciais.
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
   * Garante que a função de verificação não "vaza" dados se o token for omitido.
   */
  it('deve retornar null se tentar verificar um token inexistente (undefined)', async () => {
    // @ts-ignore - Testando comportamento em tempo de execução para segurança
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

    expect(validacao1?.id).not.toBe(validacao2?.id);
    expect(validacao1?.nome).toBe(mockUsers[0].nome);
    expect(validacao2?.nome).toBe(mockUsers[1].nome);
  });
});