"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const products_1 = __importDefault(require("./routes/products"));
const collections_1 = __importDefault(require("./routes/collections"));
const checkout_1 = __importDefault(require("./routes/checkout"));
const contact_1 = __importDefault(require("./routes/contact"));
const newsletter_1 = __importDefault(require("./routes/newsletter"));
const auth_1 = __importDefault(require("./routes/auth"));
const platform_1 = __importDefault(require("./routes/platform"));
const events_1 = __importDefault(require("./routes/events"));
const updates_1 = __importDefault(require("./routes/updates"));
const profiles_1 = __importDefault(require("./routes/profiles"));
const friends_1 = __importDefault(require("./routes/friends"));
const communities_1 = __importDefault(require("./routes/communities"));
const search_1 = __importDefault(require("./routes/search"));
const submissions_1 = __importDefault(require("./routes/submissions"));
const admin_1 = __importDefault(require("./routes/admin"));
const env_1 = require("./lib/env");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, cors_1.default)({
        origin: (0, env_1.getAllowedOrigins)(),
        credentials: true,
    }));
    app.post('/api/checkout/webhook', express_1.default.raw({ type: 'application/json' }));
    app.use((req, res, next) => {
        if (req.path === '/api/checkout/webhook') {
            next();
            return;
        }
        express_1.default.json()(req, res, next);
    });
    app.get('/', (_req, res) => {
        res.json({
            name: 'STATIK API',
            status: 'ok',
            frontendUrl: env_1.env.FRONTEND_URL,
            mode: 'launch-safe-fallback',
            healthcheck: '/api/health',
        });
    });
    app.get('/health', (_req, res) => {
        res.status(200).json({ status: 'ok' });
    });
    app.get('/api/health', (_req, res) => {
        res.status(200).json({
            status: 'ok',
            uptime: process.uptime(),
            mode: 'launch-safe-fallback',
        });
    });
    app.use('/api/products', (0, products_1.default)());
    app.use('/api/collections', (0, collections_1.default)());
    app.use('/api/checkout', (0, checkout_1.default)());
    app.use('/api/contact', (0, contact_1.default)());
    app.use('/api/newsletter', (0, newsletter_1.default)());
    app.use('/api/auth', (0, auth_1.default)());
    app.use('/api/platform', (0, platform_1.default)());
    app.use('/api/events', (0, events_1.default)());
    app.use('/api/updates', (0, updates_1.default)());
    app.use('/api/profiles', (0, profiles_1.default)());
    app.use('/api/friends', (0, friends_1.default)());
    app.use('/api/communities', (0, communities_1.default)());
    app.use('/api/search', (0, search_1.default)());
    app.use('/api/submissions', (0, submissions_1.default)());
    app.use('/api/admin', (0, admin_1.default)());
    app.use((_req, res) => {
        res.status(404).json({ error: 'Not Found' });
    });
    app.use((err, _req, res, _next) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    });
    return app;
}
async function startServer() {
    const app = createApp();
    const port = parseInt(env_1.env.PORT, 10);
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server listening on port ${port}`);
    });
}
