import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

class Settings:
    # Configurações do banco de dados
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://usuario:senha@localhost:5432/sead_eventos")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "usuario")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "senha")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "sead_eventos")
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    
    # Configurações da aplicação
    SECRET_KEY: str = os.getenv("SECRET_KEY", "sua_chave_secreta_aqui")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # CORS
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    
    # Configurações da API
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "SEAD - Calendário de Eventos"
    PROJECT_VERSION: str = "1.0.0"

settings = Settings()
