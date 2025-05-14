import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DataTable from '../../../features/admin/components/DataTable';
import DeleteDialog from '../../../features/admin/components/DeleteDialog';
import CompanyForm from './CompanyForm';
import { getCompanies, deleteCompany } from '../services/CompanyService';
import { Company } from '../types';
import AuditInfo from '../../../features/admin/components/AuditInfo';

import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { 
  fetchCompanies, 
  removeCompany, 
  setSelectedCompany 
} from '../../../store/slices/companiesSlice';
import { clearAlert } from '../../../store/slices/uiSlice';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'nome', label: 'Nome', minWidth: 170 },
  { id: 'cnpj', label: 'CNPJ', minWidth: 150 }
];

const Companies = () => {
  // Estados locais para diálogos
  const [openForm, setOpenForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<number | null>(null);
  const [auditInfoOpen, setAuditInfoOpen] = useState(false);
  
  // Redux state e dispatch
  const dispatch = useAppDispatch();
  const companies = useAppSelector((state) => state.companies.list);
  const selectedCompany = useAppSelector((state) => state.companies.selected);
  const { message: alertMessage, type: alertType } = useAppSelector((state) => state.ui.alert);
  const loading = useAppSelector((state) => state.ui.loading.fetchCompanies);
  const deleteLoading = useAppSelector((state) => state.ui.loading.removeCompany);

  // Carregar empresas ao montar o componente
  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  // Handlers
  const handleAddCompany = () => {
    dispatch(setSelectedCompany(null));
    setOpenForm(true);
  };

  const handleEditCompany = (id: number) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      dispatch(setSelectedCompany(company));
      setOpenForm(true);
    }
  };

  const handleDeleteCompany = (id: number) => {
    setCompanyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCompany = async () => {
    if (companyToDelete !== null) {
      await dispatch(removeCompany(companyToDelete));
      setDeleteDialogOpen(false);
      setCompanyToDelete(null);
    }
  };

  const handleCloseAlert = () => {
    dispatch(clearAlert());
  };

  const handleCompanyFormClose = () => {
    setOpenForm(false);
    dispatch(setSelectedCompany(null));
  };

  // Auditoria
  const handleShowAuditInfo = (id: number) => {
    const company = companies.find((c) => c.id === id);
    if (company) {
      dispatch(setSelectedCompany(company));
      setAuditInfoOpen(true);
    }
  };

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
        onClose={handleCompanyFormClose}
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

      <Snackbar open={!!alertMessage} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertType || 'info'}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Companies;