import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { CqrsModule } from '@nestjs/cqrs';

// Configuración
import { DatabaseConfig } from '@infrastructure/database/mysql/config';
import AppConfig from '@config/app.config';
import CloudConfig from '@config/cloud.config';
import DatabaseConfigModule from '@config/database.config';

// Módulos principales
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { PostModule } from '@modules/post/post.module';
import { BookingModule } from '@modules/booking/booking.module';
import { PaymentModule } from '@modules/payment/payment.module';
import { AiDesignModule } from '@modules/ai-design/ai-design.module';

// Controladores REST
import { AppController } from '@interfaces/rest/app.controller';
import { UserController } from '@interfaces/rest/user.controller';
import { PostController } from '@interfaces/rest/post.controller';
import { BookingController } from '@interfaces/rest/booking.controller';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [AppConfig, CloudConfig, DatabaseConfigModule],
    }),

    // CQRS para arquitectura limpia
    CqrsModule,

    // Base de datos MySQL
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),

    // Rate limiting
    ThrottlerModule.forRoot({
      ttl: 60000, // 1 minuto
      limit: 100, // 100 requests por minuto
    }),

    // Cache (deshabilitado temporalmente para desarrollo)
    CacheModule.register({
      isGlobal: true,
      ttl: 3600, // 1 hora por defecto
    }),

    // Módulos de dominio
    AuthModule,
    UserModule,
    PostModule,
    BookingModule,
    PaymentModule,
    AiDesignModule,
  ],
  controllers: [
    // Controladores REST principales
    AppController,
    UserController,
    PostController,
    BookingController,
  ],
  providers: [],
})
export class AppModule {}
