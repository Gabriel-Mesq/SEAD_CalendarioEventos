import os
from config import settings
from sqlmodel import Session, create_engine

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(
    DATABASE_URL, 
    echo=True,
    pool_pre_ping=True,
)

# Dependency para obter sessão do banco
def get_session():
    with Session(engine) as session:
        yield session