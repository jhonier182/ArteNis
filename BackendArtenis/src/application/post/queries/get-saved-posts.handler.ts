import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetSavedPostsQuery } from './get-saved-posts.query';
import { PostRepository } from '@domain/post/repositories/post.repository';

@QueryHandler(GetSavedPostsQuery)
export class GetSavedPostsHandler implements IQueryHandler<GetSavedPostsQuery> {
  constructor(@Inject('PostRepository') private readonly postRepo: PostRepository) {}

  async execute(query: GetSavedPostsQuery) {
    const { userId, pagination } = query;
    const result = await this.postRepo.getSavedPosts(userId, pagination);
    const totalPages = Math.ceil(result.total / pagination.limit);
    return { ...result, page: pagination.page, limit: pagination.limit, totalPages };
  }
}


