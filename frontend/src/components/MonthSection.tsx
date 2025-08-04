import React from 'react';
import type { MonthEventData, EventData } from '../types/event';
import EventForm from './EventForm';

interface MonthSectionProps {
  monthData: MonthEventData;
  onMonthChange: (monthData: MonthEventData) => void;
  nomeSolicitante?: string; // Prop opcional para receber o nome do solicitante
}

const MonthSection: React.FC<MonthSectionProps> = ({ monthData, onMonthChange, nomeSolicitante = '' }) => {
  const handleHasEventsChange = (hasEvents: boolean) => {
    onMonthChange({
      ...monthData,
      hasEvents,
      events: hasEvents ? monthData.events : []
    });
  };

  const handleAddEvent = () => {
    const newEvent: EventData = {
      nome: '',
      unidadeResponsavel: '',
      quantidadePessoas: 0,
      mesPrevisto: monthData.month,
      coffeeBreakManha: false,
      coffeeBreakTarde: false,
      almoco: false,
      jantar: false,
      cerimonial: false,
      nomeSolicitante: nomeSolicitante // Usar o nome do solicitante recebido via props
    };

    onMonthChange({
      ...monthData,
      events: [...monthData.events, newEvent]
    });
  };

  const handleEventChange = (index: number, updatedEvent: EventData) => {
    const updatedEvents = monthData.events.map((event, i) =>
      i === index ? updatedEvent : event
    );

    onMonthChange({
      ...monthData,
      events: updatedEvents
    });
  };

  const handleRemoveEvent = (index: number) => {
    const updatedEvents = monthData.events.filter((_, i) => i !== index);
    
    onMonthChange({
      ...monthData,
      events: updatedEvents,
      hasEvents: updatedEvents.length > 0
    });
  };

  return (
    <div className="month-section">
      <div className="month-header">
        <label className="month-checkbox">
          <input
            type="checkbox"
            checked={monthData.hasEvents}
            onChange={(e) => handleHasEventsChange(e.target.checked)}
          />
          Terá evento em {monthData.month}?
        </label>
      </div>

      {monthData.hasEvents && (
        <div className="month-events">
          <div className="events-header">
            <h3>Eventos de {monthData.month}</h3>
            <button 
              type="button" 
              onClick={handleAddEvent}
              className="add-event-btn"
            >
              Adicionar Evento
            </button>
          </div>

          {monthData.events.length === 0 && (
            <div className="no-events">
              <p>Nenhum evento adicionado ainda. Clique em "Adicionar Evento" para começar.</p>
            </div>
          )}

          {monthData.events.map((event, index) => (
            <EventForm
              key={index}
              event={event}
              eventIndex={index}
              onEventChange={(updatedEvent) => handleEventChange(index, updatedEvent)}
              onRemoveEvent={() => handleRemoveEvent(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthSection;
