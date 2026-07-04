import { useEffect, useRef } from 'react';
import { router } from 'expo-router';

import { usePrototype } from '../../src/context/PrototypeContext';

export default function CreateSessionScreen() {
  const { startSession } = usePrototype();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const id = startSession();
    router.replace(`/sessions/${id}/active`);
  }, [startSession]);

  return null;
}
