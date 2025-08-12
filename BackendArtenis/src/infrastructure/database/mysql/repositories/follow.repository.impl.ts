import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FollowRepository, Follow, CreateFollowData, PaginationOptions, FollowersResult, FollowingResult } from '@domain/user/repositories/follow.repository';
import { FollowEntity } from '../entities/follow.entity';
import { UserEntity } from '../entities/user.entity';
import { User } from '@domain/user/entities/user';

@Injectable()
export class FollowRepositoryImpl implements FollowRepository {
  constructor(
    @InjectRepository(FollowEntity)
    private readonly followRepository: Repository<FollowEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(data: CreateFollowData): Promise<Follow> {
    const followEntity = this.followRepository.create(data);
    const savedFollow = await this.followRepository.save(followEntity);
    
    return {
      id: savedFollow.id,
      followerId: savedFollow.followerId,
      followingId: savedFollow.followingId,
      createdAt: savedFollow.createdAt,
    };
  }

  async delete(id: string): Promise<void> {
    await this.followRepository.delete(id);
  }

  async findByFollowerAndFollowing(followerId: string, followingId: string): Promise<Follow | null> {
    const followEntity = await this.followRepository.findOne({
      where: { followerId, followingId },
    });

    if (!followEntity) {
      return null;
    }

    return {
      id: followEntity.id,
      followerId: followEntity.followerId,
      followingId: followEntity.followingId,
      createdAt: followEntity.createdAt,
    };
  }

  async getUserFollowers(userId: string, pagination: PaginationOptions): Promise<FollowersResult> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [followers, total] = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('follows', 'follow', 'follow.followerId = user.id')
      .where('follow.followingId = :userId', { userId })
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      followers: followers.map(this.mapUserEntityToDomain),
      total,
    };
  }

  async getUserFollowing(userId: string, pagination: PaginationOptions): Promise<FollowingResult> {
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    const [following, total] = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('follows', 'follow', 'follow.followingId = user.id')
      .where('follow.followerId = :userId', { userId })
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      following: following.map(this.mapUserEntityToDomain),
      total,
    };
  }

  async getFollowersCount(userId: string): Promise<number> {
    return this.followRepository.count({
      where: { followingId: userId },
    });
  }

  async getFollowingCount(userId: string): Promise<number> {
    return this.followRepository.count({
      where: { followerId: userId },
    });
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { followerId, followingId },
    });
    return !!follow;
  }

  private mapUserEntityToDomain(userEntity: UserEntity): User {
    return new User(
      userEntity.id,
      userEntity.email,
      userEntity.username,
      userEntity.firstName,
      userEntity.lastName,
      userEntity.role as any,
      userEntity.status as any,
      userEntity.avatar,
      userEntity.bio,
      userEntity.phone,
      userEntity.dateOfBirth,
      userEntity.language,
      userEntity.emailVerified,
      userEntity.phoneVerified,
      userEntity.isPremium,
      userEntity.premiumExpiresAt,
      userEntity.lastLoginAt,
      userEntity.preferences,
      userEntity.createdAt,
      userEntity.updatedAt,
      userEntity.followersCount,
      userEntity.followingCount,
    );
  }
}
