from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr

# Schemas compartilhados
class UserBase(BaseModel):
    email: EmailStr
    nome: str
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False

# Schemas para criação/atualização
class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    password: Optional[str] = None

# Schema para resposta
class UserInDBBase(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Schema para resposta pública (sem dados sensíveis)
class User(UserInDBBase):
    pass

# Schema para dados com senha (uso interno)
class UserInDB(UserInDBBase):
    hashed_password: str
