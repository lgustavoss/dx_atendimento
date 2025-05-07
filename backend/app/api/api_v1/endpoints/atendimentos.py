from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import random
import string

from app.api.deps import get_db, get_current_user
from app.models.atendimento import Atendimento, StatusAtendimento
from app.models.user import User
from app.schemas.atendimento import Atendimento as AtendimentoSchema, AtendimentoCreate, AtendimentoUpdate

router = APIRouter()

# Função para gerar protocolo
def gerar_protocolo():
    # Formato: ANO-MES-DIA-XXXX onde X são caracteres alfanuméricos
    hoje = datetime.now().strftime("%Y-%m-%d")
    aleatorio = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{hoje}-{aleatorio}"

@router.get("/", response_model=List[AtendimentoSchema])
def listar_atendimentos(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Recupera todos os atendimentos."""
    atendimentos = db.query(Atendimento).offset(skip).limit(limit).all()
    return atendimentos

@router.get("/abertos", response_model=List[AtendimentoSchema])
def listar_atendimentos_abertos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Recupera todos os atendimentos aguardando ou em andamento."""
    atendimentos = db.query(Atendimento).filter(
        Atendimento.status != StatusAtendimento.FINALIZADO
    ).all()
    return atendimentos

@router.post("/", response_model=AtendimentoSchema)
def criar_atendimento(
    *,
    db: Session = Depends(get_db),
    atendimento_in: AtendimentoCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Cria um novo atendimento."""
    # Verificar se já existe atendimento aberto para o contato
    atendimento_aberto = db.query(Atendimento).filter(
        Atendimento.contato_id == atendimento_in.contato_id,
        Atendimento.status != StatusAtendimento.FINALIZADO
    ).first()
    
    if atendimento_aberto:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Já existe um atendimento aberto para este contato."
        )
    
    atendimento = Atendimento(**atendimento_in.model_dump())
    atendimento.protocolo = gerar_protocolo()
    
    db.add(atendimento)
    db.commit()
    db.refresh(atendimento)
    return atendimento

@router.put("/{atendimento_id}/assumir", response_model=AtendimentoSchema)
def assumir_atendimento(
    *,
    db: Session = Depends(get_db),
    atendimento_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Atendente assume um atendimento."""
    atendimento = db.query(Atendimento).filter(Atendimento.id == atendimento_id).first()
    if not atendimento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Atendimento não encontrado",
        )
    
    if atendimento.status == StatusAtendimento.FINALIZADO:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Não é possível assumir um atendimento finalizado",
        )
    
    if atendimento.atendente_id and atendimento.atendente_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este atendimento já foi assumido por outro atendente",
        )
    
    atendimento.atendente_id = current_user.id
    atendimento.status = StatusAtendimento.EM_ANDAMENTO
    atendimento.atendido_em = datetime.now()
    
    db.add(atendimento)
    db.commit()
    db.refresh(atendimento)
    return atendimento

@router.put("/{atendimento_id}/finalizar", response_model=AtendimentoSchema)
def finalizar_atendimento(
    *,
    db: Session = Depends(get_db),
    atendimento_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Finaliza um atendimento."""
    atendimento = db.query(Atendimento).filter(Atendimento.id == atendimento_id).first()
    if not atendimento:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Atendimento não encontrado",
        )
    
    if atendimento.status == StatusAtendimento.FINALIZADO:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este atendimento já está finalizado",
        )
    
    if atendimento.atendente_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não pode finalizar um atendimento que não assumiu",
        )
    
    atendimento.status = StatusAtendimento.FINALIZADO
    atendimento.finalizado_em = datetime.now()
    
    db.add(atendimento)
    db.commit()
    db.refresh(atendimento)
    return atendimento

@router.get("/count", response_model=int)
def contar_atendimentos(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Conta o número total de atendimentos (chats)."""
    count = db.query(Atendimento).count()
    return count