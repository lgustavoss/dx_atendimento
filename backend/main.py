from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from dotenv import load_dotenv
import os

from app.api.api_v1.api import api_router
from app.core.config import settings

# Carregar variáveis de ambiente
load_dotenv()

app = FastAPI(
    title="DX Atendimento API",
    description="API para sistema de atendimento via WhatsApp",
    version="0.1.0",
)

# Configurar CORS de forma explícita
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas da API
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "DX Atendimento API funcionando!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
