import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';

import { UpdateUserCommand } from './update-user.command';
import { UserRepository } from '@domain/user/repositories/user.repository';
import { User } from '@domain/user/entities/user';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    @Inject('ArtistRepository') private readonly artistRepository: any,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const { userId, role, ...updateData } = command;

    // Verificar que el usuario existe
    const existingUser = await this.userRepository.findById(userId);
    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Filtrar campos undefined
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    // Si se envió rol y cambia entre user/artist, crear/eliminar perfil de artista
    if (role && role !== existingUser.role) {
      if (role === 'artist') {
        const existingArtist = await this.artistRepository.findByUserId(userId);
        if (!existingArtist) await this.artistRepository.createDefault(userId);
        filteredUpdateData['role'] = role;
      } else if (existingUser.role === 'artist' && role !== 'artist') {
        await this.artistRepository.deleteByUserId(userId);
        filteredUpdateData['role'] = role;
      }
    }

    // Actualizar el usuario
    return await this.userRepository.update(userId, filteredUpdateData);
  }
}
