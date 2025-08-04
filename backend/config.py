import os
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

class Settings:
    # Configurações do banco de dados
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    
    # Configurações da aplicação
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret-key")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:8080",
        "https://seudominio.com",
    ]
    
    # Configurações da API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "SEAD Calendar API"
    PROJECT_VERSION: str = "1.0.0"

settings = Settings()
