from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.session import Base

class Mensagem(Base):
    __tablename__ = "mensagens"

    id = Column(Integer, primary_key=True, index=True)
    conteudo = Column(Text, nullable=False)
    tipo = Column(String(20), default="text")  
    midia_url = Column(String(255), nullable=True)
    
    contato_id = Column(Integer, ForeignKey("contatos.id"), nullable=False)
    atendente_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    atendimento_id = Column(Integer, ForeignKey("atendimentos.id"), nullable=False)
    
    # Direção da mensagem
    entrada = Column(Boolean, default=True)  
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relacionamentos
    contato = relationship("Contato", back_populates="mensagens")
    atendente = relationship("User")
    atendimento = relationship("Atendimento", back_populates="mensagens")
