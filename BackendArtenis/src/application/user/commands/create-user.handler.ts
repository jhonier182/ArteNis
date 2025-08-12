import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { ConflictException, Inject } from '@nestjs/common';

import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '@domain/user/repositories/user.repository';
import { User, UserRole } from '@domain/user/entities/user';
import { AuthService } from '@modules/auth/services/auth.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject('UserRepository') private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { email, username, password, firstName, lastName, role } = command;

    // Verificar si el email ya existe
    const existingUserByEmail = await this.userRepository.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictException('El email ya está registrado');
    }

    // Verificar si el username ya existe
    const existingUserByUsername = await this.userRepository.findByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictException('El nombre de usuario ya está en uso');
    }

    // Hash de la contraseña
    const hashedPassword = await this.authService.hashPassword(password);

    // Crear el usuario usando el repositorio
    const userData = {
      email,
      username,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || UserRole.USER,
    };

    return await this.userRepository.create(userData);
  }
}
