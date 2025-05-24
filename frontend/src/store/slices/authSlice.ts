import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login, logout as logoutService, getCurrentUser as getCurrentUserService, changePassword as changePasswordService } from '../../features/auth/services/authService';
import { setLoading, setAlert } from './uiSlice';
import { ChangePasswordRequest } from '../../features/users/types';

// Thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'login', value: true }));
      const data = await login(credentials);
      return data;
    } catch (error: any) {
      dispatch(setAlert({
        type: 'error',
        message: error.response?.data?.detail || 'Erro ao fazer login'
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'login', value: false }));
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'fetchCurrentUser', value: true }));
      const data = await getCurrentUserService();
      return data;
    } catch (error) {
      throw error;
    } finally {
      dispatch(setLoading({ key: 'fetchCurrentUser', value: false }));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await logoutService();
      dispatch(logout());
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (data: ChangePasswordRequest, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'changePassword', value: true }));
      await changePasswordService(data);
      dispatch(setAlert({
        message: 'Senha alterada com sucesso',
        type: 'success'
      }));
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao alterar senha',
        type: 'error'
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'changePassword', value: false }));
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('access_token'),
    isAuthenticated: !!localStorage.getItem('access_token')
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        const { access, user } = action.payload;
        state.token = access;
        state.user = user;
        state.isAuthenticated = true;
        localStorage.setItem('access_token', access);
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;