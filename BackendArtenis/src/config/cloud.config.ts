import { registerAs } from '@nestjs/config';

export default registerAs('cloud', () => ({
  // Configuración de AWS S3
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME || 'artenis-media',
      endpoint: process.env.AWS_S3_ENDPOINT || '',
    },
  },

  // Configuración de Cloudflare
  cloudflare: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '',
    apiToken: process.env.CLOUDFLARE_API_TOKEN || '',
    r2: {
      bucketName: process.env.CLOUDFLARE_R2_BUCKET || 'artenis-media',
    },
    cdn: {
      baseUrl: process.env.CLOUDFLARE_CDN_URL || '',
    },
  },

  // APIs externas
  external: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4',
    },
    stripe: {
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    },
    firebase: {
      adminSdkPath: process.env.FIREBASE_ADMIN_SDK_KEY_PATH || '',
    },
  },
}));
