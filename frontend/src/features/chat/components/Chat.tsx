import { useState, useEffect } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import PageContainer from '../../../components/shared/PageContainer';
import AtendimentosList from './AtendimentosList';
import ChatWindow from './ChatWindow';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { fetchAtendimentos, Atendimento } from '../../../store/slices/chatSlice';

const Chat = () => {
  const dispatch = useAppDispatch();
  const atendimentos = useAppSelector((state) => state.chat.atendimentos);
  const [selectedAtendimento, setSelectedAtendimento] = useState<Atendimento | null>(null);

  useEffect(() => {
    dispatch(fetchAtendimentos());
  }, [dispatch]);

  return (
    <PageContainer title="Chat">
      <Box sx={{ height: 'calc(100vh - 140px)', display: 'flex' }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          {/* Lista de Atendimentos */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper sx={{ height: '100%', overflow: 'hidden' }}>
              <AtendimentosList 
                atendimentos={atendimentos}
                selectedAtendimento={selectedAtendimento}
                onSelectAtendimento={setSelectedAtendimento}
              />
            </Paper>
          </Grid>
          
          {/* Janela do Chat */}
          <Grid item xs={12} md={8} lg={9}>
            <Paper sx={{ height: '100%', overflow: 'hidden' }}>
              <ChatWindow 
                atendimento={selectedAtendimento}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Chat;