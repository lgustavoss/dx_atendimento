import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import api from '../services/api';

interface User {
  id: number;
  email: string;
  nome: string;
  is_active: boolean;
  is_superuser: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          await getCurrentUser();
        } catch (error) {
          console.error('Erro ao inicializar autenticação');
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const getCurrentUser = async () => {
    if (!token) return;
    
    try {
      // Definir token global no Axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      const response = await api.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Verificação extra para garantir que o usuário é válido
      if (!response.data) {
        throw new Error('Dados do usuário inválidos');
      }
      
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao obter dados do usuário');
      logout();
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Formato exato esperado pelo OAuth2PasswordRequestForm do FastAPI
      const data = `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
      
      const response = await api.post('/auth/login', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      // Remover log de informações sensíveis
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Obter dados do usuário
      await getCurrentUser();
      
      return true;
    } catch (error) {
      console.error('Erro no login');
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
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};