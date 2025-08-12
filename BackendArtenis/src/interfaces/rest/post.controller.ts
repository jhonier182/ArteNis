import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

import { JwtAuthGuard } from '@common/guards/jwt-auth.guard';
import { RolesGuard } from '@common/guards/roles.guard';
import { Roles } from '@common/decorators/roles.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { Public } from '@common/decorators/public.decorator';

// Commands
import { CreatePostCommand } from '@application/post/commands/create-post.command';
import { UpdatePostCommand } from '@application/post/commands/update-post.command';
import { DeletePostCommand } from '@application/post/commands/delete-post.command';

// Queries
import { GetPostQuery } from '@application/post/queries/get-post.query';
import { GetUserPostsQuery } from '@application/post/queries/get-user-posts.query';
import { GetFeedQuery } from '@application/post/queries/get-feed.query';
import { GetSavedPostsQuery } from '@application/post/queries/get-saved-posts.query';

// DTOs
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';

// Mappers
import { PostMapper } from '@application/post/mappers/post.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LikeEntity } from '@infrastructure/database/mysql/entities/like.entity';
import { CommentEntity } from '@infrastructure/database/mysql/entities/comment.entity';
import { BoardEntity } from '@infrastructure/database/mysql/entities/board.entity';
import { BoardPostEntity } from '@infrastructure/database/mysql/entities/board-post.entity';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly postMapper: PostMapper,
    @InjectRepository(LikeEntity) private readonly likeRepo: Repository<LikeEntity>,
    @InjectRepository(CommentEntity) private readonly commentRepo: Repository<CommentEntity>,
    @InjectRepository(BoardEntity) private readonly boardRepo: Repository<BoardEntity>,
    @InjectRepository(BoardPostEntity) private readonly boardPostRepo: Repository<BoardPostEntity>,
  ) {}

  @Get('feed')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Obtener feed de publicaciones',
    description: 'Devuelve el feed personalizado del usuario'
  })
  @ApiResponse({
    status: 200,
    description: 'Feed obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        posts: { type: 'array', items: { $ref: '#/components/schemas/PostResponseDto' } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
        hasNextPage: { type: 'boolean' },
      },
    },
  })
  async getFeed(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('styles') styles?: string,
    @Query('location') location?: string,
  ) {
    const stylesArray = styles ? styles.split(',') : undefined;
    
    const query = new GetFeedQuery(
      user.id,
      { page, limit },
      { styles: stylesArray, location }
    );
    
    const result = await this.queryBus.execute(query);
    
    return {
      posts: result.posts.map(post => this.postMapper.toResponseDto(post)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ 
    summary: 'Crear nueva publicación',
    description: 'Crea una nueva publicación de tatuaje con archivos multimedia'
  })
  @ApiResponse({
    status: 201,
    description: 'Publicación creada exitosamente',
    type: PostResponseDto,
  })
  async createPost(
    @CurrentUser() user: any,
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<PostResponseDto> {
    const command = new CreatePostCommand(
      user.id,
      createPostDto.title,
      createPostDto.description,
      createPostDto.tags,
      createPostDto.styles,
      files,
      createPostDto.location,
      createPostDto.tattooDetails,
      createPostDto.allowComments,
      createPostDto.allowSharing,
    );

    const post = await this.commandBus.execute(command);
    return this.postMapper.toResponseDto(post);
  }

  @Get('user/:userId')
  @ApiOperation({ 
    summary: 'Obtener publicaciones de un usuario',
    description: 'Devuelve las publicaciones de un usuario específico'
  })
  @ApiResponse({
    status: 200,
    description: 'Publicaciones obtenidas exitosamente',
    type: [PostResponseDto],
  })
  async getUserPosts(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 12,
  ) {
    const query = new GetUserPostsQuery(userId, { page, limit });
    const result = await this.queryBus.execute(query);
    
    return {
      posts: result.posts.map(post => this.postMapper.toResponseDto(post)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get(':id')
  @Public()
  @ApiOperation({ 
    summary: 'Obtener publicación específica',
    description: 'Devuelve los detalles de una publicación'
  })
  @ApiResponse({
    status: 200,
    description: 'Publicación obtenida exitosamente',
    type: PostResponseDto,
  })
  async getPost(@Param('id') id: string): Promise<PostResponseDto> {
    const query = new GetPostQuery(id);
    const post = await this.queryBus.execute(query);
    return this.postMapper.toResponseDto(post);
  }

  @Get('me/saved')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener posts guardados (paginado)' })
  async getSaved(
    @CurrentUser() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 24,
  ) {
    const result = await this.queryBus.execute(new GetSavedPostsQuery(user.id, { page, limit }));
    return {
      posts: result.posts.map((p) => this.postMapper.toResponseDto(p)),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist')
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Actualizar publicación',
    description: 'Actualiza una publicación existente'
  })
  @ApiResponse({
    status: 200,
    description: 'Publicación actualizada exitosamente',
    type: PostResponseDto,
  })
  async updatePost(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const command = new UpdatePostCommand(
      id,
      user.id,
      updatePostDto.title,
      updatePostDto.description,
      updatePostDto.tags,
      updatePostDto.styles,
      updatePostDto.location,
      updatePostDto.tattooDetails,
      updatePostDto.allowComments,
      updatePostDto.allowSharing,
    );

    const post = await this.commandBus.execute(command);
    return this.postMapper.toResponseDto(post);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('artist')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Eliminar publicación',
    description: 'Elimina una publicación del usuario'
  })
  @ApiResponse({
    status: 204,
    description: 'Publicación eliminada exitosamente',
  })
  async deletePost(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<void> {
    const command = new DeletePostCommand(id, user.id);
    await this.commandBus.execute(command);
  }

  // Interacciones
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async like(@Param('id') postId: string, @CurrentUser() user: any) {
    const exists = await this.likeRepo.findOne({ where: { postId, userId: user.id } as any });
    if (!exists) {
      await this.likeRepo.save(this.likeRepo.create({ postId, userId: user.id } as any));
    }
    return { liked: true };
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async unlike(@Param('id') postId: string, @CurrentUser() user: any) {
    await this.likeRepo.delete({ postId, userId: user.id } as any);
    return { liked: false };
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async savePost(@Param('id') postId: string, @CurrentUser() user: any) {
    // default board per user
    let board = await this.boardRepo.findOne({ where: { userId: user.id, name: 'Favoritos' } });
    if (!board) {
      board = await this.boardRepo.save(this.boardRepo.create({ userId: user.id, name: 'Favoritos' }));
    }
    const exists = await this.boardPostRepo.findOne({ where: { boardId: board.id, postId } });
    if (!exists) await this.boardPostRepo.save(this.boardPostRepo.create({ boardId: board.id, postId }));
    return { saved: true };
  }

  @Delete(':id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async unsavePost(@Param('id') postId: string, @CurrentUser() user: any) {
    const board = await this.boardRepo.findOne({ where: { userId: user.id, name: 'Favoritos' } });
    if (board) await this.boardPostRepo.delete({ boardId: board.id, postId } as any);
    return { saved: false };
  }
}
