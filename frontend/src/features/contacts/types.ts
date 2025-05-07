export interface Contact {
  id: number;
  nome: string;
  telefone: string;
  empresa_id?: number | null;
  created_at: string;
  updated_at?: string | null;
  usuario_cadastro_id?: number;
  usuario_alteracao_id?: number;
  usuario_cadastro?: {
    id: number;
    nome: string;
  };
  usuario_alteracao?: {
    id: number;
    nome: string;
  };
  empresa?: {
    id: number;
    nome: string;
  };
}

export interface ContactCreate {
  nome: string;
  telefone: string;
  empresa_id?: number | null;
}

export interface ContactUpdate {
  nome?: string;
  telefone?: string;
  empresa_id?: number | null;
}