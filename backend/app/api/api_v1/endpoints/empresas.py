from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_superuser, get_current_user
from app.models.empresa import Empresa
from app.models.user import User
from app.schemas.empresa import Empresa as EmpresaSchema, EmpresaCreate, EmpresaUpdate

router = APIRouter()

@router.get("/", response_model=List[EmpresaSchema])
def listar_empresas(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Recupera todas as empresas.
    """
    empresas = db.query(Empresa).offset(skip).limit(limit).all()
    return empresas


@router.post("/", response_model=EmpresaSchema)
def criar_empresa(
    *,
    db: Session = Depends(get_db),
    empresa_in: EmpresaCreate,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Cria uma nova empresa.
    """
    empresa = db.query(Empresa).filter(Empresa.cnpj == empresa_in.cnpj).first()
    if empresa:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="CNPJ já cadastrado no sistema.",
        )
    empresa = Empresa(**empresa_in.model_dump())
    # Adicionar informação de auditoria
    empresa.usuario_cadastro_id = current_user.id
    
    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa


@router.put("/{id}", response_model=EmpresaSchema)
def update_empresa(
    *,
    db: Session = Depends(get_db),
    id: int,
    empresa_in: EmpresaUpdate,
    current_user: User = Depends(get_current_active_superuser)
) -> Any:
    """
    Atualizar empresa.
    """
    empresa = db.query(Empresa).filter(Empresa.id == id).first()
    if not empresa:
        raise HTTPException(status_code=404, detail="Empresa não encontrada")
    
    update_data = empresa_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(empresa, field, value)
    
    # Adicionar informação de auditoria
    empresa.usuario_alteracao_id = current_user.id
    
    db.add(empresa)
    db.commit()
    db.refresh(empresa)
    return empresa


@router.get("/{empresa_id}", response_model=EmpresaSchema)
def ler_empresa(
    empresa_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """
    Obtém uma empresa específica pelo ID.
    """
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empresa não encontrada",
        )
    return empresa


@router.delete("/{empresa_id}", response_model=EmpresaSchema)
def deletar_empresa(
    *,
    db: Session = Depends(get_db),
    empresa_id: int,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """
    Remove uma empresa.
    """
    empresa = db.query(Empresa).filter(Empresa.id == empresa_id).first()
    if not empresa:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Empresa não encontrada",
        )
    db.delete(empresa)
    db.commit()
    return empresa
