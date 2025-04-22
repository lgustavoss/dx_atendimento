import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert } from '@mui/material';
import DataTable from '../../components/admin/DataTable';
import DeleteDialog from '../../components/admin/DeleteDialog';
import UserForm from './UserForm';
import { getUsers, deleteUser } from './UserService';
import { User } from './types';
import { useAuth } from '../../providers/AuthProvider';

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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { token } = useAuth();

  useEffect(() => {
    // Verificar se o token está presente ao montar o componente
    console.log('Users component - token present:', !!token);
  }, [token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Garantir que o token esteja presente na requisição
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        setError('Token de autenticação não encontrado');
        return;
      }
      
      // Requisição com token explícito no cabeçalho 
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError('Não foi possível carregar os usuários');
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setEditingUser(null);
    setOpenForm(true);
  };

  const handleEditUser = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setEditingUser(user);
      setOpenForm(true);
    }
  };

  const handleDeleteUser = (id: number) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete !== null) {
      try {
        setDeleteLoading(true);
        await deleteUser(userToDelete);
        setUsers(users.filter((user) => user.id !== userToDelete));
        setSuccess('Usuário excluído com sucesso');
      } catch (err) {
        setError('Erro ao excluir usuário');
        console.error(err);
      } finally {
        setDeleteLoading(false);
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      }
    }
  };

  const handleUserSaved = (user: User) => {
    // Se for edição, atualiza o usuário existente
    if (editingUser) {
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
      setSuccess('Usuário atualizado com sucesso');
    } else {
      // Se for adição, adiciona o novo usuário
      setUsers([...users, user]);
      setSuccess('Usuário criado com sucesso');
    }
    setOpenForm(false);
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
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
      />

      <UserForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleUserSaved}
        user={editingUser}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        title="Excluir Usuário"
        message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteUser}
        loading={deleteLoading}
      />

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

export default Users;