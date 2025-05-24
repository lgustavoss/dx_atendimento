import { store } from '../store';
import { updateUserStatusAsync } from '../store/slices/usersSlice';

class WebSocketService {
    private socket: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeout: NodeJS.Timeout | null = null;

    connect() {
        if (this.socket?.readyState === WebSocket.OPEN) return;
        
        const token = localStorage.getItem('access_token');
        if (!token) {
            console.log('Token não encontrado, não tentando conexão WebSocket');
            return;
        }

        try {
            // Removido o prefixo /api/v1 da URL do WebSocket
            const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
            this.socket = new WebSocket(`${wsUrl}/ws/status/?token=${token}`);

            this.socket.onopen = () => {
                console.log('WebSocket conectado');
                this.reconnectAttempts = 0;
            };

            this.socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'user_status') {
                        store.dispatch(updateUserStatusAsync({
                            userId: data.user_id,
                            isOnline: data.is_online,
                            lastActivity: data.last_activity
                        }));
                    }
                } catch (error) {
                    console.error('Erro ao processar mensagem do WebSocket:', error);
                }
            };

            this.socket.onclose = () => {
                console.log('WebSocket desconectado');
                this.scheduleReconnect();
            };

            this.socket.onerror = (error) => {
                console.error('Erro no WebSocket:', error);
            };

        } catch (error) {
            console.error('Erro ao conectar WebSocket:', error);
            this.scheduleReconnect();
        }
    }

    private scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Número máximo de tentativas de reconexão atingido');
            return;
        }

        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        console.log(`Tentativa de reconexão ${this.reconnectAttempts + 1} de ${this.maxReconnectAttempts} em ${delay}ms`);

        this.reconnectTimeout = setTimeout(() => {
            this.reconnectAttempts++;
            this.connect();
        }, delay);
    }

    disconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export const websocketService = new WebSocketService();