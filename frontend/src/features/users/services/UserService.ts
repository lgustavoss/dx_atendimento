import api from '../../../services/api';
import { User, UserCreate, UserUpdate } from '../types';

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users/');
  return response.data;
};

export const getUser = async (id: number): Promise<User> => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: UserCreate): Promise<User> => {
  const response = await api.post('/users', data);
  return response.data;
};

export const updateUser = async (id: number, data: UserUpdate): Promise<User> => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};