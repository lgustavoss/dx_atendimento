import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { setLoading } from './uiSlice';
import api from '../../services/api';

interface DashboardState {
  stats: {
    usuarios: number;
    empresas: number;
    grupos: number;
    chats: number;
  };
}

const initialState: DashboardState = {
  stats: {
    usuarios: 0,
    empresas: 0,
    grupos: 0,
    chats: 0
  }
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'fetchDashboardStats', value: true }));
      
      const [usuarios, empresas, grupos, atendimentos] = await Promise.all([
        api.get('/users/').then(res => res.data.length),
        api.get('/empresas/').then(res => res.data.length),
        api.get('/grupos/').then(res => res.data.length),
        api.get('/atendimentos/count').then(res => res.data)
      ]);
      
      return {
        usuarios,
        empresas,
        grupos,
        chats: atendimentos
      };
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      throw error;
    } finally {
      dispatch(setLoading({ key: 'fetchDashboardStats', value: false }));
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
      state.stats = action.payload;
    });
  }
});

export default dashboardSlice.reducer;