from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

# Schemas compartilhados
class GrupoBase(BaseModel):
    nome: str
    descricao: Optional[str] = None

# Schemas para criação/atualização
class GrupoCreate(GrupoBase):
    pass

class GrupoUpdate(GrupoBase):
    nome: Optional[str] = None

# Schema para usuário resumido (usado nas respostas)
class UsuarioAuditoria(BaseModel):
    id: int
    nome: str

    class Config:
        from_attributes = True

# Schema para resposta
class GrupoInDBBase(GrupoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    usuario_cadastro_id: Optional[int] = None
    usuario_alteracao_id: Optional[int] = None
    
    class Config:
        from_attributes = True

# Schema para resposta pública
class Grupo(GrupoInDBBase):
    usuario_cadastro: Optional[UsuarioAuditoria] = None
    usuario_alteracao: Optional[UsuarioAuditoria] = None
