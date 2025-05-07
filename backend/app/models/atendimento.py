from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.session import Base
import enum

class StatusAtendimento(str, enum.Enum):
    AGUARDANDO = "aguardando"
    EM_ANDAMENTO = "em_andamento"
    FINALIZADO = "finalizado"

class Atendimento(Base):
    __tablename__ = "atendimentos"

    id = Column(Integer, primary_key=True, index=True)
    protocolo = Column(String(20), unique=True, index=True)
    status = Column(Enum(StatusAtendimento), default=StatusAtendimento.AGUARDANDO)
    
    contato_id = Column(Integer, ForeignKey("contatos.id"), nullable=False)
    atendente_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    iniciado_em = Column(DateTime(timezone=True), server_default=func.now())
    atendido_em = Column(DateTime(timezone=True), nullable=True)
    finalizado_em = Column(DateTime(timezone=True), nullable=True)
    
    # Relacionamentos
    contato = relationship("Contato", back_populates="atendimentos")
    atendente = relationship("User")
    mensagens = relationship("Mensagem", back_populates="atendimento")