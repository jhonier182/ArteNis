import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';

import { UpdateUserCommand } from './update-user.command';
import { UserRepository } from '@domain/user/repositories/user.repository';
import { User } from '@domain/user/entities/user';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const { userId, ...updateData } = command;

    // Verificar que el usuario existe
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Filtrar campos undefined
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    // Actualizar el usuario
    return await this.userRepository.update(userId, filteredUpdateData);
  }
}
