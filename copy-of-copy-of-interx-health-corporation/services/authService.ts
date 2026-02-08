
export interface User {
  id: string;
  name: string;
  email: string;
}

const AUTH_KEY = 'interx_session_v2';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const input = email.toLowerCase();
        
        if (input === 'adm' && password === 'adm') {
          const user = { id: '1', name: 'ADMINISTRADOR', email: 'adm' };
          localStorage.setItem(AUTH_KEY, JSON.stringify(user));
          resolve(user);
        } else if (input === 'cadastro' && password === 'cadastro') {
          const user = { id: '2', name: 'EQUIPE CADASTRO', email: 'cadastro' };
          localStorage.setItem(AUTH_KEY, JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error('Acesso negado. Tente cadastro/cadastro.'));
        }
      }, 600);
    });
  },

  // Fix: Implementação do método register para permitir criação de novos acessos corporativos simulados
  register: async (name: string, email: string, password: string): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = { 
          id: Math.random().toString(36).substring(2, 11), 
          name: name.toUpperCase(), 
          email: email.toLowerCase() 
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        resolve(user);
      }, 600);
    });
  },

  logout: () => localStorage.removeItem(AUTH_KEY),
  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  }
};
