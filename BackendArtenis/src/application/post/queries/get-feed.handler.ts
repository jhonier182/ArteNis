import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetFeedQuery } from './get-feed.query';
import { PostRepository } from '@domain/post/repositories/post.repository';
import { Post } from '@domain/post/entities/post';

export interface GetFeedResult {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
}

@QueryHandler(GetFeedQuery)
export class GetFeedHandler implements IQueryHandler<GetFeedQuery> {
  constructor(@Inject('PostRepository') private readonly postRepository: PostRepository) {}

  async execute(query: GetFeedQuery): Promise<GetFeedResult> {
    const { userId, pagination, filters } = query;
    const { page = 1, limit = 20 } = pagination;

    // Obtener posts del feed personalizado
    const result = await this.postRepository.getFeed(userId, { page, limit }, filters);
    const totalPages = Math.ceil(result.total / limit);
    const hasNextPage = page < totalPages;

    return {
      posts: result.posts,
      total: result.total,
      page,
      limit,
      totalPages,
      hasNextPage,
    };
  }
}
