import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, MaxLength, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@ejemplo.com',
  })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;

  @ApiProperty({
    description: 'Nombre de usuario único',
    example: 'usuario123',
    minLength: 3,
    maxLength: 30,
  })
  @IsString()
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  @MaxLength(30, { message: 'El nombre de usuario no puede tener más de 30 caracteres' })
  username: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MiContraseñaSegura123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Juan',
  })
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres' })
  firstName: string;

  @ApiProperty({
    description: 'Apellido del usuario',
    example: 'Pérez',
  })
  @IsString()
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El apellido no puede tener más de 50 caracteres' })
  lastName: string;

  @ApiProperty({
    description: 'Rol del usuario',
    enum: ['user', 'artist', 'admin'],
    example: 'user',
    required: false,
  })
  @IsOptional()
  @IsString()
  role?: string;
}
