export interface Contact {
  id: number;
  nome: string;
  telefone: string;
  empresa_id?: number;
  created_at: string;
  updated_at?: string;
}

export interface ContactCreate {
  nome: string;
  telefone: string;
  empresa_id?: number;
}

export interface ContactUpdate {
  nome?: string;
  telefone?: string;
  empresa_id?: number;
}