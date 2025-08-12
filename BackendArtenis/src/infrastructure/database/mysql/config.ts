import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

// Entidades del dominio
import { UserEntity } from './entities/user.entity';
import { ArtistEntity } from './entities/artist.entity';
import { PostEntity } from './entities/post.entity';
import { CommentEntity } from './entities/comment.entity';
import { LikeEntity } from './entities/like.entity';
import { BoardEntity } from './entities/board.entity';
import { BoardPostEntity } from './entities/board-post.entity';
import { AppointmentEntity } from './entities/appointment.entity';
import { QuoteEntity } from './entities/quote.entity';
import { MediaEntity } from './entities/media.entity';
import { NotificationEntity } from './entities/notification.entity';
import { FollowEntity } from './entities/follow.entity';

@Injectable()
export class DatabaseConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get('database.mysql.host'),
      port: this.configService.get('database.mysql.port'),
      username: this.configService.get('database.mysql.username'),
      password: this.configService.get('database.mysql.password'),
      database: this.configService.get('database.mysql.database'),
      entities: [
        UserEntity,
        ArtistEntity,
        PostEntity,
        CommentEntity,
        LikeEntity,
        BoardEntity,
        BoardPostEntity,
        AppointmentEntity,
        QuoteEntity,
        MediaEntity,
        NotificationEntity,
        FollowEntity,
      ],
      synchronize: this.configService.get('database.mysql.synchronize'),
      logging: this.configService.get('database.mysql.logging'),
      timezone: this.configService.get('database.mysql.timezone'),
      charset: this.configService.get('database.mysql.charset'),
      migrations: ['dist/infrastructure/database/mysql/migrations/*{.ts,.js}'],
      migrationsRun: true,
    };
  }
}

// DataSource para migraciones
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT) || 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
