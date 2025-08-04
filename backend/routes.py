from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_session
from services import EventoService, UnidadeService
import schemas
from datetime import datetime

router = APIRouter()

@router.post("/eventos", response_model=schemas.ApiResponse)
async def create_form_submission(
    form_data: schemas.FormSubmissionRequest,
    db: Session = Depends(get_session)
):
    """
    Endpoint para submissão do formulário completo
    Cria uma unidade com seus eventos
    """
    try:
        # Verifica se a unidade já existe
        existing_unidade = UnidadeService.get_unidade_by_nome(db, form_data.nome_unidade)
        
        if existing_unidade:
            return schemas.ApiResponse(
                success=False,
                message=f"Unidade '{form_data.nome_unidade}' já existe",
                errors={"nome_unidade": ["Esta unidade já foi cadastrada"]}
            )
        
        # Cria a unidade com os eventos
        unidade_create = schemas.UnidadeCreate(
            nome_unidade=form_data.nome_unidade,
            eventos=form_data.eventos
        )
        
        db_unidade = UnidadeService.create_unidade(db, unidade_create)
        
        return schemas.ApiResponse(
            success=True,
            message="Formulário enviado com sucesso",
            data={
                "unidade_id": db_unidade.id,
                "nome_unidade": db_unidade.nome_unidade,
                "total_eventos": len(db_unidade.eventos)
            }
        )
        
    except Exception as e:
        return schemas.ApiResponse(
            success=False,
            message="Erro interno do servidor",
            errors={"server": [str(e)]}
        )

@router.get("/eventos", response_model=List[schemas.EventoResponse])
async def get_all_eventos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_session)
):
    """Lista todos os eventos"""
    eventos = EventoService.get_eventos(db, skip=skip, limit=limit)
    return eventos

@router.get("/eventos/{evento_id}", response_model=schemas.EventoResponse)
async def get_evento(evento_id: int, db: Session = Depends(get_session)):
    """Busca um evento específico por ID"""
    evento = EventoService.get_evento(db, evento_id)
    if evento is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evento não encontrado"
        )
    return evento

@router.put("/eventos/{evento_id}", response_model=schemas.EventoResponse)
async def update_evento(
    evento_id: int,
    evento_update: schemas.EventoUpdate,
    db: Session = Depends(get_session)
):
    """Atualiza um evento"""
    evento = EventoService.update_evento(db, evento_id, evento_update)
    if evento is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evento não encontrado"
        )
    return evento

@router.delete("/eventos/{evento_id}")
async def delete_evento(evento_id: int, db: Session = Depends(get_session)):
    """Deleta um evento"""
    success = EventoService.delete_evento(db, evento_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evento não encontrado"
        )
    return {"message": "Evento deletado com sucesso"}

@router.get("/unidades", response_model=List[schemas.UnidadeResponse])
async def get_all_unidades(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_session)
):
    """Lista todas as unidades com seus eventos"""
    unidades = UnidadeService.get_unidades(db, skip=skip, limit=limit)
    return unidades

@router.get("/unidades/{unidade_id}", response_model=schemas.UnidadeResponse)
async def get_unidade(unidade_id: int, db: Session = Depends(get_session)):
    """Busca uma unidade específica por ID"""
    unidade = UnidadeService.get_unidade(db, unidade_id)
    if unidade is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unidade não encontrada"
        )
    return unidade

@router.delete("/unidades/{unidade_id}")
async def delete_unidade(unidade_id: int, db: Session = Depends(get_session)):
    """Deleta uma unidade e todos os seus eventos"""
    success = UnidadeService.delete_unidade(db, unidade_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unidade não encontrada"
        )
    return {"message": "Unidade e seus eventos deletados com sucesso"}

@router.get("/health", response_model=schemas.HealthResponse)
async def health_check():
    """Endpoint para verificar a saúde da API"""
    return schemas.HealthResponse(
        status="healthy",
        timestamp=datetime.now(),
        version="1.0.0"
    )
