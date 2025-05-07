import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DataTable from '../../components/admin/DataTable';
import DeleteDialog from '../../components/admin/DeleteDialog';
import CompanyForm from './CompanyForm';
import { getCompanies, deleteCompany } from './CompanyService';
import { Company } from './types';
import AuditInfo from '../../components/admin/AuditInfo';

// Removida a coluna "Criado em" e também a coluna "Auditoria"
const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'nome', label: 'Nome', minWidth: 170 },
  { id: 'cnpj', label: 'CNPJ', minWidth: 150 }
];

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Novos estados para o diálogo de informações de auditoria
  const [auditInfoOpen, setAuditInfoOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getCompanies();
      setCompanies(data);
    } catch (err) {
      setError('Não foi possível carregar as empresas');
      console.error('Erro ao carregar empresas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleAddCompany = () => {
    setEditingCompany(null);
    setOpenForm(true);
  };

  const handleEditCompany = (id: number) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      setEditingCompany(company);
      setOpenForm(true);
    }
  };

  const handleDeleteCompany = (id: number) => {
    setCompanyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCompany = async () => {
    if (companyToDelete !== null) {
      try {
        setDeleteLoading(true);
        await deleteCompany(companyToDelete);
        setCompanies(companies.filter((company) => company.id !== companyToDelete));
        setSuccess('Empresa excluída com sucesso');
      } catch (err) {
        setError('Erro ao excluir empresa');
        console.error(err);
      } finally {
        setDeleteLoading(false);
        setDeleteDialogOpen(false);
        setCompanyToDelete(null);
      }
    }
  };

  const handleCompanySaved = (company: Company) => {
    if (editingCompany) {
      setCompanies(companies.map((c) => (c.id === company.id ? company : c)));
      setSuccess('Empresa atualizada com sucesso');
    } else {
      setCompanies([...companies, company]);
      setSuccess('Empresa criada com sucesso');
    }
    setOpenForm(false);
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  // Nova função para mostrar informações de auditoria
  const handleShowAuditInfo = (id: number) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      setSelectedCompany(company);
      setAuditInfoOpen(true);
    }
  };

  // Função que renderiza os botões de ação personalizados
  const renderActionButtons = (id: number) => (
    <>
      <Tooltip title="Informações de Auditoria">
        <IconButton onClick={() => handleShowAuditInfo(id)}>
          <InfoIcon color="info" />
        </IconButton>
      </Tooltip>
    </>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <DataTable
        columns={columns}
        data={companies}
        title="Empresas"
        onAdd={handleAddCompany}
        onEdit={handleEditCompany}
        onDelete={handleDeleteCompany}
        searchField="nome"
        renderCustomActions={renderActionButtons}
      />

      <CompanyForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleCompanySaved}
        company={editingCompany}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        title="Excluir Empresa"
        message="Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita."
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteCompany}
        loading={deleteLoading}
      />

      {selectedCompany && (
        <AuditInfo
          open={auditInfoOpen}
          onClose={() => setAuditInfoOpen(false)}
          createdAt={selectedCompany.created_at}
          updatedAt={selectedCompany.updated_at}
          createdBy={selectedCompany.usuario_cadastro}
          updatedBy={selectedCompany.usuario_alteracao}
        />
      )}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="error">
          {error}
        </Alert>
      </Snackbar>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity="success">
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Companies;