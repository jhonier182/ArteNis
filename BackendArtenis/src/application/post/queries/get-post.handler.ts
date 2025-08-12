import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException, Inject } from '@nestjs/common';

import { GetPostQuery } from './get-post.query';
import { PostRepository } from '@domain/post/repositories/post.repository';
import { Post } from '@domain/post/entities/post';

@QueryHandler(GetPostQuery)
export class GetPostHandler implements IQueryHandler<GetPostQuery> {
  constructor(@Inject('PostRepository') private readonly postRepository: PostRepository) {}

  async execute(query: GetPostQuery): Promise<Post> {
    const { postId } = query;

    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Publicación no encontrada');
    }

    // Incrementar contador de vistas
    await this.postRepository.incrementViews(postId);

    return post;
  }
}
