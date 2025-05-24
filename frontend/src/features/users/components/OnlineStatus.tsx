import { Box, Tooltip, Typography } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OnlineStatusProps {
  isOnline: boolean;
  lastActivity?: string;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const OnlineStatus = ({ 
  isOnline, 
  lastActivity, 
  showText = false,
  size = 'small' 
}: OnlineStatusProps) => {
  const dotSize = {
    small: 8,
    medium: 10,
    large: 12
  }[size];

  return (
    <Tooltip title={
      isOnline 
        ? 'Online' 
        : lastActivity 
          ? `Última atividade: ${formatDistanceToNow(new Date(lastActivity), { 
              addSuffix: true,
              locale: ptBR 
            })}` 
          : 'Offline'
    }>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            bgcolor: isOnline ? 'success.main' : 'grey.500'
          }}
        />
        {showText && (
          <Typography variant="body2" color="text.secondary">
            {isOnline ? 'Online' : 'Offline'}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default OnlineStatus;