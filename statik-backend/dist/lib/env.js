"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.envSchema = void 0;
exports.getAllowedOrigins = getAllowedOrigins;
exports.getPublicServerUrl = getPublicServerUrl;
exports.getMaxUploadBytes = getMaxUploadBytes;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
exports.envSchema = zod_1.z.object({
    PORT: zod_1.z.string().default('3000'),
    FRONTEND_URL: zod_1.z.string().default('http://localhost:5173'),
    ALLOWED_ORIGINS: zod_1.z.string().optional(),
    DATABASE_URL: zod_1.z.string().optional(),
    STRIPE_SECRET_KEY: zod_1.z.string().optional(),
    STRIPE_WEBHOOK_SECRET: zod_1.z.string().optional(),
    ADMIN_EMAIL: zod_1.z.string().email().optional(),
    ADMIN_PASSWORD: zod_1.z.string().min(8).optional(),
    ADMIN_DISPLAY_NAME: zod_1.z.string().min(2).max(40).optional(),
    PUBLIC_SERVER_URL: zod_1.z.string().optional(),
    MAX_UPLOAD_BYTES: zod_1.z.string().default(String(40 * 1024 * 1024)),
    NODE_ENV: zod_1.z.string().default('development'),
});
exports.env = exports.envSchema.parse(process.env);
function getAllowedOrigins() {
    const configured = exports.env.ALLOWED_ORIGINS?.split(',').map((value) => value.trim()).filter(Boolean);
    const defaults = [
        exports.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ];
    return Array.from(new Set((configured && configured.length > 0 ? configured : defaults).filter(Boolean)));
}
function getPublicServerUrl() {
    return (exports.env.PUBLIC_SERVER_URL || `http://localhost:${exports.env.PORT}`).replace(/\/$/, '');
}
function getMaxUploadBytes() {
    const parsed = Number(exports.env.MAX_UPLOAD_BYTES);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 40 * 1024 * 1024;
}
