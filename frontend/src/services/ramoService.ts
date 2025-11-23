import axiosSecure from '../utils/axiosSecure';
import type { RamoDetalle, RamoFiltersResponse } from '../types';

// Obtener todos los ramos disponibles
export async function getRamosDisponibles(): Promise<RamoDetalle[]> {
  const response = await axiosSecure.get('/api/ramos');
  return response.data;
}

// Obtener ramos filtrados
export async function getRamosFiltrados(params: { nivel?: string; categoria?: string; area?: string; prefix?: string }): Promise<RamoDetalle[]> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k,v]) => { if (v) query.append(k, v); });
  const response = await axiosSecure.get(`/api/ramos?${query.toString()}`);
  return response.data;
}

// Obtener filtros disponibles
export async function getRamoFilters(): Promise<RamoFiltersResponse> {
  const response = await axiosSecure.get('/api/ramos/filters');
  return response.data as RamoFiltersResponse;
}

// Obtener detalle de un ramo específico
export async function getRamoById(ramoId: string): Promise<RamoDetalle> {
  const response = await axiosSecure.get(`/api/ramos/${ramoId}`);
  return response.data;
}