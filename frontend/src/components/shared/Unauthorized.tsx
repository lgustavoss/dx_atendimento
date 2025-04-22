import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        p: 3,
      }}
    >
      <Typography variant="h1" sx={{ color: 'error.main', fontSize: '5rem', fontWeight: 'bold' }}>
        403
      </Typography>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Acesso Negado
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
        Você não tem permissão para acessar esta página. Este recurso está disponível apenas para administradores.
      </Typography>
      <Button variant="contained" component={RouterLink} to="/">
        Voltar para a Dashboard
      </Button>
    </Box>
  );
};

export default Unauthorized;