// Interfaz del repositorio de usuario (puerto del dominio)
import { User } from '../entities/user';

export interface UserRepository {
  // Métodos de búsqueda
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmailOrUsername(emailOrUsername: string): Promise<User | null>;
  
  // Métodos de escritura
  save(user: User): Promise<User>;
  create(userData: CreateUserData): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
  
  // Métodos de verificación
  existsByEmail(email: string): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;
  
  // Métodos de seguimiento
  findFollowers(userId: string): Promise<User[]>;
  findFollowing(userId: string): Promise<User[]>;
  isFollowing(followerId: string, followingId: string): Promise<boolean>;
  follow(followerId: string, followingId: string): Promise<void>;
  unfollow(followerId: string, followingId: string): Promise<void>;
  
  // Métodos de búsqueda avanzada
  searchUsers(query: string, filters?: UserSearchFilters, pagination?: PaginationOptions): Promise<SearchUsersResult>;
  findRecommendedUsers(userId: string, limit?: number): Promise<User[]>;
  
  // Métodos de estadísticas
  getFollowersCount(userId: string): Promise<number>;
  getFollowingCount(userId: string): Promise<number>;
  getUserStats(userId: string): Promise<UserStats>;
}

// Tipos para el repositorio
export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

export interface UserSearchFilters {
  role?: string;
  status?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  location?: {
    city?: string;
    country?: string;
    radius?: number;
    latitude?: number;
    longitude?: number;
  };
}

export interface UserStats {
  totalPosts: number;
  totalLikes: number;
  totalComments: number;
  totalFollowers: number;
  totalFollowing: number;
  joinDate: Date;
  lastActivity: Date;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SearchUsersResult {
  users: User[];
  total: number;
}
