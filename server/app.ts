import express from 'express';
import { apiRouter } from './routes/index.js';
import { checkSupabaseReadiness, isSupabaseConfigured, isSupabaseRlsConfigured } from './db/supabase.js';

export function createApp() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-user-id');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    if (req.method === 'OPTIONS') {
      res.status(204).send();
      return;
    }
    next();
  });

  app.get('/health', async (_req, res) => {
    const now = new Date().toISOString();
    const readiness = isSupabaseConfigured ? await checkSupabaseReadiness() : { ok: false, error: 'Supabase not configured' };

    res.json({
      status: 'ok',
      service: 'iasa-backend',
      timestamp: now,
      database: {
        mode: isSupabaseConfigured ? 'supabase' : 'memory',
        rlsReady: isSupabaseRlsConfigured,
        reachable: readiness.ok,
        error: readiness.ok ? undefined : readiness.error,
      },
    });
  });

  app.get('/readiness', async (_req, res) => {
    const readiness = await checkSupabaseReadiness();
    if (!readiness.ok) {
      res.status(503).json({
        status: 'not_ready',
        reason: readiness.error,
      });
      return;
    }

    res.json({
      status: 'ready',
      database: 'supabase',
      timestamp: new Date().toISOString(),
    });
  });

  app.use('/api', apiRouter);

  app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
  });

  return app;
}
