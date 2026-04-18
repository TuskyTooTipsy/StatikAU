import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import productsRouter from './routes/products';
import collectionsRouter from './routes/collections';
import checkoutRouter from './routes/checkout';
import contactRouter from './routes/contact';
import newsletterRouter from './routes/newsletter';
import authRouter from './routes/auth';
import platformRouter from './routes/platform';
import eventsRouter from './routes/events';
import updatesRouter from './routes/updates';
import profilesRouter from './routes/profiles';
import friendsRouter from './routes/friends';
import communitiesRouter from './routes/communities';
import searchRouter from './routes/search';
import submissionsRouter from './routes/submissions';
import adminRouter from './routes/admin';
import mediaRouter from './routes/media';
import linksRouter, { redirectRouter } from './routes/links';
import analyticsRouter from './routes/analytics';
import reportsRouter from './routes/reports';
import { env, getAllowedOrigins } from './lib/env';
import { ensureBootstrapAdmin } from './lib/bootstrap';
import { UPLOADS_DIR } from './lib/store';

export function createApp() {
  const app = express();
  app.set('trust proxy', true);

  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(compression());
  app.use(
    cors({
      origin: getAllowedOrigins(),
      credentials: true,
    }),
  );

  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use(redirectRouter());

  app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }));
  app.use((req, res, next) => {
    if (req.path === '/api/checkout/webhook') {
      next();
      return;
    }
    express.json({ limit: '2mb' })(req, res, next);
  });

  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'STATIK API',
      status: 'ok',
      frontendUrl: env.FRONTEND_URL,
      mode: 'network-expanded',
      healthcheck: '/api/health',
    });
  });

  app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      uptime: process.uptime(),
      mode: 'network-expanded',
    });
  });

  app.use('/api/products', productsRouter());
  app.use('/api/collections', collectionsRouter());
  app.use('/api/checkout', checkoutRouter());
  app.use('/api/contact', contactRouter());
  app.use('/api/newsletter', newsletterRouter());
  app.use('/api/auth', authRouter());
  app.use('/api/platform', platformRouter());
  app.use('/api/events', eventsRouter());
  app.use('/api/updates', updatesRouter());
  app.use('/api/profiles', profilesRouter());
  app.use('/api/friends', friendsRouter());
  app.use('/api/communities', communitiesRouter());
  app.use('/api/search', searchRouter());
  app.use('/api/submissions', submissionsRouter());
  app.use('/api/admin', adminRouter());
  app.use('/api/media', mediaRouter());
  app.use('/api/links', linksRouter());
  app.use('/api/analytics', analyticsRouter());
  app.use('/api/reports', reportsRouter());

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found' });
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  });

  return app;
}

export async function startServer() {
  ensureBootstrapAdmin();
  const app = createApp();
  const port = parseInt(env.PORT, 10);

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}
