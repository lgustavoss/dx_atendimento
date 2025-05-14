import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AlertState {
  message: string | null;
  type: 'success' | 'error' | 'info' | 'warning' | null;
}

interface LoadingState {
  [key: string]: boolean;
}

interface UIState {
  alert: AlertState;
  loading: LoadingState;
}

const initialState: UIState = {
  alert: { message: null, type: null },
  loading: {},
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<AlertState>) {
      state.alert = action.payload;
    },
    clearAlert(state) {
      state.alert = { message: null, type: null };
    },
    setLoading(state, action: PayloadAction<{ key: string; value: boolean }>) {
      state.loading[action.payload.key] = action.payload.value;
    },
  },
});

export const { setAlert, clearAlert, setLoading } = uiSlice.actions;
export default uiSlice.reducer;