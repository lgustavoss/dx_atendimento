import api from '../../../services/api';
import { LoginCredentials, LoginResponse } from '../types';
import { ChangePasswordRequest } from '../../users/types';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  // Converte as credenciais para o formato que o backend espera
  const requestData = {
    email: credentials.email,
    password: credentials.password
  };

  const response = await api.post('/accounts/login/', requestData);

  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
    if (response.data.refresh) {
      localStorage.setItem('refresh_token', response.data.refresh);
    }
  }
  return response.data;
};

export const logout = async () => {
  try {
    await api.post('/accounts/logout/');
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const getCurrentUser = async () => {
  const response = await api.get('/accounts/me/');
  return response.data;
};

export const changePassword = async (data: ChangePasswordRequest) => {
  const response = await api.post('/accounts/change-password/', data);
  return response.data;
};