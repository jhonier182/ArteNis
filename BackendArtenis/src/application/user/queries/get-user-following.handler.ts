import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';

import { GetUserFollowingQuery } from './get-user-following.query';
import { UserRepository } from '@domain/user/repositories/user.repository';
import { FollowRepository } from '@domain/user/repositories/follow.repository';
import { User } from '@domain/user/entities/user';

export interface GetUserFollowingResult {
  following: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@QueryHandler(GetUserFollowingQuery)
export class GetUserFollowingHandler implements IQueryHandler<GetUserFollowingQuery> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('FollowRepository') private readonly followRepository: FollowRepository,
  ) {}

  async execute(query: GetUserFollowingQuery): Promise<GetUserFollowingResult> {
    const { userId, pagination } = query;
    const { page = 1, limit = 20 } = pagination;

    // Verificar que el usuario existe
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Obtener usuarios seguidos con paginación
    const result = await this.followRepository.getUserFollowing(userId, {
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      following: result.following,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }
}
