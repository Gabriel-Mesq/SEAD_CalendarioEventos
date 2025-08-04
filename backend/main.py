from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from sqlmodel import SQLModel
import uvicorn

from config import settings
from database import engine
import routes

# Criar tabelas no banco de dados
def create_tables():
    """Cria as tabelas no banco de dados"""
    SQLModel.metadata.create_all(engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gerencia o ciclo de vida da aplicação"""
    # Startup
    print("🚀 Iniciando aplicação...")
    create_tables()
    print("✅ Tabelas do banco de dados criadas/verificadas")
    yield
    # Shutdown
    print("🔄 Encerrando aplicação...")

# Criar a aplicação FastAPI
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="API para gerenciamento de calendário de eventos da SEAD",
    lifespan=lifespan
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir as rotas da API
app.include_router(routes.router, prefix=settings.API_V1_STR)

# Handler global para exceções
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Handler global para capturar exceções não tratadas"""
    print(f"Erro não tratado: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Erro interno do servidor",
            "detail": str(exc) if settings.DEBUG else "Erro interno"
        }
    )

# Endpoint raiz
@app.get("/")
async def root():
    """Endpoint raiz da API"""
    return {
        "message": "SEAD - Calendário de Eventos API",
        "version": settings.PROJECT_VERSION,
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG,
        log_level="info" if not settings.DEBUG else "debug"
    )
