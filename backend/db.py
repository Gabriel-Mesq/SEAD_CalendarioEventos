import os
from sqlmodel import Session, create_engine
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Converte postgres:// para postgresql+asyncpg:// para usar asyncpg
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

engine = create_engine(
    DATABASE_URL, 
    echo=True,
    pool_pre_ping=True,
    )

def get_session():
    with Session(engine) as session:
        yield session