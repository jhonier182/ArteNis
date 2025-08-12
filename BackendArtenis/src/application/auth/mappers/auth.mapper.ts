import { Injectable } from '@nestjs/common';
import { UserEntity } from '@infrastructure/database/mysql/entities/user.entity';
import { LoginResponse } from '@modules/auth/services/auth.service';

export interface LoginResponseDto {
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

@Injectable()
export class AuthMapper {
  toLoginResponseDto(loginResponse: LoginResponse): LoginResponseDto {
    return {
      accessToken: loginResponse.accessToken,
      refreshToken: loginResponse.refreshToken,
      user: {
        id: loginResponse.user.id,
        email: loginResponse.user.email,
        username: loginResponse.user.username,
        firstName: loginResponse.user.firstName,
        lastName: loginResponse.user.lastName,
        role: loginResponse.user.role,
        avatar: loginResponse.user.avatar,
        isPremium: loginResponse.user.isPremium,
      },
    };
  }
}
