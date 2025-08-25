from datetime import datetime, timedelta, timezone
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from enum import Enum
from zoneinfo import ZoneInfo


def brasilia_now():
    # GMT-3 = UTC-3
    return datetime.now(timezone(timedelta(hours=-3)))


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
    nome_solicitante: str = Field(max_length=255) 
    quantidade_pessoas: int
    mes_previsto: MonthEnum
    coffee_break_manha: bool = Field(default=False)
    coffee_break_tarde: bool = Field(default=False)
    almoco: bool = Field(default=False)
    jantar: bool = Field(default=False)
    cerimonial: bool = Field(default=False)
    aprovado: bool = Field(default=False)

class Evento(EventoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    unidade_id: Optional[int] = Field(default=None, foreign_key="unidade.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)
    
    # Relacionamento com unidade
    unidade: Optional[Unidade] = Relationship(back_populates="eventos")

class EventoAprovado(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    evento_id: int = Field(foreign_key="evento.id")
    nome: str = Field(max_length=255)  
    quantidade_pessoas: int
    coffee_break_manha: bool
    coffee_break_tarde: bool
    almoco: bool
    jantar: bool
    cerimonial: bool
    aprovado_at: datetime = Field(default_factory=brasilia_now)

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
    nome_solicitante: Optional[str] = None  # Novo campo
    quantidade_pessoas: Optional[int] = Field(default=None, gt=0)
    mes_previsto: Optional[MonthEnum] = None
    coffee_break_manha: Optional[bool] = None
    coffee_break_tarde: Optional[bool] = None
    almoco: Optional[bool] = None
    jantar: Optional[bool] = None
    cerimonial: Optional[bool] = None
    aprovado: Optional[bool] = None

class EventoFormData(SQLModel):
    nome: str
    unidade_responsavel: str
    nome_solicitante: str  # Novo campo
    quantidade_pessoas: int
    mes_previsto: str
    coffee_break_manha: bool
    coffee_break_tarde: bool
    almoco: bool
    jantar: bool
    cerimonial: bool


class FormSubmissionData(SQLModel):
    nome_unidade: str
    nome_solicitante: str  # Novo campo
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

#region Frotas
class Veiculo (SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    modelo: str = Field(max_length=255)
    placa: str = Field(max_length=10)
    quilometragem: int
    proxima_manutencao: int  
    ultima_limpeza: datetime 
#endregion