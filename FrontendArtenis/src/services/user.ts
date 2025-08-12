import { api } from './api';
import type { User } from '@/types/user';

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  language?: string;
  role?: 'user' | 'artist' | 'admin';
}

export const userService = {
  async getById(userId: string): Promise<User> {
    const res = await api.get(`/users/${userId}`);
    const wrapped = (res.data as any)?.data ?? res.data;
    return wrapped as User;
  },

  async updateProfile(payload: UpdateUserPayload): Promise<User> {
    const res = await api.patch('/users/profile', payload);
    const wrapped = res.data?.data ?? res.data;
    return wrapped as User;
  },

  async follow(userId: string): Promise<void> {
    await api.post(`/users/${userId}/follow`);
  },

  async unfollow(userId: string): Promise<void> {
    await api.delete(`/users/${userId}/follow`);
  },
};


