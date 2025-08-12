export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: import('./user').User;
  token: string;
  refreshToken?: string;
}

export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}

export interface SearchRequest {
  query: string;
  type?: 'posts' | 'users' | 'artists' | 'all';
  filters?: {
    location?: string;
    styles?: string[];
    colors?: string[];
    bodyParts?: string[];
    priceRange?: {
      min: number;
      max: number;
    };
    rating?: number;
    verified?: boolean;
  };
  sort?: 'relevance' | 'recent' | 'popular' | 'rating';
  page?: number;
  limit?: number;
}
