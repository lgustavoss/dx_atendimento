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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { addCompany, editCompany } from '../../../store/slices/companiesSlice';
import { fetchGroups } from '../../../store/slices/groupsSlice';
import { CompanyCreate, CompanyUpdate } from './types';

interface CompanyFormProps {
  open: boolean;
  onClose: () => void;
}

const CompanyForm = ({ open, onClose }: CompanyFormProps) => {
  // Estados
  const [formData, setFormData] = useState<CompanyCreate | CompanyUpdate>({
    nome: '',
    cnpj: '',
    grupo_id: undefined,
  });

  // Redux
  const dispatch = useAppDispatch();
  const selectedCompany = useAppSelector((state) => state.companies.selected);
  const groups = useAppSelector((state) => state.groups.list);
  const loading = useAppSelector((state) => 
    state.ui.loading.addCompany || state.ui.loading.editCompany);
  const gruposLoading = useAppSelector((state) => state.ui.loading.fetchGroups);
  const error = useAppSelector((state) => 
    state.ui.alert.type === 'error' ? state.ui.alert.message : null);

  // Efeitos
  useEffect(() => {
    if (open) {
      dispatch(fetchGroups());
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (selectedCompany) {
      setFormData({
        nome: selectedCompany.nome,
        cnpj: selectedCompany.cnpj,
        grupo_id: selectedCompany.grupo_id,
      });
    } else {
      setFormData({
        nome: '',
        cnpj: '',
        grupo_id: undefined,
      });
    }
  }, [selectedCompany, open]);

  // Formatação de CNPJ: 00.000.000/0000-00
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.substring(0, 2)}.${numbers.substring(2)}`;
    } else if (numbers.length <= 8) {
      return `${numbers.substring(0, 2)}.${numbers.substring(2, 5)}.${numbers.substring(5)}`;
    } else if (numbers.length <= 12) {
      return `${numbers.substring(0, 2)}.${numbers.substring(2, 5)}.${numbers.substring(5, 8)}/${numbers.substring(8)}`;
    } else {
      return `${numbers.substring(0, 2)}.${numbers.substring(2, 5)}.${numbers.substring(5, 8)}/${numbers.substring(8, 12)}-${numbers.substring(12, 14)}`;
    }
  };

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      cnpj: formatCNPJ(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCompany) {
      await dispatch(editCompany({ id: selectedCompany.id, data: formData }));
    } else {
      await dispatch(addCompany(formData as CompanyCreate));
    }
    
    if (!error) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedCompany ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="nome"
                label="Nome da Empresa"
                value={formData.nome}
                onChange={handleChange}
                fullWidth
                required
                disabled={loading}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="cnpj"
                label="CNPJ"
                value={formData.cnpj}
                onChange={handleCNPJChange}
                fullWidth
                required
                disabled={loading}
                inputProps={{ maxLength: 18 }}
                placeholder="00.000.000/0000-00"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth disabled={loading || gruposLoading}>
                <InputLabel id="grupo-label">Grupo</InputLabel>
                <Select
                  labelId="grupo-label"
                  name="grupo_id"
                  value={formData.grupo_id || ''}
                  onChange={handleChange}
                  label="Grupo"
                >
                  <MenuItem value="">
                    <em>Nenhum</em>
                  </MenuItem>
                  {groups.map((grupo) => (
                    <MenuItem key={grupo.id} value={grupo.id}>
                      {grupo.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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

export default CompanyForm;