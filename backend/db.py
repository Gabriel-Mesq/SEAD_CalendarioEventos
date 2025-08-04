import os
import time
from sqlmodel import Session, create_engine
from dotenv import load_dotenv
import logging

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def create_engine_with_retry():
    for attempt in range(5):  # 5 tentativas
        try:
            engine = create_engine(
                DATABASE_URL, 
                echo=True,
                pool_pre_ping=True,
                pool_recycle=3600,
            )
            # Testa a conexão
            with engine.connect() as conn:
                conn.execute("SELECT 1")
            return engine
        except Exception as e:
            logging.warning(f"Tentativa {attempt + 1} falhou: {e}")
            if attempt < 4:  # Não espera na última tentativa
                time.sleep(10)  # Espera 10 segundos
            else:
                raise

engine = create_engine_with_retry()

def get_session():
    with Session(engine) as session:
        yield session