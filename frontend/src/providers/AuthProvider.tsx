import { ReactNode, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { getCurrentUser, loginUser, logout as logoutAction } from '../store/slices/authSlice';
import LoadingScreen from '../components/shared/LoadingScreen';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const dispatch = useAppDispatch();
  const [initializing, setInitializing] = useState(true);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (token) {
          await dispatch(getCurrentUser()).unwrap();
        }
      } catch (error) {
        // Só remove o token se o erro for de autenticação
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
        }
      } finally {
        setInitializing(false);
      }
    };

    initAuth();
  }, [dispatch, token]);

  if (initializing) {
    return <LoadingScreen message="Carregando..." />;
  }

  return <>{children}</>;
};

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, loading } = useAppSelector((state) => state.auth);

  const login = async (email: string, password: string) => {
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    localStorage.removeItem('token');
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
  };
};