import React, { useState, useEffect } from 'react';
import { apiService, type ApiEventData } from '../services/api';
import ContractExecution from './ContractExecution';
import './ContractExecution.css';

interface ConsolidatedEvent extends ApiEventData {
  id?: string;
}

interface MonthSummary {
  month: string;
  eventCount: number;
  totalPeople: number;
  events: ConsolidatedEvent[];
}

interface ServicesSummary {
  coffeeBreakManha: number;
  coffeeBreakTarde: number;
  almoco: number;
  jantar: number;
  cerimonial: number;
}

const EventsConsolidation: React.FC = () => {
  const [events, setEvents] = useState<ConsolidatedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getEvents();
      
      if (!response.success) {
        setError(response.message || 'Erro ao carregar eventos');
        return;
      }
      
      setEvents(response.data || []);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const getMonthSummaries = (): MonthSummary[] => {
    const monthMap = new Map<string, MonthSummary>();

    events.forEach(event => {
      const month = event.mes_previsto;
      
      if (!monthMap.has(month)) {
        monthMap.set(month, {
          month,
          eventCount: 0,
          totalPeople: 0,
          events: []
        });
      }

      const summary = monthMap.get(month)!;
      summary.eventCount++;
      summary.totalPeople += event.quantidade_pessoas;
      summary.events.push(event);
    });

    return Array.from(monthMap.values()).sort((a, b) => {
      const monthOrder = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                         'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
  };

  const getServicesSummary = (): ServicesSummary => {
    return events.reduce((acc, event) => ({
      coffeeBreakManha: acc.coffeeBreakManha + (event.coffee_break_manha ? 1 : 0),
      coffeeBreakTarde: acc.coffeeBreakTarde + (event.coffee_break_tarde ? 1 : 0),
      almoco: acc.almoco + (event.almoco ? 1 : 0),
      jantar: acc.jantar + (event.jantar ? 1 : 0),
      cerimonial: acc.cerimonial + (event.cerimonial ? 1 : 0),
    }), {
      coffeeBreakManha: 0,
      coffeeBreakTarde: 0,
      almoco: 0,
      jantar: 0,
      cerimonial: 0,
    });
  };

  const getFilteredEvents = () => {
    if (selectedMonth === 'all') return events;
    return events.filter(event => event.mes_previsto === selectedMonth);
  };
  
  const getTotalPeople = () => {
    return getFilteredEvents().reduce((total, event) => total + event.quantidade_pessoas, 0);
  };
  
  const getUniqueMonths = () => {
    const months = [...new Set(events.map(event => event.mes_previsto))];
    const monthOrder = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      return months.sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));
    };
    
    if (loading) {
      return (
        <div className="consolidation-container">
        <div className="loading">
          <p>Carregando eventos...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="consolidation-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadEvents} className="retry-btn">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }
  
  const monthSummaries = getMonthSummaries();
  const servicesSummary = getServicesSummary();
  const filteredEvents = getFilteredEvents();
  
  // Função para calcular custo estimado de um evento
  const calcularCustoEstimado = (event: ApiEventData) => {
    const pessoas = event.quantidade_pessoas || 0;
    let total = 0;
    if (event.coffee_break_manha) total += 50 * pessoas;
    if (event.coffee_break_tarde) total += 50 * pessoas;
    if (event.almoco) total += 70 * pessoas;
    if (event.jantar) total += 70 * pessoas;
    if (event.cerimonial) total += 990;
    return total;
  };

  return (
    <div className="consolidation-container">
      <div className="consolidation-header">
        <h2>Consolidação de Eventos</h2>
        <button onClick={loadEvents} className="refresh-btn">
          Atualizar Dados
        </button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total de Eventos</h3>
          <p className="stat-number">{events.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total de Pessoas</h3>
          <p className="stat-number">{getTotalPeople().toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Meses com Eventos</h3>
          <p className="stat-number">{monthSummaries.length}</p>
        </div>
        <div className="stat-card">
          <h3>Média por Evento</h3>
          <p className="stat-number">
            {events.length > 0 ? Math.round(getTotalPeople() / events.length) : 0}
          </p>
        </div>
      </div>

      {/* Resumo por Serviços */}
      <div className="services-summary">
        <h3>Resumo de Serviços Solicitados</h3>
        <div className="services-grid">
          <div className="service-item">
            <span>Coffee Break (Manhã):</span>
            <strong>{servicesSummary.coffeeBreakManha}</strong>
          </div>
          <div className="service-item">
            <span>Coffee Break (Tarde):</span>
            <strong>{servicesSummary.coffeeBreakTarde}</strong>
          </div>
          <div className="service-item">
            <span>Almoço:</span>
            <strong>{servicesSummary.almoco}</strong>
          </div>
          <div className="service-item">
            <span>Jantar:</span>
            <strong>{servicesSummary.jantar}</strong>
          </div>
          <div className="service-item">
            <span>Cerimonial:</span>
            <strong>{servicesSummary.cerimonial}</strong>
          </div>
        </div>
      </div>

      {/* Filtro por Mês */}
      <div className="filter-section">
        <label htmlFor="month-filter">Filtrar por mês:</label>
        <select
          id="month-filter"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="month-filter"
        >
          <option value="all">Todos os meses</option>
          {getUniqueMonths().map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      {/* Resumo por Mês */}
      <div className="months-summary">
        <h3>Resumo por Mês</h3>
        <div className="months-grid">
          {monthSummaries.map(summary => (
            <div key={summary.month} className="month-summary-card">
              <h4>{summary.month}</h4>
              <p>{summary.eventCount} evento(s)</p>
              <p>{summary.totalPeople.toLocaleString()} pessoas</p>
            </div>
          ))}
        </div>
      </div>
      
      <ContractExecution contractTotal={306741.50} events={events} />

      {/* Lista Detalhada de Eventos */}
      <div className="events-list">
        <h3>
          Eventos Detalhados 
          {selectedMonth !== 'all' && ` - ${selectedMonth}`}
          <span className="events-count">({filteredEvents.length} evento(s))</span>
        </h3>
        
        {filteredEvents.length === 0 ? (
          <div className="no-events">
            <p>Nenhum evento encontrado.</p>
          </div>
        ) : (
          <div className="events-table">
            <div className="table-header">
              <div>Nome do Evento</div>
              <div>Unidade Responsável</div>
              <div>Mês</div>
              <div>Pessoas</div>
              <div>Serviços</div>
              <div>Preço Estimado</div>
            </div>
            
            {filteredEvents.map((event, index) => (
              <div key={index} className="table-row">
                <div className="event-name">{event.nome}</div>
                <div className="event-unit">{event.unidade_responsavel}</div>
                <div className="event-month">{event.mes_previsto}</div>
                <div className="event-people">{event.quantidade_pessoas}</div>
                <div className="event-services">
                  {[
                    event.coffee_break_manha && 'Coffee Manhã',
                    event.coffee_break_tarde && 'Coffee Tarde',
                    event.almoco && 'Almoço',
                    event.jantar && 'Jantar',
                    event.cerimonial && 'Cerimonial'
                  ].filter(Boolean).join(', ') || 'Nenhum'}
                </div>
                <div className="event-price">
                  R$ {calcularCustoEstimado(event).toLocaleString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsConsolidation;