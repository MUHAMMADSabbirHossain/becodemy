import Redis from 'ioredis';

const REDIS_DATABASE_URI = process.env.REDIS_DATABASE_URI as string;

if (!REDIS_DATABASE_URI) {
  throw new Error('REDIS_DATABASE_URI is not defined');
}

export const redis = new Redis(REDIS_DATABASE_URI);
