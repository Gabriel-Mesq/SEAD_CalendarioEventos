import React from 'react';
import type { EventData } from '../types/event';

interface EventFormProps {
  event: EventData;
  onEventChange: (event: EventData) => void;
  onRemoveEvent: () => void;
  eventIndex: number;
}

const EventForm: React.FC<EventFormProps> = ({
  event,
  onEventChange,
  onRemoveEvent,
  eventIndex
}) => {
  const handleInputChange = (field: keyof EventData, value: string | number | boolean) => {
    onEventChange({
      ...event,
      [field]: value
    });
  };

  return (
    <div className="event-form">
      <div className="event-form-header">
        <h4>Evento {eventIndex + 1}</h4>
        <button 
          type="button" 
          onClick={onRemoveEvent}
          className="remove-event-btn"
        >
          Remover Evento
        </button>
      </div>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor={`nome-${eventIndex}`}>Nome do Evento:</label>
          <input
            type="text"
            id={`nome-${eventIndex}`}
            value={event.nome}
            onChange={(e) => handleInputChange('nome', e.target.value)}
            placeholder="Digite o nome do evento"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor={`unidade-${eventIndex}`}>Unidade Responsável:</label>
          <input
            type="text"
            id={`unidade-${eventIndex}`}
            value={event.unidadeResponsavel}
            onChange={(e) => handleInputChange('unidadeResponsavel', e.target.value)}
            placeholder="Digite a unidade responsável"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor={`pessoas-${eventIndex}`}>Quantidade de Pessoas:</label>
          <input
            type="number"
            id={`pessoas-${eventIndex}`}
            value={event.quantidadePessoas || ''}
            onChange={(e) => handleInputChange('quantidadePessoas', parseInt(e.target.value) || 0)}
            placeholder="0"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor={`mes-${eventIndex}`}>Mês Previsto:</label>
          <input
            type="text"
            id={`mes-${eventIndex}`}
            value={event.mesPrevisto}
            readOnly
            className="readonly-input"
          />
        </div>
      </div>

      <div className="checkbox-group">
        <h5>Serviços:</h5>
        
        <div className="checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={event.coffeeBreakManha}
              onChange={(e) => handleInputChange('coffeeBreakManha', e.target.checked)}
            />
            Coffee Break (Manhã)
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={event.coffeeBreakTarde}
              onChange={(e) => handleInputChange('coffeeBreakTarde', e.target.checked)}
            />
            Coffee Break (Tarde)
          </label>
        </div>

        <div className="checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={event.almoco}
              onChange={(e) => handleInputChange('almoco', e.target.checked)}
            />
            Almoço
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={event.jantar}
              onChange={(e) => handleInputChange('jantar', e.target.checked)}
            />
            Jantar
          </label>
        </div>

        <div className="checkbox-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={event.cerimonial}
              onChange={(e) => handleInputChange('cerimonial', e.target.checked)}
            />
            Cerimonial
          </label>
        </div>
      </div>
    </div>
  );
};

export default EventForm;
