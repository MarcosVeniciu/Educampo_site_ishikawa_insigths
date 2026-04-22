/**
 * @fileoverview Banco de dados simulado e serviços de autenticação fictícios.
 * Utilizado para testes de interface, validação de login e controle de rotas
 * protegidas no frontend (Shift-Left e TDD) antes da integração com a API FastAPI.
 */

export type UserRole = 'PRODUTOR' | 'TECNICO' | 'ADMIN';

export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string; // AVISO: Apenas para fins de MOCK. Nunca trafegue senhas puras em produção.
  fazenda: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'senha'>;
}

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

const safeBtoa = (str: string): string => {
  if (typeof btoa === 'function') return btoa(str);
  if (typeof Buffer !== 'undefined') return Buffer.from(str).toString('base64');
  return str;
};

const safeAtob = (str: string): string => {
  if (typeof atob === 'function') return atob(str);
  if (typeof Buffer !== 'undefined') return Buffer.from(str, 'base64').toString('utf-8');
  return str;
};

export const loginMock = async (email: string, senha: string): Promise<AuthResponse> => {
  return new Promise((resolve, reject) => {
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

      const { senha: _, ...userWithoutPassword } = user;

      const payload = {
        id: user.id,
        email: user.email,
        role: user.role
      };

      const headerB64 = safeBtoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payloadB64 = safeBtoa(JSON.stringify(payload));

      resolve({
        token: `${headerB64}.${payloadB64}.mock_signature_educampo_2024`,
        user: userWithoutPassword
      });
    }, latency);
  });
};

/**
 * Simula a verificação de um token JWT para proteger rotas privadas.
 * @param {string} token - O token JWT.
 * @returns {Promise<{ user: Omit<User, 'senha'> } | null>} O objeto user validado.
 */
export const verifyTokenMock = async (token: string): Promise<{ user: Omit<User, 'senha'> } | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!token || token.split('.').length !== 3) {
        resolve(null);
        return;
      }

      try {
        const payloadB64 = token.split('.')[1];
        const decodedPayload = JSON.parse(safeAtob(payloadB64));
        const userId = decodedPayload.id; 
        
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
          const { senha: _, ...userWithoutPassword } = user;
          // CORREÇÃO: Envolver o usuário na propriedade 'user'
          resolve({ user: userWithoutPassword });
        } else {
          resolve(null);
        }
      } catch (e) {
        resolve(null);
      }
    }, 300); 
  });
};