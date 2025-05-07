import { useState, useEffect } from 'react';
import { Box, Snackbar, Alert, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DataTable from '../../components/admin/DataTable';
import DeleteDialog from '../../components/admin/DeleteDialog';
import GroupForm from './GroupForm';
import { getGrupos, deleteGrupo } from './GroupService';
import { Group } from './types';
import AuditInfo from '../../components/admin/AuditInfo';

const columns = [
  { id: 'id', label: 'ID', minWidth: 50 },
  { id: 'nome', label: 'Nome', minWidth: 170 },
  { id: 'descricao', label: 'Descrição', minWidth: 250 }
];

const Groups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [auditInfoOpen, setAuditInfoOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const data = await getGrupos();
      setGroups(data);
    } catch (err) {
      setError('Não foi possível carregar os grupos');
      console.error('Erro ao carregar grupos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAddGroup = () => {
    setEditingGroup(null);
    setOpenForm(true);
  };

  const handleEditGroup = (id: number) => {
    const group = groups.find((g) => g.id === id);
    if (group) {
      setEditingGroup(group);
      setOpenForm(true);
    }
  };

  const handleDeleteGroup = (id: number) => {
    setGroupToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (groupToDelete !== null) {
      try {
        setDeleteLoading(true);
        await deleteGrupo(groupToDelete);
        setGroups(groups.filter((group) => group.id !== groupToDelete));
        setSuccess('Grupo excluído com sucesso');
      } catch (err) {
        setError('Erro ao excluir grupo');
        console.error(err);
      } finally {
        setDeleteLoading(false);
        setDeleteDialogOpen(false);
        setGroupToDelete(null);
      }
    }
  };

  const handleGroupSaved = (group: Group) => {
    if (editingGroup) {
      setGroups(groups.map((g) => (g.id === group.id ? group : g)));
      setSuccess('Grupo atualizado com sucesso');
    } else {
      setGroups([...groups, group]);
      setSuccess('Grupo criado com sucesso');
    }
    setOpenForm(false);
  };

  const handleCloseAlert = () => {
    setError(null);
    setSuccess(null);
  };

  const handleShowAuditInfo = (id: number) => {
    const group = groups.find((g) => g.id === id);
    if (group) {
      setSelectedGroup(group);
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
      />

      <GroupForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSave={handleGroupSaved}
        group={editingGroup}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        title="Excluir Grupo"
        message="Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita e pode afetar empresas associadas."
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

export default Groups;