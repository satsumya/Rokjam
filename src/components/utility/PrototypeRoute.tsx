import type { ReactNode } from 'react';

import { usePrototypeRouteGuard } from '../../hooks/usePrototypeRouteGuard';

/** Prototype-only route shell — redirects to welcome in production mode. */
export function PrototypeRoute({ children }: { children: ReactNode }) {
  const allowed = usePrototypeRouteGuard();
  if (!allowed) return null;
  return children;
}
