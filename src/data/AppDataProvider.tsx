import type { ReactNode } from 'react';

import { MockAppDataProvider } from '../adapters/mock/MockAppDataProvider';

export function AppDataProvider({ children }: { children: ReactNode }) {
  // Phase 4: select ApiAppDataProvider when isProductionMode() and API adapters exist.
  return <MockAppDataProvider>{children}</MockAppDataProvider>;
}

export { useAppData } from '../adapters/mock/MockAppDataProvider';
