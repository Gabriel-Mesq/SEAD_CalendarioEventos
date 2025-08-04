from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from datetime import datetime

from db import get_session
from models import (
    Unidade, UnidadeCreate, UnidadeRead, UnidadeUpdate, 
    UnidadeWithEventos, ApiResponse
)

router = APIRouter(prefix="/api/unidades", tags=["unidades"])


@router.post("/", response_model=ApiResponse)
async def create_unidade(unidade: UnidadeCreate, session: Session = Depends(get_session)):
    """Criar uma nova unidade"""
    try:
        # Verificar se unidade já existe
        statement = select(Unidade).where(Unidade.nome_unidade == unidade.nome_unidade)
        existing_unidade = session.exec(statement).first()
        
        if existing_unidade:
            return ApiResponse(
                success=False,
                message="Unidade já existe",
                errors={"nome_unidade": "Esta unidade já foi cadastrada"}
            )
        
        db_unidade = Unidade.model_validate(unidade)
        db_unidade.updated_at = datetime.utcnow()
        
        session.add(db_unidade)
        session.commit()
        session.refresh(db_unidade)
        
        return ApiResponse(
            success=True,
            message="Unidade criada com sucesso",
            data={"unidade": db_unidade.model_dump()}
        )
    except Exception as e:
        session.rollback()
        return ApiResponse(
            success=False,
            message="Erro ao criar unidade",
            errors={"detail": str(e)}
        )


@router.get("/", response_model=List[UnidadeRead])
async def get_unidades(session: Session = Depends(get_session)):
    """Listar todas as unidades"""
    statement = select(Unidade)
    unidades = session.exec(statement).all()
    return [UnidadeRead.model_validate(unidade) for unidade in unidades]


@router.get("/{unidade_id}", response_model=UnidadeWithEventos)
async def get_unidade(unidade_id: int, session: Session = Depends(get_session)):
    """Obter unidade específica por ID com seus eventos"""
    unidade = session.get(Unidade, unidade_id)
    if not unidade:
        raise HTTPException(status_code=404, detail="Unidade não encontrada")
    
    unidade_dict = unidade.model_dump()
    unidade_dict["eventos"] = [evento.model_dump() for evento in unidade.eventos]
    
    return UnidadeWithEventos(**unidade_dict)


@router.put("/{unidade_id}", response_model=ApiResponse)
async def update_unidade(
    unidade_id: int, 
    unidade_update: UnidadeUpdate, 
    session: Session = Depends(get_session)
):
    """Atualizar unidade existente"""
    unidade = session.get(Unidade, unidade_id)
    if not unidade:
        raise HTTPException(status_code=404, detail="Unidade não encontrada")
    
    try:
        # Verificar se novo nome já existe (se foi fornecido)
        if unidade_update.nome_unidade:
            statement = select(Unidade).where(
                Unidade.nome_unidade == unidade_update.nome_unidade,
                Unidade.id != unidade_id
            )
            existing_unidade = session.exec(statement).first()
            
            if existing_unidade:
                return ApiResponse(
                    success=False,
                    message="Nome de unidade já existe",
                    errors={"nome_unidade": "Esta unidade já foi cadastrada"}
                )
        
        unidade_data = unidade_update.model_dump(exclude_unset=True)
        for field, value in unidade_data.items():
            setattr(unidade, field, value)
        
        unidade.updated_at = datetime.utcnow()
        session.add(unidade)
        session.commit()
        session.refresh(unidade)
        
        return ApiResponse(
            success=True,
            message="Unidade atualizada com sucesso",
            data={"unidade": unidade.model_dump()}
        )
    except Exception as e:
        session.rollback()
        return ApiResponse(
            success=False,
            message="Erro ao atualizar unidade",
            errors={"detail": str(e)}
        )


@router.delete("/{unidade_id}", response_model=ApiResponse)
async def delete_unidade(unidade_id: int, session: Session = Depends(get_session)):
    """Deletar unidade"""
    unidade = session.get(Unidade, unidade_id)
    if not unidade:
        raise HTTPException(status_code=404, detail="Unidade não encontrada")
    
    try:
        # Verificar se há eventos associados
        if unidade.eventos:
            return ApiResponse(
                success=False,
                message="Não é possível deletar unidade com eventos associados",
                errors={"eventos": f"Esta unidade possui {len(unidade.eventos)} evento(s) associado(s)"}
            )
        
        session.delete(unidade)
        session.commit()
        
        return ApiResponse(
            success=True,
            message="Unidade deletada com sucesso"
        )
    except Exception as e:
        session.rollback()
        return ApiResponse(
            success=False,
            message="Erro ao deletar unidade",
            errors={"detail": str(e)}
        )


@router.get("/nome/{nome_unidade}", response_model=UnidadeWithEventos)
async def get_unidade_by_name(nome_unidade: str, session: Session = Depends(get_session)):
    """Obter unidade por nome"""
    statement = select(Unidade).where(Unidade.nome_unidade == nome_unidade)
    unidade = session.exec(statement).first()
    
    if not unidade:
        raise HTTPException(status_code=404, detail="Unidade não encontrada")
    
    unidade_dict = unidade.model_dump()
    unidade_dict["eventos"] = [evento.model_dump() for evento in unidade.eventos]
    
    return UnidadeWithEventos(**unidade_dict)


@router.get("/search/{term}", response_model=List[UnidadeRead])
async def search_unidades(term: str, session: Session = Depends(get_session)):
    """Buscar unidades por termo no nome"""
    statement = select(Unidade).where(Unidade.nome_unidade.contains(term))
    unidades = session.exec(statement).all()
    return [UnidadeRead.model_validate(unidade) for unidade in unidades]