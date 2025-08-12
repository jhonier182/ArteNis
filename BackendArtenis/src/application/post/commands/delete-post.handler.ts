import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { NotFoundException, ForbiddenException, Inject } from '@nestjs/common';

import { DeletePostCommand } from './delete-post.command';
import { PostRepository } from '@domain/post/repositories/post.repository';
import { MediaService } from '@modules/post/services/media.service';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    @Inject('PostRepository') private readonly postRepository: PostRepository,
    private readonly mediaService: MediaService,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { postId, userId } = command;

    // Verificar que la publicación existe
    const existingPost = await this.postRepository.findById(postId);
    if (!existingPost) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // Verificar que el usuario es el propietario o es admin
    if (existingPost.userId !== userId) {
      throw new ForbiddenException('No tienes permisos para eliminar esta publicación');
    }

    // Eliminar archivos de media asociados
    if (existingPost.mediaUrls?.length) {
      await this.mediaService.deletePostMedia(existingPost.mediaUrls);
    }

    // Eliminar la publicación
    await this.postRepository.delete(postId);
  }
}
