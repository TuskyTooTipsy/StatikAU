"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updatesRouter;
const express_1 = require("express");
function updatesRouter() {
    const router = (0, express_1.Router)();
    router.get('/', async (_req, res) => {
        res.json([]);
    });
    return router;
}
