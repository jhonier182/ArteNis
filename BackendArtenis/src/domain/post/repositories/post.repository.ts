import { Post } from '../entities/post';

export interface CreatePostData {
  userId: string;
  title?: string;
  description?: string;
  tags?: string[];
  styles?: string[];
  mediaUrls?: string[];
  location?: {
    name?: string;
    address?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
  };
  tattooDetails?: {
    bodyPart?: string;
    size?: string;
    duration?: number;
    price?: number;
    currency?: string;
    healing?: string;
    technique?: string;
  };
  allowComments?: boolean;
  allowSharing?: boolean;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PostsResult {
  posts: Post[];
  total: number;
}

export interface FeedFilters {
  styles?: string[];
  bodyParts?: string[];
  location?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
}

export interface SearchPostsFilters {
  userId?: string;
  styles?: string[];
  tags?: string[];
  location?: string;
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  minLikes?: number;
  hasLocation?: boolean;
}

export abstract class PostRepository {
  // Métodos de lectura
  abstract findById(id: string): Promise<Post | null>;
  abstract findByUserId(userId: string, pagination: PaginationOptions): Promise<PostsResult>;
  abstract getFeed(userId: string, pagination: PaginationOptions, filters?: FeedFilters): Promise<PostsResult>;
  abstract searchPosts(query: string, filters?: SearchPostsFilters, pagination?: PaginationOptions): Promise<PostsResult>;
  abstract getPopularPosts(pagination: PaginationOptions, timeframe?: 'day' | 'week' | 'month'): Promise<PostsResult>;
  abstract getRecentPosts(pagination: PaginationOptions): Promise<PostsResult>;
  abstract getPostsByStyle(style: string, pagination: PaginationOptions): Promise<PostsResult>;
  abstract getPostsByLocation(location: string, pagination: PaginationOptions): Promise<PostsResult>;

  // Métodos de escritura
  abstract create(data: CreatePostData): Promise<Post>;
  abstract update(id: string, data: Partial<Post>): Promise<Post>;
  abstract delete(id: string): Promise<void>;

  // Métodos de interacción
  abstract incrementViews(id: string): Promise<void>;
  abstract incrementLikes(id: string): Promise<void>;
  abstract decrementLikes(id: string): Promise<void>;
  abstract incrementComments(id: string): Promise<void>;
  abstract decrementComments(id: string): Promise<void>;
  abstract incrementShares(id: string): Promise<void>;
  abstract incrementSaves(id: string): Promise<void>;
  abstract decrementSaves(id: string): Promise<void>;

  // Métodos de estadísticas
  abstract getUserPostsCount(userId: string): Promise<number>;
  abstract getUserLikesCount(userId: string): Promise<number>;
  abstract getPostStats(id: string): Promise<{
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  }>;

  // Métodos de moderación
  abstract reportPost(id: string, reason: string): Promise<void>;
  abstract approvePost(id: string): Promise<void>;
  abstract rejectPost(id: string, reason: string): Promise<void>;
}
