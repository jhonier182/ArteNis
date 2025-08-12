import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { UserEntity, UserStatus } from '@infrastructure/database/mysql/entities/user.entity';
import { JwtPayload } from '../strategies/jwt.strategy';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
    avatar?: string;
    isPremium: boolean;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private refreshTokens: Map<string, string> = new Map(); // En producción usar Redis

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['artistProfile'],
    });

    if (!user) {
      return null;
    }

    // Verificar que el usuario esté activo
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Cuenta suspendida o desactivada');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: UserEntity): Promise<LoginResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken();

    // Guardar refresh token (en producción usar Redis con TTL)
    this.refreshTokens.set(refreshToken, user.id);

    // Actualizar último login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        avatar: user.avatar,
        isPremium: user.isPremium,
      },
    };
  }

  async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const userId = this.refreshTokens.get(refreshToken);
    
    if (!userId) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      this.refreshTokens.delete(refreshToken);
      throw new UnauthorizedException('Usuario no válido');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.generateRefreshToken();

    // Reemplazar refresh token
    this.refreshTokens.delete(refreshToken);
    this.refreshTokens.set(newRefreshToken, user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(refreshToken: string): Promise<void> {
    this.refreshTokens.delete(refreshToken);
  }

  private generateRefreshToken(): string {
    return this.jwtService.sign(
      { type: 'refresh' },
      {
        secret: this.configService.get<string>('app.jwt.secret') + '_refresh',
        expiresIn: '30d',
      },
    );
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
