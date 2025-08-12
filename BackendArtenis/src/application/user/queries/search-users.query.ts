export class SearchUsersQuery {
  constructor(
    public readonly searchTerm: string,
    public readonly filters: {
      role?: string;
      isVerified?: boolean;
      city?: string;
      country?: string;
    } = {},
    public readonly pagination: {
      page?: number;
      limit?: number;
    } = { page: 1, limit: 20 },
  ) {}
}
