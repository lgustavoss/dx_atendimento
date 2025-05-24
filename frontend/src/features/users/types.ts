export interface User {
  id: number;
  email: string;
  nome: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  is_online: boolean;
  last_login: string | null;
  last_activity: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface UserCreate {
  email: string;
  nome: string;
  password: string;
  password_confirm: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface UserUpdate {
  email?: string;
  nome?: string;
  password?: string;
  password_confirm?: string;
  is_active?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
}

export interface UserStatus {
  user_id: number;
  is_online: boolean;
  last_activity: string;
}

export interface WebSocketMessage {
  type: string;
  user_id?: number;
  is_online?: boolean;
  last_activity?: string;
}

export type WebSocketMessageType = 'status.update' | 'heartbeat';

export interface WebSocketError {
  type: 'error';
  message: string;
}

// Interface para as opções de configuração do WebSocket
export interface WebSocketOptions {
  url: string;
  token: string;
  onMessage?: (data: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: WebSocketError) => void;
}