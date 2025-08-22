import React from 'react';
import type { ApiEventData } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ContractExecutionProps {
  contractTotal: number;
  events: ApiEventData[];
}

const monthOrder = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

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

const ContractExecution: React.FC<ContractExecutionProps> = ({
  contractTotal,
  events
}) => {
  // Consumo acumulado mês a mês
  let saldo = contractTotal;
  let saldoAprovado = contractTotal;
  const chartData = monthOrder.map(month => {
    const monthEvents = events.filter(e => e.mes_previsto === month);
    const consumed = monthEvents.reduce((sum, e) => sum + calcularCustoEstimado(e), 0);

    const monthApprovedEvents = monthEvents.filter(e => e.aprovado);
    const approvedConsumed = monthApprovedEvents.reduce((sum, e) => sum + calcularCustoEstimado(e), 0);

    saldo -= consumed;
    saldoAprovado -= approvedConsumed;

    return {
      month,
      saldo,
      saldoAprovado
    };
  });

  // Agrupa consumo por mês
  const consumptions = monthOrder.map(month => {
    const monthEvents = events.filter(e => e.mes_previsto === month);
    const consumed = monthEvents.reduce((sum, e) => sum + calcularCustoEstimado(e), 0);
    return { month, consumed };
  });

  const totalConsumed = consumptions.reduce((sum, m) => sum + m.consumed, 0);
  const contractBalance = contractTotal - totalConsumed;

  const approvedEvents = events.filter(e => e.aprovado);
  const approvedConsumed = approvedEvents.reduce((sum, e) => sum + calcularCustoEstimado(e), 0);
  const approvedBalance = contractTotal - approvedConsumed;

  return (
    <div className="contract-execution-section">
      <h2>Execução do Contrato</h2>
      <div className="contract-summary">
        <div>
          <strong>Valor Inicial do Contrato:</strong>
          <span>R$ {contractTotal.toLocaleString('pt-BR')}</span>
        </div>
        <div>
          <strong>Consumo Solicitado:</strong>
          <span>R$ {totalConsumed.toLocaleString('pt-BR')}</span>
        </div>
        <div>
          <strong>Saldo Restante do Contrato:</strong>
          <span>R$ {contractBalance.toLocaleString('pt-BR')}</span>
        </div>
        <div className="highlight-green">
          <strong>Consumo Aprovado:</strong>
          <span>R$ {approvedConsumed.toLocaleString('pt-BR')}</span>
        </div>
        <div className="highlight-green">
          <strong>Saldo Restante Aprovado:</strong>
          <span>R$ {approvedBalance.toLocaleString('pt-BR')}</span>
        </div>
      </div>
      <h3>Saldo do Contrato Mês a Mês</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
          <Bar dataKey="saldo" fill="#8884d8" name="Saldo Geral" />
          <Bar dataKey="saldoAprovado" fill="#21ba45" name="Saldo Aprovado" />
        </BarChart>
      </ResponsiveContainer>
      <h3>Consumo Mês a Mês</h3>
      <table className="consumption-table">
        <thead>
          <tr>
            <th>Mês</th>
            <th>Consumo (R$)</th>
          </tr>
        </thead>
        <tbody>
          {consumptions.map(({ month, consumed }) => (
            <tr key={month}>
              <td>{month}</td>
              <td>{consumed > 0 ? `R$ ${consumed.toLocaleString('pt-BR')}` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractExecution;