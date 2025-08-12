// Re-export all types for easy importing
export * from './user';
export * from './post';
export * from './api';

// Global types
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}
