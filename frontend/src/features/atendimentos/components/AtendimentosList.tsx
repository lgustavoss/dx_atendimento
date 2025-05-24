import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Divider } from '@mui/material';
import { Atendimento } from '../../../store/slices/chatSlice';

interface AtendimentosListProps {
  atendimentos: Atendimento[];
  selectedAtendimento: Atendimento | null;
  onSelectAtendimento: (atendimento: Atendimento) => void;
}

const AtendimentosList = ({ 
  atendimentos, 
  selectedAtendimento, 
  onSelectAtendimento 
}: AtendimentosListProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Atendimentos</Typography>
      </Box>
      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {atendimentos.map((atendimento) => (
          <ListItem key={atendimento.id} disablePadding>
            <ListItemButton 
              selected={selectedAtendimento?.id === atendimento.id}
              onClick={() => onSelectAtendimento(atendimento)}
            >
              <ListItemText 
                primary={`Protocolo: ${atendimento.protocolo}`}
                secondary={`Status: ${atendimento.status}`}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AtendimentosList;