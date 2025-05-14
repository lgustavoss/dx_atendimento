import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setAlert, setLoading } from "./uiSlice";
import { 
  getContacts, 
  createContact, 
  updateContact, 
  deleteContact 
} from "../../features/contacts/services/ContactService";
import { Contact, ContactCreate, ContactUpdate } from "../../features/contacts/types";

interface ContactsState {
  list: Contact[];
  selected: Contact | null;
}

const initialState: ContactsState = {
  list: [],
  selected: null,
};

// Thunks para operações assíncronas
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'fetchContacts', value: true }));
      const data = await getContacts();
      return data;
    } catch (error: any) {
      dispatch(setAlert({
        message: 'Não foi possível carregar os contatos',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'fetchContacts', value: false }));
    }
  }
);

export const addContact = createAsyncThunk(
  'contacts/addContact',
  async (contact: ContactCreate, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'addContact', value: true }));
      const data = await createContact(contact);
      dispatch(setAlert({
        message: 'Contato criado com sucesso',
        type: 'success',
      }));
      return data;
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao criar contato',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'addContact', value: false }));
    }
  }
);

export const editContact = createAsyncThunk(
  'contacts/editContact',
  async ({ id, data }: { id: number; data: ContactUpdate }, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'editContact', value: true }));
      const updated = await updateContact(id, data);
      dispatch(setAlert({
        message: 'Contato atualizado com sucesso',
        type: 'success',
      }));
      return updated;
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao atualizar contato',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'editContact', value: false }));
    }
  }
);

export const removeContact = createAsyncThunk(
  'contacts/removeContact',
  async (id: number, { dispatch }) => {
    try {
      dispatch(setLoading({ key: 'removeContact', value: true }));
      await deleteContact(id);
      dispatch(setAlert({
        message: 'Contato removido com sucesso',
        type: 'success',
      }));
      return id;
    } catch (error: any) {
      dispatch(setAlert({
        message: error.response?.data?.detail || 'Erro ao remover contato',
        type: 'error',
      }));
      throw error;
    } finally {
      dispatch(setLoading({ key: 'removeContact', value: false }));
    }
  }
);

// Slice para contatos
const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSelectedContact: (state, action: PayloadAction<Contact | null>) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editContact.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(removeContact.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setSelectedContact } = contactsSlice.actions;
export default contactsSlice.reducer;