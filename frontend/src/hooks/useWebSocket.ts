import { useEffect, useRef, useState } from 'react';
import { getAccessToken } from '../store/utils/auth';
import { useAppDispatch } from '../hooks/store';
import { updateUserStatus } from '../store/slices/usersSlice';

export const useWebSocket = (url: string, onMessage?: (data: any) => void) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const maxReconnectAttempts = 5;
  const reconnectAttempts = useRef(0);

  const connect = () => {
    if (ws.current?.readyState === WebSocket.OPEN) return;

    const token = getAccessToken();
    const fullUrl = `${url}?token=${token}`;
    ws.current = new WebSocket(fullUrl);

    ws.current.onopen = () => {
      console.log('WebSocket conectado');
      setIsConnected(true);
      reconnectAttempts.current = 0;
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectAttempts.current += 1;
          connect();
        }, timeout);
      }
    };

    ws.current.onerror = (error) => {
      console.error('Erro WebSocket:', error);
    };

    ws.current.onmessage = (event) => {
      if (onMessage) {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Erro ao analisar a mensagem do WebSocket:', error);
        }
      }
    };
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { isConnected, sendMessage, ws: ws.current };
};

export function useUserStatusWebSocket(url: string) {
  const dispatch = useAppDispatch();

  useWebSocket(url, (data) => {
    if (data.type === 'status.update') {
      dispatch(updateUserStatus({
        userId: data.user_id,
        isOnline: data.is_online,
        lastActivity: data.last_activity,
      }));
    }
  });
}