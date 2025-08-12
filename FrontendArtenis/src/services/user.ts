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
  async updateProfile(payload: UpdateUserPayload): Promise<User> {
    const res = await api.patch('/users/profile', payload);
    const wrapped = res.data?.data ?? res.data;
    return wrapped;
  },
};


