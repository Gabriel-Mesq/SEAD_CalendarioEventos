export interface EventData {
  nome: string;
  unidadeResponsavel: string;
  quantidadePessoas: number;
  mesPrevisto: string;
  coffeeBreakManha: boolean;
  coffeeBreakTarde: boolean;
  almoco: boolean;
  jantar: boolean;
  cerimonial: boolean;
  nomeSolicitante: string; 
}

export interface MonthEventData {
  month: string;
  hasEvents: boolean;
  events: EventData[];
}

export interface FormData {
  nomeUnidade: string;
  nomeSolicitante: string;
  months: MonthEventData[];
}

export const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
] as const;

export type Month = typeof MONTHS[number];
