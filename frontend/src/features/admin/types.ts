export interface UsuarioAuditoria {
  id: number;
  nome: string;
}

export interface AuditInfoProps {
  open: boolean;
  onClose: () => void;
  createdAt: string;
  updatedAt?: string | null;
  createdBy?: UsuarioAuditoria | null;
  updatedBy?: UsuarioAuditoria | null;
}