from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_db, get_current_user
from app.models.contato import Contato
from app.models.user import User
from app.schemas.contato import Contato as ContatoSchema, ContatoCreate, ContatoUpdate

router = APIRouter()

@router.get("/", response_model=List[ContatoSchema])
def listar_contatos(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Recupera todos os contatos.
    """
    # Usar joinedload para carregar a relação com empresa
    contatos = db.query(Contato).options(joinedload(Contato.empresa)).offset(skip).limit(limit).all()
    return contatos


@router.post("/", response_model=ContatoSchema)
def criar_contato(
    *,
    db: Session = Depends(get_db),
    contato_in: ContatoCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Cria um novo contato.
    """
    contato = Contato(**contato_in.model_dump())
    db.add(contato)
    db.commit()
    db.refresh(contato)
    return contato


@router.put("/{contato_id}", response_model=ContatoSchema)
def atualizar_contato(
    *,
    db: Session = Depends(get_db),
    contato_id: int,
    contato_in: ContatoUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Atualiza um contato.
    """
    contato = db.query(Contato).filter(Contato.id == contato_id).first()
    if not contato:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contato não encontrado",
        )
    
    update_data = contato_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(contato, field, value)
    
    db.add(contato)
    db.commit()
    db.refresh(contato)
    return contato


@router.get("/{contato_id}", response_model=ContatoSchema)
def ler_contato(
    contato_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Obtém um contato específico pelo ID.
    """
    contato = db.query(Contato).filter(Contato.id == contato_id).first()
    if not contato:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contato não encontrado",
        )
    return contato


@router.delete("/{contato_id}", response_model=ContatoSchema)
def deletar_contato(
    *,
    db: Session = Depends(get_db),
    contato_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Remove um contato.
    """
    contato = db.query(Contato).filter(Contato.id == contato_id).first()
    if not contato:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contato não encontrado",
        )
    db.delete(contato)
    db.commit()
    return contato
