import axios from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';
import { setAlert } from '../store/slices/uiSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Log para debug
console.log('API Base URL:', import.meta.env.VITE_API_URL);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
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
      const { status, config, data } = error.response;

      // Se for erro 401 e não for requisição de login
      if (status === 401 && !config.url.includes('login')) {
        store.dispatch(logout());
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Outros erros mostram notificação
      const message = data?.detail || data?.message || 'Ocorreu um erro inesperado';
      store.dispatch(setAlert({
        message: message,
        type: 'error'
      }));
    }
    return Promise.reject(error);
  }
);

export default api;