import { Router } from 'express';
import { getDatabaseMode } from '../db/mode.js';

export const metaRouter = Router();

metaRouter.get('/backend-mode', (_req, res) => {
  res.json({ mode: getDatabaseMode() });
});
