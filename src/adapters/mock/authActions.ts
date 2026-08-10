import type { AuthResult } from '../../domain/ports';

export type MockAuthActions = {
  signInWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signUpWithPassword: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<AuthResult>;
};

type MockAuthDeps = {
  setEmail: (value: string) => void;
  onSignOut?: () => void;
};

/** Prototype auth — no network; defers credential checks to feature hooks. */
export function createMockAuthActions({ setEmail, onSignOut }: MockAuthDeps): MockAuthActions {
  return {
    signInWithPassword: async (email) => {
      setEmail(email.trim());
      return {};
    },
    signUpWithPassword: async (email) => {
      setEmail(email.trim());
      return {};
    },
    signOut: async () => {
      setEmail('');
      onSignOut?.();
    },
    resetPasswordForEmail: async () => ({}),
  };
}
