import axiosSecure from '../utils/axiosSecure';
import type { RamoDetalle } from '../types';

export function buildRamoDetalle(raw: any): RamoDetalle {
  return {
    id: String(raw._id || raw.id),
    nombre: raw.nombre,
    codigo: raw.codigo,
    creditos: raw.creditos,
    descripcion: raw.descripcion,
    porcentajeAprobacion: raw.porcentajeAprobacion,
    estado: undefined
  };
}

// Obtener todos los ramos disponibles
export async function getRamosDisponibles(): Promise<RamoDetalle[]> {
  const response = await axiosSecure.get('/api/ramos');
  return response.data.map(buildRamoDetalle);
}

// Obtener detalle de un ramo específico
export async function getRamoById(ramoId: string): Promise<RamoDetalle> {
  const response = await axiosSecure.get(`/api/ramos/${ramoId}`);
  return buildRamoDetalle(response.data);
}