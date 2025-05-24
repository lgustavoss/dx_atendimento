import { ReactNode, useEffect, useState, createContext, useContext } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { loginUser, logoutUser, getCurrentUser } from '../store/slices/authSlice';
import LoadingScreen from '../components/shared/LoadingScreen';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const [initializing, setInitializing] = useState(true);
  const { token, user } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.ui);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (token) {
          await dispatch(getCurrentUser()).unwrap();
        }
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      } finally {
        setInitializing(false);
      }
    };

    if (!token) {
      setInitializing(false);
      return;
    }

    initAuth();
  }, [dispatch, token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleLogout = () => {
    // Feche a conexão WebSocket aqui, se existir
    if (window.myWebSocket) {
      window.myWebSocket.close();
    }
    dispatch(logoutUser());
  };

  const value = {
    isAuthenticated: !!token,
    user,
    token,
    loading: loading.login || initializing,
    login,
    logout: handleLogout,
  };

  if (initializing && token) {
    return <LoadingScreen message="Carregando..." />;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};