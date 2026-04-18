"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = reportsRouter;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../lib/auth");
const store_1 = require("../lib/store");
function reportsRouter() {
    const router = (0, express_1.Router)();
    router.post('/', auth_1.requireAuth, async (req, res) => {
        const schema = zod_1.z.object({
            targetType: zod_1.z.enum(['profile', 'community', 'profile_post', 'community_post', 'media']),
            targetId: zod_1.z.string().min(1),
            reason: zod_1.z.string().min(4).max(240),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid report payload' });
        const viewer = req.viewer;
        const db = (0, store_1.readDb)();
        const exists = (parsed.data.targetType === 'profile' && db.profiles.some((item) => item.id === parsed.data.targetId)) ||
            (parsed.data.targetType === 'community' && db.communities.some((item) => item.id === parsed.data.targetId)) ||
            (parsed.data.targetType === 'profile_post' && db.profilePosts.some((item) => item.id === parsed.data.targetId)) ||
            (parsed.data.targetType === 'community_post' && db.communityPosts.some((item) => item.id === parsed.data.targetId)) ||
            (parsed.data.targetType === 'media' && db.mediaAssets.some((item) => item.id === parsed.data.targetId));
        if (!exists)
            return res.status(404).json({ error: 'Target not found' });
        (0, store_1.mutateDb)((runtime) => {
            runtime.reports.unshift({
                id: (0, store_1.createId)('report'),
                reporterUserId: viewer.user.id,
                targetType: parsed.data.targetType,
                targetId: parsed.data.targetId,
                reason: parsed.data.reason,
                status: 'open',
                createdAt: (0, store_1.nowIso)(),
            });
            (0, store_1.logAudit)(runtime, viewer.user.id, 'report_created', parsed.data.targetType, parsed.data.targetId, parsed.data.reason);
        });
        return res.status(201).json({ success: true });
    });
    return router;
}
