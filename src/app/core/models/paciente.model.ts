import { Endereco } from './medico.model';

export interface Paciente {
  id?: number;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: Endereco;
  ativo?: boolean;
}
