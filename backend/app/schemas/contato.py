from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from app.schemas.empresa import Empresa as EmpresaSchema

# Schemas compartilhados
class ContatoBase(BaseModel):
    nome: str
    telefone: str
    empresa_id: Optional[int] = None

# Schemas para criação/atualização
class ContatoCreate(ContatoBase):
    pass

class ContatoUpdate(ContatoBase):
    nome: Optional[str] = None
    telefone: Optional[str] = None
    empresa_id: Optional[int] = None

# Schema para resposta
class ContatoInDBBase(ContatoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Schema para resposta pública
class Contato(ContatoInDBBase):
    empresa: Optional[EmpresaSchema] = None
    
    class Config:
        from_attributes = True
