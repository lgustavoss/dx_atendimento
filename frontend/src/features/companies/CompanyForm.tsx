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
import { Company, CompanyCreate, CompanyUpdate } from './types';
import { createCompany, updateCompany } from './CompanyService';
import { getGrupos } from '../groups/GroupService';

// Definindo a interface para os grupos (simplificada)
interface Grupo {
  id: number;
  nome: string;
}

interface CompanyFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (company: Company) => void;
  company: Company | null;
}

const CompanyForm = ({ open, onClose, onSave, company }: CompanyFormProps) => {
  const [formData, setFormData] = useState<CompanyCreate | CompanyUpdate>({
    nome: '',
    cnpj: '',
    grupo_id: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [gruposLoading, setGruposLoading] = useState(false);

  // Carregar os grupos para o dropdown
  useEffect(() => {
    const fetchGrupos = async () => {
      setGruposLoading(true);
      try {
        const data = await getGrupos();
        setGrupos(data);
      } catch (err) {
        console.error('Erro ao carregar grupos:', err);
      } finally {
        setGruposLoading(false);
      }
    };

    if (open) {
      fetchGrupos();
    }
  }, [open]);

  // Inicializar o formulário quando abrir ou quando mudar a empresa sendo editada
  useEffect(() => {
    if (company) {
      setFormData({
        nome: company.nome,
        cnpj: company.cnpj,
        grupo_id: company.grupo_id,
      });
    } else {
      setFormData({
        nome: '',
        cnpj: '',
        grupo_id: undefined,
      });
    }
  }, [company, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let savedCompany;
      
      if (company) {
        savedCompany = await updateCompany(company.id, formData);
      } else {
        savedCompany = await createCompany(formData as CompanyCreate);
      }
      
      onSave(savedCompany);
    } catch (err: any) {
      console.error('Erro ao salvar empresa:', err);
      
      // Tratamento específico para erro 401
      if (err.response?.status === 401) {
        setError('Sua sessão expirou. Por favor, faça login novamente.');
      } else {
        setError(err.response?.data?.detail || 'Erro ao salvar empresa');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para formatar CNPJ (XX.XXX.XXX/XXXX-XX)
  const formatCNPJ = (value: string) => {
    // Remove todos os caracteres não numéricos
    const cnpj = value.replace(/\D/g, '');
    
    // Aplica a máscara do CNPJ
    return cnpj
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substr(0, 18);
  };

  // Manipulador para o campo de CNPJ com formatação
  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      cnpj: formatCNPJ(value),
    });
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{company ? 'Editar Empresa' : 'Nova Empresa'}</DialogTitle>
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
                placeholder="XX.XXX.XXX/XXXX-XX"
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
                  {grupos.map((grupo) => (
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