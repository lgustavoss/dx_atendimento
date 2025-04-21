from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users
from app.api.api_v1.endpoints import empresas, grupos, contatos, mensagens

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["autenticação"])
api_router.include_router(users.router, prefix="/users", tags=["usuários"])
api_router.include_router(empresas.router, prefix="/empresas", tags=["empresas"])
api_router.include_router(grupos.router, prefix="/grupos", tags=["grupos"])
api_router.include_router(contatos.router, prefix="/contatos", tags=["contatos"])
api_router.include_router(mensagens.router, prefix="/mensagens", tags=["mensagens"])
