import api from '../../../services/api';
import { Group, GroupCreate, GroupUpdate } from '../types';

// Obter lista de grupos
export const getGrupos = async (): Promise<Group[]> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token não encontrado');
    }
    
    const response = await api.get('/grupos/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar grupos:', error);
    throw error;
  }
};

// Criar um novo grupo
export const createGrupo = async (data: GroupCreate): Promise<Group> => {
  const response = await api.post('/groups', data);
  return response.data;
};

// Atualizar um grupo existente
export const updateGrupo = async (id: number, data: GroupUpdate): Promise<Group> => {
  const response = await api.put(`/groups/${id}`, data);
  return response.data;
};

// Deletar um grupo
export const deleteGrupo = async (id: number): Promise<void> => {
  await api.delete(`/groups/${id}`);
};