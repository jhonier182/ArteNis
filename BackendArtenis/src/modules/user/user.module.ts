import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

// Entidades de infraestructura
import { UserEntity } from '@infrastructure/database/mysql/entities/user.entity';
import { FollowEntity } from '@infrastructure/database/mysql/entities/follow.entity';

// Repositorios
import { UserRepository } from '@domain/user/repositories/user.repository';
import { UserRepositoryImpl } from '@infrastructure/database/mysql/repositories/user.repository.impl';

// Servicios de dominio
import { UserDomainService } from '@domain/user/services/user-domain.service';

// Handlers de aplicación
import { CreateUserHandler } from '@application/user/commands/create-user.handler';
import { UpdateUserHandler } from '@application/user/commands/update-user.handler';
import { FollowUserHandler } from '@application/user/commands/follow-user.handler';
import { UnfollowUserHandler } from '@application/user/commands/unfollow-user.handler';
import { GetUserProfileHandler } from '@application/user/queries/get-user-profile.handler';
import { SearchUsersHandler } from '@application/user/queries/search-users.handler';
import { GetUserFollowersHandler } from '@application/user/queries/get-user-followers.handler';
import { GetUserFollowingHandler } from '@application/user/queries/get-user-following.handler';

// Mappers
import { UserMapper } from '@application/user/mappers/user.mapper';

// Controladores
import { UserController } from '@interfaces/rest/user.controller';

// Importar AuthModule para AuthService
import { AuthModule } from '@modules/auth/auth.module';

// Importar repositorio de Follow
import { FollowRepository } from '@domain/user/repositories/follow.repository';
import { FollowRepositoryImpl } from '@infrastructure/database/mysql/repositories/follow.repository.impl';

const CommandHandlers = [
  CreateUserHandler,
  UpdateUserHandler,
  FollowUserHandler,
  UnfollowUserHandler,
];

const QueryHandlers = [
  GetUserProfileHandler,
  SearchUsersHandler,
  GetUserFollowersHandler,
  GetUserFollowingHandler,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, FollowEntity]),
    CqrsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [
    // Repositorios
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'FollowRepository',
      useClass: FollowRepositoryImpl,
    },
    
    // Servicios de dominio
    UserDomainService,
    
    // CQRS Handlers
    ...CommandHandlers,
    ...QueryHandlers,
    
    // Mappers
    UserMapper,
  ],
  exports: [
    'UserRepository',
    'FollowRepository',
    UserDomainService,
    UserMapper,
  ],
})
export class UserModule {}
