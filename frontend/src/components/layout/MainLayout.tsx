import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import OnlineStatusManager from '../../features/users/components/OnlineStatusManager';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Chat as ChatIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Category as CategoryIcon,
  Contacts as ContactsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Brightness4 as ThemeIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme as useAppTheme } from '../../providers/ThemeProvider';
import { useAuth } from '../../providers/AuthProvider';
import NotificationProvider from '../shared/NotificationProvider';
import TokenRefresher from '../shared/TokenRefresher';
import ChangePasswordDialog from '../auth/ChangePasswordDialog';
import OnlineStatus from '../../features/users/components/OnlineStatus';
import { useUserStatusWebSocket } from '../../hooks/useUserStatusWebSocket';

const drawerWidth = 240;

const MainLayout = () => {
  const theme = useTheme();
  const { toggleTheme } = useAppTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, token } = useAuth();

  // Use a variável de ambiente correta para a URL do WebSocket
  useUserStatusWebSocket(
    token ? import.meta.env.VITE_WEBSOCKET_URL : ''
  );

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setIsDrawerOpen(!isDrawerOpen);
    }
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
    navigate('/login');
  };

  // Itens do menu baseados nas permissões do usuário
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Chat', icon: <ChatIcon />, path: '/chat' },
    // Itens que requerem permissão de admin
    ...(user?.is_superuser ? [
      { text: 'Usuários', icon: <PeopleIcon />, path: '/users' },
      { text: 'Empresas', icon: <BusinessIcon />, path: '/companies' },
      { text: 'Grupos', icon: <CategoryIcon />, path: '/groups' },
    ] : []),
    // Itens disponíveis para todos
    { text: 'Contatos', icon: <ContactsIcon />, path: '/contacts' },
    { text: 'Configurações', icon: <SettingsIcon />, path: '/settings' },
  ];

  // Debug apenas em desenvolvimento
  useEffect(() => {
    if (import.meta.env.MODE === 'development') {
      console.log('User permissions:', {
        user: user?.nome,
        email: user?.email,
        is_superuser: user?.is_superuser,
      });
    }
  }, [user]);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <AppBar 
        position="static" 
        sx={{ 
          position: 'relative',
          boxShadow: 'none',
          borderBottom: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}> {/* Alterado para space-between */}
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            DX Atendimento
          </Typography>
          {isMobile && ( // Botão de fechar apenas no mobile
            <IconButton
              onClick={handleDrawerToggle}
              sx={{ color: 'inherit' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={isMobile ? handleDrawerToggle : undefined}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <OnlineStatusManager />
      <TokenRefresher />
      <AppBar
        position="fixed"
        sx={{
          width: { xs: '100%', md: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)` },
          ml: { xs: 0, md: isDrawerOpen ? `${drawerWidth}px` : 0 },
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <IconButton color="inherit" onClick={toggleTheme}>
            <ThemeIcon />
          </IconButton>
          
          <IconButton
            onClick={handleProfileMenuOpen}
            size="small"
            sx={{ ml: 2 }}
            aria-controls="profile-menu"
            aria-haspopup="true"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.nome?.charAt(0) || 'U'}
            </Avatar>
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem>
              <ListItemIcon>
                <OnlineStatus isOnline={!!user?.is_online} showText={true} size="medium" />
              </ListItemIcon>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Perfil
            </MenuItem>
            <MenuItem onClick={() => setChangePasswordOpen(true)}>
              <ListItemIcon>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              Alterar Senha
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sair
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ 
          width: { xs: 0, md: isDrawerOpen ? drawerWidth : 0 },
          flexShrink: 0
        }}
        aria-label="menu items"
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'persistent'}
          open={isMobile ? mobileOpen : isDrawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Melhor desempenho em dispositivos móveis
          }}
          PaperProps={{
            sx: {
              width: { xs: '100%', md: drawerWidth }, // Drawer ocupa toda a tela em mobile
              borderRight: 'none',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              display: 'flex', // Adicionado display flex
              flexDirection: 'column', // Organiza os itens verticalmente
              '& .MuiListItemIcon-root': {
                color: 'inherit',
              },
              '& .MuiListItemButton-root': {
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '&.Mui-selected': {
                  bgcolor: 'primary.dark',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }
              },
            }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          bgcolor: 'background.default',
          color: 'background.default',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Toolbar /> {/* Espaçamento para o AppBar fixo */}
        <Box 
          sx={{ 
            flexGrow: 1,
            p: { xs: 1, sm: 2 },
            overflow: 'auto',
            width: '100%',
            display: 'flex',
            justifyContent: 'center', // Centraliza horizontalmente
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '1800px', // Largura máxima para o conteúdo
              height: '100%',
            }}
          >
            <Outlet />
          </Box>
        </Box>
        <NotificationProvider />
      </Box>
      <ChangePasswordDialog 
        open={changePasswordOpen} 
        onClose={() => setChangePasswordOpen(false)} 
      />
    </Box>
  );
};

export default MainLayout;