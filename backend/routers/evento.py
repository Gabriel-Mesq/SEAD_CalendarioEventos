from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from datetime import datetime

from db import get_session
from models import (
    Evento, EventoCreate, EventoRead, EventoUpdate, EventoWithUnidade,
    FormSubmissionData, EventoFormData, MonthEnum, ApiResponse, EventoStats,
    Unidade
)

router = APIRouter(prefix="/api/eventos", tags=["eventos"])


@router.post("", response_model=ApiResponse)
async def submit_form(form_data: FormSubmissionData, session: Session = Depends(get_session)):
    """Submeter formulário completo com unidade e eventos"""
    try:
        # Verificar se unidade já existe
        statement = select(Unidade).where(Unidade.nome_unidade == form_data.nome_unidade)
        existing_unidade = session.exec(statement).first()
        
        if existing_unidade:
            unidade = existing_unidade
        else:
            # Criar nova unidade
            unidade = Unidade(nome_unidade=form_data.nome_unidade)
            session.add(unidade)
            session.commit()
            session.refresh(unidade)
        
        # Criar eventos
        eventos_criados = []
        for evento_data in form_data.eventos:
            # Converter string do mês para enum
            try:
                mes_enum = MonthEnum(evento_data.mes_previsto)
            except ValueError:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Mês inválido: {evento_data.mes_previsto}"
                )
            
            evento = Evento(
                nome=evento_data.nome,
                unidade_responsavel=evento_data.unidade_responsavel,
                quantidade_pessoas=evento_data.quantidade_pessoas,
                mes_previsto=mes_enum,
                coffee_break_manha=evento_data.coffee_break_manha,
                coffee_break_tarde=evento_data.coffee_break_tarde,
                almoco=evento_data.almoco,
                jantar=evento_data.jantar,
                cerimonial=evento_data.cerimonial,
                unidade_id=unidade.id
            )
            
            session.add(evento)
            eventos_criados.append(evento)
        
        session.commit()
        
        return ApiResponse(
            success=True,
            message=f"Formulário submetido com sucesso. {len(eventos_criados)} eventos criados.",
            data={
                "unidade_id": unidade.id,
                "eventos_count": len(eventos_criados)
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        session.rollback()
        return ApiResponse(
            success=False,
            message="Erro ao processar formulário",
            errors={"detail": str(e)}
        )

@router.get("", response_model=List[EventoWithUnidade])
async def get_eventos(session: Session = Depends(get_session)):
    """Listar todos os eventos com informações da unidade"""
    statement = select(Evento)
    eventos = session.exec(statement).all()
    
    eventos_with_unidade = []
    for evento in eventos:
        evento_dict = evento.model_dump()
        if evento.unidade:
            evento_dict["unidade"] = evento.unidade.model_dump()
        eventos_with_unidade.append(EventoWithUnidade(**evento_dict))
    
    return eventos_with_unidade


@router.get("/{evento_id}", response_model=EventoWithUnidade)
async def get_evento(evento_id: int, session: Session = Depends(get_session)):
    """Obter evento específico por ID"""
    evento = session.get(Evento, evento_id)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    
    evento_dict = evento.model_dump()
    if evento.unidade:
        evento_dict["unidade"] = evento.unidade.model_dump()
    
    return EventoWithUnidade(**evento_dict)


@router.put("/{evento_id}", response_model=ApiResponse)
async def update_evento(
    evento_id: int, 
    evento_update: EventoUpdate, 
    session: Session = Depends(get_session)
):
    """Atualizar evento existente"""
    evento = session.get(Evento, evento_id)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    
    try:
        evento_data = evento_update.model_dump(exclude_unset=True)
        for field, value in evento_data.items():
            setattr(evento, field, value)
        
        evento.updated_at = datetime.utcnow()
        session.add(evento)
        session.commit()
        session.refresh(evento)
        
        return ApiResponse(
            success=True,
            message="Evento atualizado com sucesso",
            data={"evento": evento.model_dump()}
        )
    except Exception as e:
        session.rollback()
        return ApiResponse(
            success=False,
            message="Erro ao atualizar evento",
            errors={"detail": str(e)}
        )


@router.delete("/{evento_id}", response_model=ApiResponse)
async def delete_evento(evento_id: int, session: Session = Depends(get_session)):
    """Deletar evento"""
    evento = session.get(Evento, evento_id)
    if not evento:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    
    try:
        session.delete(evento)
        session.commit()
        
        return ApiResponse(
            success=True,
            message="Evento deletado com sucesso"
        )
    except Exception as e:
        session.rollback()
        return ApiResponse(
            success=False,
            message="Erro ao deletar evento",
            errors={"detail": str(e)}
        )


@router.get("/mes/{mes}", response_model=List[EventoWithUnidade])
async def get_eventos_por_mes(mes: MonthEnum, session: Session = Depends(get_session)):
    """Obter eventos de um mês específico"""
    statement = select(Evento).where(Evento.mes_previsto == mes)
    eventos = session.exec(statement).all()
    
    eventos_with_unidade = []
    for evento in eventos:
        evento_dict = evento.model_dump()
        if evento.unidade:
            evento_dict["unidade"] = evento.unidade.model_dump()
        eventos_with_unidade.append(EventoWithUnidade(**evento_dict))
    
    return eventos_with_unidade


@router.get("/stats/resumo", response_model=EventoStats)
async def get_stats(session: Session = Depends(get_session)):
    """Obter estatísticas dos eventos"""
    # Total de eventos
    eventos_statement = select(Evento)
    eventos = session.exec(eventos_statement).all()
    total_eventos = len(eventos)
    
    # Total de unidades
    unidades_statement = select(Unidade)
    unidades = session.exec(unidades_statement).all()
    total_unidades = len(unidades)
    
    # Eventos por mês
    eventos_por_mes = {}
    pessoas_por_mes = {}
    for evento in eventos:
        mes = evento.mes_previsto.value
        eventos_por_mes[mes] = eventos_por_mes.get(mes, 0) + 1
        pessoas_por_mes[mes] = pessoas_por_mes.get(mes, 0) + evento.quantidade_pessoas
    
    # Serviços mais solicitados
    servicos = {
        "Coffee Break Manhã": sum(1 for e in eventos if e.coffee_break_manha),
        "Coffee Break Tarde": sum(1 for e in eventos if e.coffee_break_tarde),
        "Almoço": sum(1 for e in eventos if e.almoco),
        "Jantar": sum(1 for e in eventos if e.jantar),
        "Cerimonial": sum(1 for e in eventos if e.cerimonial)
    }
    
    return EventoStats(
        total_eventos=total_eventos,
        total_unidades=total_unidades,
        eventos_por_mes=eventos_por_mes,
        pessoas_por_mes=pessoas_por_mes,
        servicos_mais_solicitados=servicos
    )