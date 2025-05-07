import api from '../../services/api';
import { Group, GroupCreate, GroupUpdate } from './types';

export const getGrupos = async (): Promise<Group[]> => {
  const response = await api.get('/grupos/');
  return response.data;
};

export const getGrupo = async (id: number): Promise<Group> => {
  const response = await api.get(`/grupos/${id}`);
  return response.data;
};

export const createGrupo = async (grupo: GroupCreate): Promise<Group> => {
  const response = await api.post('/grupos/', grupo);
  return response.data;
};

export const updateGrupo = async (id: number, grupo: GroupUpdate): Promise<Group> => {
  const response = await api.put(`/grupos/${id}`, grupo);
  return response.data;
};

export const deleteGrupo = async (id: number): Promise<void> => {
  await api.delete(`/grupos/${id}`);
};