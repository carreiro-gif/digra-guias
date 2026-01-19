
export enum StatusServico {
  PENDENTE = 'Pendente',
  EM_ANDAMENTO = 'Em Andamento',
  CONCLUIDO = 'Concluído',
  ENTREGUE = 'Entregue'
}

export interface Orgao {
  id: string;
  sigla: string;
  nome: string;
  comarca: string;
  forum: string;
  endereco: string;
  telefone: string;
  cep?: string;
}

export interface Operador {
  id: string;
  nome: string;
}

export interface ResponsavelExterno {
  id: string;
  nome: string;
}

export interface ServicoPreco {
  id: string;
  descricao: string;
  categoria: 'Programacao' | 'Sinalizacao' | 'Impressao';
  valorUnitario: number;
}

export interface ItemGuia {
  id: string;
  servicoId: string;
  descricao: string; // Copied from ServicoPreco or custom
  detalhes: string; // formato, gramatura, acabamento, cor
  quantidade: number;
  valorUnitario: number;
  midia?: string;
  operadores?: string[];
  status: StatusServico;
}

export interface Guia {
  id: string;
  numero: string; // Ex: 2024/0001
  dataEmissao: string;
  orgaoId: string;
  orgaoSnapshot: Orgao; // Store copy in case org changes
  itens: ItemGuia[];
  observacoes: string;
  solicitante: string; // Nome da pessoa que pediu
  responsaveisExternos: string[]; // Lista de nomes selecionados
  numeroProcesso?: string;
  processoAtivo?: boolean;
}

export interface DraftGuideParams {
  orgaoQuery: string;
  items: {
    servicoQuery: string;
    quantidade: number;
    detalhes?: string;
  }[];
  solicitante?: string;
}