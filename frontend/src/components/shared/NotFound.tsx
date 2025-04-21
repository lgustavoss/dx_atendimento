import { Box, Button, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFound = () => {
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
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main' }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Página não encontrada
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 500 }}>
        A página que você está procurando não existe ou foi removida.
      </Typography>
      <Button variant="contained" component={RouterLink} to="/">
        Voltar para a página inicial
      </Button>
    </Box>
  );
};

export default NotFound;