from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
import models
import schemas

class EventoService:
    @staticmethod
    def create_evento(db: Session, evento: schemas.EventoCreate, unidade_id: int) -> models.Evento:
        """Cria um novo evento"""
        db_evento = models.Evento(
            **evento.dict(),
            unidade_id=unidade_id
        )
        db.add(db_evento)
        db.commit()
        db.refresh(db_evento)
        return db_evento
    
    @staticmethod
    def get_evento(db: Session, evento_id: int) -> Optional[models.Evento]:
        """Busca um evento por ID"""
        return db.query(models.Evento).filter(models.Evento.id == evento_id).first()
    
    @staticmethod
    def get_eventos(db: Session, skip: int = 0, limit: int = 100) -> List[models.Evento]:
        """Lista todos os eventos com paginação"""
        return db.query(models.Evento).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_evento(db: Session, evento_id: int, evento_update: schemas.EventoUpdate) -> Optional[models.Evento]:
        """Atualiza um evento"""
        db_evento = db.query(models.Evento).filter(models.Evento.id == evento_id).first()
        if db_evento:
            update_data = evento_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_evento, field, value)
            db.commit()
            db.refresh(db_evento)
        return db_evento
    
    @staticmethod
    def delete_evento(db: Session, evento_id: int) -> bool:
        """Deleta um evento"""
        db_evento = db.query(models.Evento).filter(models.Evento.id == evento_id).first()
        if db_evento:
            db.delete(db_evento)
            db.commit()
            return True
        return False

class UnidadeService:
    @staticmethod
    def create_unidade(db: Session, unidade: schemas.UnidadeCreate) -> models.Unidade:
        """Cria uma nova unidade com seus eventos"""
        try:
            # Cria a unidade
            db_unidade = models.Unidade(nome_unidade=unidade.nome_unidade)
            db.add(db_unidade)
            db.flush()  # Para obter o ID antes do commit
            
            # Cria os eventos associados
            for evento_data in unidade.eventos:
                db_evento = models.Evento(
                    **evento_data.dict(),
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
    def get_unidade(db: Session, unidade_id: int) -> Optional[models.Unidade]:
        """Busca uma unidade por ID"""
        return db.query(models.Unidade).filter(models.Unidade.id == unidade_id).first()
    
    @staticmethod
    def get_unidades(db: Session, skip: int = 0, limit: int = 100) -> List[models.Unidade]:
        """Lista todas as unidades com paginação"""
        return db.query(models.Unidade).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_unidade_by_nome(db: Session, nome_unidade: str) -> Optional[models.Unidade]:
        """Busca uma unidade pelo nome"""
        return db.query(models.Unidade).filter(models.Unidade.nome_unidade == nome_unidade).first()
    
    @staticmethod
    def delete_unidade(db: Session, unidade_id: int) -> bool:
        """Deleta uma unidade e seus eventos"""
        db_unidade = db.query(models.Unidade).filter(models.Unidade.id == unidade_id).first()
        if db_unidade:
            db.delete(db_unidade)
            db.commit()
            return True
        return False
