import { isSupabaseConfigured } from './supabase.js';

export type DatabaseMode = 'memory' | 'supabase';

export function getDatabaseMode(): DatabaseMode {
  return isSupabaseConfigured ? 'supabase' : 'memory';
}
