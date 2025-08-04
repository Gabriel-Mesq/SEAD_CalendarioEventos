from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Unidade(Base):
    __tablename__ = "unidades"
    
    id = Column(Integer, primary_key=True, index=True)
    nome_unidade = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relacionamento com eventos
    eventos = relationship("Evento", back_populates="unidade", cascade="all, delete-orphan")

class Evento(Base):
    __tablename__ = "eventos"
    
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    unidade_responsavel = Column(String, nullable=False)
    quantidade_pessoas = Column(Integer, nullable=False)
    mes_previsto = Column(String, nullable=False)
    coffee_break_manha = Column(Boolean, default=False)
    coffee_break_tarde = Column(Boolean, default=False)
    almoco = Column(Boolean, default=False)
    jantar = Column(Boolean, default=False)
    cerimonial = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign Key para unidade
    unidade_id = Column(Integer, ForeignKey("unidades.id"), nullable=False)
    
    # Relacionamento com unidade
    unidade = relationship("Unidade", back_populates="eventos")
