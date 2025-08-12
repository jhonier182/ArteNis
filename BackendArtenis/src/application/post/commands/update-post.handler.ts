import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException, Inject } from '@nestjs/common';

import { UpdatePostCommand } from './update-post.command';
import { PostRepository } from '@domain/post/repositories/post.repository';
import { Post } from '@domain/post/entities/post';

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(@Inject('PostRepository') private readonly postRepository: PostRepository) {}

  async execute(command: UpdatePostCommand): Promise<Post> {
    const { postId, userId, ...updateData } = command;

    // Verificar que la publicación existe
    const existingPost = await this.postRepository.findById(postId);
    if (!existingPost) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // Verificar que el usuario es el propietario
    if (existingPost.userId !== userId) {
      throw new ForbiddenException('No tienes permisos para editar esta publicación');
    }

    // Filtrar campos undefined
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    // Actualizar la publicación
    return await this.postRepository.update(postId, filteredUpdateData);
  }
}
