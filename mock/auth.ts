/**
 * @fileoverview Banco de dados simulado e serviços de autenticação fictícios.
 * Utilizado para testes de interface, validação de login e controle de rotas
 * protegidas no frontend (Shift-Left e TDD) antes da integração com a API FastAPI.
 */

/**
 * Representa os papéis (roles) de um usuário dentro do sistema Educampo.
 * Define o nível de acesso e o que ele pode visualizar no dashboard.
 * @typedef {'PRODUTOR' | 'TECNICO' | 'ADMIN'} UserRole
 */
export type UserRole = 'PRODUTOR' | 'TECNICO' | 'ADMIN';

/**
 * Interface que define a estrutura do usuário do sistema.
 * @interface User
 * @property {string} id - Identificador único do usuário.
 * @property {string} nome - Nome completo do usuário.
 * @property {string} email - E-mail utilizado para login.
 * @property {string} senha - Senha do usuário (em um sistema real, NUNCA exposta e sempre em hash).
 * @property {string} fazenda - Nome da propriedade rural associada.
 * @property {UserRole} role - Papel do usuário no sistema.
 * @property {string} [avatar] - URL opcional para a foto de perfil.
 */
export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string; // AVISO: Apenas para fins de MOCK. Nunca trafegue senhas puras em produção.
  fazenda: string;
  role: UserRole;
  avatar?: string;
}

/**
 * Interface que define a resposta de um login bem-sucedido.
 * @interface AuthResponse
 * @property {string} token - Token JWT simulado para controle de sessão (Bearer).
 * @property {Omit<User, 'senha'>} user - Dados do usuário autenticado, removendo a senha por segurança.
 */
export interface AuthResponse {
  token: string;
  user: Omit<User, 'senha'>;
}

/**
 * Banco de dados estático simulando usuários reais da plataforma Educampo.
 * Usado para testar diferentes permissões e dados de fazendas.
 * @type {User[]}
 */
export const mockUsers: User[] = [
  {
    id: 'usr_01',
    nome: 'João Batista',
    email: 'joao@fazendaesperanca.com.br',
    senha: 'SenhaForte123!',
    fazenda: 'Fazenda Esperança',
    role: 'PRODUTOR',
  },
  {
    id: 'usr_02',
    nome: 'Ana Souza',
    email: 'ana.tecnica@educampo.com.br',
    senha: 'TecnicaAdmin@2024',
    fazenda: 'Múltiplas (Visão Consultor)',
    role: 'TECNICO',
  }
];

/**
 * Simula a chamada de API para o endpoint de login (/api/v1/auth/login).
 * Insere um atraso artificial para simular a latência da rede e permitir
 * o teste de estados de "Carregando" (Loading spinners) na interface.
 * * @param {string} email - O e-mail fornecido no formulário.
 * @param {string} senha - A senha fornecida no formulário.
 * @returns {Promise<AuthResponse>} Uma promessa que resolve com o token e dados do usuário, ou rejeita com erro.
 * * @example
 * try {
 * const response = await loginMock('joao@fazendaesperanca.com.br', 'SenhaForte123!');
 * localStorage.setItem('token', response.token);
 * } catch (error) {
 * showError(error.message);
 * }
 */
export const loginMock = async (email: string, senha: string): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
    // Simula latência de rede entre 800ms e 1500ms
    const latency = Math.floor(Math.random() * 700) + 800;

    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);

      if (!user) {
        reject(new Error('Usuário não encontrado. Verifique o e-mail digitado.'));
        return;
      }

      if (user.senha !== senha) {
        reject(new Error('Credenciais inválidas. Senha incorreta.'));
        return;
      }

      // Separa a senha do restante das informações usando destructuring
      const { senha: _, ...userWithoutPassword } = user;

      resolve({
        // Gera um token simulado concatenando o ID em base64 (Apenas mock visual)
        token: `mock_jwt_token_header.payload_${btoa(user.id)}.signature`,
        user: userWithoutPassword
      });
    }, latency);
  });
};

/**
 * Simula a verificação de um token JWT para proteger rotas privadas.
 * Se o token for válido, retorna o usuário correspondente.
 * * @param {string} token - O token JWT (simulado) recuperado dos cookies ou localStorage.
 * @returns {Promise<Omit<User, 'senha'> | null>} O usuário logado ou null se o token for inválido.
 */
export const verifyTokenMock = async (token: string): Promise<Omit<User, 'senha'> | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!token || !token.startsWith('mock_jwt_token_')) {
        resolve(null);
        return;
      }

      // Extrai a string base64 que colocamos no token falso
      try {
        const base64Id = token.split('.')[1].replace('payload_', '');
        const userId = atob(base64Id);
        
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          const { senha: _, ...userWithoutPassword } = user;
          resolve(userWithoutPassword);
        } else {
          resolve(null);
        }
      } catch (e) {
        // Se falhar o decode do token falso, assume inválido
        resolve(null);
      }
    }, 300); // Latência menor para validação de rota
  });
};