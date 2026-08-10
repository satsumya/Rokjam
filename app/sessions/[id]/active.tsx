import { router, useLocalSearchParams } from 'expo-router';

import { ActiveSessionView } from '../../../src/features/sessions/ActiveSessionView';
import { useActiveSession } from '../../../src/features/sessions/useActiveSession';

export default function ActiveSessionScreen() {
  const { id, demo } = useLocalSearchParams<{ id: string; demo?: string }>();

  return (
    <ActiveSessionView
      {...useActiveSession({
        sessionId: id,
        demo,
        onCompleted: () => router.replace(`/sessions/${id}`),
        onBackToDashboard: () => router.replace('/dashboard'),
      })}
    />
  );
}
