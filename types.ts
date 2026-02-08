
export interface Patient {
  id: string;
  numeroConhecimento: string;
  nomePaciente: string;
  dataEnvio: string; // ISO format: YYYY-MM-DD
  destino: string;
  dataRecebimento: string | null; // ISO format: YYYY-MM-DD or null
  observacao?: string;
  createdAt: number;
}

export type SortField = 'dataEnvio' | 'nomePaciente' | 'destino' | 'numeroConhecimento' | 'dataRecebimento' | 'createdAt' | 'observacao';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}
