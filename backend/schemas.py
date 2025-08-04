from pydantic import BaseModel, Field
from sqlmodel import SQLModel
from typing import List, Optional
from datetime import datetime

# Schemas para criação
class EventoCreate(SQLModel):
    nome: str = Field(..., min_length=1, max_length=200)
    unidade_responsavel: str = Field(..., min_length=1, max_length=200)
    quantidade_pessoas: int = Field(..., gt=0)
    mes_previsto: str = Field(..., min_length=1, max_length=50)
    coffee_break_manha: bool = False
    coffee_break_tarde: bool = False
    almoco: bool = False
    jantar: bool = False
    cerimonial: bool = False

class EventoUpdate(SQLModel):
    nome: Optional[str] = Field(None, min_length=1, max_length=200)
    unidade_responsavel: Optional[str] = Field(None, min_length=1, max_length=200)
    quantidade_pessoas: Optional[int] = Field(None, gt=0)
    mes_previsto: Optional[str] = Field(None, min_length=1, max_length=50)
    coffee_break_manha: Optional[bool] = None
    coffee_break_tarde: Optional[bool] = None
    almoco: Optional[bool] = None
    jantar: Optional[bool] = None
    cerimonial: Optional[bool] = None

# Schemas para resposta
class EventoRead(SQLModel):
    id: int
    nome: str
    unidade_responsavel: str
    quantidade_pessoas: int
    mes_previsto: str
    coffee_break_manha: bool
    coffee_break_tarde: bool
    almoco: bool
    jantar: bool
    cerimonial: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    unidade_id: Optional[int] = None

class UnidadeCreate(SQLModel):
    nome_unidade: str = Field(..., min_length=1, max_length=200)

class UnidadeRead(SQLModel):
    id: int
    nome_unidade: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    eventos: List[EventoRead] = []

class FormSubmissionRequest(SQLModel):
    nome_unidade: str = Field(..., min_length=1, max_length=200)
    eventos: List[EventoCreate] = Field(..., min_items=1)

class ApiResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    data: Optional[dict] = None
    errors: Optional[dict] = None

class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    version: str
