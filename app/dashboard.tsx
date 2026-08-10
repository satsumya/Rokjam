import { router, useLocalSearchParams } from 'expo-router';

import { DashboardView } from '../src/features/dashboard/DashboardView';
import { useDashboard } from '../src/features/dashboard/useDashboard';

export default function DashboardScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();

  return (
    <DashboardView
      {...useDashboard({
        demo,
        onSignOut: () => router.replace('/'),
        onSetupProfile: () => router.push('/profile/setup'),
        onContinueSession: (sessionId: string) => router.push(`/sessions/${sessionId}/active`),
        onOpenSessionsList: () => router.push('/sessions'),
        onOpenSession: (sessionId: string) => router.push(`/sessions/${sessionId}`),
      })}
    />
  );
}
