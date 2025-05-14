// src/components/shared/GlobalSnackbar.tsx
import { Snackbar, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../hooks/store';
import { clearAlert } from '../../store/slices/uiSlice';

const GlobalSnackbar = () => {
  const dispatch = useAppDispatch();
  const { message, type } = useAppSelector((state) => state.ui.alert);

  const handleClose = () => {
    dispatch(clearAlert());
  };

  return (
    <Snackbar open={!!message} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type || 'info'}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalSnackbar;