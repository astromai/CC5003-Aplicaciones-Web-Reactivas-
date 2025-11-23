import { create } from 'zustand';
import loginService from '../services/login';
import type { User } from '../types/user';
import { AxiosError } from 'axios';

interface Credentials {
  username: string;
  password: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: Credentials) => Promise<void>;
  register: (credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  // Estado inicial
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const user = await loginService.login(credentials);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error en login:', error);
      set({
        error: 'Error al hacer login. Revisa tus credenciales.',
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  register: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      await loginService.register(credentials);
      // Después de registrar, hacer login
      await loginService.login(credentials);
      const loggedUser = await loginService.restoreLogin();
      set({
        user: loggedUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: unknown) {
      console.error('Error en registro:', error);
      const message = error instanceof AxiosError
        ? error.response?.data?.error || 'Error al registrarse.'
        : 'Error al registrarse.';
      set({
        error: message,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  },

  logout: async () => {
    await loginService.logout().catch(() => {});
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const user = await loginService.restoreLogin();
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error al restaurar sesión:', error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));
