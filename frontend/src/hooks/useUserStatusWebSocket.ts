import { useWebSocket } from '../hooks/useWebSocket';
import { useAppDispatch } from '../hooks/store';
import { updateUserStatus } from '../store/slices/usersSlice';

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