import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { UnauthorizedException } from '@nestjs/common';

import { LoginCommand } from './login.command';
import { AuthService, LoginResponse } from '@modules/auth/services/auth.service';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LoginCommand): Promise<LoginResponse> {
    const { email, password } = command;

    // Validar credenciales
    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar tokens
    return this.authService.login(user);
  }
}
