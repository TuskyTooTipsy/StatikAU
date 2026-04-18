"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.createSession = createSession;
exports.getTokenFromRequest = getTokenFromRequest;
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
const crypto_1 = __importDefault(require("crypto"));
const store_1 = require("./store");
function hashPassword(password) {
    const salt = crypto_1.default.randomBytes(16).toString('hex');
    const hash = crypto_1.default.scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}
function verifyPassword(password, storedHash) {
    const [salt, hash] = storedHash.split(':');
    const input = crypto_1.default.scryptSync(password, salt, 64).toString('hex');
    return crypto_1.default.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(input, 'hex'));
}
function getRequestIp(req) {
    const forwarded = req?.headers['x-forwarded-for'];
    if (typeof forwarded === 'string' && forwarded.trim())
        return forwarded.split(',')[0].trim();
    return req?.ip || '';
}
function getRequestUserAgent(req) {
    return typeof req?.headers['user-agent'] === 'string' ? req.headers['user-agent'] : '';
}
function createSession(userId, req) {
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const now = (0, store_1.nowIso)();
    (0, store_1.mutateDb)((db) => {
        db.sessions.push({
            id: (0, store_1.createId)('session'),
            userId,
            tokenHash: (0, store_1.tokenHash)(token),
            createdAt: now,
            lastSeenAt: now,
            ip: getRequestIp(req),
            userAgent: getRequestUserAgent(req),
        });
    });
    return token;
}
function getTokenFromRequest(req) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer '))
        return null;
    return header.slice(7).trim() || null;
}
function isUserBlocked(user) {
    if (user?.isBanned)
        return 'Account banned';
    if (user?.suspensionEndsAt && new Date(user.suspensionEndsAt).getTime() > Date.now()) {
        return `Account suspended until ${new Date(user.suspensionEndsAt).toLocaleString()}`;
    }
    return null;
}
function requireAuth(req, res, next) {
    const token = getTokenFromRequest(req);
    if (!token)
        return res.status(401).json({ error: 'Authentication required' });
    const db = (0, store_1.readDb)();
    const session = db.sessions.find((item) => item.tokenHash === (0, store_1.tokenHash)(token));
    if (!session)
        return res.status(401).json({ error: 'Session expired' });
    const user = db.users.find((item) => item.id === session.userId);
    const profile = user ? db.profiles.find((item) => item.id === user.profileId) : null;
    if (!user || !profile)
        return res.status(401).json({ error: 'Session invalid' });
    const blocked = isUserBlocked(user);
    if (blocked)
        return res.status(403).json({ error: blocked });
    (0, store_1.mutateDb)((mutable) => {
        const live = mutable.sessions.find((item) => item.id === session.id);
        if (live) {
            live.lastSeenAt = (0, store_1.nowIso)();
            live.ip = getRequestIp(req);
            live.userAgent = getRequestUserAgent(req);
        }
    });
    req.viewer = { user, profile };
    return next();
}
function requireAdmin(req, res, next) {
    requireAuth(req, res, () => {
        const viewer = req.viewer;
        if (!viewer || viewer.user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        return next();
    });
}
