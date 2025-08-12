import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';

import { LogoutCommand } from './logout.command';
import { AuthService } from '@modules/auth/services/auth.service';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LogoutCommand): Promise<void> {
    const { refreshToken } = command;
    await this.authService.logout(refreshToken);
  }
}
