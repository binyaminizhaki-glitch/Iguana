import { Router } from 'express';

export const authRouter = Router();

// Auth lifecycle is handled by Clerk on the frontend.
// The backend only validates Clerk bearer tokens via middleware/auth.ts.
// Clients should:
// 1. Sign in or sign up with Clerk
// 2. Retrieve the Clerk session token on the client
// 3. Send Authorization: Bearer <jwt> on all API requests

authRouter.post('/logout', (_req, res) => {
  // Frontend signs out via Clerk and clears any local dev fallback state.
  res.status(204).send();
});
