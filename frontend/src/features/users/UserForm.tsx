// src/features/users/UserForm.tsx
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
import { User, UserCreate, UserUpdate } from './types';
import { createUser, updateUser } from './UserService';

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
    is_active: true,
    is_superuser: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        is_active: user.is_active,
        is_superuser: user.is_superuser,
        password: '', // Senha vazia para edição
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        password: '',
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
    setLoading(true);
    setError(null);

    try {
      let savedUser;
      
      if (user && !formData.password) {
        const { password, ...dataWithoutPassword } = formData;
        savedUser = await updateUser(user.id, dataWithoutPassword);
      } else if (user) {
        savedUser = await updateUser(user.id, formData);
      } else {
        savedUser = await createUser(formData as UserCreate);
      }
      
      onSave(savedUser);
    } catch (err: any) {
      console.error('Erro ao salvar usuário:', err);
      
      // Tratamento específico para erro 401
      if (err.response?.status === 401) {
        setError('Sua sessão expirou. Por favor, faça login novamente.');
      } else {
        setError(err.response?.data?.detail || 'Erro ao salvar usuário');
      }
    } finally {
      setLoading(false);
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
                label={user ? "Senha (deixe em branco para manter)" : "Senha"}
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                required={!user}
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    disabled={loading}
                  />
                }
                label="Ativo"
              />
            </Grid>
            
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="is_superuser"
                    checked={formData.is_superuser}
                    onChange={handleChange}
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