from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel

from db import engine
from routers import evento, unidade

# Criar tabelas no banco
SQLModel.metadata.create_all(engine)

app = FastAPI(
    title="SEAD Calendario Eventos API",
    description="API for managing events in SEAD",
    version="1.0.0"
)

# Configurar CORS para permitir requisições do frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:5173", 
        "https://fs8sgk0w8wwk08o0kkwsww00.82.29.62.110.sslip.io",
        "https://gws804ggcosos8k0gccskocs.82.29.62.110.sslip.io",
        "https://api.sead.allsafeassessoria.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir as rotas
app.include_router(evento.router)
app.include_router(unidade.router)

# Rota de health check
@app.get("/")
async def root():
    return {"message": "SEAD Calendario Eventos API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is running properly!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5151, reload=True)