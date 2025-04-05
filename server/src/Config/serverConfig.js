import dotenv from 'dotenv';
import RateLimiter from './rateLimiter.js'

dotenv.config();

export default {
  PORT: process.env.PORT,
  RateLimiter: RateLimiter,
  DB_URI: process.env.MONGO_URI,
};