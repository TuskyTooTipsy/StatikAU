"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = newsletterRouter;
const express_1 = require("express");
const zod_1 = require("zod");
function newsletterRouter() {
    const router = (0, express_1.Router)();
    router.post('/', async (req, res) => {
        const schema = zod_1.z.object({
            email: zod_1.z.string().email(),
        });
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ error: 'Invalid input' });
        }
        return res.json({ success: true, mode: 'fallback' });
    });
    return router;
}
