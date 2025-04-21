from typing import Optional
from datetime import datetime
from pydantic import BaseModel

# Schemas compartilhados
class EmpresaBase(BaseModel):
    nome: str
    cnpj: str
    grupo_id: Optional[int] = None

# Schemas para criação/atualização
class EmpresaCreate(EmpresaBase):
    pass

class EmpresaUpdate(EmpresaBase):
    nome: Optional[str] = None
    cnpj: Optional[str] = None

# Schema para resposta
class EmpresaInDBBase(EmpresaBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Schema para resposta pública
class Empresa(EmpresaInDBBase):
    pass
