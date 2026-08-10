import { useEffect, useRef, useState } from 'react';

import { useMockSeeding } from '../../data/hooks/useMockSeeding';
import { useSessions } from '../../data/hooks/useSessions';
import { computeDurationMinutes, formatDuration } from '../../utils/sessionUtils';

import type { SessionDetailViewProps } from './SessionDetailView';

export type UseSessionDetailOptions = {
  sessionId: string;
  demo?: string;
  onContinueSession: () => void;
  onEditSession: () => void;
  onBackToSessions: () => void;
  onDeleted: () => void;
};

export function useSessionDetail({
  sessionId,
  demo,
  onContinueSession,
  onEditSession,
  onBackToSessions,
  onDeleted,
}: UseSessionDetailOptions): SessionDetailViewProps {
  const { sessions, deleteSession } = useSessions();
  const { seedDemoSessions } = useMockSeeding();
  const [shareVisible, setShareVisible] = useState(false);
  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const demoApplied = useRef(false);

  useEffect(() => {
    if (demo !== 'seed' || demoApplied.current) return;
    if (sessions.some((s) => s.id === sessionId)) return;
    seedDemoSessions();
    demoApplied.current = true;
  }, [demo, sessionId, seedDemoSessions, sessions]);

  const session = sessions.find((s) => s.id === sessionId) ?? null;
  const duration = session
    ? formatDuration(
        computeDurationMinutes(session.startTime, session.endTime, session.durationMinutes),
      )
    : '';

  return {
    session,
    duration,
    shareVisible,
    showDeleteSheet,
    onContinueSession,
    onEditSession,
    onShare: () => setShareVisible(true),
    onDeleteRequest: () => setShowDeleteSheet(true),
    onConfirmDelete: () => {
      if (session) {
        deleteSession(session.id);
      }
      onDeleted();
    },
    onCancelDelete: () => setShowDeleteSheet(false),
    onBackToSessions,
  };
}
