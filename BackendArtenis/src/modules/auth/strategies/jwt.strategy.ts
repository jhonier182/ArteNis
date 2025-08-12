import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity, UserStatus } from '@infrastructure/database/mysql/entities/user.entity';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('app.jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    const { sub: userId, email } = payload;

    // Buscar usuario en la base de datos
    const user = await this.userRepository.findOne({
      where: { id: userId, email },
      relations: ['artistProfile'],
    });

    if (!user) {
      throw new UnauthorizedException('Token inválido - usuario no encontrado');
    }

    // Verificar que el usuario esté activo
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Cuenta suspendida o desactivada');
    }

    // Actualizar último login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    // Retornar datos del usuario que se adjuntarán al request
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      isPremium: user.isPremium,
      artistProfile: user.artistProfile,
    };
  }
}
