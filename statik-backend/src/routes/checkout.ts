import express, { Router } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import { env } from '../lib/env';
import { getFallbackProductById, fallbackProducts } from '../data/catalog';

function getStripeClient() {
  if (!env.STRIPE_SECRET_KEY) return null;
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' as any });
}

export default function checkoutRouter() {
  const router = Router();

  router.get('/status', async (_req, res) => {
    res.json({
      stripeConfigured: Boolean(env.STRIPE_SECRET_KEY),
      productCount: fallbackProducts.length,
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

    const cartSchema = z.object({
      items: z.array(
        z.object({
          id: z.string(),
          quantity: z.number().min(1),
        }),
      ),
    });

    const parseResult = cartSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid cart format' });
    }

    const { items } = parseResult.data;

    try {
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
      for (const item of items) {
        const product = getFallbackProductById(item.id);
        if (!product) continue;
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
        success_url: `${env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.FRONTEND_URL}/cart`,
      });

      return res.json({ sessionId: session.id, url: session.url });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const stripe = getStripeClient();
    const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

    if (!stripe || !webhookSecret) {
      return res.status(503).json({ error: 'Stripe webhook is not configured' });
    }

    const signature = req.headers['stripe-signature'] as string | undefined;
    if (!signature) {
      return res.status(400).send('Missing Stripe signature');
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (err) {
      console.error(err);
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed', session.id);
    }

    return res.json({ received: true });
  });

  return router;
}
