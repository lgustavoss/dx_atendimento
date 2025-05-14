import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../providers/AuthProvider';
import { ReactNode, useEffect, useState } from 'react';
import LoadingScreen from '../../../components/shared/LoadingScreen';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, user, token, loading } = useAuth();
  const location = useLocation();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => setVerifying(false), 300);
    }
  }, [isAuthenticated, user, token, loading]);

  if (loading || verifying) {
    return <LoadingScreen message="Verificando permissões..." />;
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user?.is_superuser) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;