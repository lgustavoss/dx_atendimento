import { useEffect } from 'react';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { useAppDispatch } from '../../../hooks/store';
import { updateUserStatus } from '../../../store/slices/usersSlice';

const OnlineStatusManager = () => {
  const dispatch = useAppDispatch();
  const { ws, isConnected } = useWebSocket(import.meta.env.VITE_WEBSOCKET_URL);

  useEffect(() => {
    if (!ws) return;
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'status.update') {
        dispatch(
          updateUserStatus({
            userId: data.user_id,
            isOnline: data.is_online,
            lastActivity: data.last_activity,
          })
        );
      }
    };
  }, [ws, dispatch]);

  return null;
};

export default OnlineStatusManager;