import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as compression from 'compression';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { TransformInterceptor } from '@common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuración de seguridad
  app.use(helmet());
  app.use(compression());

  // CORS para desarrollo
  app.enableCors({
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://artenis.com', 'https://app.artenis.com'] 
      : true,
    credentials: true,
  });

  // Pipes, filtros e interceptores globales
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Artenis API')
    .setDescription('API para la plataforma de tatuadores Artenis - Arquitectura Hexagonal')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('/api/v1')
    .addTag('auth', 'Autenticación y autorización')
    .addTag('users', 'Gestión de usuarios')
    .addTag('artists', 'Gestión de tatuadores')
    .addTag('posts', 'Publicaciones y contenido')
    .addTag('search', 'Búsqueda y filtros')
    .addTag('appointments', 'Citas y cotizaciones')
    .addTag('ai', 'Inteligencia artificial')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Prefijo global para la API
  app.setGlobalPrefix('api/v1');

  const port = configService.get('PORT') || 3000;
  await app.listen(port);
  
  console.log(`🚀 Servidor Artenis ejecutándose en puerto ${port}`);
  console.log(`📚 Documentación disponible en: http://localhost:${port}/api/docs`);
  console.log(`🏗️  Arquitectura: Hexagonal/Clean Architecture`);
}

bootstrap();
