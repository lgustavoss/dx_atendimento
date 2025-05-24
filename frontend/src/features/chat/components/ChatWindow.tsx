import { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton,
  List,
  ListItem,
  ListItemText 
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import { Atendimento, Mensagem } from '../../../store/slices/chatSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { enviarMensagem } from '../../../store/slices/chatSlice';

interface ChatWindowProps {
  atendimento: Atendimento | null;
}

const ChatWindow = ({ atendimento }: ChatWindowProps) => {
  const dispatch = useAppDispatch();
  const [mensagem, setMensagem] = useState('');
  const mensagens = useAppSelector(
    (state) => atendimento ? state.chat.mensagens[atendimento.id] || [] : []
  );

  const handleEnviarMensagem = async () => {
    if (!atendimento || !mensagem.trim()) return;

    try {
      await dispatch(enviarMensagem({
        atendimentoId: atendimento.id,
        mensagem: {
          conteudo: mensagem,
          tipo: 'texto',
          entrada: false,
          contato_id: atendimento.contato_id,
          atendimento_id: atendimento.id
        }
      })).unwrap();
      setMensagem('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  if (!atendimento) {
    return (
      <Box sx={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <Typography variant="h6" color="textSecondary">
          Selecione um atendimento para iniciar
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%' 
    }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">
          Protocolo: {atendimento.protocolo}
        </Typography>
      </Box>

      {/* Mensagens */}
      <List sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {mensagens.map((msg: Mensagem) => (
          <ListItem 
            key={msg.id}
            sx={{ 
              justifyContent: msg.entrada ? 'flex-start' : 'flex-end'
            }}
          >
            <Box 
              sx={{ 
                maxWidth: '70%',
                bgcolor: msg.entrada ? 'grey.100' : 'primary.main',
                color: msg.entrada ? 'text.primary' : 'primary.contrastText',
                borderRadius: 2,
                p: 1
              }}
            >
              <ListItemText 
                primary={msg.conteudo}
                secondary={new Date(msg.created_at).toLocaleString()}
              />
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Input de mensagem */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Digite sua mensagem..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
          />
          <IconButton 
            color="primary" 
            onClick={handleEnviarMensagem}
            disabled={!mensagem.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatWindow;