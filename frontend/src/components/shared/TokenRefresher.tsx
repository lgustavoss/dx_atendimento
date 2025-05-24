import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks/store';
import { getCurrentUser } from '../../store/slices/authSlice';

const TokenRefresher = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const refreshToken = async () => {
      try {
        await dispatch(getCurrentUser()).unwrap();
      } catch (error) {
        console.error('Erro ao atualizar token:', error);
      }
    };

    const interval = setInterval(refreshToken, 4 * 60 * 1000); // 4 minutos

    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
};

export default TokenRefresher;