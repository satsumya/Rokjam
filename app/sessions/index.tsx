import { router, useLocalSearchParams } from 'expo-router';

import { SessionsListView } from '../../src/features/sessions/SessionsListView';
import { useSessionsList } from '../../src/features/sessions/useSessionsList';

export default function SessionsListScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();

  return (
    <SessionsListView
      {...useSessionsList({
        demo,
        onOpenSession: (sessionId) => router.push(`/sessions/${sessionId}`),
        onContinueActiveSession: (sessionId) => router.push(`/sessions/${sessionId}/active`),
      })}
    />
  );
}
