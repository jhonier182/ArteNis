import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { BadRequestException, Inject } from '@nestjs/common';

import { CreatePostCommand } from './create-post.command';
import { PostRepository } from '@domain/post/repositories/post.repository';
import { MediaService } from '@modules/post/services/media.service';
import { Post } from '@domain/post/entities/post';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @Inject('PostRepository') private readonly postRepository: PostRepository,
    private readonly mediaService: MediaService,
  ) {}

  async execute(command: CreatePostCommand): Promise<Post> {
    const {
      userId,
      title,
      description,
      tags,
      styles,
      mediaFiles,
      location,
      tattooDetails,
      allowComments,
      allowSharing,
    } = command;

    // Validar que al menos hay un archivo de media o descripción
    if (!mediaFiles?.length && !description?.trim()) {
      throw new BadRequestException('Una publicación debe tener al menos una imagen o descripción');
    }

    // Procesar archivos de media si existen
    let mediaUrls: string[] = [];
    if (mediaFiles?.length) {
      mediaUrls = await this.mediaService.uploadPostMedia(mediaFiles, userId);
    }

    // Crear la publicación
    const postData = {
      userId,
      title: title?.trim(),
      description: description?.trim(),
      tags: tags?.filter(tag => tag.trim()) || [],
      styles: styles?.filter(style => style.trim()) || [],
      mediaUrls,
      location,
      tattooDetails,
      allowComments,
      allowSharing,
    };

    return await this.postRepository.create(postData);
  }
}
