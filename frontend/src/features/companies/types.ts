export interface UsuarioAuditoria {
  id: number;
  nome: string;
}

export interface Company {
  id: number;
  nome: string;
  cnpj: string;
  grupo_id?: number;
  created_at: string;
  updated_at?: string;
  usuario_cadastro_id?: number;
  usuario_alteracao_id?: number;
  usuario_cadastro?: UsuarioAuditoria;
  usuario_alteracao?: UsuarioAuditoria;
}

export interface CompanyCreate {
  nome: string;
  cnpj: string;
  grupo_id?: number;
}

export interface CompanyUpdate {
  nome?: string;
  cnpj?: string;
  grupo_id?: number;
}