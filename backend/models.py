from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from typing import Optional, List

class UnidadeBase(SQLModel):
    nome_unidade: str = Field(max_length=200, index=True)

class Unidade(UnidadeBase, table=True):
    __tablename__ = "unidades"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)
    
    # Relacionamento com eventos
    eventos: List["Evento"] = Relationship(back_populates="unidade", cascade_delete=True)

class EventoBase(SQLModel):
    nome: str = Field(max_length=200)
    unidade_responsavel: str = Field(max_length=200)
    quantidade_pessoas: int = Field(gt=0)
    mes_previsto: str = Field(max_length=50)
    coffee_break_manha: bool = Field(default=False)
    coffee_break_tarde: bool = Field(default=False)
    almoco: bool = Field(default=False)
    jantar: bool = Field(default=False)
    cerimonial: bool = Field(default=False)

class Evento(EventoBase, table=True):
    __tablename__ = "eventos"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)
    
    # Chave estrangeira
    unidade_id: Optional[int] = Field(default=None, foreign_key="unidades.id")
    
    # Relacionamento com unidade
    unidade: Optional[Unidade] = Relationship(back_populates="eventos")
