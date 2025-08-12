import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mysql: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME || 'artenis_user',
    password: process.env.DATABASE_PASSWORD || 'password',
    database: process.env.DATABASE_NAME || 'artenis_db',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    timezone: 'UTC',
    charset: 'utf8mb4',
  },

  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    ttl: 3600, // 1 hora
  },

  search: {
    url: process.env.SEARCH_ENGINE_URL || 'http://localhost:9200',
    apiKey: process.env.SEARCH_ENGINE_API_KEY || '',
    indexPrefix: 'artenis_',
  },
}));
