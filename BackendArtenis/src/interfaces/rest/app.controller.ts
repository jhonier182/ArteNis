import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  
  @Get()
  @ApiOperation({ summary: 'Información básica de la API' })
  @ApiResponse({ 
    status: 200, 
    description: 'Información básica de la API Artenis',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Artenis API' },
        version: { type: 'string', example: '1.0.0' },
        description: { type: 'string', example: 'API para la plataforma Artenis' },
        status: { type: 'string', example: 'running' },
        timestamp: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
        endpoints: {
          type: 'object',
          properties: {
            docs: { type: 'string', example: '/api/docs' },
            users: { type: 'string', example: '/api/users' },
            posts: { type: 'string', example: '/api/posts' },
            bookings: { type: 'string', example: '/api/bookings' }
          }
        }
      }
    }
  })
  getApiInfo() {
    return {
      name: 'Artenis API',
      version: '1.0.0',
      description: 'API para la plataforma Artenis - Red social para tatuadores',
      status: 'running',
      timestamp: new Date().toISOString(),
      endpoints: {
        docs: '/api/docs',
        users: '/api/users',
        posts: '/api/posts',
        bookings: '/api/bookings'
      }
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check de la API' })
  @ApiResponse({ 
    status: 200, 
    description: 'Estado de salud de la API',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2025-01-01T00:00:00.000Z' },
        uptime: { type: 'number', example: 3600 },
        database: { type: 'string', example: 'connected' }
      }
    }
  })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected'
    };
  }
}
