import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

// Entidades
import { PostEntity } from '@infrastructure/database/mysql/entities/post.entity';
import { CommentEntity } from '@infrastructure/database/mysql/entities/comment.entity';
import { LikeEntity } from '@infrastructure/database/mysql/entities/like.entity';
import { MediaEntity } from '@infrastructure/database/mysql/entities/media.entity';
import { PostRepository } from '@domain/post/repositories/post.repository';
import { PostRepositoryImpl } from '@infrastructure/database/mysql/repositories/post.repository.impl';
import { PostMapper } from '@application/post/mappers/post.mapper';
import { CreatePostHandler } from '@application/post/commands/create-post.handler';
import { UpdatePostHandler } from '@application/post/commands/update-post.handler';
import { DeletePostHandler } from '@application/post/commands/delete-post.handler';
import { GetPostHandler } from '@application/post/queries/get-post.handler';
import { GetUserPostsHandler } from '@application/post/queries/get-user-posts.handler';
import { GetFeedHandler } from '@application/post/queries/get-feed.handler';
import { MediaService } from '@modules/post/services/media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, CommentEntity, LikeEntity, MediaEntity]),
    CqrsModule,
  ],
  controllers: [],
  providers: [
    { provide: 'PostRepository', useClass: PostRepositoryImpl },
    PostMapper,
    MediaService,
    CreatePostHandler,
    UpdatePostHandler,
    DeletePostHandler,
    GetPostHandler,
    GetUserPostsHandler,
    GetFeedHandler,
  ],
  exports: [
    'PostRepository',
    PostMapper,
  ],
})
export class PostModule {}
