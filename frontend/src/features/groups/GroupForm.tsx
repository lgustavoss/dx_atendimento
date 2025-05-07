import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Group, GroupCreate, GroupUpdate } from './types';
import { createGrupo, updateGrupo } from './GroupService';

interface GroupFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (group: Group) => void;
  group: Group | null;
}

const GroupForm = ({ open, onClose, onSave, group }: GroupFormProps) => {
  const [formData, setFormData] = useState<GroupCreate | GroupUpdate>({
    nome: '',
    descricao: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (group) {
      setFormData({
        nome: group.nome,
        descricao: group.descricao || '',
      });
    } else {
      setFormData({
        nome: '',
        descricao: '',
      });
    }
  }, [group, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let savedGroup;
      
      if (group) {
        savedGroup = await updateGrupo(group.id, formData);
      } else {
        savedGroup = await createGrupo(formData as GroupCreate);
      }
      
      onSave(savedGroup);
    } catch (err: any) {
      console.error('Erro ao salvar grupo:', err);
      
      // Tratamento específico para erro 401
      if (err.response?.status === 401) {
        setError('Sua sessão expirou. Por favor, faça login novamente.');
      } else {
        setError(err.response?.data?.detail || 'Erro ao salvar grupo');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{group ? 'Editar Grupo' : 'Novo Grupo'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="nome"
                label="Nome do Grupo"
                value={formData.nome}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="descricao"
                label="Descrição"
                value={formData.descricao}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
                disabled={loading}
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

export default GroupForm;