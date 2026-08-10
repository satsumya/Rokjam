import { useEffect, useRef, useState } from 'react';

import { usePrototype } from '../../context/PrototypeContext';
import type { TrendTimeframe } from '../../types/climbingSession';

import type { InsightsViewProps } from './InsightsView';

export type UseInsightsOptions = {
  demo?: string;
};

export function useInsights({ demo }: UseInsightsOptions): InsightsViewProps {
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

  return {
    needsProfile,
    sessions: completedSessions,
    locations,
    timeframe,
    onTimeframeChange: setTimeframe,
  };
}
