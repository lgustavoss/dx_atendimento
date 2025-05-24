import { Box, Paper, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

const PageContainer = ({ children, title }: PageContainerProps) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        width: '100%',
        minHeight: 'calc(100vh - 64px)', 
        p: { xs: 2, sm: 3 },
        bgcolor: 'background.default',
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: {
            xs: '100%',     // < 600px - Tela toda
            sm: '800px',    // >= 600px
            md: '1100px',   // >= 900px
            lg: '1400px',   // >= 1200px
            xl: '1600px',   // >= 1536px
          },
          flex: '0 1 auto',
          transition: 'width 0.3s ease',
        }}
      >
        <Paper
          sx={{
            width: '100%',
            p: { xs: 2, sm: 3 },
            borderRadius: 2,
            bgcolor: 'transparent',
            backdropFilter: 'blur(8px)',
            background: (theme) => 
              `linear-gradient(145deg, 
                ${theme.palette.background.paper}dd, 
                ${theme.palette.background.paper}ff)`,
            boxShadow: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: (theme) => theme.shadows[4],
            }
          }}
          elevation={0}
        >
          {title && (
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                mb: 3,
                fontWeight: 'bold',
                color: 'text.primary'
              }}
            >
              {title}
            </Typography>
          )}
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default PageContainer;