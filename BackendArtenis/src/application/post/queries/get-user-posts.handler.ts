import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { GetUserPostsQuery } from './get-user-posts.query';
import { PostRepository } from '@domain/post/repositories/post.repository';
import { Post } from '@domain/post/entities/post';

export interface GetUserPostsResult {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@QueryHandler(GetUserPostsQuery)
export class GetUserPostsHandler implements IQueryHandler<GetUserPostsQuery> {
  constructor(@Inject('PostRepository') private readonly postRepository: PostRepository) {}

  async execute(query: GetUserPostsQuery): Promise<GetUserPostsResult> {
    const { userId, pagination } = query;
    const { page = 1, limit = 12 } = pagination;

    const result = await this.postRepository.findByUserId(userId, { page, limit });
    const totalPages = Math.ceil(result.total / limit);

    return {
      posts: result.posts,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }
}
