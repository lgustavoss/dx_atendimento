import { createTheme, ThemeOptions } from '@mui/material/styles';

// Definição das cores principais
const colors = {
  primary: {
    main: '#0088cc',
    light: '#35a6e1',
    dark: '#006b9f',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#25d366',
    light: '#51db87',
    dark: '#00a045',
    contrastText: '#ffffff',
  },
  error: {
    main: '#ff3b30',
    light: '#ff6259',
    dark: '#c30000',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ff9500',
    light: '#ffb133',
    dark: '#c66a00',
    contrastText: '#ffffff',
  },
  info: {
    main: '#007aff',
    light: '#3395ff',
    dark: '#0057cb',
    contrastText: '#ffffff',
  },
  success: {
    main: '#34c759',
    light: '#5dd27d',
    dark: '#009a29',
    contrastText: '#ffffff',
  },
  grey: {
    50: '#f2f2f7',
    100: '#e5e5ea',
    200: '#d1d1d6',
    300: '#c7c7cc',
    400: '#aeaeb2',
    500: '#8e8e93',
    600: '#636366',
    700: '#48484a',
    800: '#3a3a3c',
    900: '#1c1c1e',
  },
  background: {
    default: '#f2f2f7',
    paper: '#ffffff',
  },
  text: {
    primary: '#000000',
    secondary: '#3c3c43',
    disabled: '#c7c7cc',
  },
};

// Configurações do tema claro
const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    ...colors,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
};

// Tema escuro - podemos implementar depois
const darkThemeOptions: ThemeOptions = {
  ...lightThemeOptions,
  palette: {
    mode: 'dark',
    ...colors,
    background: {
      default: '#1c1c1e',
      paper: '#2c2c2e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#ebebf0',
      disabled: '#636366',
    },
  },
};

// Criação dos temas
export const lightTheme = createTheme(lightThemeOptions);
export const darkTheme = createTheme(darkThemeOptions);

export default lightTheme;