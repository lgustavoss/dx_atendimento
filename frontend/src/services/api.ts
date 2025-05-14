import axios from 'axios';
import { addNotification } from '../store/slices/notificationSlice';
import { store } from '../store';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status, data, config } = error.response;

      // Não mostrar erro 404 para listagens
      if (status === 404 && config.method === 'get') {
        const isListEndpoint = [
          '/empresas/',
          '/grupos/',
          '/empresas',
          '/grupos',  // Adicionando endpoints sem barra
        ].includes(config.url);

        if (isListEndpoint) {
          return Promise.resolve({ data: [] });
        }
      }

      // Não mostrar erro de autenticação para requisições normais
      if (status === 401 && !config.url.includes('/login')) {
        const token = localStorage.getItem('token');
        if (!token) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }

      // Outros erros mostram notificação
      let message = 'Ocorreu um erro inesperado';
      switch (status) {
        case 403:
          message = 'Acesso negado: você não tem permissão para realizar esta ação.';
          break;
        case 404:
          message = 'O recurso solicitado não foi encontrado.';
          break;
        case 500:
          message = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        default:
          message = data?.message || message;
      }

      store.dispatch(
        addNotification({
          message,
          type: 'error',
        })
      );
    }
    return Promise.reject(error);
  }
);

export default api;