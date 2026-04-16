"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = submissionsRouter;
const express_1 = require("express");
function submissionsRouter() {
    const router = (0, express_1.Router)();
    router.get('/', async (_req, res) => {
        res.json([]);
    });
    return router;
}
