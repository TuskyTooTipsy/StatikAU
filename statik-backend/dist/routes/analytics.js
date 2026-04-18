"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = analyticsRouter;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_1 = require("../lib/auth");
const store_1 = require("../lib/store");
const store_2 = require("../lib/store");
function analyticsRouter() {
    const router = (0, express_1.Router)();
    router.post('/track', async (req, res) => {
        const schema = zod_1.z.object({
            eventType: zod_1.z.enum(['vehicle_view', 'profile_post_view', 'community_post_view', 'event_click', 'garage_view']),
            targetType: zod_1.z.enum(['vehicle', 'profile_post', 'community_post', 'event', 'profile']),
            targetId: zod_1.z.string().min(1),
            source: zod_1.z.string().max(50).optional().default('direct'),
        });
        const parsed = schema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: 'Invalid analytics payload' });
        const viewer = (0, store_1.getUserByToken)((0, auth_1.getTokenFromRequest)(req));
        const sessionKey = (0, store_1.hashVisitorKey)(`${viewer?.user.id || 'guest'}:${req.ip}:${req.headers['user-agent'] || 'unknown'}`);
        (0, store_2.mutateDb)((db) => {
            (0, store_1.trackAnalyticsEvent)(db, {
                actorUserId: viewer?.user.id || null,
                sessionKey,
                source: parsed.data.source,
                eventType: parsed.data.eventType,
                targetType: parsed.data.targetType,
                targetId: parsed.data.targetId,
            });
        });
        return res.json({ success: true });
    });
    return router;
}
