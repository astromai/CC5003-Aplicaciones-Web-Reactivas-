import type { SemestreEnMalla } from './semestre';

export interface Malla {
  id: string;
  nombre: string;
  semestres: SemestreEnMalla[];
  createdAt?: string;
  updatedAt?: string;
}