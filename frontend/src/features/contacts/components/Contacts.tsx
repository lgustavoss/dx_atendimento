import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DataTable from '../../../features/admin/components/DataTable';
import DeleteDialog from '../../../features/admin/components/DeleteDialog';
import ContactForm from './ContactForm';
import { Contact } from '../types';
import AuditInfo from '../../../features/admin/components/AuditInfo';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { 
  fetchContacts, 
  removeContact, 
  setSelectedContact 
} from '../../../store/slices/contactsSlice';
import { clearAlert } from '../../../store/slices/uiSlice';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'nome', label: 'Nome', minWidth: 170 },
  { id: 'telefone', label: 'Telefone', minWidth: 150 },
  { 
    id: 'empresa', 
    label: 'Empresa', 
    minWidth: 150,
    format: (value: any) => value?.nome || '-'
  }
];

const Contacts = () => {
  // Estados locais para diálogos
  const [openForm, setOpenForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const [auditInfoOpen, setAuditInfoOpen] = useState(false);
  
  // Redux state e dispatch
  const dispatch = useAppDispatch();
  const contacts = useAppSelector((state) => state.contacts.list);
  const selectedContact = useAppSelector((state) => state.contacts.selected);
  const { message: alertMessage, type: alertType } = useAppSelector((state) => state.ui.alert);
  const loading = useAppSelector((state) => state.ui.loading.fetchContacts);
  const deleteLoading = useAppSelector((state) => state.ui.loading.removeContact);

  // Carregar contatos ao montar o componente
  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  // Handlers
  const handleAddContact = () => {
    dispatch(setSelectedContact(null));
    setOpenForm(true);
  };

  const handleEditContact = (id: number) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      dispatch(setSelectedContact(contact));
      setOpenForm(true);
    }
  };

  const handleDeleteContact = (id: number) => {
    setContactToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (contactToDelete !== null) {
      await dispatch(removeContact(contactToDelete));
      setDeleteDialogOpen(false);
      setContactToDelete(null);
    }
  };

  const handleCloseAlert = () => {
    dispatch(clearAlert());
  };

  const handleContactFormClose = () => {
    setOpenForm(false);
    dispatch(setSelectedContact(null));
  };

  // Auditoria
  const handleShowAuditInfo = (id: number) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      dispatch(setSelectedContact(contact));
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
        data={contacts}
        title="Contatos"
        onAdd={handleAddContact}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
        searchField="nome"
        renderCustomActions={renderActionButtons}
      />

      <ContactForm
        open={openForm}
        onClose={handleContactFormClose}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        title="Excluir Contato"
        message="Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita."
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteContact}
        loading={deleteLoading}
      />

      {selectedContact && (
        <AuditInfo
          open={auditInfoOpen}
          onClose={() => setAuditInfoOpen(false)}
          createdAt={selectedContact.created_at}
          updatedAt={selectedContact.updated_at}
          createdBy={selectedContact.usuario_cadastro}
          updatedBy={selectedContact.usuario_alteracao}
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

export default Contacts;