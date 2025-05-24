import { useEffect, useRef } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import api from '../../services/api';
import { useAppDispatch } from '../../hooks/store';
import { fetchUsers } from '../../store/slices/usersSlice';

const OnlineStatusUpdater = () => {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const heartbeatInterval = useRef<NodeJS.Timeout>();
    const updateInterval = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (!user) return;

        // Função para atualizar o status
        const updateStatus = async (status: 'online' | 'offline') => {
            try {
                await api.post('/accounts/status/', { status });
            } catch (error) {
                console.error('Erro ao atualizar status:', error);
            }
        };

        // Heartbeat para manter o status online
        const sendHeartbeat = async () => {
            await updateStatus('online');
        };

        // Inicializa como online
        sendHeartbeat();

        // Configura o heartbeat a cada 1 minuto
        heartbeatInterval.current = setInterval(sendHeartbeat, 60000);

        // Atualiza a lista de usuários a cada 30 segundos
        updateInterval.current = setInterval(() => {
            dispatch(fetchUsers());
        }, 30000);

        // Evento para quando o usuário fecha o navegador
        const handleBeforeUnload = () => {
            // Usando sendBeacon para garantir que a requisição seja enviada
            const data = new Blob(
                [JSON.stringify({ status: 'offline', user_id: user.id })],
                { type: 'application/json' }
            );
            navigator.sendBeacon(`${import.meta.env.VITE_API_URL}/api/v1/accounts/status/`, data);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            if (heartbeatInterval.current) {
                clearInterval(heartbeatInterval.current);
            }
            if (updateInterval.current) {
                clearInterval(updateInterval.current);
            }
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [user, dispatch]);

    return null;
};

export default OnlineStatusUpdater;