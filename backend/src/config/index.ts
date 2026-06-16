import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || '',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  resendApiKey: process.env.RESEND_API_KEY || '',
  superadminEmail: process.env.SUPERADMIN_EMAIL || 'admin@ems.com',
  superadminPassword: process.env.SUPERADMIN_PASSWORD || 'Admin@123456',
};

if (!config.databaseUrl && config.nodeEnv === 'production') {
  console.error('FATAL: DATABASE_URL is required in production');
  process.exit(1);
}

export default config;
