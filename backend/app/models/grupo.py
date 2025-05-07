from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.session import Base

class Grupo(Base):
    __tablename__ = "grupos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    descricao = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Campos de auditoria
    usuario_cadastro_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    usuario_alteracao_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relacionamentos
    empresas = relationship("Empresa", back_populates="grupo")
    usuario_cadastro = relationship("User", foreign_keys=[usuario_cadastro_id])
    usuario_alteracao = relationship("User", foreign_keys=[usuario_alteracao_id])