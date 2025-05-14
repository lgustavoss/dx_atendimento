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
import { addContact, editContact } from '../../../store/slices/contactsSlice';
import { fetchCompanies } from '../../../store/slices/companiesSlice';
import { ContactCreate, ContactUpdate } from './types';

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
}

const ContactForm = ({ open, onClose }: ContactFormProps) => {
  // Estados
  const [formData, setFormData] = useState<ContactCreate | ContactUpdate>({
    nome: '',
    telefone: '',
    empresa_id: null,
  });

  // Redux
  const dispatch = useAppDispatch();
  const selectedContact = useAppSelector((state) => state.contacts.selected);
  const companies = useAppSelector((state) => state.companies.list);
  const loading = useAppSelector((state) => 
    state.ui.loading.addContact || state.ui.loading.editContact);
  const companiesLoading = useAppSelector((state) => state.ui.loading.fetchCompanies);
  const error = useAppSelector((state) => 
    state.ui.alert.type === 'error' ? state.ui.alert.message : null);

  // Efeitos
  useEffect(() => {
    if (open) {
      dispatch(fetchCompanies());
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (selectedContact) {
      setFormData({
        nome: selectedContact.nome,
        telefone: selectedContact.telefone,
        empresa_id: selectedContact.empresa_id,
      });
    } else {
      setFormData({
        nome: '',
        telefone: '',
        empresa_id: null,
      });
    }
  }, [selectedContact, open]);

  // Formatação de telefone (XX) XXXXX-XXXX
  const formatPhone = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 7) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2)}`;
    } else {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(2, 7)}-${numbers.substring(7, 11)}`;
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      telefone: formatPhone(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedContact) {
      await dispatch(editContact({ id: selectedContact.id, data: formData }));
    } else {
      await dispatch(addContact(formData as ContactCreate));
    }
    
    if (!error) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedContact ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
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
                name="telefone"
                label="Telefone"
                value={formData.telefone}
                onChange={handlePhoneChange}
                fullWidth
                required
                disabled={loading}
                inputProps={{ maxLength: 16 }}
                placeholder="(99) 99999-9999"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth disabled={loading || companiesLoading}>
                <InputLabel id="empresa-label">Empresa</InputLabel>
                <Select
                  labelId="empresa-label"
                  name="empresa_id"
                  value={formData.empresa_id || ''}
                  onChange={handleChange}
                  label="Empresa"
                >
                  <MenuItem value="">
                    <em>Nenhuma</em>
                  </MenuItem>
                  {companies.map((company) => (
                    <MenuItem key={company.id} value={company.id}>
                      {company.nome}
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

export default ContactForm;