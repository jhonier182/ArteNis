import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

import { RefreshTokenCommand } from './refresh-token.command';
import { AuthService, RefreshTokenResponse } from '@modules/auth/services/auth.service';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResponse> {
    const { refreshToken } = command;
    return this.authService.refreshAccessToken(refreshToken);
  }
}
