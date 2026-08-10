import { useEffect, useRef, useState } from 'react';

import { TAKEN_USERNAMES } from '../../constants/mockData';
import { useMockSeeding } from '../../data/hooks/useMockSeeding';
import { useProfile } from '../../data/hooks/useProfile';
import { useSessions } from '../../data/hooks/useSessions';
import {
  computeDurationMinutes,
  formatDuration,
  sessionDifficultyRange,
} from '../../utils/sessionUtils';
import { getUsernameError, isUsernameAvailable } from '../../utils/validation';

import type { DashboardViewProps } from './DashboardView';

export type UseDashboardOptions = {
  demo?: string;
  onSignOut: () => void;
  onSetupProfile: () => void;
  onContinueSession: (sessionId: string) => void;
  onOpenSessionsList: () => void;
  onOpenSession: (sessionId: string) => void;
};

export function useDashboard({
  demo,
  onSignOut,
  onSetupProfile,
  onContinueSession,
  onOpenSessionsList,
  onOpenSession,
}: UseDashboardOptions): DashboardViewProps {
  const {
    username,
    setUsername,
    avatar,
    locations,
    strengthTags,
    improvementTags,
  } = useProfile();
  const { sessions } = useSessions();
  const { seedDemoSessions, seedDemoProfileOnly, seedFlowDemo, resetSession } = useMockSeeding();

  const homeLocation = locations.find((loc) => loc.isHome) ?? locations[0];
  const needsProfile = locations.length === 0;
  const [showAllSessions, setShowAllSessions] = useState(false);
  const [addingUsername, setAddingUsername] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const demoApplied = useRef<string | null>(null);

  useEffect(() => {
    if (!demo || demoApplied.current === demo) return;

    if (demo === 'session-ready') {
      seedDemoSessions();
      demoApplied.current = demo;
    } else if (demo === 'new-user' || demo === 'profile-incomplete') {
      seedFlowDemo('profile-incomplete');
      demoApplied.current = demo;
    } else if (demo === 'profile-ready') {
      seedDemoProfileOnly();
      demoApplied.current = demo;
    } else if (demo === 'one-session') {
      seedFlowDemo('dashboard-one-session');
      demoApplied.current = demo;
    } else if (demo === 'many-sessions') {
      seedFlowDemo('dashboard-many-sessions');
      demoApplied.current = demo;
    } else if (demo === 'mid-session') {
      seedFlowDemo('dashboard-mid-session');
      demoApplied.current = demo;
    } else if (demo === 'seed') {
      seedFlowDemo('dashboard-many-sessions');
      demoApplied.current = demo;
    }
  }, [demo, seedDemoSessions, seedDemoProfileOnly, seedFlowDemo]);

  const usernameError = usernameTouched ? getUsernameError(usernameDraft, TAKEN_USERNAMES) : undefined;
  const usernameSuccess =
    usernameTouched && isUsernameAvailable(usernameDraft, TAKEN_USERNAMES)
      ? 'Username available'
      : undefined;
  const canConfirmUsername =
    Boolean(usernameDraft.trim()) && !getUsernameError(usernameDraft, TAKEN_USERNAMES);

  const confirmUsername = () => {
    setUsernameTouched(true);
    if (!usernameDraft.trim() || getUsernameError(usernameDraft, TAKEN_USERNAMES)) return;
    setUsername(usernameDraft.trim());
    setAddingUsername(false);
    setUsernameDraft('');
    setUsernameTouched(false);
  };

  const cancelUsername = () => {
    setAddingUsername(false);
    setUsernameDraft('');
    setUsernameTouched(false);
  };

  const completedSessions = sessions
    .filter((s) => s.status === 'completed')
    .sort((a, b) => b.date.localeCompare(a.date));
  const visibleSessions = showAllSessions ? completedSessions : completedSessions.slice(0, 3);
  const activeSessions = sessions.filter((s) => s.status === 'active');

  return {
    needsProfile,
    avatar,
    username,
    homeLocationNickname: homeLocation?.nickname,
    homeLocationName: homeLocation?.name,
    strengthTags,
    improvementTags,
    addingUsername,
    usernameDraft,
    usernameError,
    usernameSuccess,
    canConfirmUsername,
    activeSessions,
    showAllSessions,
    recentSessions: visibleSessions.map((session) => {
      const loc = locations.find((l) => l.id === session.locationId);
      return {
        session,
        duration: formatDuration(
          computeDurationMinutes(session.startTime, session.endTime, session.durationMinutes),
        ),
        difficultyRange: sessionDifficultyRange(session.climbs, loc?.levels ?? []),
      };
    }),
    onSignOut: () => {
      resetSession();
      onSignOut();
    },
    onSetupProfile,
    onUsernameChange: (value) => {
      setUsernameDraft(value);
      setUsernameTouched(true);
    },
    onUsernameConfirm: confirmUsername,
    onUsernameCancel: cancelUsername,
    onStartAddUsername: () => {
      setAddingUsername(true);
      setUsernameDraft('');
      setUsernameTouched(false);
    },
    onContinueSession,
    onShowRecentSessions: () => setShowAllSessions(false),
    onShowAllSessions: () => setShowAllSessions(true),
    onOpenSessionsList,
    onOpenSession,
  };
}
