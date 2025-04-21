from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user
from app.models.mensagem import Mensagem
from app.models.user import User
from app.schemas.mensagem import Mensagem as MensagemSchema, MensagemCreate, MensagemUpdate

router = APIRouter()

@router.get("/", response_model=List[MensagemSchema])
def listar_mensagens(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Recupera todas as mensagens.
    """
    mensagens = db.query(Mensagem).offset(skip).limit(limit).all()
    return mensagens


@router.post("/", response_model=MensagemSchema)
def criar_mensagem(
    *,
    db: Session = Depends(get_db),
    mensagem_in: MensagemCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Cria uma nova mensagem.
    """
    # Se não for mensagem de entrada, defina o atendente como o usuário atual
    if not mensagem_in.entrada and mensagem_in.atendente_id is None:
        mensagem_data = mensagem_in.model_dump()
        mensagem_data["atendente_id"] = current_user.id
        mensagem = Mensagem(**mensagem_data)
    else:
        mensagem = Mensagem(**mensagem_in.model_dump())
    
    db.add(mensagem)
    db.commit()
    db.refresh(mensagem)
    return mensagem


@router.get("/contato/{contato_id}", response_model=List[MensagemSchema])
def listar_mensagens_por_contato(
    contato_id: int,
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Recupera todas as mensagens de um contato específico.
    """
    mensagens = db.query(Mensagem).filter(
        Mensagem.contato_id == contato_id
    ).order_by(Mensagem.created_at.asc()).offset(skip).limit(limit).all()
    
    return mensagens


@router.get("/{mensagem_id}", response_model=MensagemSchema)
def ler_mensagem(
    mensagem_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Obtém uma mensagem específica pelo ID.
    """
    mensagem = db.query(Mensagem).filter(Mensagem.id == mensagem_id).first()
    if not mensagem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mensagem não encontrada",
        )
    return mensagem


@router.delete("/{mensagem_id}", response_model=MensagemSchema)
def deletar_mensagem(
    *,
    db: Session = Depends(get_db),
    mensagem_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Remove uma mensagem.
    """
    mensagem = db.query(Mensagem).filter(Mensagem.id == mensagem_id).first()
    if not mensagem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mensagem não encontrada",
        )
    db.delete(mensagem)
    db.commit()
    return mensagem
