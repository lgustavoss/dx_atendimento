import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  login: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);

  useEffect(() => {
    // Carrega o usuário se o token existir
    if (token) {
      // Aqui você pode fazer uma requisição para obter os dados do usuário
      // Por enquanto, vamos simular um usuário
      setUser({ id: 1, email: 'admin@example.com', nome: 'Admin' });
      setIsAuthenticated(true);
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Aqui deveria ser uma chamada real à API, mas vamos simular por enquanto
      if (email === 'admin@example.com' && password === 'admin') {
        // Simular um token JWT
        const simulatedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        
        // Em produção, faríamos uma chamada real:
        // const response = await axios.post('/api/v1/auth/login', {
        //   username: email,
        //   password: password,
        // });
        // const { access_token } = response.data;
        
        localStorage.setItem('token', simulatedToken);
        setToken(simulatedToken);
        setUser({ id: 1, email, nome: 'Admin' });
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};