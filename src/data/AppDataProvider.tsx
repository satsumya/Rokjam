import type { ReactNode } from 'react';

import { MockAppDataProvider } from '../adapters/mock/MockAppDataProvider';
import { usesSupabaseBackend } from '../config/backend';

export function AppDataProvider({ children }: { children: ReactNode }) {
  const authBackend = usesSupabaseBackend() ? 'supabase' : 'mock';
  return <MockAppDataProvider authBackend={authBackend}>{children}</MockAppDataProvider>;
}

export { useAppData } from '../adapters/mock/MockAppDataProvider';
