"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkoutRouter;
const express_1 = __importStar(require("express"));
const stripe_1 = __importDefault(require("stripe"));
const zod_1 = require("zod");
const env_1 = require("../lib/env");
const catalog_1 = require("../data/catalog");
function getStripeClient() {
    if (!env_1.env.STRIPE_SECRET_KEY)
        return null;
    return new stripe_1.default(env_1.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
}
function checkoutRouter() {
    const router = (0, express_1.Router)();
    router.get('/status', async (_req, res) => {
        res.json({
            stripeConfigured: Boolean(env_1.env.STRIPE_SECRET_KEY),
            productCount: catalog_1.fallbackProducts.length,
        });
    });
    router.post('/session', async (req, res) => {
        const stripe = getStripeClient();
        if (!stripe) {
            return res.status(503).json({
                error: 'Stripe is not configured yet',
                message: 'The storefront is live, but checkout is still waiting on Stripe keys.',
            });
        }
        const cartSchema = zod_1.z.object({
            items: zod_1.z.array(zod_1.z.object({
                id: zod_1.z.string(),
                quantity: zod_1.z.number().min(1),
            })),
        });
        const parseResult = cartSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: 'Invalid cart format' });
        }
        const { items } = parseResult.data;
        try {
            const lineItems = [];
            for (const item of items) {
                const product = (0, catalog_1.getFallbackProductById)(item.id);
                if (!product)
                    continue;
                lineItems.push({
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: product.title,
                        },
                        unit_amount: Math.round(product.price * 100),
                    },
                    quantity: item.quantity,
                });
            }
            if (lineItems.length === 0) {
                return res.status(400).json({ error: 'No valid items found in cart' });
            }
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: lineItems,
                success_url: `${env_1.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${env_1.env.FRONTEND_URL}/cart`,
            });
            return res.json({ sessionId: session.id, url: session.url });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to create checkout session' });
        }
    });
    router.post('/webhook', express_1.default.raw({ type: 'application/json' }), async (req, res) => {
        const stripe = getStripeClient();
        const webhookSecret = env_1.env.STRIPE_WEBHOOK_SECRET;
        if (!stripe || !webhookSecret) {
            return res.status(503).json({ error: 'Stripe webhook is not configured' });
        }
        const signature = req.headers['stripe-signature'];
        if (!signature) {
            return res.status(400).send('Missing Stripe signature');
        }
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
        }
        catch (err) {
            console.error(err);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('Checkout session completed', session.id);
        }
        return res.json({ received: true });
    });
    return router;
}
