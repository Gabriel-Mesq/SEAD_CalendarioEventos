from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List

class UnidadeBase(SQLModel):
    nome_unidade: str

class Unidade(UnidadeBase, table=True):
    __tablename__ = "unidades"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    
    # Relacionamento com eventos
    eventos: List["Evento"] = Relationship(back_populates="unidade")

class UnidadeCreate(UnidadeBase):
    pass

class UnidadeRead(UnidadeBase):
    id: int
    created_at: datetime
    updated_at: datetime

class EventoBase(SQLModel):
    nome: str
    unidade_responsavel: str
    quantidade_pessoas: int
    mes_previsto: str
    coffee_break_manha: bool = False
    coffee_break_tarde: bool = False
    almoco: bool = False
    jantar: bool = False
    cerimonial: bool = False
    unidade_id: int = Field(foreign_key="unidades.id")

class Evento(EventoBase, table=True):
    __tablename__ = "eventos"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default_factory=datetime.utcnow)
    
    # Relacionamento com unidade
    unidade: Optional[Unidade] = Relationship(back_populates="eventos")

class EventoCreate(EventoBase):
    pass

class EventoRead(EventoBase):
    id: int
    created_at: datetime
    updated_at: datetime

class EventoReadWithUnidade(EventoRead):
    unidade: Optional[UnidadeRead] = None
