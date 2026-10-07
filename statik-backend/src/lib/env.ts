import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

export const envSchema = z.object({
  PORT: z.string().default('3000'),
  FRONTEND_URL: z.string().default('https://statik.au'),
  PUBLIC_APP_URL: z.string().default('https://statik.au'),
  ALLOWED_ORIGINS: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  ADMIN_DISPLAY_NAME: z.string().min(2).max(40).optional(),
  JWT_SECRET: z.string().min(16).optional(),
  UPLOAD_SIGNING_SECRET: z.string().min(32).optional(),
  PUBLIC_SERVER_URL: z.string().optional(),
  MAX_UPLOAD_BYTES: z.string().default(String(40 * 1024 * 1024)),
  STORAGE_PROVIDER: z.string().default('local'),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_REGION: z.string().optional(),
  STORAGE_PUBLIC_URL: z.string().optional(),
  STORAGE_ACCESS_KEY_ID: z.string().optional(),
  STORAGE_SECRET_ACCESS_KEY: z.string().optional(),
  GOOGLE_MAPS_API_KEY: z.string().optional(),
  MAPBOX_TOKEN: z.string().optional(),
  AI_PROVIDER: z.string().optional(),
  AI_API_KEY: z.string().optional(),
  AI_MODEL: z.string().default('gpt-4o-mini'),
  AI_DEFAULT_TONE: z.string().default('sharp, premium, automotive editorial'),
  AI_MAX_TOKENS: z.string().default('1200'),
  UPLOADS_DIR: z.string().optional(),
  NODE_ENV: z.string().default('development'),
});

export const env = envSchema.parse(process.env);

export function getAllowedOrigins() {
  const configured = env.ALLOWED_ORIGINS?.split(',').map((value) => value.trim()).filter(Boolean);
  const defaults = [
    env.PUBLIC_APP_URL,
    env.FRONTEND_URL,
    'https://statik.au',
    'https://www.statik.au',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ];

  return Array.from(new Set((configured && configured.length > 0 ? configured : defaults).filter(Boolean)));
}

export function getPublicServerUrl() {
  return (env.PUBLIC_SERVER_URL || `http://localhost:${env.PORT}`).replace(/\/$/, '');
}

export function getPublicAppUrl() {
  return (env.PUBLIC_APP_URL || env.FRONTEND_URL || 'https://statik.au').replace(/\/$/, '');
}

export function getStoragePublicUrl() {
  return (env.STORAGE_PUBLIC_URL || getPublicServerUrl()).replace(/\/$/, '');
}

export function getMaxUploadBytes() {
  const parsed = Number(env.MAX_UPLOAD_BYTES);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 40 * 1024 * 1024;
}

export function getRuntimeDiagnostics() {
  const allowedOrigins = getAllowedOrigins();
  const publicAppUrl = getPublicAppUrl();
  const publicServerUrl = getPublicServerUrl();
  const warnings: string[] = [];
  if (!process.env.PUBLIC_APP_URL) warnings.push('PUBLIC_APP_URL missing; public QR/share links default to https://statik.au.');
  if (publicAppUrl.includes('localhost')) warnings.push('PUBLIC_APP_URL resolves to localhost; production QR/share links will be wrong.');
  if (!process.env.PUBLIC_SERVER_URL) warnings.push('PUBLIC_SERVER_URL missing; upload URLs fall back to the request host.');
  if (!allowedOrigins.some((origin) => origin.includes('statik.au'))) warnings.push('ALLOWED_ORIGINS does not include statik.au.');
  if (env.STORAGE_PROVIDER === 'local' && !process.env.UPLOADS_DIR) warnings.push('Local storage is active. Configure a Railway volume and UPLOADS_DIR for persistent production uploads.');
  if (env.STORAGE_PROVIDER !== 'local' && (!env.STORAGE_BUCKET || !env.STORAGE_PUBLIC_URL)) warnings.push('Object storage selected but bucket/public URL settings are incomplete.');
  if (!env.GOOGLE_MAPS_API_KEY && !env.MAPBOX_TOKEN) warnings.push('Map provider token missing. Configure VITE_GOOGLE_MAPS_API_KEY on Netlify and GOOGLE_MAPS_API_KEY on Railway for event location autocomplete.');
  if (!env.AI_API_KEY) warnings.push('AI writer is not configured. Manual article/news CMS still works.');
  return {
    publicAppUrl,
    publicServerUrl,
    allowedOrigins,
    storageProvider: env.STORAGE_PROVIDER,
    mapProviderConfigured: Boolean(env.GOOGLE_MAPS_API_KEY || env.MAPBOX_TOKEN),
    storagePublicUrl: getStoragePublicUrl(),
    aiProviderConfigured: Boolean(env.AI_API_KEY),
    aiProvider: env.AI_PROVIDER || 'not configured',
    maxUploadBytes: getMaxUploadBytes(),
    nodeEnv: env.NODE_ENV,
    warnings,
  };
}
