import os
from sqlmodel import Session, create_engine, SQLModel
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Configuração do engine com SQLModel
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Para debug, remova em produção
    pool_pre_ping=True,
    pool_recycle=300,
    pool_size=5,
    max_overflow=10
)

def create_db_and_tables():
    """Cria as tabelas no banco de dados"""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Dependency para obter sessão do banco"""
    with Session(engine) as session:
        yield session