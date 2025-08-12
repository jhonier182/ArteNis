export class UpdatePostCommand {
  constructor(
    public readonly postId: string,
    public readonly userId: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly tags?: string[],
    public readonly styles?: string[],
    public readonly location?: {
      name?: string;
      address?: string;
      city?: string;
      country?: string;
      latitude?: number;
      longitude?: number;
    },
    public readonly tattooDetails?: {
      bodyPart?: string;
      size?: string;
      duration?: number;
      price?: number;
      currency?: string;
      healing?: string;
      technique?: string;
    },
    public readonly allowComments?: boolean,
    public readonly allowSharing?: boolean,
  ) {}
}
