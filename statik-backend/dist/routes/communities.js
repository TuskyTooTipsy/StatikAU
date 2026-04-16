"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = communitiesRouter;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../lib/auth");
const store_1 = require("../lib/store");
function assertMember(community, userId) {
    return community.memberUserIds.includes(userId);
}
function messagePayload(db, message) {
    const profile = db.profiles.find((item) => item.userId === message.userId);
    const event = message.eventId ? db.events.find((item) => item.id === message.eventId) : null;
    return {
        ...message,
        profile,
        event,
    };
}
function communityPayload(db, community) {
    const owner = db.profiles.find((item) => item.userId === community.ownerUserId) || null;
    const admins = community.adminUserIds
        .map((userId) => db.profiles.find((item) => item.userId === userId))
        .filter(Boolean);
    const members = community.memberUserIds
        .map((userId) => db.profiles.find((item) => item.userId === userId))
        .filter(Boolean)
        .map((profile) => ({ ...profile, stats: (0, store_1.profileStats)(db, profile.id) }));
    const messages = db.messages
        .filter((message) => message.communityId === community.id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
        .slice(-120)
        .map((message) => messagePayload(db, message));
    return {
        ...community,
        owner,
        admins,
        members,
        memberCount: community.memberUserIds.length,
        messages,
    };
}
function communitiesRouter() {
    const router = (0, express_1.Router)();
    router.get('/', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        const db = (0, store_1.readDb)();
        const items = db.communities
            .filter((community) => community.visibility === 'public' || community.memberUserIds.includes(viewer.user.id))
            .sort((a, b) => b.memberUserIds.length - a.memberUserIds.length)
            .map((community) => ({
            id: community.id,
            slug: community.slug,
            name: community.name,
            description: community.description,
            visibility: community.visibility,
            avatarUrl: community.avatarUrl,
            bannerUrl: community.bannerUrl,
            memberCount: community.memberUserIds.length,
            isMember: community.memberUserIds.includes(viewer.user.id),
            isAdmin: (0, store_1.canManageCommunity)(community, viewer.user.id),
        }));
        return res.json(items);
    });
    router.post('/', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            name: zod_1.z.string().min(2).max(60),
            description: zod_1.z.string().min(10).max(280),
            visibility: zod_1.z.enum(['public', 'private']).default('public'),
            avatarUrl: zod_1.z.string().url().or(zod_1.z.literal('')).optional().default(''),
            bannerUrl: zod_1.z.string().url().or(zod_1.z.literal('')).optional().default(''),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid community payload' });
        const viewer = req.viewer;
        const created = (0, store_1.mutateDb)((db) => {
            const community = {
                id: (0, store_1.createId)('community'),
                slug: (0, store_1.uniqueSlug)(parsed.data.name, db.communities.map((item) => item.slug)),
                name: parsed.data.name,
                description: parsed.data.description,
                visibility: parsed.data.visibility,
                avatarUrl: parsed.data.avatarUrl,
                bannerUrl: parsed.data.bannerUrl,
                ownerUserId: viewer.user.id,
                adminUserIds: [],
                memberUserIds: [viewer.user.id],
                createdAt: (0, store_1.nowIso)(),
            };
            db.communities.push(community);
            (0, store_1.logAudit)(db, viewer.user.id, 'community_created', 'community', community.id);
            return community.slug;
        });
        const db = (0, store_1.readDb)();
        const community = db.communities.find((item) => item.slug === created);
        return res.status(201).json(community ? communityPayload(db, community) : null);
    });
    router.get('/:slug', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        const db = (0, store_1.readDb)();
        const community = db.communities.find((item) => item.slug === req.params.slug);
        if (!community)
            return res.status(404).json({ error: 'Community not found' });
        if (community.visibility === 'private' && !community.memberUserIds.includes(viewer.user.id)) {
            return res.status(403).json({ error: 'This community is private' });
        }
        return res.json(communityPayload(db, community));
    });
    router.post('/:id/join', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const community = db.communities.find((item) => item.id === req.params.id);
                if (!community)
                    throw new Error('Community not found');
                if (community.visibility === 'private')
                    throw new Error('Private communities must add members manually');
                if (!community.memberUserIds.includes(viewer.user.id))
                    community.memberUserIds.push(viewer.user.id);
                (0, store_1.logAudit)(db, viewer.user.id, 'community_joined', 'community', community.id);
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || 'Could not join community' });
        }
        return res.json({ success: true });
    });
    router.post('/:id/leave', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const community = db.communities.find((item) => item.id === req.params.id);
                if (!community)
                    throw new Error('Community not found');
                if (community.ownerUserId === viewer.user.id)
                    throw new Error('Owner cannot leave without transferring ownership');
                community.memberUserIds = community.memberUserIds.filter((id) => id !== viewer.user.id);
                community.adminUserIds = community.adminUserIds.filter((id) => id !== viewer.user.id);
                (0, store_1.logAudit)(db, viewer.user.id, 'community_left', 'community', community.id);
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || 'Could not leave community' });
        }
        return res.json({ success: true });
    });
    router.post('/:id/messages', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            type: zod_1.z.enum(['text', 'event', 'location']).default('text'),
            text: zod_1.z.string().max(600).optional().default(''),
            eventId: zod_1.z.string().optional(),
            location: zod_1.z.object({
                lat: zod_1.z.number(),
                lng: zod_1.z.number(),
                label: zod_1.z.string().max(120).optional(),
            }).optional(),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid message payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const community = db.communities.find((item) => item.id === req.params.id);
                if (!community)
                    throw new Error('Community not found');
                if (!assertMember(community, viewer.user.id))
                    throw new Error('Join this community to chat');
                if (parsed.data.type === 'event' && !parsed.data.eventId)
                    throw new Error('Event messages must include an event');
                if (parsed.data.type === 'location' && !parsed.data.location)
                    throw new Error('Location messages must include coordinates');
                if (parsed.data.type === 'text' && !parsed.data.text.trim())
                    throw new Error('Message cannot be empty');
                db.messages.push({
                    id: (0, store_1.createId)('message'),
                    communityId: community.id,
                    userId: viewer.user.id,
                    type: parsed.data.type,
                    text: parsed.data.text,
                    eventId: parsed.data.eventId,
                    location: parsed.data.location,
                    createdAt: (0, store_1.nowIso)(),
                });
                (0, store_1.logAudit)(db, viewer.user.id, 'community_message_sent', 'community', community.id, parsed.data.type);
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || 'Could not send message' });
        }
        const db = (0, store_1.readDb)();
        const community = db.communities.find((item) => item.id === req.params.id);
        return res.status(201).json(community ? communityPayload(db, community) : null);
    });
    router.delete('/:id/messages/:messageId', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const community = db.communities.find((item) => item.id === req.params.id);
                if (!community)
                    throw new Error('Community not found');
                const message = db.messages.find((item) => item.id === req.params.messageId && item.communityId === community.id);
                if (!message)
                    throw new Error('Message not found');
                const canDelete = message.userId === viewer.user.id || (0, store_1.canManageCommunity)(community, viewer.user.id) || viewer.user.role === 'admin';
                if (!canDelete)
                    throw new Error('Not allowed to delete this message');
                db.messages = db.messages.filter((item) => item.id !== message.id);
                (0, store_1.logAudit)(db, viewer.user.id, 'community_message_deleted', 'message', message.id);
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || 'Could not delete message' });
        }
        return res.json({ success: true });
    });
    router.post('/:id/admins', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            userId: zod_1.z.string().min(1),
            action: zod_1.z.enum(['promote', 'demote']),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid admin action payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const community = db.communities.find((item) => item.id === req.params.id);
                if (!community)
                    throw new Error('Community not found');
                if (community.ownerUserId !== viewer.user.id && viewer.user.role !== 'admin')
                    throw new Error('Only the owner can manage admins');
                if (!community.memberUserIds.includes(parsed.data.userId))
                    throw new Error('Target user is not a member');
                if (parsed.data.action === 'promote' && !community.adminUserIds.includes(parsed.data.userId)) {
                    community.adminUserIds.push(parsed.data.userId);
                }
                if (parsed.data.action === 'demote') {
                    community.adminUserIds = community.adminUserIds.filter((id) => id !== parsed.data.userId);
                }
                (0, store_1.logAudit)(db, viewer.user.id, parsed.data.action === 'promote' ? 'community_admin_promoted' : 'community_admin_demoted', 'community', community.id, parsed.data.userId);
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || 'Could not update community admin' });
        }
        return res.json({ success: true });
    });
    router.post('/:id/members/:userId/kick', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const community = db.communities.find((item) => item.id === req.params.id);
                if (!community)
                    throw new Error('Community not found');
                if (!(0, store_1.canManageCommunity)(community, viewer.user.id) && viewer.user.role !== 'admin')
                    throw new Error('Not allowed to manage this community');
                if (community.ownerUserId === req.params.userId)
                    throw new Error('Owner cannot be kicked');
                community.memberUserIds = community.memberUserIds.filter((id) => id !== req.params.userId);
                community.adminUserIds = community.adminUserIds.filter((id) => id !== req.params.userId);
                db.messages = db.messages.filter((message) => !(message.communityId === community.id && message.userId === req.params.userId));
                (0, store_1.logAudit)(db, viewer.user.id, 'community_member_kicked', 'community', community.id, req.params.userId);
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || 'Could not kick member' });
        }
        return res.json({ success: true });
    });
    return router;
}
