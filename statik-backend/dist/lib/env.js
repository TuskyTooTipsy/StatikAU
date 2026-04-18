"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.envSchema = void 0;
exports.getAllowedOrigins = getAllowedOrigins;
exports.getPublicServerUrl = getPublicServerUrl;
exports.getPublicAppUrl = getPublicAppUrl;
exports.getStoragePublicUrl = getStoragePublicUrl;
exports.getMaxUploadBytes = getMaxUploadBytes;
exports.getRuntimeDiagnostics = getRuntimeDiagnostics;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
exports.envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('3000'),
    FRONTEND_URL: zod_1.z.string().default('https://statik.au'),
    PUBLIC_APP_URL: zod_1.z.string().default('https://statik.au'),
    ALLOWED_ORIGINS: zod_1.z.string().optional(),
    DATABASE_URL: zod_1.z.string().optional(),
    STRIPE_SECRET_KEY: zod_1.z.string().optional(),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().optional(),
    ADMIN_EMAIL: zod_1.z.string().email().optional(),
    ADMIN_PASSWORD: zod_1.z.string().min(8).optional(),
    ADMIN_DISPLAY_NAME: zod_1.z.string().min(2).max(40).optional(),
    JWT_SECRET: zod_1.z.string().min(16).optional(),
    PUBLIC_SERVER_URL: zod_1.z.string().optional(),
    MAX_UPLOAD_BYTES: zod_1.z.string().default(String(40 * 1024 * 1024)),
    STORAGE_PROVIDER: zod_1.z.string().default('local'),
    STORAGE_BUCKET: zod_1.z.string().optional(),
    STORAGE_REGION: zod_1.z.string().optional(),
    STORAGE_PUBLIC_URL: zod_1.z.string().optional(),
    STORAGE_ACCESS_KEY_ID: zod_1.z.string().optional(),
    STORAGE_SECRET_ACCESS_KEY: zod_1.z.string().optional(),
    GOOGLE_MAPS_API_KEY: zod_1.z.string().optional(),
    MAPBOX_TOKEN: zod_1.z.string().optional(),
    UPLOADS_DIR: zod_1.z.string().optional(),
    NODE_ENV: zod_1.z.string().default('development'),
});
exports.env = exports.envSchema.parse(process.env);
function getAllowedOrigins() {
    const configured = exports.env.ALLOWED_ORIGINS?.split(',').map((value) => value.trim()).filter(Boolean);
    const defaults = [
        exports.env.PUBLIC_APP_URL,
        exports.env.FRONTEND_URL,
        'https://statik.au',
        'https://www.statik.au',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ];
    return Array.from(new Set((configured && configured.length > 0 ? configured : defaults).filter(Boolean)));
}
function getPublicServerUrl() {
    return (exports.env.PUBLIC_SERVER_URL || `http://localhost:${exports.env.PORT}`).replace(/\/$/, '');
}
function getPublicAppUrl() {
    return (exports.env.PUBLIC_APP_URL || exports.env.FRONTEND_URL || 'https://statik.au').replace(/\/$/, '');
}
function getStoragePublicUrl() {
    return (exports.env.STORAGE_PUBLIC_URL || getPublicServerUrl()).replace(/\/$/, '');
}
function getMaxUploadBytes() {
    const parsed = Number(exports.env.MAX_UPLOAD_BYTES);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 40 * 1024 * 1024;
}
function getRuntimeDiagnostics() {
    const allowedOrigins = getAllowedOrigins();
    const publicAppUrl = getPublicAppUrl();
    const publicServerUrl = getPublicServerUrl();
    const warnings = [];
    if (!process.env.PUBLIC_APP_URL)
        warnings.push('PUBLIC_APP_URL missing; public QR/share links default to https://statik.au.');
    if (publicAppUrl.includes('localhost'))
        warnings.push('PUBLIC_APP_URL resolves to localhost; production QR/share links will be wrong.');
    if (!process.env.PUBLIC_SERVER_URL)
        warnings.push('PUBLIC_SERVER_URL missing; upload URLs fall back to the request host.');
    if (!allowedOrigins.some((origin) => origin.includes('statik.au')))
        warnings.push('ALLOWED_ORIGINS does not include statik.au.');
    if (exports.env.STORAGE_PROVIDER === 'local' && !process.env.UPLOADS_DIR)
        warnings.push('Local storage is active. Configure a Railway volume and UPLOADS_DIR for persistent production uploads.');
    if (exports.env.STORAGE_PROVIDER !== 'local' && (!exports.env.STORAGE_BUCKET || !exports.env.STORAGE_PUBLIC_URL))
        warnings.push('Object storage selected but bucket/public URL settings are incomplete.');
    if (!exports.env.GOOGLE_MAPS_API_KEY && !exports.env.MAPBOX_TOKEN)
        warnings.push('Map provider token missing. Configure VITE_GOOGLE_MAPS_API_KEY on Netlify and GOOGLE_MAPS_API_KEY on Railway for event location autocomplete.');
    return {
        publicAppUrl,
        publicServerUrl,
        allowedOrigins,
        storageProvider: exports.env.STORAGE_PROVIDER,
        mapProviderConfigured: Boolean(exports.env.GOOGLE_MAPS_API_KEY || exports.env.MAPBOX_TOKEN),
        storagePublicUrl: getStoragePublicUrl(),
        maxUploadBytes: getMaxUploadBytes(),
        nodeEnv: exports.env.NODE_ENV,
        warnings,
    };
}
