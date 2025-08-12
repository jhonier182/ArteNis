import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { Public } from '@common/decorators/public.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';

// Commands
import { LoginCommand } from '@application/auth/commands/login.command';
import { RefreshTokenCommand } from '@application/auth/commands/refresh-token.command';
import { LogoutCommand } from '@application/auth/commands/logout.command';

// DTOs
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

// Mappers
import { AuthMapper, LoginResponseDto } from '@application/auth/mappers/auth.mapper';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly authMapper: AuthMapper,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Autentica un usuario y devuelve tokens de acceso',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'string' },
            avatar: { type: 'string' },
            isPremium: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  async login(@Body() loginDto: LoginDto, @CurrentUser() user: any): Promise<LoginResponseDto> {
    // El usuario ya fue validado por LocalStrategy
    const command = new LoginCommand(loginDto.email, loginDto.password);
    const loginResponse = await this.commandBus.execute(command);
    return this.authMapper.toLoginResponseDto(loginResponse);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Renovar token de acceso',
    description: 'Usa un refresh token para obtener un nuevo access token',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token renovado exitosamente',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido',
  })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    const command = new RefreshTokenCommand(refreshTokenDto.refreshToken);
    return this.commandBus.execute(command);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cerrar sesión',
    description: 'Invalida el refresh token del usuario',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Logout exitoso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logout exitoso' },
      },
    },
  })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    const command = new LogoutCommand(refreshTokenDto.refreshToken);
    await this.commandBus.execute(command);
    return { message: 'Logout exitoso' };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validar token',
    description: 'Verifica si el token de acceso es válido',
  })
  @ApiResponse({
    status: 200,
    description: 'Token válido',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido',
  })
  async validate(@CurrentUser() user: any) {
    return {
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }
}
