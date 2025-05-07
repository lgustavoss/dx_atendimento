from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.session import Base

class Empresa(Base):
    __tablename__ = "empresas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    cnpj = Column(String(18), unique=True, index=True)
    grupo_id = Column(Integer, ForeignKey("grupos.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Campos de auditoria
    usuario_cadastro_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    usuario_alteracao_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relacionamentos
    grupo = relationship("Grupo", back_populates="empresas")
    contatos = relationship("Contato", back_populates="empresa")
    usuario_cadastro = relationship("User", foreign_keys=[usuario_cadastro_id])
    usuario_alteracao = relationship("User", foreign_keys=[usuario_alteracao_id])
