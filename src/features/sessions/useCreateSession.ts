import { useEffect, useRef } from 'react';

import { usePrototype } from '../../context/PrototypeContext';

export type UseCreateSessionOptions = {
  onStarted: (sessionId: string) => void;
};

export function useCreateSession({ onStarted }: UseCreateSessionOptions): null {
  const { startSession } = usePrototype();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    onStarted(startSession());
  }, [onStarted, startSession]);

  return null;
}
