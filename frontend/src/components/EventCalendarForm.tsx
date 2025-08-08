import React, { useState } from 'react';
import type { FormData, MonthEventData } from '../types/event';
import { MONTHS, UNIDADES } from '../types/event';
import MonthSection from './MonthSection';
import { apiService } from '../services/api';

const EventCalendarForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nomeUnidade: '',
    nomeSolicitante: '', // Novo campo
    months: MONTHS.map(month => ({
      month,
      hasEvents: false,
      events: []
    }))
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [gerencia, setGerencia] = useState('');

  const handleUnitNameChange = (name: string) => {
    setFormData(prev => {
      // Atualizar todos os eventos existentes com a nova unidade responsável
      const updatedMonths = prev.months.map(month => ({
        ...month,
        events: month.events.map(event => ({
          ...event,
          unidadeResponsavel: name // Preencher automaticamente a unidade responsável
        }))
      }));

      return {
        ...prev,
        nomeUnidade: name,
        months: updatedMonths
      };
    });
  };

  const handleSolicitanteNameChange = (name: string) => {
    setFormData(prev => {
      // Atualizar todos os eventos existentes com o novo nome do solicitante
      const updatedMonths = prev.months.map(month => ({
        ...month,
        events: month.events.map(event => ({
          ...event,
          nomeSolicitante: name
        }))
      }));

      return {
        ...prev,
        nomeSolicitante: name,
        months: updatedMonths
      };
    });
  };

  const handleMonthChange = (monthIndex: number, updatedMonth: MonthEventData) => {
    // Garantir que todos os eventos tenham o nome do solicitante
    const monthWithSolicitante = {
      ...updatedMonth,
      events: updatedMonth.events.map(event => ({
        ...event,
        nomeSolicitante: formData.nomeSolicitante
      }))
    };

    setFormData(prev => ({
      ...prev,
      months: prev.months.map((month, index) =>
        index === monthIndex ? monthWithSolicitante : month
      )
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.nomeUnidade.trim()) {
      setSubmitMessage('Por favor, informe o nome da unidade.');
      return false;
    }

    if (!formData.nomeSolicitante.trim()) {
      setSubmitMessage('Por favor, informe o nome do solicitante.');
      return false;
    }

    const monthsWithEvents = formData.months.filter(month => month.hasEvents);
    
    if (monthsWithEvents.length === 0) {
      setSubmitMessage('Por favor, selecione pelo menos um mês com eventos.');
      return false;
    }

    for (const month of monthsWithEvents) {
      if (month.events.length === 0) {
        setSubmitMessage(`Por favor, adicione pelo menos um evento para o mês de ${month.month}.`);
        return false;
      }

      for (const event of month.events) {
        if (!event.nome.trim()) {
          setSubmitMessage(`Por favor, informe o nome do evento em ${month.month}.`);
          return false;
        }
        if (!event.unidadeResponsavel.trim()) {
          setSubmitMessage(`Por favor, informe a unidade responsável pelo evento em ${month.month}.`);
          return false;
        }
        if (event.quantidadePessoas <= 0) {
          setSubmitMessage(`Por favor, informe uma quantidade válida de pessoas para o evento em ${month.month}.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados para envio ao backend FastAPI
      const dataToSubmit = {
        nome_unidade: formData.nomeUnidade,
        nome_solicitante: formData.nomeSolicitante, // Incluir nome do solicitante
        eventos: formData.months
          .filter(month => month.hasEvents && month.events.length > 0)
          .flatMap(month => 
            month.events.map(event => ({
              nome: event.nome,
              unidade_responsavel: event.unidadeResponsavel,
              quantidade_pessoas: event.quantidadePessoas,
              mes_previsto: event.mesPrevisto,
              coffee_break_manha: event.coffeeBreakManha,
              coffee_break_tarde: event.coffeeBreakTarde,
              almoco: event.almoco,
              jantar: event.jantar,
              cerimonial: event.cerimonial,
              nome_solicitante: event.nomeSolicitante // Incluir em cada evento
            }))
          )
      };

      console.log('Dados para envio:', dataToSubmit);

      // Chamada real à API usando o apiService
      const response = await apiService.submitForm(dataToSubmit);

      if (!response.success) {
        // Tratar erros de validação específicos
        if (response.errors) {
          const errorMessages = Object.entries(response.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          setSubmitMessage(`Erro de validação:\n${errorMessages}`);
        } else {
          setSubmitMessage(response.message || 'Erro ao enviar formulário');
        }
        return;
      }

      setSubmitMessage(response.message || 'Formulário enviado com sucesso!');
      
      // Reset do formulário após sucesso
      setFormData({
        nomeUnidade: '',
        nomeSolicitante: '',
        months: MONTHS.map(month => ({
          month,
          hasEvents: false,
          events: []
        }))
      });

    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      setSubmitMessage('Erro de conexão com o servidor. Verifique sua internet e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSelectedMonthsCount = () => {
    return formData.months.filter(month => month.hasEvents).length;
  };

  const getTotalEventsCount = () => {
    return formData.months.reduce((total, month) => total + month.events.length, 0);
  };

  return (
    <div className="event-calendar-form">
      <form onSubmit={handleSubmit}>
        {/* Cabeçalho do formulário */}
        <section className="form-header-section">
          <div className="form-group">
            <label htmlFor="nomeUnidade">Nome da Unidade:</label>
            <select
              id="nomeUnidade"
              value={formData.nomeUnidade}
              onChange={(e) => handleUnitNameChange(e.target.value)}
              required
            >
              <option value="">Selecione uma unidade</option>
              {UNIDADES.map((unidade) => (
                <option key={unidade} value={unidade}>
                  {unidade}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="gerencia">Gerência:</label>
            <input
              type="text"
              id="gerencia"
              value={gerencia}
              onChange={(e) => setGerencia(e.target.value)}
              placeholder="A sigla da sua gerência"
            />
          </div>

          <div className="form-group">
            <label htmlFor="nomeSolicitante">Nome do Solicitante:</label>
            <input
              type="text"
              id="nomeSolicitante"
              value={formData.nomeSolicitante}
              onChange={(e) => handleSolicitanteNameChange(e.target.value)}
              placeholder="Digite o nome do solicitante"
              required
            />
          </div>

          {/* Resumo */}
          <div className="form-summary">
            <p><strong>Resumo:</strong></p>
            <p>Meses selecionados: {getSelectedMonthsCount()}</p>
            <p>Total de eventos: {getTotalEventsCount()}</p>
          </div>
        </section>

        {/* Seções dos meses */}
        <section className="months-section">
          <h2>Selecione os meses com eventos:</h2>
          
          {formData.months.map((month, index) => (
            <MonthSection
              key={month.month}
              monthData={month}
              nomeSolicitante={formData.nomeSolicitante}
              nomeUnidade={formData.nomeUnidade} // Passar a unidade selecionada
              onMonthChange={(updatedMonth) => handleMonthChange(index, updatedMonth)}
            />
          ))}
        </section>

        {/* Rodapé do formulário */}
        <section className="form-footer">
          {submitMessage && (
            <div className={`submit-message ${submitMessage.includes('sucesso') ? 'success' : 'error'}`}>
              {submitMessage}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Formulário'}
          </button>
        </section>
      </form>
    </div>
  );
};

export default EventCalendarForm;
