import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { ReactNode, useEffect, useState } from 'react';
import LoadingScreen from '../shared/LoadingScreen';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, user, token, loading } = useAuth();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Verificação adicional para garantir que o estado está completo
    if (!loading) {
      console.log('AdminRoute - Verificação completa:', {
        isAuthenticated,
        userExists: !!user,
        isSuperuser: user?.is_superuser,
        tokenExists: !!token
      });
      
      // Pequeno atraso para garantir sincronia de estado
      setTimeout(() => setVerifying(false), 300);
    }
  }, [isAuthenticated, user, token, loading]);

  // Exibir loading enquanto verifica
  if (loading || verifying) {
    return <LoadingScreen message="Verificando permissões..." />;
  }

  // Verificar autenticação
  if (!isAuthenticated || !token) {
    console.log('Redirecionando para login - Não autenticado');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar se é superuser
  if (!user?.is_superuser) {
    console.log('Redirecionando para unauthorized - Não é admin');
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;