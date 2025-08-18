from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import datetime

from db import get_session
from models import (
    Veiculo
)

router = APIRouter(prefix="/api/frotas", tags=["frotas"])

@router.get("", response_model=List[Veiculo])
async def get_frotas(session: Session = Depends(get_session)):
    """Listar todos os veículos"""
    statement = select(Veiculo)
    veiculos = session.exec(statement).all()
    return veiculos

@router.post("", response_model=Veiculo)
async def create_frota(veiculo: Veiculo, session: Session = Depends(get_session)):
    """Criar um novo veículo"""
    session.add(veiculo)
    session.commit()
    session.refresh(veiculo)
    return veiculo