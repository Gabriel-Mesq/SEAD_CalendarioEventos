from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class EventoBase(BaseModel):
    nome: str = Field(..., min_length=1, max_length=200)
    unidade_responsavel: str = Field(..., min_length=1, max_length=200)
    quantidade_pessoas: int = Field(..., gt=0)
    mes_previsto: str = Field(..., min_length=1)
    coffee_break_manha: bool = False
    coffee_break_tarde: bool = False
    almoco: bool = False
    jantar: bool = False
    cerimonial: bool = False

class EventoCreate(EventoBase):
    pass

class EventoUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=1, max_length=200)
    unidade_responsavel: Optional[str] = Field(None, min_length=1, max_length=200)
    quantidade_pessoas: Optional[int] = Field(None, gt=0)
    mes_previsto: Optional[str] = Field(None, min_length=1)
    coffee_break_manha: Optional[bool] = None
    coffee_break_tarde: Optional[bool] = None
    almoco: Optional[bool] = None
    jantar: Optional[bool] = None
    cerimonial: Optional[bool] = None

class EventoResponse(EventoBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UnidadeBase(BaseModel):
    nome_unidade: str = Field(..., min_length=1, max_length=200)

class UnidadeCreate(UnidadeBase):
    eventos: List[EventoCreate] = []

class UnidadeResponse(UnidadeBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    eventos: List[EventoResponse] = []
    
    class Config:
        from_attributes = True

class FormSubmissionRequest(BaseModel):
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
