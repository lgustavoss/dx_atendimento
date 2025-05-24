import api from '../../../services/api';

export const OnlineStatusService = {
  updateStatus: async (status: boolean) => {
    try {
      const response = await api.put('/users/me/status', { is_online: status });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  }
};

export default OnlineStatusService;