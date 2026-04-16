"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = friendsRouter;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../lib/auth");
const store_1 = require("../lib/store");
function mapFriendCard(db, userId) {
    const profile = db.profiles.find((item) => item.userId === userId);
    if (!profile)
        return null;
    return {
        ...profile,
        stats: (0, store_1.profileStats)(db, profile.id),
    };
}
function friendsRouter() {
    const router = (0, express_1.Router)();
    router.get('/', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        const db = (0, store_1.readDb)();
        const friends = (0, store_1.getFriendUserIds)(db, viewer.user.id).map((userId) => mapFriendCard(db, userId)).filter(Boolean);
        const incoming = db.friendRequests
            .filter((request) => request.toUserId === viewer.user.id && request.status === 'pending')
            .map((request) => ({ request, profile: mapFriendCard(db, request.fromUserId) }));
        const outgoing = db.friendRequests
            .filter((request) => request.fromUserId === viewer.user.id && request.status === 'pending')
            .map((request) => ({ request, profile: mapFriendCard(db, request.toUserId) }));
        return res.json({ friends, incoming, outgoing });
    });
    router.post('/requests', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({ targetUserId: zod_1.z.string().min(1) });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid friend request payload' });
        const viewer = req.viewer;
        if (viewer.user.id === parsed.data.targetUserId)
            return res.status(400).json({ error: 'You cannot friend yourself' });
        try {
            (0, store_1.mutateDb)((db) => {
                const target = db.users.find((item) => item.id === parsed.data.targetUserId);
                if (!target)
                    throw new Error('Target user not found');
                const existingFriend = (0, store_1.getFriendUserIds)(db, viewer.user.id).includes(parsed.data.targetUserId);
                if (existingFriend)
                    throw new Error('Already friends');
                const existingRequest = db.friendRequests.find((item) => ((item.fromUserId === viewer.user.id && item.toUserId === parsed.data.targetUserId) ||
                    (item.fromUserId === parsed.data.targetUserId && item.toUserId === viewer.user.id)) && item.status === 'pending');
                if (existingRequest)
                    throw new Error('Friend request already pending');
                db.friendRequests.push({
                    id: (0, store_1.createId)('friendreq'),
                    fromUserId: viewer.user.id,
                    toUserId: parsed.data.targetUserId,
                    status: 'pending',
                    createdAt: (0, store_1.nowIso)(),
                    updatedAt: (0, store_1.nowIso)(),
                });
                (0, store_1.logAudit)(db, viewer.user.id, 'friend_request_sent', 'user', parsed.data.targetUserId);
            });
        }
        catch (error) {
            return res.status(400).json({ error: error.message || 'Could not send friend request' });
        }
        return res.status(201).json({ success: true });
    });
    router.post('/requests/:id/respond', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({ action: zod_1.z.enum(['accept', 'reject']) });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid response payload' });
        const viewer = req.viewer;
        try {
            (0, store_1.mutateDb)((db) => {
                const request = db.friendRequests.find((item) => item.id === req.params.id && item.toUserId === viewer.user.id && item.status === 'pending');
                if (!request)
                    throw new Error('Friend request not found');
                request.status = parsed.data.action === 'accept' ? 'accepted' : 'rejected';
                request.updatedAt = (0, store_1.nowIso)();
                (0, store_1.logAudit)(db, viewer.user.id, parsed.data.action === 'accept' ? 'friend_request_accepted' : 'friend_request_rejected', 'user', request.fromUserId);
            });
        }
        catch (error) {
            return res.status(404).json({ error: error.message || 'Friend request not found' });
        }
        return res.json({ success: true });
    });
    router.delete('/:userId', auth_1.requireAuth, async (req, res) => {
        const viewer = req.viewer;
        (0, store_1.mutateDb)((db) => {
            db.friendRequests = db.friendRequests.filter((item) => !(item.status === 'accepted' && ((item.fromUserId === viewer.user.id && item.toUserId === req.params.userId) ||
                (item.toUserId === viewer.user.id && item.fromUserId === req.params.userId))));
            (0, store_1.logAudit)(db, viewer.user.id, 'friend_removed', 'user', req.params.userId);
        });
        return res.json({ success: true });
    });
    return router;
}
