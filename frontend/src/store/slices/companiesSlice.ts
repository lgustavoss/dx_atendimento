import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setAlert, setLoading } from "./uiSlice";
import { 
  getCompanies, 
  createCompany, 
  updateCompany, 
  deleteCompany 
} from "../../features/companies/services/CompanyService";
import { Company, CompanyCreate, CompanyUpdate } from "../../features/companies/types";

interface CompaniesState {
  list: Company[];
  selected: Company | null;
}

const initialState: CompaniesState = {
  list: [],
  selected: null,
};

// Thunks para operações assíncronas
export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'fetchCompanies', value: true }));
      const data = await getCompanies();
      return data;
    } catch (error: any) {
      dispatch(setAlert({
        message: 'Não foi possível carregar as empresas',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'fetchCompanies', value: false }));
    }
  }
);

export const addCompany = createAsyncThunk(
  'companies/addCompany',
  async (company: CompanyCreate, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'addCompany', value: true }));
      const data = await createCompany(company);
      dispatch(setAlert({
        message: 'Empresa criada com sucesso',
        type: 'success',
      }));
      return data;
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao criar empresa',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'addCompany', value: false }));
    }
  }
);

export const editCompany = createAsyncThunk(
  'companies/editCompany',
  async ({ id, data }: { id: number; data: CompanyUpdate }, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'editCompany', value: true }));
      const updated = await updateCompany(id, data);
      dispatch(setAlert({
        message: 'Empresa atualizada com sucesso',
        type: 'success',
      }));
      return updated;
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao atualizar empresa',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'editCompany', value: false }));
    }
  }
);

export const removeCompany = createAsyncThunk(
  'companies/removeCompany',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'removeCompany', value: true }));
      await deleteCompany(id);
      dispatch(setAlert({
        message: 'Empresa removida com sucesso',
        type: 'success',
      }));
      return id;
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao remover empresa',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'removeCompany', value: false }));
    }
  }
);

// Slice para empresas
const companiesSlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setSelectedCompany: (state, action: PayloadAction<Company | null>) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addCompany.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editCompany.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(removeCompany.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setSelectedCompany } = companiesSlice.actions;
export default companiesSlice.reducer;