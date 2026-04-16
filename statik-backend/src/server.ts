import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import productsRouter from './routes/products';
import collectionsRouter from './routes/collections';
import checkoutRouter from './routes/checkout';
import contactRouter from './routes/contact';
import newsletterRouter from './routes/newsletter';
import eventsRouter from './routes/events';
import updatesRouter from './routes/updates';
import profilesRouter from './routes/profiles';
import searchRouter from './routes/search';
import submissionsRouter from './routes/submissions';
import adminRouter from './routes/admin';
import { env, getAllowedOrigins } from './lib/env';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: getAllowedOrigins(),
      credentials: true,
    }),
  );

  app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }));
  app.use((req, res, next) => {
    if (req.path === '/api/checkout/webhook') {
      next();
      return;
    }
    express.json()(req, res, next);
  });

  app.get('/', (_req: Request, res: Response) => {
    res.json({
      name: 'STATIK API',
      status: 'ok',
      frontendUrl: env.FRONTEND_URL,
      mode: 'launch-safe-fallback',
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
      mode: 'launch-safe-fallback',
    });
  });

  app.use('/api/products', productsRouter());
  app.use('/api/collections', collectionsRouter());
  app.use('/api/checkout', checkoutRouter());
  app.use('/api/contact', contactRouter());
  app.use('/api/newsletter', newsletterRouter());
  app.use('/api/events', eventsRouter());
  app.use('/api/updates', updatesRouter());
  app.use('/api/profiles', profilesRouter());
  app.use('/api/search', searchRouter());
  app.use('/api/submissions', submissionsRouter());
  app.use('/api/admin', adminRouter());

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
  const app = createApp();
  const port = parseInt(env.PORT, 10);

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
  });
}
