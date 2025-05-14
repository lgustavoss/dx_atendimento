import {
  PeopleAlt as UsersIcon,
  Business as CompaniesIcon,
  Category as GroupsIcon,
  Message as MessagesIcon,
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { fetchDashboardStats } from '../../store/slices/dashboardSlice';
import { Box, Grid, Paper, Typography } from '@mui/material';

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const stats = useAppSelector((state) => state.dashboard?.stats);
  const isLoading = useAppSelector((state) => state.ui.loading.fetchDashboardStats);
  
  const [statCards, setStatCards] = useState([
    { title: 'Usuários', value: 0, icon: <UsersIcon fontSize="large" color="primary" /> },
    { title: 'Empresas', value: 0, icon: <CompaniesIcon fontSize="large" color="secondary" /> },
    { title: 'Grupos', value: 0, icon: <GroupsIcon fontSize="large" color="success" /> },
    { title: 'Chats', value: 0, icon: <MessagesIcon fontSize="large" color="info" /> },
  ]);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    if (stats) {
      setStatCards([
        { title: 'Usuários', value: stats.usuarios || 0, icon: <UsersIcon fontSize="large" color="primary" /> },
        { title: 'Empresas', value: stats.empresas || 0, icon: <CompaniesIcon fontSize="large" color="secondary" /> },
        { title: 'Grupos', value: stats.grupos || 0, icon: <GroupsIcon fontSize="large" color="success" /> },
        { title: 'Chats', value: stats.chats || 0, icon: <MessagesIcon fontSize="large" color="info" /> },
      ]);
    }
  }, [stats]);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((stat, index) => (
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
              <Typography variant="h4" component="div" sx={{ mt: 2 }}>
                {isLoading ? '...' : stat.value}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
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