import { api } from './api';
import type { User } from '@/types/user';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    // Backend devuelve { accessToken, refreshToken, user }
    const { accessToken, refreshToken, user } = response.data;
    return { user, token: accessToken, refreshToken };
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Backend registra en /users/register y no devuelve token.
    await api.post('/users/register', data);
    // Iniciar sesión automáticamente después del registro
    const login = await this.login({ email: data.email, password: data.password });
    return login;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/users/profile');
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem('artenis_refresh');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch {}
  },

  async refreshToken(): Promise<{ token: string }> {
    const refreshToken = localStorage.getItem('artenis_refresh');
    const response = await api.post('/auth/refresh', { refreshToken });
    const { accessToken, refreshToken: newRefresh } = response.data;
    if (newRefresh) localStorage.setItem('artenis_refresh', newRefresh);
    return { token: accessToken };
  },
};

