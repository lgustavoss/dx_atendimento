import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import DataTable from '../../../features/admin/components/DataTable';
import DeleteDialog from '../../../features/admin/components/DeleteDialog';
import UserForm from './UserForm';
import { User } from '../types';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { fetchUsers, removeUser, setSelectedUser } from '../../../store/slices/usersSlice';
import { clearAlert } from '../../../store/slices/uiSlice';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'nome', label: 'Nome', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 170 },
  {
    id: 'is_active',
    label: 'Ativo',
    minWidth: 100,
    format: (value: boolean) => (value ? 'Sim' : 'Não'),
  },
  {
    id: 'is_superuser',
    label: 'Admin',
    minWidth: 100,
    format: (value: boolean) => (value ? 'Sim' : 'Não'),
  },
  {
    id: 'created_at',
    label: 'Criado em',
    minWidth: 170,
    format: (value: string) => new Date(value).toLocaleDateString('pt-BR'),
  },
];

const Users = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.list);
  const selectedUser = useAppSelector((state) => state.users.selected);
  const { message: alertMessage, type: alertType } = useAppSelector((state) => state.ui.alert);
  const loading = useAppSelector((state) => state.ui.loading.fetchUsers);
  const deleteLoading = useAppSelector((state) => state.ui.loading.removeUser);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddUser = () => {
    dispatch(setSelectedUser(null));
    setFormOpen(true);
  };

  const handleEditUser = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      dispatch(setSelectedUser(user));
      setFormOpen(true);
    }
  };

  const handleDeleteUser = (id: number) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete !== null) {
      try {
        await dispatch(removeUser(userToDelete)).unwrap();
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
      }
    }
  };

  const handleCloseAlert = () => {
    dispatch(clearAlert());
  };

  return (
    <Box sx={{ width: '100%' }}>
      <DataTable
        columns={columns}
        data={users}
        title="Usuários"
        onAdd={handleAddUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        searchField="nome"
        loading={loading}
      />

      <UserForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        user={selectedUser}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        title="Excluir Usuário"
        message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteUser}
        loading={deleteLoading}
      />

      {alertMessage && (
        <Snackbar 
          open={!!alertMessage} 
          autoHideDuration={6000} 
          onClose={handleCloseAlert}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseAlert} 
            severity={alertType || 'info'} 
            variant="filled"
            elevation={6}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default Users;