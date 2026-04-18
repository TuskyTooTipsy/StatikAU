"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const media_1 = __importDefault(require("./routes/media"));
const links_1 = __importStar(require("./routes/links"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const reports_1 = __importDefault(require("./routes/reports"));
const vehicleRegistry_1 = __importDefault(require("./routes/vehicleRegistry"));
const env_1 = require("./lib/env");
const bootstrap_1 = require("./lib/bootstrap");
const store_1 = require("./lib/store");
function createApp() {
    const app = (0, express_1.default)();
    app.set('trust proxy', true);
    app.use((0, helmet_1.default)({ crossOriginResourcePolicy: false }));
    app.use((0, compression_1.default)());
    app.use((0, cors_1.default)({
        origin: (0, env_1.getAllowedOrigins)(),
        credentials: true,
    }));
    app.use('/uploads', express_1.default.static(store_1.UPLOADS_DIR));
    app.use((0, links_1.redirectRouter)());
    app.post('/api/checkout/webhook', express_1.default.raw({ type: 'application/json' }));
    app.use((req, res, next) => {
        if (req.path === '/api/checkout/webhook') {
            next();
            return;
        }
        express_1.default.json({ limit: '2mb' })(req, res, next);
    });
    app.get('/', (_req, res) => {
        res.json({
            name: 'STATIK API',
            status: 'ok',
            frontendUrl: env_1.env.FRONTEND_URL,
            mode: 'network-expanded',
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
            mode: 'network-expanded',
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
    app.use('/api/media', (0, media_1.default)());
    app.use('/api/links', (0, links_1.default)());
    app.use('/api/analytics', (0, analytics_1.default)());
    app.use('/api/reports', (0, reports_1.default)());
    app.use('/api/vehicle-registry', (0, vehicleRegistry_1.default)());
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
    (0, bootstrap_1.ensureBootstrapAdmin)();
    const app = createApp();
    const port = parseInt(env_1.env.PORT, 10);
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server listening on port ${port}`);
    });
}
