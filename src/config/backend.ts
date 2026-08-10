import { isProductionMode } from './appMode';
import { isSupabaseConfigured } from './supabaseEnv';

/** Production builds with Supabase env vars use the live auth adapter. */
export function usesSupabaseBackend(): boolean {
  return isProductionMode() && isSupabaseConfigured();
}
