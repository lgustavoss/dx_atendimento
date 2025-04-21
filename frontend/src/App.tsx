import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider, useAuth } from './providers/AuthProvider';
import { AppRouter } from './routes';
import LoadingScreen from './components/shared/LoadingScreen';
import './App.css';

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen message="Inicializando aplicação..." />;
  }

  return <AppRouter />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
