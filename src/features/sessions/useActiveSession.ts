import { useEffect, useMemo, useRef, useState } from 'react';

import { TAKEN_USERNAMES } from '../../constants/mockData';
import { FLOW_DEMO_SESSION_ID, type FlowDemoPreset } from '../../constants/flowDemoSessions';
import { useMockSeeding } from '../../data/hooks/useMockSeeding';
import { useProfile } from '../../data/hooks/useProfile';
import { useSessions } from '../../data/hooks/useSessions';
import type { SessionClimb } from '../../types/climbingSession';
import {
  climbHasDetails,
  computeDurationMinutes,
  DURATION_PRESETS,
  formatSessionDate,
  nowTimeLabel,
  parseSessionDateDisplay,
} from '../../utils/sessionUtils';
import { getUsernameError, isUsernameAvailable } from '../../utils/validation';

import type { ActiveSessionViewProps } from './ActiveSessionView';

const emptyClimb = (): SessionClimb => ({
  id: 'draft',
  tags: [],
  hasImage: false,
  hasVideo: false,
  isWarmUp: false,
  isRepeat: false,
  isProject: false,
  attempts: [{ id: 'draft-a', progress: [] }],
});

const FLOW_ACTIVE_DEMOS: Record<string, FlowDemoPreset> = {
  'flow-empty': 'active-empty',
  'flow-empty-incomplete': 'active-empty-incomplete',
  'flow-adding': 'active-adding',
  'flow-multi': 'active-multi',
  'flow-end-sheet': 'active-end-sheet',
  'flow-end-sheet-filled': 'active-end-sheet-filled',
};

export type UseActiveSessionOptions = {
  sessionId: string;
  demo?: string;
  onCompleted: () => void;
  onBackToDashboard: () => void;
};

export function useActiveSession({
  sessionId,
  demo,
  onCompleted,
  onBackToDashboard,
}: UseActiveSessionOptions): ActiveSessionViewProps {
  const { sessions, updateSession, completeSession, addClimb, updateClimb, removeClimb } =
    useSessions();
  const { locations, username, setUsername } = useProfile();
  const { seedDemoActiveSession, seedFlowDemo } = useMockSeeding();
  const demoApplied = useRef(false);
  const flowUiApplied = useRef<string | null>(null);

  const [editingClimbId, setEditingClimbId] = useState<string | null>(null);
  const [draftClimb, setDraftClimb] = useState<SessionClimb | null>(null);
  const [showEndSheet, setShowEndSheet] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [endTime, setEndTime] = useState(() => nowTimeLabel());
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>();
  const [customDuration, setCustomDuration] = useState('');
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [climbPrompt, setClimbPrompt] = useState('');
  const [removeTarget, setRemoveTarget] = useState<SessionClimb | null>(null);

  useEffect(() => {
    if (!demo) return;

    const flowPreset = FLOW_ACTIVE_DEMOS[demo];
    if (flowPreset) {
      if (!sessions.some((s) => s.id === FLOW_DEMO_SESSION_ID)) {
        seedFlowDemo(flowPreset);
        return;
      }
      if (flowUiApplied.current === demo) return;

      if (demo === 'flow-adding') {
        setEditingClimbId('new');
        setDraftClimb(emptyClimb());
      }
      if (demo === 'flow-end-sheet') {
        const now = nowTimeLabel();
        setEndTime(now);
        setDurationMinutes(computeDurationMinutes('5:30 PM', now));
        setCustomDuration('');
        setShowEndSheet(true);
      }
      if (demo === 'flow-end-sheet-filled') {
        setEndTime('7:30 PM');
        setCustomDuration('');
        setDurationMinutes(90);
        setShowEndSheet(true);
      }
      flowUiApplied.current = demo;
      return;
    }

    if (demo !== 'active' || demoApplied.current) return;
    if (sessions.some((s) => s.id === sessionId)) return;
    seedDemoActiveSession();
    demoApplied.current = true;
  }, [demo, sessionId, seedDemoActiveSession, seedFlowDemo, sessions]);

  const session = sessions.find((s) => s.id === sessionId);
  const location = locations.find((l) => l.id === session?.locationId) ?? locations[0];
  const needsProfile = locations.length === 0;

  const usernameError = useMemo(() => {
    if (!isPublic || username.trim()) return undefined;
    if (!usernameTouched && !usernameInput.trim()) return undefined;
    if (!usernameInput.trim()) return 'Username is required for public sessions';
    return getUsernameError(usernameInput, TAKEN_USERNAMES);
  }, [isPublic, username, usernameInput, usernameTouched]);

  const usernameSuccess =
    isPublic &&
    !username.trim() &&
    usernameTouched &&
    isUsernameAvailable(usernameInput, TAKEN_USERNAMES)
      ? 'Username available'
      : undefined;

  const durationOptions = useMemo(
    () => DURATION_PRESETS.map((preset) => ({ value: String(preset.minutes), label: preset.label })),
    [],
  );

  const openEndSheet = () => {
    const now = nowTimeLabel();
    setEndTime(now);
    setDurationMinutes(computeDurationMinutes(session?.startTime ?? now, now));
    setCustomDuration('');
    setShowEndSheet(true);
  };

  const startEdit = (climb: SessionClimb) => {
    setEditingClimbId(climb.id);
    setDraftClimb({ ...climb });
  };

  const startAdd = () => {
    setClimbPrompt('');
    setEditingClimbId('new');
    setDraftClimb(emptyClimb());
  };

  const saveClimb = () => {
    if (!draftClimb || !session) return;
    if (editingClimbId === 'new') {
      const { id: _id, ...rest } = draftClimb;
      addClimb(session.id, rest);
    } else if (editingClimbId) {
      updateClimb(session.id, editingClimbId, draftClimb);
    }
    setEditingClimbId(null);
    setDraftClimb(null);
  };

  const endSession = () => {
    if (!session) return;
    if (isPublic && !username.trim()) {
      setUsernameTouched(true);
      if (!usernameInput.trim() || usernameError) return;
      setUsername(usernameInput.trim());
    }
    const resolvedEnd = endTime;
    const duration = durationMinutes ?? computeDurationMinutes(session.startTime, resolvedEnd);
    completeSession(session.id, {
      endTime: resolvedEnd,
      durationMinutes: duration,
      isPublic,
      ownerUsername: username.trim() || usernameInput.trim() || 'member',
    });
    onCompleted();
  };

  const handleRemoveClimb = (climb: SessionClimb) => {
    if (climbHasDetails(climb)) {
      setRemoveTarget(climb);
      return;
    }
    if (session) {
      removeClimb(session.id, climb.id);
    }
  };

  const confirmRemoveClimb = () => {
    if (removeTarget && session) {
      removeClimb(session.id, removeTarget.id);
    }
    setRemoveTarget(null);
  };

  const isEditingClimb = Boolean(draftClimb && editingClimbId);

  return {
    session: session ?? null,
    location,
    needsProfile,
    editingClimbId,
    draftClimb,
    showEndSheet,
    isPublic,
    endTime,
    durationMinutes,
    customDuration,
    durationOptions,
    usernameInput,
    username,
    usernameError,
    usernameSuccess,
    climbPrompt,
    removeTarget,
    dateDisplay: session ? formatSessionDate(session.date) : '',
    onPrimaryNav: isEditingClimb ? saveClimb : startAdd,
    onEndSessionRequest: openEndSheet,
    onDateChange: (display) => {
      if (!session) return;
      const iso = parseSessionDateDisplay(display);
      if (iso) updateSession(session.id, { date: iso });
    },
    onLocationLinked: (locationId, locationName) =>
      session && updateSession(session.id, { locationId, locationName }),
    onStartTimeChange: (startTime) => session && updateSession(session.id, { startTime }),
    onDraftChange: (patch) => setDraftClimb((c) => (c ? { ...c, ...patch } : c)),
    onCancelClimbEdit: () => {
      setEditingClimbId(null);
      setDraftClimb(null);
    },
    onEditClimb: startEdit,
    onRemoveClimb: handleRemoveClimb,
    onDifficultyChange: (climb, level) =>
      session &&
      updateClimb(session.id, climb.id, {
        levelId: level.id,
        levelName: level.name,
        levelColor: level.color,
      }),
    onSetPrivate: () => setIsPublic(false),
    onSetPublic: () => setIsPublic(true),
    onUsernameInputChange: (value) => {
      setUsernameInput(value);
      setUsernameTouched(true);
    },
    onEndTimeChange: (value) => {
      setEndTime(value);
      if (session) {
        setDurationMinutes(computeDurationMinutes(session.startTime, value));
      }
    },
    onDurationPresetChange: (value) => {
      setDurationMinutes(Number(value));
      setCustomDuration('');
    },
    onCustomDurationChange: (value) => {
      setCustomDuration(value);
      const minutes = Number(value);
      if (!Number.isNaN(minutes) && minutes > 0) {
        setDurationMinutes(minutes);
      }
    },
    onConfirmEndSession: endSession,
    onCancelEndSheet: () => setShowEndSheet(false),
    onConfirmRemoveClimb: confirmRemoveClimb,
    onCancelRemoveClimb: () => setRemoveTarget(null),
    onBackToDashboard,
  };
}
