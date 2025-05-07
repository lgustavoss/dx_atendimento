import { useState } from 'react';
import { 
  Dialog, 
  DialogTitle,
  DialogContent, 
  Typography, 
  Box, 
  Divider 
} from '@mui/material';

interface UsuarioAuditoria {
  id: number;
  nome: string;
}

interface AuditInfoProps {
  open: boolean;
  onClose: () => void;
  createdAt: string;
  updatedAt?: string | null;
  createdBy?: UsuarioAuditoria | null;
  updatedBy?: UsuarioAuditoria | null;
}

const AuditInfo = ({ open, onClose, createdAt, updatedAt, createdBy, updatedBy }: AuditInfoProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Informações de Auditoria</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="primary">Criação</Typography>
          <Typography variant="body2">
            Data: {new Date(createdAt).toLocaleString('pt-BR')}
          </Typography>
          <Typography variant="body2">
            Usuário: {createdBy?.nome || 'Não disponível'}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box>
          <Typography variant="subtitle2" color="primary">Última Alteração</Typography>
          <Typography variant="body2">
            Data: {updatedAt ? new Date(updatedAt).toLocaleString('pt-BR') : 'Sem alterações'}
          </Typography>
          <Typography variant="body2">
            Usuário: {updatedBy?.nome || 'Não disponível'}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AuditInfo;