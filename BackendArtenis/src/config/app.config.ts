import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  environment: process.env.NODE_ENV || 'development',
  name: 'Artenis API',
  version: '1.0.0',
  
  // Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key',
    expiresIn: process.env.JWT_EXPIRATION || '7d',
  },

  // Configuración de límites
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
    requestTimeout: 30000, // 30 segundos
    uploadTimeout: 120000, // 2 minutos
  },

  // URLs permitidas para CORS
  corsOrigins: process.env.NODE_ENV === 'production' 
    ? ['https://artenis.com', 'https://app.artenis.com']
    : ['http://localhost:3000', 'http://localhost:3001'],
}));
