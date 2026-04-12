import { Request, Response, NextFunction } from 'express';
import { authenticateRequest, createClerkClient } from '@clerk/express';
import { db } from '../store.js';
import { getSupabaseAdminClient, getSupabaseUserClient, isSupabaseConfigured, isSupabaseRlsConfigured } from '../db/supabase.js';
import { User } from '../types.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
  accessToken?: string;
}

const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const clerkJwtKey = process.env.CLERK_JWT_KEY;
const clerkAuthorizedParties = (process.env.CLERK_AUTHORIZED_PARTIES ?? process.env.APP_URL ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

const clerkClient = clerkSecretKey
  ? createClerkClient({
      secretKey: clerkSecretKey,
      publishableKey: clerkPublishableKey,
    })
  : null;

function getClerkPrimaryEmail(user: {
  primaryEmailAddressId?: string | null;
  emailAddresses?: Array<{ id: string; emailAddress: string }>;
}): string | null {
  const primary = user.emailAddresses?.find((email) => email.id === user.primaryEmailAddressId);
  return primary?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? null;
}

async function ensureSupabaseUserRecords(authUser: {
  id: string;
  email?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
}) {
  if (!isSupabaseConfigured) {
    return;
  }

  const admin = getSupabaseAdminClient();
  const fallbackName =
    typeof authUser.fullName === 'string' && authUser.fullName.trim().length > 0
      ? authUser.fullName.trim()
      : typeof authUser.email === 'string' && authUser.email.includes('@')
        ? authUser.email.split('@')[0]
        : 'New User';

  const { error: profileError } = await admin.from('profiles').upsert(
    {
      id: authUser.id,
      email: authUser.email ?? `${authUser.id}@unknown.local`,
      full_name: fallbackName,
      grade: 'unknown',
      avatar_url: authUser.avatarUrl ?? null,
    },
    {
      onConflict: 'id',
      ignoreDuplicates: false,
    },
  );

  if (profileError) {
    throw new Error(`Failed creating authenticated profile: ${profileError.message}`);
  }

  const { error: settingsError } = await admin.from('user_settings').upsert(
    {
      user_id: authUser.id,
      precise_location_enabled: true,
      default_visibility: 'all',
    },
    {
      onConflict: 'user_id',
      ignoreDuplicates: false,
    },
  );

  if (settingsError) {
    throw new Error(`Failed creating authenticated user settings: ${settingsError.message}`);
  }

  const { error: notificationPrefsError } = await admin.from('notification_preferences').upsert(
    {
      user_id: authUser.id,
    },
    {
      onConflict: 'user_id',
      ignoreDuplicates: false,
    },
  );

  if (notificationPrefsError) {
    throw new Error(`Failed creating notification preferences: ${notificationPrefsError.message}`);
  }
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.header('Authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const isProduction = process.env.NODE_ENV === 'production';
  const allowDevFallbackEnv = process.env.ALLOW_DEV_AUTH_FALLBACK?.toLowerCase();
  const allowDevFallback = !isProduction && allowDevFallbackEnv !== 'false';

  if (bearerToken && clerkClient) {
    try {
      const requestState = await authenticateRequest({
        clerkClient,
        request: req,
        options: {
          acceptsToken: 'session_token',
          jwtKey: clerkJwtKey,
          authorizedParties: clerkAuthorizedParties.length > 0 ? clerkAuthorizedParties : undefined,
        },
      });

      if (!requestState.isAuthenticated) {
        if (!allowDevFallback) {
          res.status(401).json({ error: requestState.message ?? 'Invalid Clerk bearer token.' });
          return;
        }
      } else {
        const auth = requestState.toAuth();
        const userId = auth.userId;
        if (!userId) {
          if (!allowDevFallback) {
            res.status(401).json({ error: 'Authenticated Clerk session is missing a user id.' });
            return;
          }
        } else {
          const clerkUser = await clerkClient.users.getUser(userId);
          const fullName =
            clerkUser.fullName ??
            [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ').trim() ??
            clerkUser.username ??
            null;

          await ensureSupabaseUserRecords({
            id: userId,
            email: getClerkPrimaryEmail(clerkUser),
            fullName,
            avatarUrl: clerkUser.imageUrl ?? null,
          });

          const supabase = getSupabaseUserClient(bearerToken);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, full_name, grade, avatar_url, created_at, updated_at')
            .eq('id', userId)
            .maybeSingle();

          if (profileError || !profile) {
            if (!allowDevFallback) {
              res.status(401).json({ error: 'Authenticated user profile was not found.' });
              return;
            }
          } else {
            const { data: settings, error: settingsError } = await supabase
              .from('user_settings')
              .select('user_id, precise_location_enabled, default_visibility')
              .eq('user_id', userId)
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
      }
    } catch (error) {
      if (!allowDevFallback) {
        res.status(401).json({
          error: error instanceof Error ? error.message : 'Clerk bearer token authentication failed.',
        });
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
