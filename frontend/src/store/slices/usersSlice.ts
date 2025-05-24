import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setLoading, setAlert } from './uiSlice';
import * as userService from '../../features/users/services/userService';
import { User, UserCreate, UserUpdate } from '../../features/users/types';

// Interface para o payload de atualização de status
interface UpdateUserStatusPayload {
  userId: number;
  isOnline: boolean;
  lastActivity: string;
}

// Thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'fetchUsers', value: true }));
      const data = await userService.getUsers();
      return data;
    } catch (error: any) {
      dispatch(setAlert({
        message: 'Não foi possível carregar os usuários',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'fetchUsers', value: false }));
    }
  }
);

export const addUser = createAsyncThunk(
  'users/addUser',
  async (user: UserCreate, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'addUser', value: true }));
      const data = await userService.createUser(user);
      dispatch(setAlert({
        message: 'Usuário criado com sucesso',
        type: 'success',
      }));
      return data;
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao criar usuário',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'addUser', value: false }));
    }
  }
);

export const editUser = createAsyncThunk(
  'users/editUser',
  async ({ id, data }: { id: number; data: UserUpdate }, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'editUser', value: true }));
      const updated = await userService.updateUser(id, data);
      dispatch(setAlert({
        message: 'Usuário atualizado com sucesso',
        type: 'success',
      }));
      return updated;
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao atualizar usuário',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'editUser', value: false }));
    }
  }
);

export const removeUser = createAsyncThunk(
  'users/removeUser',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'removeUser', value: true }));
      await userService.deleteUser(id);
      dispatch(setAlert({
        message: 'Usuário removido com sucesso',
        type: 'success',
      }));
      return id;
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao remover usuário',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'removeUser', value: false }));
    }
  }
);

// Slice
const initialState = {
  list: [] as User[],
  selected: null as User | null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selected = action.payload;
    },
    updateUserStatus: (state, action) => {
      const { userId, isOnline, lastActivity } = action.payload;
      const user = state.list.find(u => u.id === userId);
      if (user) {
        user.is_online = isOnline;
        user.last_activity = lastActivity;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.list.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.list = state.list.filter(user => user.id !== action.payload);
      });
  }
});

export const { setSelectedUser, updateUserStatus } = usersSlice.actions;
export default usersSlice.reducer;