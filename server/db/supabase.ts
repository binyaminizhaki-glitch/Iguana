import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey);
export const isSupabaseRlsConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export function getSupabaseAdminClient() {
  if (!isSupabaseConfigured) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for Supabase mode.');
  }

  return createClient(supabaseUrl!, supabaseServiceRoleKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseUserClient(accessToken: string) {
  if (!isSupabaseRlsConfigured) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required for user-scoped Supabase mode.');
  }

  return createClient(supabaseUrl!, supabaseAnonKey!, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function checkSupabaseReadiness(): Promise<{ ok: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return { ok: false, error: 'Supabase admin configuration is missing.' };
  }

  try {
    const client = getSupabaseAdminClient();
    const { error } = await client.from('profiles').select('id').limit(1);
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'Unknown Supabase readiness error.' };
  }
}
