from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel
from enum import Enum

class StatusAtendimento(str, Enum):
    AGUARDANDO = "aguardando"
    EM_ANDAMENTO = "em_andamento"
    FINALIZADO = "finalizado"

class AtendimentoBase(BaseModel):
    contato_id: int
    status: StatusAtendimento = StatusAtendimento.AGUARDANDO

class AtendimentoCreate(AtendimentoBase):
    pass

class AtendimentoUpdate(BaseModel):
    status: Optional[StatusAtendimento] = None
    atendente_id: Optional[int] = None

class AtendimentoInDB(AtendimentoBase):
    id: int
    protocolo: str
    atendente_id: Optional[int] = None
    iniciado_em: datetime
    atendido_em: Optional[datetime] = None
    finalizado_em: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class Atendimento(AtendimentoInDB):
    pass