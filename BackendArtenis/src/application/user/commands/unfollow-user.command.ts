export class UnfollowUserCommand {
  constructor(
    public readonly followerId: string,
    public readonly followingId: string,
  ) {}
}
