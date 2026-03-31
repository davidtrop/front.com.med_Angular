export interface Endereco {
  logradouro: string;
  bairro: string;
  cep: string;
  numero: string;
  complemento: string;
  cidade: string;
  uf: string;
}

export interface Medico {
  id?: number;
  nome: string;
  email: string;
  crm: string;
  telefone: string;
  especialidade: string;
  endereco: Endereco;
  ativo?: boolean;
}
