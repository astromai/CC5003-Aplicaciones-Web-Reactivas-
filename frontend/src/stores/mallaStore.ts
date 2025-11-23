import { create } from 'zustand';
import { getMallasUsuario, deleteMalla as deleteMallaService, getMallaById, actualizarEstadoRamo as actualizarEstadoRamoService, eliminarRamoDeSemestre as eliminarRamoService } from '../services/mallaService';
import type { Malla, EstadoRamo } from '../types';

interface MallaState {
  mallas: Malla[];
  mallaActual: Malla | null;
  isLoading: boolean;
  error: string | null;

  fetchMallasUser: () => Promise<void>;
  fetchMallaById: (mallaId: string) => Promise<void>;
  deleteMalla: (mallaId: string) => Promise<void>;
  updateRamoEstado: (mallaId: string, ramoId: string, nuevoEstado: EstadoRamo) => Promise<void>;
  removeRamoFromSemestre: (mallaId: string, semestreNumero: number, ramoId: string) => Promise<void>;
}

export const useMallaStore = create<MallaState>((set, get) => ({
  // Estado inicial
  mallas: [],
  mallaActual: null,
  isLoading: false,
  error: null,

  fetchMallasUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const mallas = await getMallasUsuario();
      set({
        mallas,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error al cargar mallas:', error);
      set({
        error: 'Error al cargar las mallas.',
        isLoading: false,
      });
    }
  },

  deleteMalla: async (mallaId: string) => {
    try {
      await deleteMallaService(mallaId);
      
      // Actualizar estado local, filtrar la malla eliminada
      const { mallas } = get();
      set({
        mallas: mallas.filter(m => m.id !== mallaId),
        error: null,
      });
    } catch (error) {
      console.error('Error al eliminar malla:', error);
      set({
        error: 'Error al eliminar la malla.',
      });
    }
  },

  fetchMallaById: async (mallaId: string) => {
    set({ isLoading: true, error: null });
    try {
      const malla = await getMallaById(mallaId);
      set({
        mallaActual: malla,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error al cargar malla:', error);
      set({
        error: 'Error al cargar la malla.',
        isLoading: false,
        mallaActual: null,
      });
    }
  },

  updateRamoEstado: async (mallaId: string, ramoId: string, nuevoEstado: EstadoRamo) => {
    try {
      const mallaActualizada = await actualizarEstadoRamoService(mallaId, ramoId, nuevoEstado);
      set({
        mallaActual: mallaActualizada,
        error: null,
      });
    } catch (error) {
      console.error('Error al actualizar estado del ramo:', error);
      set({
        error: 'Error al actualizar el estado del ramo.',
      });
    }
  },

  removeRamoFromSemestre: async (mallaId: string, semestreNumero: number, ramoId: string) => {
    try {
      const mallaActualizada = await eliminarRamoService(mallaId, semestreNumero, ramoId);
      set({
        mallaActual: mallaActualizada,
        error: null,
      });
    } catch (error) {
      console.error('Error al eliminar ramo:', error);
      set({
        error: 'Error al eliminar el ramo.',
      });
    }
  },
}));
