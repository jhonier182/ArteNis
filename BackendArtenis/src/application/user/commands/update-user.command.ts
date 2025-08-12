export class UpdateUserCommand {
  constructor(
    public readonly userId: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly bio?: string,
    public readonly avatar?: string,
    public readonly phone?: string,
    public readonly preferences?: {
      darkMode?: boolean;
      notifications?: {
        email?: boolean;
        push?: boolean;
        likes?: boolean;
        comments?: boolean;
        follows?: boolean;
      };
      privacy?: {
        showEmail?: boolean;
        showPhone?: boolean;
        allowMessages?: boolean;
      };
    },
    public readonly role?: string,
  ) {}
}
