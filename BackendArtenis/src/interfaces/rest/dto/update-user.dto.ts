import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Biografía del usuario',
    required: false,
  })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'URL del avatar',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    description: 'Número de teléfono',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({
    description: 'Idioma preferido',
    enum: ['es', 'en'],
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    description: 'Preferencias del usuario',
    required: false,
  })
  @IsOptional()
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
