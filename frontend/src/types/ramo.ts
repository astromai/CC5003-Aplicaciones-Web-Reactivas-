import type { EstadoRamo } from './estado';

export interface RamoBase {
  id: string; // MongoDB _id
  nombre: string;
  codigo: string;
  creditos: number;
  estado?: EstadoRamo;
  nivel?: 'Plan Común' | 'Especialidad';
  categoria?: string;
  area?: string;
}

export interface RamoDetalle extends RamoBase {
  descripcion: string;
  porcentajeAprobacion: number;
}

export interface RamoFiltersResponse {
  niveles: string[];
  categoriasPorNivel: Record<string, string[]>;
  planComunPrefijos: string[];
  electivoAreas: string[];
  gestionAreas: string[];
}