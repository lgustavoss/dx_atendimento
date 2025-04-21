import { Grid, Paper, Typography, Box, Card, CardContent, CardHeader } from '@mui/material';
import {
  PeopleAlt as UsersIcon,
  Business as CompaniesIcon,
  Category as GroupsIcon,
  Message as MessagesIcon,
} from '@mui/icons-material';

const Dashboard = () => {
  const stats = [
    { title: 'Usuários', value: 8, icon: <UsersIcon fontSize="large" color="primary" /> },
    { title: 'Empresas', value: 12, icon: <CompaniesIcon fontSize="large" color="secondary" /> },
    { title: 'Grupos', value: 5, icon: <GroupsIcon fontSize="large" color="success" /> },
    { title: 'Mensagens', value: 1458, icon: <MessagesIcon fontSize="large" color="info" /> },
  ];

  const recentChats = [
    { name: 'João Silva', message: 'Preciso de ajuda com meu pedido', time: '5min atrás' },
    { name: 'Maria Souza', message: 'Quando será entregue?', time: '15min atrás' },
    { name: 'Pedro Almeida', message: 'Obrigado pelo atendimento', time: '1h atrás' },
    { name: 'Ana Costa', message: 'Meu produto chegou com defeito', time: '2h atrás' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Cards de estatísticas */}
        {stats.map((stat, index) => (
          <Grid key={index} xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                m: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: 140,
                justifyContent: 'center',
              }}
            >
              {stat.icon}
              <Typography variant="h4" component="div" sx={{ mt: 1 }}>
                {stat.value}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}

        {/* Chats recentes */}
        <Grid xs={12} md={6}>
          <Card sx={{ m: 1 }}>
            <CardHeader title="Conversas Recentes" />
            <CardContent>
              {recentChats.map((chat, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    py: 1.5,
                    borderBottom: index < recentChats.length - 1 ? '1px solid #eee' : 'none',
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1">{chat.name}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 250 }}>
                      {chat.message}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {chat.time}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Resumo do sistema */}
        <Grid xs={12} md={6}>
          <Card>
            <CardHeader title="Informações do Sistema" />
            <CardContent>
              <Typography variant="body1" paragraph>
                Bem-vindo ao painel de administração do DX Atendimento. Aqui você pode gerenciar todos os aspectos
                do sistema de atendimento via WhatsApp.
              </Typography>
              <Typography variant="body1">
                Use o menu lateral para navegar entre as diferentes seções do sistema e gerenciar usuários,
                empresas, grupos e atendimentos.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;