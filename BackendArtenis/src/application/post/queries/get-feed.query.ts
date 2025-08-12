export class GetFeedQuery {
  constructor(
    public readonly userId: string,
    public readonly pagination: {
      page?: number;
      limit?: number;
    } = { page: 1, limit: 20 },
    public readonly filters?: {
      styles?: string[];
      bodyParts?: string[];
      location?: string;
      dateRange?: {
        from?: Date;
        to?: Date;
      };
    },
  ) {}
}
