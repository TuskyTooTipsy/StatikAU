import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const envSchema = z.object({
  PORT: z.string().default('3000'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),
  ALLOWED_ORIGINS: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  NODE_ENV: z.string().default('development'),
});

export const env = envSchema.parse(process.env);

export function getAllowedOrigins() {
  const configured = env.ALLOWED_ORIGINS?.split(',').map((value) => value.trim()).filter(Boolean);
  const defaults = [
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];

  return Array.from(new Set((configured && configured.length > 0 ? configured : defaults).filter(Boolean)));
}
