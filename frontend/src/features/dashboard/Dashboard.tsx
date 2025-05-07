import { Grid, Paper, Typography, Box } from '@mui/material';
import {
  PeopleAlt as UsersIcon,
  Business as CompaniesIcon,
  Category as GroupsIcon,
  Message as MessagesIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { title: 'Usuários', value: 0, icon: <UsersIcon fontSize="large" color="primary" /> },
    { title: 'Empresas', value: 0, icon: <CompaniesIcon fontSize="large" color="secondary" /> },
    { title: 'Grupos', value: 0, icon: <GroupsIcon fontSize="large" color="success" /> },
    { title: 'Chats', value: 0, icon: <MessagesIcon fontSize="large" color="info" /> }, // Alterado de "Mensagens" para "Chats"
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usuarios, empresas, grupos, atendimentos] = await Promise.all([
          api.get('/users/').then(res => res.data.length),
          api.get('/empresas/').then(res => res.data.length),
          api.get('/grupos/').then(res => res.data.length),
          api.get('/atendimentos/count').then(res => res.data) // Endpoint novo
        ]);
        
        setStats([
          { title: 'Usuários', value: usuarios, icon: <UsersIcon fontSize="large" color="primary" /> },
          { title: 'Empresas', value: empresas, icon: <CompaniesIcon fontSize="large" color="secondary" /> },
          { title: 'Grupos', value: grupos, icon: <GroupsIcon fontSize="large" color="success" /> },
          { title: 'Chats', value: atendimentos, icon: <MessagesIcon fontSize="large" color="info" /> },
        ]);
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Cards de estatísticas */}
        {stats.map((stat, index) => (
          <Grid key={index} item xs={12} sm={6} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: 180,
                justifyContent: 'center',
                borderRadius: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6,
                },
              }}
            >
              {stat.icon}
              <Typography variant="h3" component="div" sx={{ mt: 2, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography color="text.secondary" variant="subtitle1">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;