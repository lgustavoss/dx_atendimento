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
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { addGroup, editGroup } from '../../../store/slices/groupsSlice';
import { GroupCreate, GroupUpdate } from './types';

interface GroupFormProps {
  open: boolean;
  onClose: () => void;
}

const GroupForm = ({ open, onClose }: GroupFormProps) => {
  // Estados
  const [formData, setFormData] = useState<GroupCreate | GroupUpdate>({
    nome: '',
    descricao: '',
  });

  // Redux
  const dispatch = useAppDispatch();
  const selectedGroup = useAppSelector((state) => state.groups.selected);
  const loading = useAppSelector((state) => 
    state.ui.loading.addGroup || state.ui.loading.editGroup);
  const error = useAppSelector((state) => 
    state.ui.alert.type === 'error' ? state.ui.alert.message : null);

  // Efeitos
  useEffect(() => {
    if (selectedGroup) {
      setFormData({
        nome: selectedGroup.nome,
        descricao: selectedGroup.descricao || '',
      });
    } else {
      setFormData({
        nome: '',
        descricao: '',
      });
    }
  }, [selectedGroup, open]);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedGroup) {
      await dispatch(editGroup({ id: selectedGroup.id, data: formData }));
    } else {
      await dispatch(addGroup(formData as GroupCreate));
    }
    
    if (!error) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedGroup ? 'Editar Grupo' : 'Novo Grupo'}</DialogTitle>
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
                rows={4}
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