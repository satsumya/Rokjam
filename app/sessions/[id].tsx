import { router, useLocalSearchParams } from 'expo-router';

import { SessionDetailView } from '../../src/features/sessions/SessionDetailView';
import { useSessionDetail } from '../../src/features/sessions/useSessionDetail';

export default function SessionDetailScreen() {
  const { id, demo } = useLocalSearchParams<{ id: string; demo?: string }>();

  return (
    <SessionDetailView
      {...useSessionDetail({
        sessionId: id,
        demo,
        onContinueSession: () => router.push(`/sessions/${id}/active`),
        onEditSession: () => router.push(`/sessions/${id}/edit`),
        onBackToSessions: () => router.replace('/sessions'),
        onDeleted: () => router.replace('/sessions'),
      })}
    />
  );
}
