import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

import type { User } from '@/types/user';
import { authService } from '@/services/auth';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login action
      login: async (email: string, password: string) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authService.login({ email, password });
          
          set((state) => {
            state.user = response.user;
            state.token = response.token;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
          });

          // Guardar token en localStorage para requests de API
          localStorage.setItem('artenis_token', response.token);
          if (response.refreshToken) localStorage.setItem('artenis_refresh', response.refreshToken);
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Error al iniciar sesión';
            state.isLoading = false;
          });
          throw error;
        }
      },

      // Register action
      register: async (userData: RegisterData) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await authService.register(userData);
          
          set((state) => {
            state.user = response.user;
            state.token = response.token;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
          });

          localStorage.setItem('artenis_token', response.token);
          if (response.refreshToken) localStorage.setItem('artenis_refresh', response.refreshToken);
        } catch (error: any) {
          set((state) => {
            state.error = error.message || 'Error al registrarse';
            state.isLoading = false;
          });
          throw error;
        }
      },

      // Logout action
      logout: () => {
        set((state) => {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.error = null;
        });

        localStorage.removeItem('artenis_token');
      },

      // Update user action
      updateUser: (userData: Partial<User>) => {
        set((state) => {
          if (state.user) {
            state.user = { ...state.user, ...userData };
          }
        });
      },

      // Clear error action
      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },

      // Set loading action
      setLoading: (loading: boolean) => {
        set((state) => {
          state.isLoading = loading;
        });
      },

      // Check auth action (validar token existente)
      checkAuth: async () => {
        const token = localStorage.getItem('artenis_token');
        
        if (!token) {
          set((state) => {
            state.isLoading = false;
          });
          return;
        }

        set((state) => {
          state.isLoading = true;
        });

        try {
          const user = await authService.getProfile();
          
          set((state) => {
            state.user = user;
            state.token = token;
            state.isAuthenticated = true;
            state.isLoading = false;
          });
        } catch (error) {
          // Token inválido o expirado
          localStorage.removeItem('artenis_token');
          set((state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.isLoading = false;
          });
        }
      },
    })),
    {
      name: 'artenis-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
