import type { RamoBase } from './ramo';
import type { EstadoRamo } from './estado';

export interface SemestreEnMalla {
  numero: number;
  ramos: RamoBase[];
}

export type RamoEstadoChangeHandler = (ramoId: string, nuevoEstado: EstadoRamo) => void;