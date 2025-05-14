import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setAlert, setLoading } from './uiSlice';
import { getGrupos, createGrupo, updateGrupo, deleteGrupo } from "../../features/groups/services/GroupService";
import { Group, GroupCreate, GroupUpdate } from '../../features/groups/types';


interface GroupsState {
  list: Group[];
  selected: Group | null;
}

const initialState: GroupsState = {
  list: [],
  selected: null,
};

// Thunks para operações assíncronas
export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'fetchGroups', value: true }));
      const data = await getGrupos();
      return data;
    } catch (error: any) {
      dispatch(setAlert({
        message: 'Não foi possível carregar os grupos',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'fetchGroups', value: false }));
    }
  }
);

export const addGroup = createAsyncThunk(
  'groups/addGroup',
  async (group: GroupCreate, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'addGroup', value: true }));
      const data = await createGrupo(group);
      dispatch(setAlert({
        message: 'Grupo criado com sucesso',
        type: 'success',
      }));
      return data;
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao criar grupo',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'addGroup', value: false }));
    }
  }
);

export const editGroup = createAsyncThunk(
  'groups/editGroup',
  async ({ id, data }: { id: number; data: GroupUpdate }, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'editGroup', value: true }));
      const updated = await updateGrupo(id, data);
      dispatch(setAlert({
        message: 'Grupo atualizado com sucesso',
        type: 'success',
      }));
      return updated;
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao atualizar grupo',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'editGroup', value: false }));
    }
  }
);

export const removeGroup = createAsyncThunk(
  'groups/removeGroup',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'removeGroup', value: true }));
      await deleteGrupo(id);
      dispatch(setAlert({
        message: 'Grupo removido com sucesso',
        type: 'success',
      }));
      return id;
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao remover grupo',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'removeGroup', value: false }));
    }
  }
);

// Slice para grupos
const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setSelectedGroup: (state, action: PayloadAction<Group | null>) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addGroup.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editGroup.fulfilled, (state, action) => {
        const index = state.list.findIndex((g) => g.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(removeGroup.fulfilled, (state, action) => {
        state.list = state.list.filter((g) => g.id !== action.payload);
      });
  },
});

export const { setSelectedGroup } = groupsSlice.actions;
export default groupsSlice.reducer;