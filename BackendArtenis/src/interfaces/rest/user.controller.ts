import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Public } from '@common/decorators/public.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';

// Commands y Queries
import { CreateUserCommand } from '@application/user/commands/create-user.command';
import { UpdateUserCommand } from '@application/user/commands/update-user.command';
import { FollowUserCommand } from '@application/user/commands/follow-user.command';
import { UnfollowUserCommand } from '@application/user/commands/unfollow-user.command';
import { GetUserProfileQuery } from '@application/user/queries/get-user-profile.query';
import { SearchUsersQuery } from '@application/user/queries/search-users.query';
import { GetUserFollowersQuery } from '@application/user/queries/get-user-followers.query';
import { GetUserFollowingQuery } from '@application/user/queries/get-user-following.query';

// DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

// Mappers
import { UserMapper } from '@application/user/mappers/user.mapper';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly userMapper: UserMapper,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Registrar nuevo usuario',
    description: 'Crea una nueva cuenta de usuario en la plataforma'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario registrado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email o username ya existe' 
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const command = new CreateUserCommand(
      createUserDto.email,
      createUserDto.username,
      createUserDto.password,
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.role,
    );

    const user = await this.commandBus.execute(command);
    return this.userMapper.toResponseDto(user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Obtener perfil del usuario autenticado',
    description: 'Devuelve la información completa del usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil obtenido exitosamente',
    type: UserResponseDto,
  })
  async getMyProfile(@CurrentUser() currentUser: any): Promise<UserResponseDto> {
    const query = new GetUserProfileQuery(currentUser.id);
    const user = await this.queryBus.execute(query);
    return this.userMapper.toResponseDto(user);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener perfil público de usuario',
    description: 'Devuelve la información pública de un usuario específico'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil obtenido exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  async getUserProfile(@Param('id') id: string): Promise<UserResponseDto> {
    const query = new GetUserProfileQuery(id);
    const user = await this.queryBus.execute(query);
    return this.userMapper.toPublicResponseDto(user);
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Actualizar perfil',
    description: 'Actualiza la información del usuario autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil actualizado exitosamente',
    type: UserResponseDto,
  })
  async updateProfile(
    @CurrentUser() currentUser: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const command = new UpdateUserCommand(
      currentUser.id,
      updateUserDto.firstName,
      updateUserDto.lastName,
      updateUserDto.bio,
      updateUserDto.avatar,
      updateUserDto.phone,
      updateUserDto.preferences,
    );
    const user = await this.commandBus.execute(command);
    return this.userMapper.toResponseDto(user);
  }

  @Post('follow/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Seguir usuario',
    description: 'Permite al usuario autenticado seguir a otro usuario'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario seguido exitosamente' 
  })
  async followUser(
    @CurrentUser() currentUser: any,
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    const command = new FollowUserCommand(currentUser.id, userId);
    await this.commandBus.execute(command);
    
    return { message: 'Usuario seguido exitosamente' };
  }

  @Delete('follow/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Dejar de seguir usuario',
    description: 'Permite al usuario autenticado dejar de seguir a otro usuario'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario no seguido exitosamente' 
  })
  async unfollowUser(
    @CurrentUser() currentUser: any,
    @Param('userId') userId: string,
  ): Promise<{ message: string }> {
    const command = new UnfollowUserCommand(currentUser.id, userId);
    await this.commandBus.execute(command);
    
    return { message: 'Usuario no seguido exitosamente' };
  }

  @Get('search')
  @ApiOperation({ 
    summary: 'Buscar usuarios',
    description: 'Busca usuarios usando diferentes filtros'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuarios encontrados exitosamente',
    type: [UserResponseDto],
  })
  async searchUsers(
    @Query('q') query: string,
    @Query('role') role?: string,
    @Query('verified') verified?: boolean,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const searchQuery = new SearchUsersQuery(
      query,
      { role, isVerified: verified },
      { page, limit }
    );
    const result = await this.queryBus.execute(searchQuery);
    
    return {
      users: result.users.map(user => this.userMapper.toPublicResponseDto(user)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':userId/followers')
  @ApiOperation({ 
    summary: 'Obtener seguidores',
    description: 'Devuelve la lista de seguidores de un usuario'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Seguidores obtenidos exitosamente',
    type: [UserResponseDto],
  })
  async getFollowers(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{
    followers: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const query = new GetUserFollowersQuery(userId, { page, limit });
    const result = await this.queryBus.execute(query);
    
    return {
      followers: result.followers.map(user => this.userMapper.toPublicResponseDto(user)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':userId/following')
  @ApiOperation({ 
    summary: 'Obtener seguidos',
    description: 'Devuelve la lista de usuarios que sigue un usuario'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Seguidos obtenidos exitosamente',
    type: [UserResponseDto],
  })
  async getFollowing(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{
    following: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const query = new GetUserFollowingQuery(userId, { page, limit });
    const result = await this.queryBus.execute(query);
    
    return {
      following: result.following.map(user => this.userMapper.toPublicResponseDto(user)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Eliminar usuario',
    description: 'Elimina un usuario (solo administradores)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario eliminado exitosamente' 
  })
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    // TODO: Implementar comando de eliminación
    // const command = new DeleteUserCommand(id);
    // await this.commandBus.execute(command);
    
    return { message: 'Usuario eliminado exitosamente' };
  }
}
