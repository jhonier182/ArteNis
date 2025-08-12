export class GetSavedPostsQuery {
  constructor(
    public readonly userId: string,
    public readonly pagination: { page: number; limit: number },
  ) {}
}


