import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';

import { GetUserProfileQuery } from './get-user-profile.query';
import { UserRepository } from '@domain/user/repositories/user.repository';
import { User } from '@domain/user/entities/user';

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler implements IQueryHandler<GetUserProfileQuery> {
  constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

  async execute(query: GetUserProfileQuery): Promise<User> {
    const { userId } = query;

    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }
}
