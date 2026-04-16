"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = authRouter;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../lib/auth");
const store_1 = require("../lib/store");
function sanitizeAuthPayload(db, userId) {
    const user = db.users.find((item) => item.id === userId);
    if (!user)
        return null;
    const profile = db.profiles.find((item) => item.id === user.profileId);
    if (!profile)
        return null;
    return {
        user: {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            createdAt: user.createdAt,
        },
        profile,
        site: db.site,
    };
}
function authRouter() {
    const router = (0, express_1.Router)();
    router.post('/register', async (req, res) => {
        const schema = zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(8),
            displayName: zod_1.z.string().min(2).max(40),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid registration payload' });
        const { email, password, displayName } = parsed.data;
        const existing = (0, store_1.readDb)().users.find((item) => item.email.toLowerCase() === email.toLowerCase());
        if (existing)
            return res.status(409).json({ error: 'An account with that email already exists' });
        let result;
        try {
            result = (0, store_1.mutateDb)((db) => {
                if (!db.site.registrationOpen) {
                    throw new Error('Registration is currently closed');
                }
                const firstUser = db.users.length === 0;
                const userId = (0, store_1.createId)('user');
                const profileId = (0, store_1.createId)('profile');
                const slug = (0, store_1.uniqueSlug)(displayName || (0, store_1.slugify)(email.split('@')[0]), db.profiles.map((item) => item.slug));
                const createdAt = (0, store_1.nowIso)();
                db.profiles.push({
                    id: profileId,
                    userId,
                    slug,
                    displayName,
                    bio: '',
                    location: '',
                    primaryCar: '',
                    avatarUrl: '',
                    bannerUrl: '',
                    verified: false,
                    featured: false,
                    promoted: false,
                    createdAt,
                });
                db.users.push({
                    id: userId,
                    email: email.toLowerCase(),
                    passwordHash: (0, auth_1.hashPassword)(password),
                    displayName,
                    role: firstUser ? 'admin' : 'user',
                    profileId,
                    createdAt,
                });
                (0, store_1.logAudit)(db, userId, 'register', 'user', userId, firstUser ? 'First account auto-promoted to admin' : undefined);
                return { userId, foundingAdmin: firstUser };
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || 'Could not create account' });
        }
        const token = (0, auth_1.createSession)(result.userId);
        const db = (0, store_1.readDb)();
        return res.status(201).json({
            token,
            foundingAdmin: result.foundingAdmin,
            ...sanitizeAuthPayload(db, result.userId),
        });
    });
    router.post('/login', async (req, res) => {
        const schema = zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(8),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid login payload' });
        const db = (0, store_1.readDb)();
        const user = db.users.find((item) => item.email.toLowerCase() === parsed.data.email.toLowerCase());
        if (!user || !(0, auth_1.verifyPassword)(parsed.data.password, user.passwordHash)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = (0, auth_1.createSession)(user.id);
        return res.json({ token, ...sanitizeAuthPayload((0, store_1.readDb)(), user.id) });
    });
    router.get('/me', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        return res.json(sanitizeAuthPayload((0, store_1.readDb)(), viewer.user.id));
    });
    router.post('/logout', auth_1.requireAuth, async (req, res) => {
        const token = (0, auth_1.getTokenFromRequest)(req);
        (0, store_1.mutateDb)((db) => {
            db.sessions = db.sessions.filter((item) => item.tokenHash !== (0, store_1.tokenHash)(token || ''));
            (0, store_1.logAudit)(db, req.viewer.user.id, 'logout', 'session', 'current');
        });
        return res.json({ success: true });
    });
    return router;
}
