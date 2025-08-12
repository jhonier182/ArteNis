import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';

import { GetUserFollowersQuery } from './get-user-followers.query';
import { UserRepository } from '@domain/user/repositories/user.repository';
import { FollowRepository } from '@domain/user/repositories/follow.repository';
import { User } from '@domain/user/entities/user';

export interface GetUserFollowersResult {
  followers: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@QueryHandler(GetUserFollowersQuery)
export class GetUserFollowersHandler implements IQueryHandler<GetUserFollowersQuery> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('FollowRepository') private readonly followRepository: FollowRepository,
  ) {}

  async execute(query: GetUserFollowersQuery): Promise<GetUserFollowersResult> {
    const { userId, pagination } = query;
    const { page = 1, limit = 20 } = pagination;

    // Verificar que el usuario existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Obtener seguidores con paginación
    const result = await this.followRepository.getUserFollowers(userId, {
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      followers: result.followers,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }
}
