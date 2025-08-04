import os
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings
from sqlmodel import Session, create_engine

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(
    DATABASE_URL, 
    echo=True,
    pool_pre_ping=True,
)

# Configuração da sessão
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para os modelos
Base = declarative_base()

# Metadata para facilitar operações
metadata = MetaData()

# Dependency para obter sessão do banco
def get_session():
    with Session(engine) as session:
        yield session