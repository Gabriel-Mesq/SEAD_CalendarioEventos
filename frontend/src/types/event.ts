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
  // Subsecretaria de Gestão e Desenvolvimento de Pessoas
  'Subsecretaria de Gestão e Desenvolvimento de Pessoas',
  'Superintendência Central de Desenvolvimento Estratégico de Pessoal',
  'Superintendência Central de Gestão de Pessoal',
  'Superintendência de Recrutamento e Seleção',
  
  // Subsecretaria de Inovação da Gestão e dos Serviços Públicos
  'Subsecretaria de Inovação da Gestão e dos Serviços Públicos',
  'Superintendência Central de Transformação Pública',
  'Superintendência de Inovação da Gestão Pública',
  'Superintendência da Gestão do Atendimento ao Cidadão',
  
  // Subsecretaria de Logística e Patrimônio
  'Subsecretaria de Logística e Patrimônio',
  'Superintendência Central do Patrimônio Imobiliário',
  'Superintendência Central de Logística e Patrimônio Mobiliário',
  'Superintendência Central de Compras e Contratos',
  
  // Diretorias Executivas
  'Diretoria Executiva da Liquidação de Estatais',
  'Diretoria Executiva de Saúde e Segurança do Servidor',
  'Diretoria Executiva da Escola de Governo',
  
  // Superintendências
  'Superintendência de Gestão Integrada',
  'Superintendência de Sistemas de Informação'
] as const;

export type Unidade = typeof UNIDADES[number];
