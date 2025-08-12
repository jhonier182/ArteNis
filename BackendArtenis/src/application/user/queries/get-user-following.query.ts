export class GetUserFollowingQuery {
  constructor(
    public readonly userId: string,
    public readonly pagination: {
      page?: number;
      limit?: number;
    } = { page: 1, limit: 20 },
  ) {}
}
