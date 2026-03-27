import { Router } from 'express';

export const authRouter = Router();

// This endpoint is deprecated - use Supabase Auth directly from frontend
// The backend only validates JWTs via middleware/auth.ts
// Clients should:
// 1. Call Supabase Auth from frontend with email/password
// 2. Get JWT token from Supabase
// 3. Send Authorization: Bearer <jwt> on all API requests

authRouter.post('/logout', (_req, res) => {
  // Frontend should clear localStorage on logout
  res.status(204).send();
});
