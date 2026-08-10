import { useEffect, useRef } from 'react';

import { useMockSeeding } from '../../data/hooks/useMockSeeding';
import { useProfile } from '../../data/hooks/useProfile';
import { useSessions } from '../../data/hooks/useSessions';
import {
  computeDurationMinutes,
  formatDuration,
  sessionDifficultyRange,
} from '../../utils/sessionUtils';

import type { SessionsListViewProps } from './SessionsListView';

export type UseSessionsListOptions = {
  demo?: string;
  onOpenSession: (sessionId: string) => void;
  onContinueActiveSession: (sessionId: string) => void;
};

export function useSessionsList({
  demo,
  onOpenSession,
  onContinueActiveSession,
}: UseSessionsListOptions): SessionsListViewProps {
  const { sessions } = useSessions();
  const { locations } = useProfile();
  const { seedDemoSessions } = useMockSeeding();
  const demoApplied = useRef(false);

  useEffect(() => {
    if (demo !== 'seed' || demoApplied.current) return;
    if (sessions.some((s) => s.status === 'completed')) return;
    seedDemoSessions();
    demoApplied.current = true;
  }, [demo, seedDemoSessions, sessions]);

  const completed = sessions
    .filter((s) => s.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date));

  return {
    completed: completed.map((session) => {
      const loc = locations.find((l) => l.id === session.locationId);
      return {
        session,
        duration: formatDuration(
          computeDurationMinutes(session.startTime, session.endTime, session.durationMinutes),
        ),
        difficultyRange: sessionDifficultyRange(session.climbs, loc?.levels ?? []),
      };
    }),
    activeSessions: sessions.filter((s) => s.status === 'active'),
    onOpenSession,
    onContinueActiveSession,
  };
}
