import React from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OnlineStatusProps {
  isOnline: boolean;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  lastActivity?: string | null;
}

const OnlineStatus: React.FC<OnlineStatusProps> = ({
  isOnline,
  showText = false,
  size = 'medium',
  lastActivity
}) => {
  const dotSize = {
    small: 8,
    medium: 10,
    large: 12
  }[size];

  const getStatusColor = () => {
    return isOnline ? '#34c759' : '#8e8e93';
  };

  const getLastActivityText = () => {
    if (!lastActivity) return 'Nunca acessou';
    
    try {
      const lastActivityDate = new Date(lastActivity);
      return `Último acesso: ${formatDistanceToNow(lastActivityDate, { 
        addSuffix: true,
        locale: ptBR 
      })}`;
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <Tooltip title={getLastActivityText()}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: getStatusColor(),
            transition: 'background-color 0.3s ease'
          }}
        />
        {showText && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {isOnline ? 'Online' : 'Offline'}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default OnlineStatus;