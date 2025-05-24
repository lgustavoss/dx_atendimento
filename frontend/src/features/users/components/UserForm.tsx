import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { addUser, editUser } from '../../../store/slices/usersSlice';
import { User, UserCreate, UserUpdate } from '../types';
import { createUser, updateUser } from '../services/UserService';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (user: User) => void;
  user: User | null;
}

const UserForm = ({ open, onClose, onSave, user }: UserFormProps) => {
  const [formData, setFormData] = useState<UserCreate | UserUpdate>({
    nome: '',
    email: '',
    password: '',
    password_confirm: '',
    is_active: true,
    is_superuser: false,
  });

  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => 
    state.ui.loading.addUser || state.ui.loading.editUser);
  const error = useAppSelector((state) => 
    state.ui.alert.type === 'error' ? state.ui.alert.message : null);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        password: '', // Senha vazia para edição
        password_confirm: '', // Senha de confirmação vazia para edição
        is_active: user.is_active,
        is_superuser: user.is_superuser,
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        password: '',
        password_confirm: '',
        is_active: true,
        is_superuser: false,
      });
    }
  }, [user, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirm) {
      dispatch(setAlert({
        message: 'As senhas não conferem',
        type: 'error'
      }));
      return;
    }

    try {
      if (user) {
        if (!formData.password) {
          const { password, password_confirm, ...dataWithoutPassword } = formData;
          await dispatch(editUser({ id: user.id, data: dataWithoutPassword })).unwrap();
        } else {
          await dispatch(editUser({ id: user.id, data: formData })).unwrap();
        }
      } else {
        const { password_confirm, ...dataToSend } = formData;
        await dispatch(addUser(dataToSend as UserCreate)).unwrap();
      }
      onClose(); // Fecha o formulário após sucesso
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="nome"
                label="Nome"
                value={formData.nome}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="password"
                label={user ? "Nova Senha (deixe em branco para manter)" : "Senha"}
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required={!user}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="password_confirm"
                label="Confirmação de Senha"
                type="password"
                value={formData.password_confirm}
                onChange={handleChange}
                fullWidth
                required={!user}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_active}
                    onChange={handleChange}
                    name="is_active"
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Usuário Ativo"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.is_superuser}
                    onChange={handleChange}
                    name="is_superuser"
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Administrador"
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserForm;