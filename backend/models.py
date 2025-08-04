from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum


class MonthEnum(str, Enum):
    JANEIRO = "Janeiro"
    FEVEREIRO = "Fevereiro"
    MARCO = "Março"
    ABRIL = "Abril"
    MAIO = "Maio"
    JUNHO = "Junho"
    JULHO = "Julho"
    AGOSTO = "Agosto"
    SETEMBRO = "Setembro"
    OUTUBRO = "Outubro"
    NOVEMBRO = "Novembro"
    DEZEMBRO = "Dezembro"


# Modelo base para Unidade
class UnidadeBase(SQLModel):
    nome_unidade: str = Field(max_length=255)


class Unidade(UnidadeBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)
    
    # Relacionamento com eventos
    eventos: List["Evento"] = Relationship(back_populates="unidade")


class UnidadeCreate(UnidadeBase):
    pass


class UnidadeRead(UnidadeBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class UnidadeUpdate(SQLModel):
    nome_unidade: Optional[str] = None


# Modelo base para Evento
class EventoBase(SQLModel):
    nome: str = Field(max_length=255)
    unidade_responsavel: str = Field(max_length=255)
    quantidade_pessoas: int = Field(gt=0)
    mes_previsto: MonthEnum
    coffee_break_manha: bool = Field(default=False)
    coffee_break_tarde: bool = Field(default=False)
    almoco: bool = Field(default=False)
    jantar: bool = Field(default=False)
    cerimonial: bool = Field(default=False)


class Evento(EventoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    unidade_id: Optional[int] = Field(default=None, foreign_key="unidade.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)
    
    # Relacionamento com unidade
    unidade: Optional[Unidade] = Relationship(back_populates="eventos")


class EventoCreate(EventoBase):
    unidade_id: Optional[int] = None


class EventoRead(EventoBase):
    id: int
    unidade_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class EventoUpdate(SQLModel):
    nome: Optional[str] = None
    unidade_responsavel: Optional[str] = None
    quantidade_pessoas: Optional[int] = Field(default=None, gt=0)
    mes_previsto: Optional[MonthEnum] = None
    coffee_break_manha: Optional[bool] = None
    coffee_break_tarde: Optional[bool] = None
    almoco: Optional[bool] = None
    jantar: Optional[bool] = None
    cerimonial: Optional[bool] = None


# Schemas para receber dados do frontend (conforme api.ts)
class EventoFormData(SQLModel):
    nome: str
    unidade_responsavel: str
    quantidade_pessoas: int
    mes_previsto: str
    coffee_break_manha: bool
    coffee_break_tarde: bool
    almoco: bool
    jantar: bool
    cerimonial: bool


class FormSubmissionData(SQLModel):
    nome_unidade: str
    eventos: List[EventoFormData]


# Schemas de resposta
class EventoWithUnidade(EventoRead):
    unidade: Optional[UnidadeRead] = None


class UnidadeWithEventos(UnidadeRead):
    eventos: List[EventoRead] = []


# Schema para estatísticas/resumo
class EventoStats(SQLModel):
    total_eventos: int
    total_unidades: int
    eventos_por_mes: dict[str, int]
    pessoas_por_mes: dict[str, int]
    servicos_mais_solicitados: dict[str, int]


# Schema para resposta de API padronizada
class ApiResponse(SQLModel):
    success: bool
    message: Optional[str] = None
    data: Optional[dict] = None
    errors: Optional[dict] = None