import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';

import { UnfollowUserCommand } from './unfollow-user.command';
import { FollowRepository } from '@domain/user/repositories/follow.repository';

@CommandHandler(UnfollowUserCommand)
export class UnfollowUserHandler implements ICommandHandler<UnfollowUserCommand> {
  constructor(@Inject('FollowRepository') private readonly followRepository: FollowRepository) {}

  async execute(command: UnfollowUserCommand): Promise<void> {
    const { followerId, followingId } = command;

    // Buscar la relación de seguimiento
    const existingFollow = await this.followRepository.findByFollowerAndFollowing(
      followerId,
      followingId,
    );

    if (!existingFollow) {
      throw new NotFoundException('No sigues a este usuario');
    }

    // Eliminar la relación de seguimiento
    await this.followRepository.delete(existingFollow.id);
  }
}
