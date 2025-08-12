import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import { SearchUsersQuery } from './search-users.query';
import { UserRepository } from '@domain/user/repositories/user.repository';
import { User } from '@domain/user/entities/user';

export interface SearchUsersResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@QueryHandler(SearchUsersQuery)
export class SearchUsersHandler implements IQueryHandler<SearchUsersQuery> {
  constructor(@Inject('UserRepository') private readonly userRepository: UserRepository) {}

  async execute(query: SearchUsersQuery): Promise<SearchUsersResult> {
    const { searchTerm, filters, pagination } = query;
    const { page = 1, limit = 20 } = pagination;

    // Buscar usuarios con filtros
    const result = await this.userRepository.searchUsers(searchTerm, filters, {
      page,
      limit,
    });

    const totalPages = Math.ceil(result.total / limit);

    return {
      users: result.users,
      total: result.total,
      page,
      limit,
      totalPages,
    };
  }
}
