"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UPLOADS_DIR = void 0;
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
exports.getMedia = getMedia;
exports.getMediaList = getMediaList;
exports.getProfileGarage = getProfileGarage;
exports.getProfilePosts = getProfilePosts;
exports.getCommunityPosts = getCommunityPosts;
exports.getProfileShortLinks = getProfileShortLinks;
exports.getProfileAffiliations = getProfileAffiliations;
exports.getShortLinkBySlug = getShortLinkBySlug;
exports.findOrCreateShortLink = findOrCreateShortLink;
exports.trackAnalyticsEvent = trackAnalyticsEvent;
exports.dayKey = dayKey;
exports.aggregateCountByDay = aggregateCountByDay;
exports.uniqueVisitors = uniqueVisitors;
exports.hashVisitorKey = hashVisitorKey;
exports.getProfileForUser = getProfileForUser;
exports.canUserAccessVehicle = canUserAccessVehicle;
exports.assertUserOwnsVehicle = assertUserOwnsVehicle;
exports.assertMediaOwnerOrAdmin = assertMediaOwnerOrAdmin;
exports.removeMediaFile = removeMediaFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("./env");
const DATA_DIR = env_1.env.UPLOADS_DIR ? path_1.default.dirname(env_1.env.UPLOADS_DIR) : path_1.default.join(process.cwd(), 'data');
const DB_PATH = path_1.default.join(DATA_DIR, 'runtime-db.json');
exports.UPLOADS_DIR = env_1.env.UPLOADS_DIR || path_1.default.join(DATA_DIR, 'uploads');
function defaultDb() {
    const now = nowIso();
    return {
        site: {
            shopLocked: true,
            maintenanceMode: false,
            registrationOpen: true,
            brandTagline: 'Private scene network for people who actually show up.',
            eventVisibilityMode: 'curated',
            mapProvider: 'google',
            importsEnabled: true,
            featureWindowDaysDefault: 3,
            homepageHeroMode: 'events',
            messageModerationEnabled: true,
            approvalWorkflowDefault: 'manual',
            sponsorEventModuleEnabled: true,
            auditRetentionDays: 180,
        },
        users: [],
        sessions: [],
        profiles: [],
        events: [],
        eventResponses: [],
        friendRequests: [],
        communities: [],
        communityJoinRequests: [],
        messages: [],
        mediaAssets: [],
        pendingUploads: [],
        garageVehicles: [],
        profilePosts: [],
        communityPosts: [],
        profileLinks: [],
        shortLinks: [],
        analyticsEvents: [],
        reports: [],
        auditLogs: [],
        eventImportSources: [
            {
                id: 'source_qldraceway',
                key: 'qldraceway',
                name: 'Queensland Raceway',
                baseUrl: 'https://www.qldraceways.com.au',
                enabled: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: 'source_racingcalendar_qldraceway',
                key: 'racingcalendar_qldraceway',
                name: 'RacingCalendar Queensland Raceway',
                baseUrl: 'https://racingcalendar.net/circuit/queensland-raceway/2026',
                enabled: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: 'source_willowbank',
                key: 'willowbank',
                name: 'Willowbank Raceway',
                baseUrl: 'https://www.willowbank-raceway.com.au/events/',
                enabled: true,
                createdAt: now,
                updatedAt: now,
            },
            {
                id: 'source_thedriveteam',
                key: 'thedriveteam',
                name: 'The Drive Team Track Days',
                baseUrl: 'https://thedriveteam.com.au/events/',
                enabled: true,
                createdAt: now,
                updatedAt: now,
            },
        ],
        eventImportRuns: [],
        eventImportItems: [],
    };
}
function ensureDirs() {
    if (!fs_1.default.existsSync(DATA_DIR))
        fs_1.default.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs_1.default.existsSync(exports.UPLOADS_DIR))
        fs_1.default.mkdirSync(exports.UPLOADS_DIR, { recursive: true });
    if (!fs_1.default.existsSync(DB_PATH))
        fs_1.default.writeFileSync(DB_PATH, JSON.stringify(defaultDb(), null, 2));
}
function normalizeProfile(profile) {
    return {
        ...profile,
        about: profile.about || '',
        currentlyBuilding: profile.currentlyBuilding || '',
        sceneTags: Array.isArray(profile.sceneTags) ? profile.sceneTags : [],
        featuredVehicleId: profile.featuredVehicleId || undefined,
        featuredPostId: profile.featuredPostId || undefined,
        analyticsVisibility: profile.analyticsVisibility === 'private' ? 'private' : 'public',
    };
}
function normalizeCommunity(community) {
    const now = community.createdAt || nowIso();
    return {
        ...community,
        adminUserIds: Array.isArray(community.adminUserIds) ? community.adminUserIds : [],
        memberUserIds: Array.isArray(community.memberUserIds) ? community.memberUserIds : [],
        region: community.region || '',
        tags: Array.isArray(community.tags) ? community.tags : [],
        rules: Array.isArray(community.rules) ? community.rules : [],
        applicationQuestions: Array.isArray(community.applicationQuestions) ? community.applicationQuestions : [],
        featuredMemberUserIds: Array.isArray(community.featuredMemberUserIds) ? community.featuredMemberUserIds : [],
        featuredVehicleIds: Array.isArray(community.featuredVehicleIds) ? community.featuredVehicleIds : [],
        featuredPostIds: Array.isArray(community.featuredPostIds) ? community.featuredPostIds : [],
        featuredEventIds: Array.isArray(community.featuredEventIds) ? community.featuredEventIds : [],
        discoverable: typeof community.discoverable === 'boolean' ? community.discoverable : true,
        createdAt: now,
        updatedAt: community.updatedAt || now,
    };
}
function normalizeVehicle(vehicle) {
    const now = vehicle.createdAt || nowIso();
    return {
        ...vehicle,
        vehicleType: ['car', 'bike', 'truck', 'other'].includes(vehicle.vehicleType) ? vehicle.vehicleType : 'car',
        year: vehicle.year || '',
        make: vehicle.make || '',
        model: vehicle.model || '',
        trim: vehicle.trim || '',
        nickname: vehicle.nickname || '',
        stage: vehicle.stage || '',
        statusTags: Array.isArray(vehicle.statusTags) ? vehicle.statusTags : [],
        visibility: vehicle.visibility === 'private' ? 'private' : 'public',
        description: vehicle.description || '',
        modTags: Array.isArray(vehicle.modTags) ? vehicle.modTags : [],
        mediaIds: Array.isArray(vehicle.mediaIds) ? vehicle.mediaIds : [],
        linkedCommunityIds: Array.isArray(vehicle.linkedCommunityIds) ? vehicle.linkedCommunityIds : [],
        timeline: Array.isArray(vehicle.timeline) ? vehicle.timeline : [],
        featured: Boolean(vehicle.featured),
        createdAt: now,
        updatedAt: vehicle.updatedAt || now,
        generation: vehicle.generation || '',
        specialEdition: vehicle.specialEdition || '',
        bodyStyle: vehicle.bodyStyle || '',
        drivetrain: vehicle.drivetrain || '',
        engineFamily: vehicle.engineFamily || '',
        transmission: vehicle.transmission || '',
        ownershipStatus: vehicle.ownershipStatus || '',
        purposeTags: Array.isArray(vehicle.purposeTags) ? vehicle.purposeTags : [],
        setupTags: Array.isArray(vehicle.setupTags) ? vehicle.setupTags : [],
        engineCode: vehicle.engineCode || '',
        induction: vehicle.induction || '',
        fuelType: vehicle.fuelType || '',
        colourWrap: vehicle.colourWrap || '',
        wheelTyreSpec: vehicle.wheelTyreSpec || '',
        suspensionSetup: vehicle.suspensionSetup || '',
        engineMods: vehicle.engineMods || '',
        aeroBodyMods: vehicle.aeroBodyMods || '',
        interiorAudioNotes: vehicle.interiorAudioNotes || '',
        performanceNotes: vehicle.performanceNotes || '',
    };
}
function normalizeEvent(event) {
    const createdAt = event.createdAt || nowIso();
    return {
        ...event,
        featured: Boolean(event.featured),
        approvalStatus: ['pending', 'approved', 'rejected', 'revision_requested'].includes(event.approvalStatus) ? event.approvalStatus : 'pending',
        sourceType: event.sourceType || 'user_submission',
        sourceName: event.sourceName || '',
        sourceUrl: event.sourceUrl || '',
        locationDetails: event.locationDetails && typeof event.locationDetails === 'object' ? event.locationDetails : null,
        tags: Array.isArray(event.tags) ? event.tags : [],
        mediaIds: Array.isArray(event.mediaIds) ? event.mediaIds : [],
        sponsored: Boolean(event.sponsored),
        sponsorName: event.sponsorName || '',
        venueType: event.venueType || 'other',
        entryType: event.entryType || 'mixed',
        pricingType: event.pricingType || 'other',
        vehicleFocus: Array.isArray(event.vehicleFocus) ? event.vehicleFocus : [],
        visibilityLabel: event.visibilityLabel || '',
        spectatorFriendly: typeof event.spectatorFriendly === 'boolean' ? event.spectatorFriendly : undefined,
        familyFriendly: typeof event.familyFriendly === 'boolean' ? event.familyFriendly : undefined,
        recurring: typeof event.recurring === 'boolean' ? event.recurring : false,
        indoorOutdoor: event.indoorOutdoor || 'unknown',
        submittedByEmail: event.submittedByEmail || '',
        submittedByName: event.submittedByName || '',
        hostLinks: Array.isArray(event.hostLinks) ? event.hostLinks : [],
        adminNotes: Array.isArray(event.adminNotes) ? event.adminNotes : [],
        statusHistory: Array.isArray(event.statusHistory) ? event.statusHistory : [],
        createdAt,
        updatedAt: event.updatedAt || createdAt,
    };
}
function normalizeDb(raw) {
    const db = { ...defaultDb(), ...raw };
    db.site = { ...defaultDb().site, ...(db.site || {}) };
    db.users = (db.users || []).map((item) => ({ ...item, isBanned: Boolean(item.isBanned), suspensionEndsAt: item.suspensionEndsAt || null, moderationNote: item.moderationNote || '', featureEndsAt: item.featureEndsAt || null }));
    db.sessions = (db.sessions || []).map((item) => ({ ...item, lastSeenAt: item.lastSeenAt || item.createdAt || nowIso(), ip: item.ip || '', userAgent: item.userAgent || '' }));
    db.profiles = (db.profiles || []).map(normalizeProfile);
    db.events = (db.events || []).map(normalizeEvent);
    db.communities = (db.communities || []).map(normalizeCommunity);
    db.garageVehicles = (db.garageVehicles || []).map(normalizeVehicle);
    db.communityJoinRequests = (db.communityJoinRequests || []).map((item) => ({ ...item, answers: Array.isArray(item.answers) ? item.answers : [] }));
    db.messages = (db.messages || []).map((item) => ({ ...item, hidden: Boolean(item.hidden), deleted: Boolean(item.deleted), moderationNote: item.moderationNote || '' }));
    db.profilePosts = (db.profilePosts || []).map((item) => ({ ...item, mediaIds: Array.isArray(item.mediaIds) ? item.mediaIds : [], pinned: Boolean(item.pinned), featured: Boolean(item.featured), updatedAt: item.updatedAt || item.createdAt || nowIso() }));
    db.communityPosts = (db.communityPosts || []).map((item) => ({ ...item, mediaIds: Array.isArray(item.mediaIds) ? item.mediaIds : [], pinned: Boolean(item.pinned), featured: Boolean(item.featured), updatedAt: item.updatedAt || item.createdAt || nowIso() }));
    db.profileLinks = (db.profileLinks || []).map((item) => ({ ...item, type: item.type || 'other', updatedAt: item.updatedAt || item.createdAt || nowIso() }));
    db.shortLinks = (db.shortLinks || []).map((item) => ({ ...item, clickCount: Number(item.clickCount || 0), qrScanCount: Number(item.qrScanCount || 0), updatedAt: item.updatedAt || item.createdAt || nowIso() }));
    db.analyticsEvents = (db.analyticsEvents || []).map((item) => ({ ...item, source: item.source || 'direct' }));
    db.mediaAssets = (db.mediaAssets || []).map((item) => ({ ...item, status: item.status || 'uploaded', updatedAt: item.updatedAt || item.createdAt || nowIso() }));
    db.pendingUploads = (db.pendingUploads || []).map((item) => ({ ...item, status: item.status || 'pending' }));
    db.reports = db.reports || [];
    db.auditLogs = db.auditLogs || [];
    {
        const defaults = defaultDb().eventImportSources;
        const existing = db.eventImportSources || [];
        const byKey = new Map();
        defaults.forEach((source) => byKey.set(source.key, source));
        existing.forEach((source) => byKey.set(source.key, { ...byKey.get(source.key), ...source }));
        db.eventImportSources = Array.from(byKey.values()).map((item) => ({ ...item, enabled: item.enabled !== false, createdAt: item.createdAt || nowIso(), updatedAt: item.updatedAt || item.createdAt || nowIso() }));
    }
    db.eventImportRuns = (db.eventImportRuns || []).map((item) => ({ ...item, importedCount: Number(item.importedCount || 0), duplicateCount: Number(item.duplicateCount || 0), errorCount: Number(item.errorCount || 0) }));
    db.eventImportItems = (db.eventImportItems || []).map((item) => ({ ...item, normalizedTags: Array.isArray(item.normalizedTags) ? item.normalizedTags : [], status: item.status || 'pending', createdAt: item.createdAt || nowIso(), updatedAt: item.updatedAt || item.createdAt || nowIso() }));
    return db;
}
function readDb() {
    ensureDirs();
    const raw = fs_1.default.readFileSync(DB_PATH, 'utf8');
    return normalizeDb(JSON.parse(raw));
}
function writeDb(db) {
    ensureDirs();
    fs_1.default.writeFileSync(DB_PATH, JSON.stringify(normalizeDb(db), null, 2));
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
        return { friendCount: 0, communityCount: 0, eventAttendanceCount: 0, vehicleCount: 0, postCount: 0 };
    }
    const friendCount = getFriendUserIds(db, profile.userId).length;
    const communityCount = db.communities.filter((community) => community.memberUserIds.includes(profile.userId)).length;
    const eventAttendanceCount = db.eventResponses.filter((response) => response.userId === profile.userId && response.status === 'attending').length;
    const vehicleCount = db.garageVehicles.filter((vehicle) => vehicle.profileId === profile.id).length;
    const postCount = db.profilePosts.filter((post) => post.profileId === profile.id).length;
    return { friendCount, communityCount, eventAttendanceCount, vehicleCount, postCount };
}
function canManageCommunity(community, userId) {
    return community.ownerUserId === userId || community.adminUserIds.includes(userId);
}
function logAudit(db, actorUserId, action, targetType, targetId, detail, undoAction) {
    db.auditLogs.unshift({
        id: createId('audit'),
        actorUserId,
        action,
        targetType,
        targetId,
        createdAt: nowIso(),
        detail,
        undoAction,
    });
    db.auditLogs = db.auditLogs.slice(0, 1000);
}
function getMedia(db, mediaId) {
    if (!mediaId)
        return null;
    return db.mediaAssets.find((item) => item.id === mediaId && item.status === 'uploaded') || null;
}
function getMediaList(db, mediaIds) {
    return mediaIds.map((mediaId) => getMedia(db, mediaId)).filter(Boolean);
}
function getProfileGarage(db, profileId, viewerUserId) {
    const profile = db.profiles.find((item) => item.id === profileId) || null;
    const viewerIsOwner = profile ? profile.userId === viewerUserId : false;
    return db.garageVehicles
        .filter((vehicle) => vehicle.profileId === profileId)
        .filter((vehicle) => vehicle.visibility === 'public' || viewerIsOwner)
        .sort((a, b) => Number(b.featured) - Number(a.featured) || b.updatedAt.localeCompare(a.updatedAt))
        .map((vehicle) => ({
        ...vehicle,
        heroMedia: getMedia(db, vehicle.heroMediaId) || getMedia(db, vehicle.mediaIds[0]),
        media: getMediaList(db, vehicle.mediaIds),
        communities: vehicle.linkedCommunityIds.map((communityId) => db.communities.find((item) => item.id === communityId)).filter(Boolean),
    }));
}
function getProfilePosts(db, profileId) {
    return db.profilePosts
        .filter((post) => post.profileId === profileId)
        .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt))
        .map((post) => ({
        ...post,
        media: getMediaList(db, post.mediaIds),
    }));
}
function getCommunityPosts(db, communityId) {
    return db.communityPosts
        .filter((post) => post.communityId === communityId)
        .sort((a, b) => Number(b.pinned) - Number(a.pinned) || Number(b.featured) - Number(a.featured) || b.createdAt.localeCompare(a.createdAt))
        .map((post) => ({
        ...post,
        media: getMediaList(db, post.mediaIds),
        authorProfile: db.profiles.find((item) => item.userId === post.authorUserId) || null,
        linkedEvent: post.linkedEventId ? db.events.find((event) => event.id === post.linkedEventId) || null : null,
    }));
}
function getProfileShortLinks(db, profile) {
    const vehicleIds = db.garageVehicles.filter((vehicle) => vehicle.profileId === profile.id).map((vehicle) => vehicle.id);
    return db.shortLinks.filter((item) => item.targetId === profile.id || vehicleIds.includes(item.targetId));
}
function getProfileAffiliations(db, userId) {
    return db.communities
        .filter((community) => community.memberUserIds.includes(userId))
        .map((community) => ({
        id: community.id,
        slug: community.slug,
        name: community.name,
        visibility: community.visibility,
        region: community.region,
        role: community.ownerUserId === userId ? 'owner' : community.adminUserIds.includes(userId) ? 'admin' : 'member',
    }));
}
function getShortLinkBySlug(db, slug) {
    return db.shortLinks.find((item) => item.slug === slug) || null;
}
function findOrCreateShortLink(db, params) {
    const existing = db.shortLinks.find((item) => item.targetType === params.targetType && item.targetId === params.targetId);
    if (existing)
        return existing;
    const slug = uniqueSlug(params.preferredSlug, db.shortLinks.map((item) => item.slug));
    const link = {
        id: createId('short'),
        slug,
        targetType: params.targetType,
        targetId: params.targetId,
        ownerUserId: params.ownerUserId,
        clickCount: 0,
        qrScanCount: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
    };
    db.shortLinks.push(link);
    return link;
}
function trackAnalyticsEvent(db, event) {
    db.analyticsEvents.unshift({
        id: createId('metric'),
        createdAt: nowIso(),
        ...event,
    });
    db.analyticsEvents = db.analyticsEvents.slice(0, 5000);
}
function dayKey(iso) {
    return iso.slice(0, 10);
}
function aggregateCountByDay(events, days = 14) {
    const today = new Date();
    const points = [];
    for (let offset = days - 1; offset >= 0; offset -= 1) {
        const date = new Date(today);
        date.setUTCDate(today.getUTCDate() - offset);
        const label = date.toISOString().slice(0, 10);
        points.push({ date: label, count: 0 });
    }
    const map = new Map(points.map((point) => [point.date, point]));
    events.forEach((event) => {
        const key = dayKey(event.createdAt);
        const point = map.get(key);
        if (point)
            point.count += 1;
    });
    return points;
}
function uniqueVisitors(events) {
    return new Set(events.map((event) => event.sessionKey)).size;
}
function hashVisitorKey(input) {
    return crypto_1.default.createHash('sha256').update(input).digest('hex');
}
function getProfileForUser(db, userId) {
    return db.profiles.find((profile) => profile.userId === userId) || null;
}
function canUserAccessVehicle(db, vehicleId, userId, includePrivate = false) {
    const vehicle = db.garageVehicles.find((item) => item.id === vehicleId);
    if (!vehicle)
        return false;
    const profile = db.profiles.find((item) => item.id === vehicle.profileId);
    const user = userId ? db.users.find((item) => item.id === userId) : null;
    if (user?.role === 'admin')
        return true;
    if (profile && userId && profile.userId === userId)
        return true;
    return includePrivate ? false : vehicle.visibility === 'public';
}
function assertUserOwnsVehicle(db, vehicleId, userId) {
    const vehicle = db.garageVehicles.find((item) => item.id === vehicleId);
    const profile = vehicle ? db.profiles.find((item) => item.id === vehicle.profileId) : null;
    if (!vehicle || !profile || profile.userId !== userId)
        throw new Error('Vehicle not found');
    return vehicle;
}
function assertMediaOwnerOrAdmin(db, mediaId, userId) {
    const asset = db.mediaAssets.find((item) => item.id === mediaId && item.status !== 'deleted');
    const user = db.users.find((item) => item.id === userId);
    if (!asset || (asset.ownerUserId !== userId && user?.role !== 'admin'))
        throw new Error('Media not found');
    return asset;
}
function removeMediaFile(storageKey) {
    if (!storageKey)
        return;
    const filePath = path_1.default.join(exports.UPLOADS_DIR, storageKey);
    if (fs_1.default.existsSync(filePath))
        fs_1.default.unlinkSync(filePath);
}
