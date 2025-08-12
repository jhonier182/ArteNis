import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { BadRequestException, ConflictException, NotFoundException, Inject } from '@nestjs/common';

import { FollowUserCommand } from './follow-user.command';
import { UserRepository } from '@domain/user/repositories/user.repository';
import { FollowRepository } from '@domain/user/repositories/follow.repository';

@CommandHandler(FollowUserCommand)
export class FollowUserHandler implements ICommandHandler<FollowUserCommand> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('FollowRepository') private readonly followRepository: FollowRepository,
  ) {}

  async execute(command: FollowUserCommand): Promise<void> {
    const { followerId, followingId } = command;

    // No puede seguirse a sí mismo
    if (followerId === followingId) {
      throw new BadRequestException('No puedes seguirte a ti mismo');
    }

    // Verificar que ambos usuarios existen
    const [follower, following] = await Promise.all([
      this.userRepository.findById(followerId),
      this.userRepository.findById(followingId),
    ]);

    if (!follower) {
      throw new NotFoundException('Usuario seguidor no encontrado');
    }

    if (!following) {
      throw new NotFoundException('Usuario a seguir no encontrado');
    }

    // Verificar que no exista ya la relación
    const existingFollow = await this.followRepository.findByFollowerAndFollowing(
      followerId,
      followingId,
    );

    if (existingFollow) {
      throw new ConflictException('Ya sigues a este usuario');
    }

    // Crear la relación de seguimiento
    await this.followRepository.create({
      followerId,
      followingId,
    });
  }
}
