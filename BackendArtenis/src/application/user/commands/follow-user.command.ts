export class FollowUserCommand {
  constructor(
    public readonly followerId: string,
    public readonly followingId: string,
  ) {}
}
