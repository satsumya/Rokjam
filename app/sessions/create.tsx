import { useEffect, useRef } from 'react';
import { router } from 'expo-router';

import { usePrototype } from '../../src/context/PrototypeContext';

export default function CreateSessionScreen() {
  const { startSession, locations } = usePrototype();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const id = startSession();
    if (locations.length === 0) {
      router.replace(`/sessions/${id}/active?demo=no-location`);
    } else {
      router.replace(`/sessions/${id}/active`);
    }
  }, [locations.length, startSession]);

  return null;
}
