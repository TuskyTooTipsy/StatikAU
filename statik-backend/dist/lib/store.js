"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDb = readDb;
exports.writeDb = writeDb;
exports.mutateDb = mutateDb;
exports.nowIso = nowIso;
exports.createId = createId;
exports.slugify = slugify;
exports.uniqueSlug = uniqueSlug;
exports.tokenHash = tokenHash;
exports.getUserByToken = getUserByToken;
exports.getFriendUserIds = getFriendUserIds;
exports.countMutualFriends = countMutualFriends;
exports.profileStats = profileStats;
exports.canManageCommunity = canManageCommunity;
exports.logAudit = logAudit;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const DATA_DIR = path_1.default.join(process.cwd(), 'data');
const DB_PATH = path_1.default.join(DATA_DIR, 'runtime-db.json');
function defaultDb() {
    return {
        site: {
            shopLocked: true,
            maintenanceMode: false,
            registrationOpen: true,
            brandTagline: 'Private scene network for people who actually show up.',
        },
        users: [],
        sessions: [],
        profiles: [],
        events: [],
        eventResponses: [],
        friendRequests: [],
        communities: [],
        messages: [],
        auditLogs: [],
    };
}
function ensureDbFile() {
    if (!fs_1.default.existsSync(DATA_DIR)) {
        fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs_1.default.existsSync(DB_PATH)) {
        fs_1.default.writeFileSync(DB_PATH, JSON.stringify(defaultDb(), null, 2));
    }
}
function readDb() {
    ensureDbFile();
    const raw = fs_1.default.readFileSync(DB_PATH, 'utf8');
    return { ...defaultDb(), ...JSON.parse(raw) };
}
function writeDb(db) {
    ensureDbFile();
    fs_1.default.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}
function mutateDb(mutator) {
    const db = readDb();
    const result = mutator(db);
    writeDb(db);
    return result;
}
function nowIso() {
    return new Date().toISOString();
}
function createId(prefix) {
    return `${prefix}_${crypto_1.default.randomUUID().replace(/-/g, '')}`;
}
function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'member';
}
function uniqueSlug(base, existing) {
    let candidate = slugify(base);
    let index = 2;
    while (existing.includes(candidate)) {
        candidate = `${slugify(base)}-${index}`;
        index += 1;
    }
    return candidate;
}
function tokenHash(token) {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
}
function getUserByToken(token) {
    if (!token)
        return null;
    const db = readDb();
    const session = db.sessions.find((item) => item.tokenHash === tokenHash(token));
    if (!session)
        return null;
    const user = db.users.find((item) => item.id === session.userId);
    if (!user)
        return null;
    const profile = db.profiles.find((item) => item.id === user.profileId) || null;
    return { user, profile, session };
}
function getFriendUserIds(db, userId) {
    return db.friendRequests
        .filter((request) => request.status === 'accepted' && (request.fromUserId === userId || request.toUserId === userId))
        .map((request) => (request.fromUserId === userId ? request.toUserId : request.fromUserId));
}
function countMutualFriends(db, aUserId, bUserId) {
    const a = new Set(getFriendUserIds(db, aUserId));
    const b = new Set(getFriendUserIds(db, bUserId));
    let count = 0;
    a.forEach((id) => {
        if (b.has(id))
            count += 1;
    });
    return count;
}
function profileStats(db, profileId) {
    const profile = db.profiles.find((item) => item.id === profileId);
    if (!profile) {
        return { friendCount: 0, communityCount: 0, eventAttendanceCount: 0 };
    }
    const friendCount = getFriendUserIds(db, profile.userId).length;
    const communityCount = db.communities.filter((community) => community.memberUserIds.includes(profile.userId)).length;
    const eventAttendanceCount = db.eventResponses.filter((response) => response.userId === profile.userId && response.status === 'attending').length;
    return { friendCount, communityCount, eventAttendanceCount };
}
function canManageCommunity(community, userId) {
    return community.ownerUserId === userId || community.adminUserIds.includes(userId);
}
function logAudit(db, actorUserId, action, targetType, targetId, detail) {
    db.auditLogs.unshift({
        id: createId('audit'),
        actorUserId,
        action,
        targetType,
        targetId,
        createdAt: nowIso(),
        detail,
    });
    db.auditLogs = db.auditLogs.slice(0, 200);
}
