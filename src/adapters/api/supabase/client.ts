import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from '../../../config/supabaseEnv';

let client: SupabaseClient | null = null;

/** Shared Supabase client — only available when env vars are configured. */
export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured()) {
    throw new Error(
      'Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
  if (!client) {
    client = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === 'web',
      },
    });
  }
  return client;
}

/** Safe accessor for auth listener setup — returns null when not configured. */
export function tryGetSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  return getSupabaseClient();
}
