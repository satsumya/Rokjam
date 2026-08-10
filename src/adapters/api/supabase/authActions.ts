import type { AuthResult } from '../../../domain/ports';
import { getSupabaseClient } from './client';

export type SupabaseAuthActions = {
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<AuthResult>;
};

export function createSupabaseAuthActions(): SupabaseAuthActions {
  return {
    signInWithPassword: async (email, password) => {
      const { error } = await getSupabaseClient().auth.signInWithPassword({ email, password });
      return error ? { error: error.message } : {};
    },
    signUpWithPassword: async (email, password) => {
      const { error } = await getSupabaseClient().auth.signUp({ email, password });
      return error ? { error: error.message } : {};
    },
    signOut: async () => {
      await getSupabaseClient().auth.signOut();
    },
    resetPasswordForEmail: async (email) => {
      const { error } = await getSupabaseClient().auth.resetPasswordForEmail(email, {
        redirectTo: undefined,
      });
      return error ? { error: error.message } : {};
    },
  };
}
