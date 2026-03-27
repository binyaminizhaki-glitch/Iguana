import { Request, Response, NextFunction } from 'express';
import { db } from '../store.js';
import { getSupabaseUserClient, isSupabaseRlsConfigured } from '../db/supabase.js';
import { User } from '../types.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
  accessToken?: string;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.header('Authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const isProduction = process.env.NODE_ENV === 'production';
  const allowDevFallbackEnv = process.env.ALLOW_DEV_AUTH_FALLBACK?.toLowerCase();
  const allowDevFallback = !isProduction && allowDevFallbackEnv !== 'false';

  if (bearerToken && isSupabaseRlsConfigured) {
    try {
      const supabase = getSupabaseUserClient(bearerToken);
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser(bearerToken);

      if (authError || !authUser) {
        if (!allowDevFallback) {
          res.status(401).json({ error: 'Invalid bearer token.' });
          return;
        }
      } else {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, full_name, grade, track, avatar_url, created_at, updated_at')
          .eq('id', authUser.id)
          .maybeSingle();

        if (profileError || !profile) {
          if (!allowDevFallback) {
            res.status(401).json({ error: 'Authenticated user profile was not found.' });
            return;
          }
        } else {
          const { data: settings, error: settingsError } = await supabase
            .from('user_settings')
            .select('precise_location_enabled, default_visibility')
            .eq('user_id', authUser.id)
            .maybeSingle();

          if (settingsError) {
            res.status(500).json({ error: 'Failed to load authenticated user settings.' });
            return;
          }

          req.user = {
            id: profile.id,
            email: profile.email,
            full_name: profile.full_name,
            grade: profile.grade,
            avatar_url: profile.avatar_url ?? undefined,
            precise_location_enabled: settings?.precise_location_enabled ?? false,
            default_visibility: settings?.default_visibility ?? 'friends',
            created_at: profile.created_at,
            updated_at: profile.updated_at,
          };
          req.accessToken = bearerToken;
          next();
          return;
        }
      }
    } catch (_error) {
      if (!allowDevFallback) {
        res.status(401).json({ error: 'Bearer token authentication failed.' });
        return;
      }
    }
  }

  if (isProduction) {
    res.status(401).json({ error: 'Authorization: Bearer <token> is required in production.' });
    return;
  }

  if (!allowDevFallback) {
    res.status(401).json({
      error: 'Development fallback auth is disabled. Set ALLOW_DEV_AUTH_FALLBACK=true or provide a valid bearer token.',
    });
    return;
  }

  const userId = req.header('x-user-id') || null;
  if (!userId) {
    res.status(401).json({ error: 'Missing x-user-id header for dev fallback auth.' });
    return;
  }

  const user = db.getUserById(userId);
  if (!user) {
    res.status(401).json({ error: 'Unknown dev user id.' });
    return;
  }

  req.user = user;
  next();
}
