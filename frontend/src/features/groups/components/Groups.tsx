import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DataTable from '../../../features/admin/components/DataTable';
import DeleteDialog from '../../../features/admin/components/DeleteDialog';
import GroupForm from './GroupForm';
import { Group } from '../types';
import AuditInfo from '../../../features/admin/components/AuditInfo';
import { useAppDispatch, useAppSelector } from '../../../hooks/store';
import { 
  fetchGroups, 
  removeGroup, 
  setSelectedGroup 
} from '../../../store/slices/groupsSlice';
import { clearAlert } from '../../../store/slices/uiSlice';
import { useAuth } from '../../../providers/AuthProvider';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'nome', label: 'Nome', minWidth: 170 },
  { id: 'descricao', label: 'Descrição', minWidth: 300 }
];

const Groups = () => {
  const { token } = useAuth();
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.groups.list);
  const selectedGroup = useAppSelector((state) => state.groups.selected);
  const { message: alertMessage, type: alertType } = useAppSelector((state) => state.ui.alert);
  const loading = useAppSelector((state) => state.ui.loading.fetchGroups);
  const deleteLoading = useAppSelector((state) => state.ui.loading.removeGroup);

  const [openForm, setOpenForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);
  const [auditInfoOpen, setAuditInfoOpen] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchGroups());
    }
  }, [dispatch, token]);

  // Handlers
  const handleAddGroup = () => {
    dispatch(setSelectedGroup(null));
    setOpenForm(true);
  };

  const handleEditGroup = (id: number) => {
    const group = groups.find((g) => g.id === id);
    if (group) {
      dispatch(setSelectedGroup(group));
      setOpenForm(true);
    }
  };

  const handleDeleteGroup = (id: number) => {
    setGroupToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (groupToDelete !== null) {
      await dispatch(removeGroup(groupToDelete));
      setDeleteDialogOpen(false);
      setGroupToDelete(null);
    }
  };

  const handleCloseAlert = () => {
    dispatch(clearAlert());
  };

  const handleGroupFormClose = () => {
    setOpenForm(false);
    dispatch(setSelectedGroup(null));
  };

  const handleShowAuditInfo = (id: number) => {
    const group = groups.find((g) => g.id === id);
    if (group) {
      dispatch(setSelectedGroup(group));
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
        data={groups}
        title="Grupos"
        onAdd={handleAddGroup}
        onEdit={handleEditGroup}
        onDelete={handleDeleteGroup}
        searchField="nome"
        renderCustomActions={renderActionButtons}
        loading={loading}
      />

      <GroupForm
        open={openForm}
        onClose={handleGroupFormClose}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        title="Excluir Grupo"
        message="Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita."
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteGroup}
        loading={deleteLoading}
      />

      {selectedGroup && (
        <AuditInfo
          open={auditInfoOpen}
          onClose={() => setAuditInfoOpen(false)}
          createdAt={selectedGroup.created_at}
          updatedAt={selectedGroup.updated_at}
          createdBy={selectedGroup.usuario_cadastro}
          updatedBy={selectedGroup.usuario_alteracao}
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

export default Groups;