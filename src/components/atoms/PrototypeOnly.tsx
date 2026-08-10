import type { ReactNode } from 'react';

import { isPrototypeMode } from '../../config/appMode';
import { useFlowCapture } from '../../hooks/useFlowCapture';

/** Testing / prototype tooling — hidden in production mode and during flow-map capture. */
export function PrototypeOnly({ children }: { children: ReactNode }) {
  const flowCapture = useFlowCapture();
  if (flowCapture || !isPrototypeMode()) return null;
  return children;
}
