import { router } from 'expo-router';

import { useCreateSession } from '../../src/features/sessions/useCreateSession';

export default function CreateSessionScreen() {
  useCreateSession({
    onStarted: (sessionId) => router.replace(`/sessions/${sessionId}/active`),
  });

  return null;
}
