import { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { BottomNav, DashboardTrends, Screen, Text } from '../src/components';
import { usePrototype } from '../src/context/PrototypeContext';
import { ui } from '../src/theme/colors';
import type { TrendTimeframe } from '../src/types/climbingSession';

export default function InsightsScreen() {
  const { demo } = useLocalSearchParams<{ demo?: string }>();
  const { sessions, locations, seedFlowDemo, seedDemoProfileOnly } = usePrototype();
  const [timeframe, setTimeframe] = useState<TrendTimeframe>('month');
  const needsProfile = locations.length === 0;
  const demoApplied = useRef<string | null>(null);

  useEffect(() => {
    if (!demo || demoApplied.current === demo) return;
    if (demo === 'seed' || demo === 'many-sessions') {
      seedFlowDemo('dashboard-many-sessions');
      demoApplied.current = demo;
    } else if (demo === 'profile-ready') {
      seedDemoProfileOnly();
      demoApplied.current = demo;
    }
  }, [demo, seedFlowDemo, seedDemoProfileOnly]);

  const completedSessions = sessions
    .filter((s) => s.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Screen title="Insights" bottomNav={<BottomNav active="insights" />}>
      {needsProfile ? (
        <Text variant="body" color={ui.textMuted}>
          Complete your profile to unlock climbing trends.
        </Text>
      ) : (
        <DashboardTrends
          sessions={completedSessions}
          locations={locations}
          timeframe={timeframe}
          onTimeframeChange={setTimeframe}
        />
      )}
    </Screen>
  );
}
