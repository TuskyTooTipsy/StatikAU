"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureBootstrapAdmin = ensureBootstrapAdmin;
const env_1 = require("./env");
const auth_1 = require("./auth");
const store_1 = require("./store");
function ensureBootstrapAdmin() {
    const email = env_1.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = env_1.env.ADMIN_PASSWORD;
    const displayName = env_1.env.ADMIN_DISPLAY_NAME?.trim() || 'STATIK Admin';
    if (!email && !password)
        return;
    if (!email || !password) {
        console.warn('[bootstrap-admin] ADMIN_EMAIL and ADMIN_PASSWORD must both be set. Skipping admin bootstrap.');
        return;
    }
    const existingDb = (0, store_1.readDb)();
    const existingUser = existingDb.users.find((item) => item.email.toLowerCase() === email);
    if (existingUser) {
        if (existingUser.role !== 'admin') {
            (0, store_1.mutateDb)((db) => {
                const user = db.users.find((item) => item.id === existingUser.id);
                if (!user)
                    return;
                user.role = 'admin';
                (0, store_1.logAudit)(db, user.id, 'bootstrap_admin_promoted', 'user', user.id, 'Promoted to admin from environment bootstrap');
            });
            console.log(`[bootstrap-admin] Promoted existing user ${email} to admin.`);
        }
        else {
            console.log(`[bootstrap-admin] Admin account already exists for ${email}.`);
        }
        return;
    }
    (0, store_1.mutateDb)((db) => {
        const userId = (0, store_1.createId)('user');
        const profileId = (0, store_1.createId)('profile');
        const createdAt = (0, store_1.nowIso)();
        const slug = (0, store_1.uniqueSlug)(displayName || (0, store_1.slugify)(email.split('@')[0]), db.profiles.map((item) => item.slug));
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
            about: '',
            currentlyBuilding: '',
            sceneTags: [],
            analyticsVisibility: 'public',
            createdAt,
        });
        db.users.push({
            id: userId,
            email,
            passwordHash: (0, auth_1.hashPassword)(password),
            displayName,
            role: 'admin',
            profileId,
            createdAt,
        });
        (0, store_1.logAudit)(db, userId, 'bootstrap_admin_created', 'user', userId, 'Created from ADMIN_EMAIL/ADMIN_PASSWORD environment variables');
    });
    console.log(`[bootstrap-admin] Seeded admin account for ${email}.`);
}
