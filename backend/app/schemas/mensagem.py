from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Schemas compartilhados
class MensagemBase(BaseModel):
    conteudo: str
    tipo: str = "text"
    midia_url: Optional[str] = None
    contato_id: int
    atendente_id: Optional[int] = None
    entrada: bool = True
    atendimento_id: int

# Schemas para criação/atualização
class MensagemCreate(MensagemBase):
    pass

class MensagemUpdate(MensagemBase):
    conteudo: Optional[str] = None
    contato_id: Optional[int] = None

# Schema para resposta
class MensagemInDBBase(MensagemBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Schema para resposta pública
class Mensagem(MensagemInDBBase):
    pass
