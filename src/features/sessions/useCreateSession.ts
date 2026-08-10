import { useEffect, useRef } from 'react';

import { useMockSeeding } from '../../data/hooks/useMockSeeding';
import { useSessions } from '../../data/hooks/useSessions';

export type UseCreateSessionOptions = {
  onStarted: (sessionId: string) => void;
};

export function useCreateSession({ onStarted }: UseCreateSessionOptions): null {
  const { startSession } = useSessions();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    onStarted(startSession());
  }, [onStarted, startSession]);

  return null;
}
