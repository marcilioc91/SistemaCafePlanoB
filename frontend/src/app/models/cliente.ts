import { Pessoa } from './usuario';

export interface Cliente {
  id?: number;
  pessoa: Pessoa;
  obs?: string;
}
