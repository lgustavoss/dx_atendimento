import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setAlert, setLoading } from './uiSlice';
import api from '../../services/api';

// Tipos baseados no backend
export interface Mensagem {
  id: number;
  conteudo: string;
  tipo: string;
  midia_url?: string;
  contato_id: number;
  atendente_id?: number;
  entrada: boolean;
  atendimento_id: number;
  created_at: string;
}

export interface Atendimento {
  id: number;
  status: 'aberto' | 'andamento' | 'fechado';
  contato_id: number;
  atendente_id?: number;
  created_at: string;
  updated_at?: string;
}

interface ChatState {
  mensagens: {
    [atendimentoId: number]: Mensagem[];
  };
  atendimentos: Atendimento[];
  selectedAtendimento: Atendimento | null;
  unreadCount: number;
}

const initialState: ChatState = {
  mensagens: {},
  atendimentos: [],
  selectedAtendimento: null,
  unreadCount: 0,
};

// Thunks para operações assíncronas
export const fetchAtendimentos = createAsyncThunk(
  'chat/fetchAtendimentos',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'fetchAtendimentos', value: true }));
      const response = await api.get('/atendimentos/');
      return response.data;
    } catch (error: any) {
      dispatch(setAlert({
        message: 'Não foi possível carregar os atendimentos',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'fetchAtendimentos', value: false }));
    }
  }
);

export const fetchMensagens = createAsyncThunk(
  'chat/fetchMensagens',
  async (atendimentoId: number, { dispatch }) => {
    try {
      dispatch(setLoading({ key: `fetchMensagens-${atendimentoId}`, value: true }));
      const response = await api.get(`/atendimentos/${atendimentoId}/mensagens/`);
      return { atendimentoId, mensagens: response.data };
    } catch (error: any) {
      dispatch(setAlert({
        message: 'Não foi possível carregar as mensagens',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: `fetchMensagens-${atendimentoId}`, value: false }));
    }
  }
);

export const enviarMensagem = createAsyncThunk(
  'chat/enviarMensagem',
  async ({ atendimentoId, mensagem }: { atendimentoId: number, mensagem: Omit<Mensagem, 'id' | 'created_at'> }, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'enviarMensagem', value: true }));
      const response = await api.post(`/atendimentos/${atendimentoId}/mensagens/`, mensagem);
      return response.data;
    } catch (error: any) {
      dispatch(setAlert({
        message: 'Não foi possível enviar a mensagem',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'enviarMensagem', value: false }));
    }
  }
);

// Slice para chat
const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedAtendimento: (state, action: PayloadAction<Atendimento | null>) => {
      state.selectedAtendimento = action.payload;
    },
    addMensagem: (state, action: PayloadAction<Mensagem>) => {
      const { atendimento_id } = action.payload;
      if (!state.mensagens[atendimento_id]) {
        state.mensagens[atendimento_id] = [];
      }
      state.mensagens[atendimento_id].push(action.payload);
      
      // Incrementar contador de não lidas se o atendimento não estiver selecionado
      if (!state.selectedAtendimento || state.selectedAtendimento.id !== atendimento_id) {
        state.unreadCount += 1;
      }
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAtendimentos.fulfilled, (state, action) => {
        state.atendimentos = action.payload;
      })
      .addCase(fetchMensagens.fulfilled, (state, action) => {
        const { atendimentoId, mensagens } = action.payload;
        state.mensagens[atendimentoId] = mensagens;
      })
      .addCase(enviarMensagem.fulfilled, (state, action) => {
        const mensagem = action.payload;
        const { atendimento_id } = mensagem;
        if (!state.mensagens[atendimento_id]) {
          state.mensagens[atendimento_id] = [];
        }
        state.mensagens[atendimento_id].push(mensagem);
      });
  },
});

export const { setSelectedAtendimento, addMensagem, resetUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;