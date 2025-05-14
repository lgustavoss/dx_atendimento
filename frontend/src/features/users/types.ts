export interface User {
  id: number;
  nome: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at?: string;
}

export interface UserCreate {
  nome: string;
  email: string;
  password: string;
  is_active?: boolean;
  is_superuser?: boolean;
}

export interface UserUpdate {
  nome?: string;
  email?: string;
  password?: string;
  is_active?: boolean;
  is_superuser?: boolean;
}