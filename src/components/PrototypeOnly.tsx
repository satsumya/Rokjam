import type { ReactNode } from 'react';

import { useFlowCapture } from '../hooks/useFlowCapture';

/** Testing / prototype tooling — hidden when capturing flow-map screenshots. */
export function PrototypeOnly({ children }: { children: ReactNode }) {
  const flowCapture = useFlowCapture();
  if (flowCapture) return null;
  return children;
}
