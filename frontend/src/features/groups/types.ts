export interface UsuarioAuditoria {
  id: number;
  nome: string;
}

export interface Group {
  id: number;
  nome: string;
  descricao?: string;
  created_at: string;
  updated_at?: string;
  usuario_cadastro_id?: number;
  usuario_alteracao_id?: number;
  usuario_cadastro?: UsuarioAuditoria;
  usuario_alteracao?: UsuarioAuditoria;
}

export interface GroupCreate {
  nome: string;
  descricao?: string;
}

export interface GroupUpdate {
  nome?: string;
  descricao?: string;
}