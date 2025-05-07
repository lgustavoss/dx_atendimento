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
  MenuItem,
} from '@mui/material';
import { Contact, ContactCreate, ContactUpdate } from './types';
import { createContact, updateContact } from './ContactService';
import { getCompanies } from '../companies/CompanyService';
import { Company } from '../companies/types';

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  contact: Contact | null;
}

const ContactForm = ({ open, onClose, onSave, contact }: ContactFormProps) => {
  const [formData, setFormData] = useState<ContactCreate | ContactUpdate>({
    nome: '',
    telefone: '',
    empresa_id: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);

  // Carregar as empresas para o dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      setCompaniesLoading(true);
      try {
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        console.error('Erro ao carregar empresas:', err);
      } finally {
        setCompaniesLoading(false);
      }
    };

    if (open) {
      fetchCompanies();
    }
  }, [open]);

  // Inicializar o formulário quando abrir ou quando mudar o contato sendo editado
  useEffect(() => {
    if (contact) {
      setFormData({
        nome: contact.nome,
        telefone: contact.telefone,
        empresa_id: contact.empresa_id,
      });
    } else {
      setFormData({
        nome: '',
        telefone: '',
        empresa_id: null,
      });
    }
  }, [contact, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Função para formatar telefone (XX) XXXXX-XXXX
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

  // Manipulador para o campo de telefone com formatação
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      telefone: formatPhone(value),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let savedContact;
      
      if (contact) {
        savedContact = await updateContact(contact.id, formData);
      } else {
        savedContact = await createContact(formData as ContactCreate);
      }
      
      onSave(savedContact);
    } catch (err: any) {
      console.error('Erro ao salvar contato:', err);
      
      // Tratamento específico para erro 401
      if (err.response?.status === 401) {
        setError('Sua sessão expirou. Por favor, faça login novamente.');
      } else {
        setError(err.response?.data?.detail || 'Erro ao salvar contato');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{contact ? 'Editar Contato' : 'Novo Contato'}</DialogTitle>
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