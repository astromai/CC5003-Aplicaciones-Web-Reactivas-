import { create } from 'zustand';
import { getMallasUsuario, deleteMalla as deleteMallaService } from '../services/mallaService';
import type { Malla } from '../types';

interface MallaState {
  mallas: Malla[];
  isLoading: boolean;
  error: string | null;

  fetchMallasUser: () => Promise<void>;
  deleteMalla: (mallaId: string) => Promise<void>;
}

export const useMallaStore = create<MallaState>((set, get) => ({
  // Estado inicial
  mallas: [],
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
}));
