import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRepository, CreateUserData, UserSearchFilters, UserStats, PaginationOptions, SearchUsersResult } from '@domain/user/repositories/user.repository';
import { User, UserRole, UserStatus } from '@domain/user/entities/user';
import { UserEntity } from '../entities/user.entity';
import { FollowEntity } from '../entities/follow.entity';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    @InjectRepository(FollowEntity)
    private readonly followEntityRepository: Repository<FollowEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.userEntityRepository.findOne({
      where: { id },
      relations: ['artistProfile'],
    });

    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userEntityRepository.findOne({
      where: { email },
    });

    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userEntity = await this.userEntityRepository.findOne({
      where: { username },
    });

    return userEntity ? this.toDomain(userEntity) : null;
  }

  async findByEmailOrUsername(emailOrUsername: string): Promise<User | null> {
    const userEntity = await this.userEntityRepository.findOne({
      where: [
        { email: emailOrUsername },
        { username: emailOrUsername },
      ],
    });

    return userEntity ? this.toDomain(userEntity) : null;
  }

  async save(user: User): Promise<User> {
    const userEntity = this.toEntity(user);
    const savedEntity = await this.userEntityRepository.save(userEntity);
    return this.toDomain(savedEntity);
  }

  async create(userData: CreateUserData): Promise<User> {
    const userEntity = this.userEntityRepository.create({
      ...userData,
      role: userData.role as UserRole || UserRole.USER,
    });

    const savedEntity = await this.userEntityRepository.save(userEntity);
    return this.toDomain(savedEntity);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    await this.userEntityRepository.update(id, userData);
    const updatedEntity = await this.userEntityRepository.findOne({ where: { id } });
    
    if (!updatedEntity) {
      throw new Error('Usuario no encontrado después de la actualización');
    }

    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.userEntityRepository.delete(id);
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.userEntityRepository.count({ where: { email } });
    return count > 0;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.userEntityRepository.count({ where: { username } });
    return count > 0;
  }

  async findFollowers(userId: string): Promise<User[]> {
    const follows = await this.followEntityRepository.find({
      where: { followingId: userId },
      relations: ['follower'],
    });

    return follows.map(follow => this.toDomain(follow.follower));
  }

  async findFollowing(userId: string): Promise<User[]> {
    const follows = await this.followEntityRepository.find({
      where: { followerId: userId },
      relations: ['following'],
    });

    return follows.map(follow => this.toDomain(follow.following));
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followEntityRepository.findOne({
      where: { followerId, followingId },
    });

    return !!follow;
  }

  async follow(followerId: string, followingId: string): Promise<void> {
    const follow = this.followEntityRepository.create({
      followerId,
      followingId,
    });

    await this.followEntityRepository.save(follow);
  }

  async unfollow(followerId: string, followingId: string): Promise<void> {
    await this.followEntityRepository.delete({
      followerId,
      followingId,
    });
  }

  async searchUsers(query: string, filters?: UserSearchFilters, pagination?: PaginationOptions): Promise<SearchUsersResult> {
    const queryBuilder = this.userEntityRepository.createQueryBuilder('user')
      .where('user.status = :status', { status: UserStatus.ACTIVE });

    // Búsqueda por texto
    if (query) {
      queryBuilder.andWhere(
        '(user.username ILIKE :query OR user.firstName ILIKE :query OR user.lastName ILIKE :query)',
        { query: `%${query}%` }
      );
    }

    // Aplicar filtros
    if (filters?.role) {
      queryBuilder.andWhere('user.role = :role', { role: filters.role });
    }

    if (filters?.isVerified !== undefined) {
      queryBuilder.andWhere('user.emailVerified = :isVerified', { isVerified: filters.isVerified });
    }

    if (filters?.isPremium !== undefined) {
      queryBuilder.andWhere('user.isPremium = :isPremium', { isPremium: filters.isPremium });
    }

    // Aplicar paginación si se proporciona
    if (pagination) {
      const { page, limit } = pagination;
      const skip = (page - 1) * limit;
      queryBuilder.skip(skip).take(limit);
    }

    const [entities, total] = await queryBuilder.getManyAndCount();
    
    return {
      users: entities.map(entity => this.toDomain(entity)),
      total,
    };
  }

  async findRecommendedUsers(userId: string, limit: number = 10): Promise<User[]> {
    // Lógica simple de recomendación: usuarios activos que no sigues
    const queryBuilder = this.userEntityRepository.createQueryBuilder('user')
      .where('user.status = :status', { status: UserStatus.ACTIVE })
      .andWhere('user.id != :userId', { userId })
      .andWhere('user.id NOT IN (SELECT followingId FROM follows WHERE followerId = :userId)', { userId })
      .orderBy('user.createdAt', 'DESC')
      .limit(limit);

    const entities = await queryBuilder.getMany();
    return entities.map(entity => this.toDomain(entity));
  }

  async getFollowersCount(userId: string): Promise<number> {
    return this.followEntityRepository.count({ where: { followingId: userId } });
  }

  async getFollowingCount(userId: string): Promise<number> {
    return this.followEntityRepository.count({ where: { followerId: userId } });
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const user = await this.userEntityRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // TODO: Implementar consultas para obtener estadísticas reales
    // Por ahora devolvemos datos mock
    return {
      totalPosts: 0,
      totalLikes: 0,
      totalComments: 0,
      totalFollowers: await this.getFollowersCount(userId),
      totalFollowing: await this.getFollowingCount(userId),
      joinDate: user.createdAt,
      lastActivity: user.lastLoginAt || user.updatedAt,
    };
  }

  // Métodos de mapeo entre entidad de base de datos y entidad de dominio
  private toDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.email,
      entity.username,
      entity.firstName,
      entity.lastName,
      entity.role,
      entity.status,
      entity.avatar,
      entity.bio,
      entity.phone,
      entity.dateOfBirth,
      entity.language,
      entity.emailVerified,
      entity.phoneVerified,
      entity.isPremium,
      entity.premiumExpiresAt,
      entity.lastLoginAt,
      entity.preferences,
      entity.createdAt,
      entity.updatedAt,
      entity.followersCount,
      entity.followingCount,
    );
  }

  private toEntity(domain: User): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.email = domain.email;
    entity.username = domain.username;
    entity.firstName = domain.firstName;
    entity.lastName = domain.lastName;
    entity.role = domain.role;
    entity.status = domain.status;
    entity.avatar = domain.avatar;
    entity.bio = domain.bio;
    entity.phone = domain.phone;
    entity.dateOfBirth = domain.dateOfBirth;
    entity.language = domain.language;
    entity.emailVerified = domain.emailVerified;
    entity.phoneVerified = domain.phoneVerified;
    entity.isPremium = domain.isPremium;
    entity.premiumExpiresAt = domain.premiumExpiresAt;
    entity.lastLoginAt = domain.lastLoginAt;
    entity.preferences = domain.preferences;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}
