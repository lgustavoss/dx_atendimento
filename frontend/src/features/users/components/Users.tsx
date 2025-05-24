import { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Tooltip, 
  Chip,
  Snackbar,
  Alert,
  Typography 
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DataTable from '../../../features/admin/components/DataTable';
import DeleteDialog from '../../../features/admin/components/DeleteDialog';
import UserForm from './UserForm';
import { User } from '../types';
import AuditInfo from '../../../features/admin/components/AuditInfo';
import PageContainer from '../../../components/layout/PageContainer';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { fetchUsers, removeUser, setSelectedUser } from '../../../store/slices/usersSlice';
import { clearAlert } from '../../../store/slices/uiSlice';
import OnlineStatus from '../../../features/online-status/components/OnlineStatus';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Users = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [auditInfoOpen, setAuditInfoOpen] = useState(false);

  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.list);
  const selectedUser = useAppSelector((state) => state.users.selected);
  const { message: alertMessage, type: alertType } = useAppSelector((state) => state.ui.alert);
  const loading = useAppSelector((state) => state.ui.loading.fetchUsers);
  const deleteLoading = useAppSelector((state) => state.ui.loading.removeUser);

  // Definição das colunas movida para dentro do componente
  const columns = [
    { id: 'id', label: 'ID', minWidth: 50, align: 'center' },
    { id: 'nome', label: 'Nome', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 170 },
    { 
      id: 'is_active', 
      label: 'Ativo', 
      minWidth: 100,
      align: 'center',
      format: (value: boolean, row: User) => (
        <Chip 
          label={value ? 'Ativo' : 'Inativo'}
          color={value ? 'success' : 'default'}
          size="small"
          sx={{ minWidth: 80 }}
        />
      )
    },
    { 
      id: 'is_online', 
      label: 'Status', 
      minWidth: 120,
      align: 'center',
      format: (value: boolean, row: any) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <FiberManualRecordIcon 
            sx={{ 
              color: value ? 'success.main' : 'text.disabled',
              fontSize: '12px'
            }} 
          />
          <Typography variant="body2">
            {value ? 'Online' : row.last_activity ? `Visto por último ${
              formatDistance(new Date(row.last_activity), new Date(), {
                addSuffix: true,
                locale: ptBR
            })
          }` : 'Offline'}
          </Typography>
        </Box>
      )
    }
  ];

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Adicione este useEffect para debug
  useEffect(() => {
    if (users.length > 0) {
      console.log('Dados dos usuários:', users);
      console.log('Exemplo de usuário:', users[0]);
      console.log('is_active:', users[0].is_active);
      console.log('is_online:', users[0].is_online);
    }
  }, [users]);

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

  const handleShowAuditInfo = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      dispatch(setSelectedUser(user));
      setAuditInfoOpen(true);
    }
  };

  const renderActionButtons = (id: number) => (
    <Tooltip title="Informações de Auditoria">
      <IconButton onClick={() => handleShowAuditInfo(id)}>
        <InfoIcon />
      </IconButton>
    </Tooltip>
  );

  return (
    <PageContainer title="Usuários">
      <DataTable 
        columns={columns}
        data={users}
        loading={loading}
        searchField="nome"
        onAdd={() => {
          dispatch(setSelectedUser(null));
          setFormOpen(true);
        }}
        onEdit={(id) => {
          const user = users.find(u => u.id === id);
          if (user) {
            dispatch(setSelectedUser(user));
            setFormOpen(true);
          }
        }}
        onDelete={(id) => {
          setUserToDelete(id);
          setDeleteDialogOpen(true);
        }}
        renderCustomActions={(id) => (
          <Tooltip title="Informações de Auditoria">
            <IconButton onClick={() => handleShowAuditInfo(id)}>
              <InfoIcon color="info" />
            </IconButton>
          </Tooltip>
        )}
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

      {selectedUser && (
        <AuditInfo
          open={auditInfoOpen}
          onClose={() => setAuditInfoOpen(false)}
          createdAt={selectedUser.created_at}
          updatedAt={selectedUser.updated_at}
          createdBy={selectedUser.usuario_cadastro}
          updatedBy={selectedUser.usuario_alteracao}
        />
      )}

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
    </PageContainer>
  );
};

export default Users;