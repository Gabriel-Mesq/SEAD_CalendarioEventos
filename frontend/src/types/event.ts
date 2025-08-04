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

export const UNIDADES = [
  'SEAD - Secretaria de Administração',
  'SEGOV - Secretaria de Governo',
  'SEFAZ - Secretaria da Fazenda',
  'SEPLAN - Secretaria de Planejamento',
  'SECULT - Secretaria de Cultura',
  'SEDUC - Secretaria de Educação',
  'SESAU - Secretaria de Saúde',
  'SEINFRA - Secretaria de Infraestrutura',
  'SEAGRI - Secretaria de Agricultura',
  'SEMAS - Secretaria de Meio Ambiente',
  'SEJUS - Secretaria de Justiça',
  'SETASS - Secretaria de Trabalho e Assistência Social',
  'SETUR - Secretaria de Turismo',
  'SESP - Secretaria de Segurança Pública'
] as const;

export type Unidade = typeof UNIDADES[number];
