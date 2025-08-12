import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

// Entidades
import { UserEntity } from '@infrastructure/database/mysql/entities/user.entity';

// Estrategias
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

// Servicios
import { AuthService } from './services/auth.service';

// Controllers
import { AuthController } from '@interfaces/rest/auth.controller';

// Commands y Queries
import { LoginCommand } from '@application/auth/commands/login.command';
import { LoginHandler } from '@application/auth/commands/login.handler';
import { RefreshTokenCommand } from '@application/auth/commands/refresh-token.command';
import { RefreshTokenHandler } from '@application/auth/commands/refresh-token.handler';
import { LogoutCommand } from '@application/auth/commands/logout.command';
import { LogoutHandler } from '@application/auth/commands/logout.handler';

// Mappers
import { AuthMapper } from '@application/auth/mappers/auth.mapper';

// Importar UserModule para acceso a repositorios
import { UserModule } from '@modules/user/user.module';

const CommandHandlers = [
  LoginHandler,
  RefreshTokenHandler,
  LogoutHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    CqrsModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('app.jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('app.jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    AuthMapper,
    ...CommandHandlers,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
