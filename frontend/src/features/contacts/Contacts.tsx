import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DataTable from '../../components/admin/DataTable';
import DeleteDialog from '../../components/admin/DeleteDialog';
import ContactForm from './ContactForm';
import { getContacts, deleteContact } from './ContactService';
import { Contact } from './types';
import AuditInfo from '../../components/admin/AuditInfo';

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
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Estados para o diálogo de informações de auditoria
  const [auditInfoOpen, setAuditInfoOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch (err) {
      setError('Não foi possível carregar os contatos');
      console.error('Erro ao carregar contatos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAddContact = () => {
    setEditingContact(null);
    setOpenForm(true);
  };

  const handleEditContact = (id: number) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      setEditingContact(contact);
      setOpenForm(true);
    }
  };

  const handleDeleteContact = (id: number) => {
    setContactToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (contactToDelete !== null) {
      try {
        setDeleteLoading(true);
        await deleteContact(contactToDelete);
        setContacts(contacts.filter((contact) => contact.id !== contactToDelete));
        setSuccess('Contato excluído com sucesso');
      } catch (err) {
        setError('Erro ao excluir contato');
        console.error(err);
      } finally {
        setDeleteLoading(false);
        setDeleteDialogOpen(false);
        setContactToDelete(null);
      }
    }
  };

  const handleContactSaved = (contact: Contact) => {
    if (editingContact) {
      setContacts(contacts.map((c) => (c.id === contact.id ? contact : c)));
      setSuccess('Contato atualizado com sucesso');
    } else {
      setContacts([...contacts, contact]);
      setSuccess('Contato criado com sucesso');
    }
    setOpenForm(false);
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  // Função para mostrar informações de auditoria
  const handleShowAuditInfo = (id: number) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      setSelectedContact(contact);
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
        onClose={() => setOpenForm(false)}
        onSave={handleContactSaved}
        contact={editingContact}
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

export default Contacts;