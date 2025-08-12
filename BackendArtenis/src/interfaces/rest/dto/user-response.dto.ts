import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'uuid-string',
  })
  id: string;

  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  email: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'usuario123',
  })
  username: string;

  @ApiProperty({
    description: 'Nombre completo',
    example: 'Juan Pérez',
  })
  fullName: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  lastName: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: ['user', 'artist', 'admin'],
    example: 'user',
  })
  role: string;

  @ApiProperty({
    description: 'Estado del usuario',
    enum: ['active', 'inactive', 'suspended', 'banned'],
    example: 'active',
  })
  status: string;

  @ApiProperty({
    description: 'URL del avatar',
    example: 'https://ejemplo.com/avatar.jpg',
    required: false,
  })
  avatar?: string;

  @ApiProperty({
    description: 'Biografía del usuario',
    example: 'Amante de los tatuajes',
    required: false,
  })
  bio?: string;

  @ApiProperty({
    description: 'Número de teléfono',
    example: '+1234567890',
    required: false,
  })
  phone?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '1990-01-01',
    required: false,
  })
  dateOfBirth?: Date;

  @ApiProperty({
    description: 'Idioma preferido',
    example: 'es',
  })
  language: string;

  @ApiProperty({
    description: 'Email verificado',
    example: true,
  })
  emailVerified: boolean;

  @ApiProperty({
    description: 'Teléfono verificado',
    example: false,
  })
  phoneVerified: boolean;

  @ApiProperty({
    description: 'Usuario premium',
    example: false,
  })
  isPremium: boolean;

  @ApiProperty({
    description: 'Fecha de expiración premium',
    required: false,
  })
  premiumExpiresAt?: Date;

  @ApiProperty({
    description: 'Último inicio de sesión',
    required: false,
  })
  lastLoginAt?: Date;

  @ApiProperty({
    description: 'Es artista',
    example: false,
  })
  isArtist: boolean;

  @ApiProperty({
    description: 'Es administrador',
    example: false,
  })
  isAdmin: boolean;

  @ApiProperty({
    description: 'Número de seguidores',
    example: 150,
  })
  followersCount: number;

  @ApiProperty({
    description: 'Número de seguidos',
    example: 200,
  })
  followingCount: number;

  @ApiProperty({
    description: 'Fecha de creación',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Preferencias del usuario',
    required: false,
  })
  preferences?: {
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
  };
}
