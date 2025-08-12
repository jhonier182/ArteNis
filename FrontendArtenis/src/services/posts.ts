import { api } from './api';

export interface SavedPostsResponse {
  posts: Array<{
    id: string;
    mediaUrls?: string[];
    title?: string;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const postsService = {
  async getMySaved(page = 1, limit = 24): Promise<SavedPostsResponse> {
    const res = await api.get(`/posts/me/saved`, { params: { page, limit } });
    const wrapped = (res.data as any)?.data ?? res.data;
    return wrapped as SavedPostsResponse;
  },

  async like(postId: string): Promise<void> {
    await api.post(`/posts/${postId}/like`);
  },
  async unlike(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}/like`);
  },
  async save(postId: string): Promise<void> {
    await api.post(`/posts/${postId}/save`);
  },
  async unsave(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}/save`);
  },
};


