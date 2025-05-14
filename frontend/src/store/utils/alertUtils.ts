import { setAlert } from '../slices/uiSlice';

export const showAlert = (dispatch: any, message: string, type: 'success' | 'error' | 'info' | 'warning') => {
  dispatch(setAlert({ message, type }));
};