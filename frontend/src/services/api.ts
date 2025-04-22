import axios from 'axios';

// Usar caminho relativo ao utilizar proxy
const API_URL = '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token a todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Garantir que o token seja aplicado a TODAS as requisições
      config.headers.Authorization = `Bearer ${token}`;
      // Configuração global do cabeçalho para manter entre navegações
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Remover para produção - usar apenas para debug
      console.log(`Requisição autenticada para: ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Verifica se é um erro 401 e se não estamos em uma operação em andamento
    if (error.response && error.response.status === 401) {
      // Verificar se esta requisição é uma operação de login
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      
      // Apenas redireciona se não for uma tentativa de login
      if (!isLoginRequest && !window.location.pathname.includes('/login')) {
        console.log('Token inválido/expirado, redirecionando para login');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;