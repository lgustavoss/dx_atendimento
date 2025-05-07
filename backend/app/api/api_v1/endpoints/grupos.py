from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_superuser, get_current_user
from app.models.grupo import Grupo
from app.models.user import User
from app.schemas.grupo import Grupo as GrupoSchema, GrupoCreate, GrupoUpdate

router = APIRouter()

@router.get("/", response_model=List[GrupoSchema])
def listar_grupos(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Recupera todos os grupos.
    """
    grupos = db.query(Grupo).offset(skip).limit(limit).all()
    return grupos


@router.post("/", response_model=GrupoSchema)
def criar_grupo(
    *,
    db: Session = Depends(get_db),
    grupo_in: GrupoCreate,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Cria um novo grupo.
    """
    grupo = Grupo(**grupo_in.model_dump())
    # Adicionar informação de auditoria
    grupo.usuario_cadastro_id = current_user.id
    
    db.add(grupo)
    db.commit()
    db.refresh(grupo)
    return grupo


@router.put("/{grupo_id}", response_model=GrupoSchema)
def atualizar_grupo(
    *,
    db: Session = Depends(get_db),
    grupo_id: int,
    grupo_in: GrupoUpdate,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Atualiza um grupo.
    """
    grupo = db.query(Grupo).filter(Grupo.id == grupo_id).first()
    if not grupo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grupo não encontrado",
        )
    
    update_data = grupo_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(grupo, field, value)
    
    # Adicionar informação de auditoria
    grupo.usuario_alteracao_id = current_user.id
    
    db.add(grupo)
    db.commit()
    db.refresh(grupo)
    return grupo


@router.get("/{grupo_id}", response_model=GrupoSchema)
def ler_grupo(
    grupo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Obtém um grupo específico pelo ID.
    """
    grupo = db.query(Grupo).filter(Grupo.id == grupo_id).first()
    if not grupo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grupo não encontrado",
        )
    return grupo


@router.delete("/{grupo_id}", response_model=GrupoSchema)
def deletar_grupo(
    *,
    db: Session = Depends(get_db),
    grupo_id: int,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Remove um grupo.
    """
    grupo = db.query(Grupo).filter(Grupo.id == grupo_id).first()
    if not grupo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grupo não encontrado",
        )
    db.delete(grupo)
    db.commit()
    return grupo
