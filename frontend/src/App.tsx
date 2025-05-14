import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { AppRouter } from './routes';
import GlobalSnackbar from './components/shared/GlobalSnackbar';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
        <GlobalSnackbar />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
