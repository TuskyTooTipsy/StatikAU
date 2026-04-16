"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.envSchema = void 0;
exports.getAllowedOrigins = getAllowedOrigins;
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
