from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from models import Evento, Unidade
import schemas

class EventoService:
    @staticmethod
    def create_evento(db: Session, evento: schemas.EventoCreate, unidade_id: int) -> Evento:
        """Cria um novo evento"""
        db_evento = Evento(
            **evento.model_dump(),
            unidade_id=unidade_id
        )
        db.add(db_evento)
        db.commit()
        db.refresh(db_evento)
        return db_evento
    
    @staticmethod
    def get_evento(db: Session, evento_id: int) -> Optional[Evento]:
        """Busca um evento por ID"""
        statement = select(Evento).where(Evento.id == evento_id)
        return db.exec(statement).first()
    
    @staticmethod
    def get_eventos(db: Session, skip: int = 0, limit: int = 100) -> List[Evento]:
        """Lista todos os eventos com paginação"""
        statement = select(Evento).offset(skip).limit(limit)
        return db.exec(statement).all()
    
    @staticmethod
    def update_evento(db: Session, evento_id: int, evento_update: schemas.EventoUpdate) -> Optional[Evento]:
        """Atualiza um evento"""
        statement = select(Evento).where(Evento.id == evento_id)
        db_evento = db.exec(statement).first()
        
        if db_evento:
            update_data = evento_update.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_evento, field, value)
            db.add(db_evento)
            db.commit()
            db.refresh(db_evento)
        return db_evento
    
    @staticmethod
    def delete_evento(db: Session, evento_id: int) -> bool:
        """Deleta um evento"""
        statement = select(Evento).where(Evento.id == evento_id)
        db_evento = db.exec(statement).first()
        
        if db_evento:
            db.delete(db_evento)
            db.commit()
            return True
        return False

class UnidadeService:
    @staticmethod
    def create_unidade(db: Session, unidade: schemas.FormSubmissionRequest) -> Unidade:
        """Cria uma nova unidade com seus eventos"""
        try:
            # Cria a unidade
            db_unidade = Unidade(nome_unidade=unidade.nome_unidade)
            db.add(db_unidade)
            db.flush()  # Para obter o ID antes do commit
            
            # Cria os eventos associados
            for evento_data in unidade.eventos:
                db_evento = Evento(
                    **evento_data.model_dump(),
                    unidade_id=db_unidade.id
                )
                db.add(db_evento)
            
            db.commit()
            db.refresh(db_unidade)
            return db_unidade
            
        except IntegrityError as e:
            db.rollback()
            raise e
    
    @staticmethod
    def get_unidade(db: Session, unidade_id: int) -> Optional[Unidade]:
        """Busca uma unidade por ID"""
        statement = select(Unidade).where(Unidade.id == unidade_id)
        return db.exec(statement).first()
    
    @staticmethod
    def get_unidades(db: Session, skip: int = 0, limit: int = 100) -> List[Unidade]:
        """Lista todas as unidades com paginação"""
        statement = select(Unidade).offset(skip).limit(limit)
        return db.exec(statement).all()
    
    @staticmethod
    def get_unidade_by_nome(db: Session, nome_unidade: str) -> Optional[Unidade]:
        """Busca uma unidade pelo nome"""
        statement = select(Unidade).where(Unidade.nome_unidade == nome_unidade)
        return db.exec(statement).first()
    
    @staticmethod
    def delete_unidade(db: Session, unidade_id: int) -> bool:
        """Deleta uma unidade e seus eventos"""
        statement = select(Unidade).where(Unidade.id == unidade_id)
        db_unidade = db.exec(statement).first()
        
        if db_unidade:
            db.delete(db_unidade)
            db.commit()
            return True
        return False
