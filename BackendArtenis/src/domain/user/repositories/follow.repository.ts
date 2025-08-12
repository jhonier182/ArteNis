import { User } from '../entities/user';

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
}

export interface CreateFollowData {
  followerId: string;
  followingId: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface FollowersResult {
  followers: User[];
  total: number;
}

export interface FollowingResult {
  following: User[];
  total: number;
}

export abstract class FollowRepository {
  abstract create(data: CreateFollowData): Promise<Follow>;
  abstract delete(id: string): Promise<void>;
  abstract findByFollowerAndFollowing(followerId: string, followingId: string): Promise<Follow | null>;
  abstract getUserFollowers(userId: string, pagination: PaginationOptions): Promise<FollowersResult>;
  abstract getUserFollowing(userId: string, pagination: PaginationOptions): Promise<FollowingResult>;
  abstract getFollowersCount(userId: string): Promise<number>;
  abstract getFollowingCount(userId: string): Promise<number>;
  abstract isFollowing(followerId: string, followingId: string): Promise<boolean>;
}
