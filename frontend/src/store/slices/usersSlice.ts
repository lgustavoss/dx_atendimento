import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, UserCreate, UserUpdate } from '../../features/users/types';
import api from '../../services/api';
import { getUsers, deleteUser } from '../../features/users/services/UserService';
import { setLoading, setAlert } from './uiSlice';

interface UsersState {
  list: User[];
  selected: User | null;
}

const initialState: UsersState = {
  list: [],
  selected: null,
};

// Thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'fetchUsers', value: true }));
      const data = await getUsers();
      return data;
    } catch (error: any) {
      dispatch(setAlert({
        message: 'Não foi possível carregar os usuários',
        type: 'error'
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'fetchUsers', value: false }));
    }
  }
);

export const addUser = createAsyncThunk('users/addUser', async (data: UserCreate) => {
  const response = await api.post('/users', data);
  return response.data;
});

export const editUser = createAsyncThunk('users/editUser', async ({ id, data }: { id: number; data: UserUpdate }) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
});

export const removeUser = createAsyncThunk('users/removeUser', async (id: number) => {
  await api.delete(`/users/${id}`);
  return id;
});

// Slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSelectedUser(state, action: PayloadAction<User | null>) {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.list = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editUser.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(removeUser.fulfilled, (state, action: PayloadAction<number>) => {
        state.list = state.list.filter((user) => user.id !== action.payload);
      });
  },
});

export const { setSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;