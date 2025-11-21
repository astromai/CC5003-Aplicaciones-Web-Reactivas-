import type { EstadoRamo } from './estado';

export interface RamoBase {
  id: string; // MongoDB _id
  nombre: string;
  codigo: string;
  creditos: number;
  estado?: EstadoRamo;
}

export interface RamoDetalle extends RamoBase {
  descripcion: string;
  porcentajeAprobacion: number;
}