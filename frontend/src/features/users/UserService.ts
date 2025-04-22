import api from '../../services/api';
import { User, UserCreate, UserUpdate } from './types';

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users/');
  return response.data;
};

export const getUser = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: UserCreate): Promise<User> => {
  const token = localStorage.getItem('token');
  const response = await api.post('/users/', user, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateUser = async (id: number, user: UserUpdate): Promise<User> => {
  const token = localStorage.getItem('token');
  const response = await api.put(`/users/${id}`, user, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  await api.delete(`/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};