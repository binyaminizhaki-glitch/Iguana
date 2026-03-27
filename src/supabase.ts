// Supabase client initialization
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase config: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function loginWithSupabase(email: string): Promise<{ session: any; error: any }> {
  try {
    // Magic link login (email OTP)
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
    return { session: data, error };
  } catch (e) {
    return { session: null, error: e };
  }
}

export async function verifyOtp(email: string, token: string): Promise<{ session: any; error: any }> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (!error && data.session) {
      // Token is in data.session.access_token
      return { session: data.session, error: null };
    }
    return { session: null, error };
  } catch (e) {
    return { session: null, error: e };
  }
}

export async function getCurrentUser(): Promise<{ user: any; error: any }> {
  try {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  } catch (e) {
    return { user: null, error: e };
  }
}

export async function logout(): Promise<{ error: any }> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (e) {
    return { error: e };
  }
}
