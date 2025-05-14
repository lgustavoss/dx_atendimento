export enum AtendimentoStatus {
  AGUARDANDO = 'aguardando',
  EM_ANDAMENTO = 'em_andamento',
  FINALIZADO = 'finalizado',
}

export interface Atendimento {
  id: number;
  contato_id: number;
  status: AtendimentoStatus;
  protocolo: string;
  atendente_id?: number;
  iniciado_em: string;
  atendido_em?: string;
  finalizado_em?: string;
}

export interface AtendimentoCreate {
  contato_id: number;
  status?: AtendimentoStatus;
}

export interface AtendimentoUpdate {
  status?: AtendimentoStatus;
  atendente_id?: number;
}