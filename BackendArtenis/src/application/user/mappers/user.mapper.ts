import { Injectable } from '@nestjs/common';
import { User } from '@domain/user/entities/user';
import { UserResponseDto } from '@interfaces/rest/dto/user-response.dto';

@Injectable()
export class UserMapper {
  
  toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      bio: user.bio,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      language: user.language,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
      isPremium: user.isPremium,
      premiumExpiresAt: user.premiumExpiresAt,
      lastLoginAt: user.lastLoginAt,
      isArtist: user.isArtist,
      isAdmin: user.isAdmin,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      preferences: user.preferences,
    };
  }

  toPublicResponseDto(user: User): UserResponseDto {
    const publicDto = this.toResponseDto(user);
    
    // Ocultar información privada para usuarios públicos
    delete publicDto.email;
    delete publicDto.phone;
    delete publicDto.preferences;
    delete publicDto.lastLoginAt;
    
    // Aplicar configuraciones de privacidad del usuario
    if (user.preferences?.privacy?.showEmail === false) {
      delete publicDto.email;
    }
    if (user.preferences?.privacy?.showPhone === false) {
      delete publicDto.phone;
    }

    return publicDto;
  }

  toMinimalResponseDto(user: User): Partial<UserResponseDto> {
    return {
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar,
      isArtist: user.isArtist,
      emailVerified: user.emailVerified,
    };
  }
}
