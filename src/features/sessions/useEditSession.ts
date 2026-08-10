import { useEffect, useRef, useState } from 'react';

import { usePrototype } from '../../context/PrototypeContext';
import type { SessionClimb } from '../../types/climbingSession';
import { climbHasDetails } from '../../utils/sessionUtils';

import type { EditSessionViewProps } from './EditSessionView';

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

export type UseEditSessionOptions = {
  sessionId: string;
  demo?: string;
  onSaved: () => void;
  onCancel: () => void;
  onBack: () => void;
};

export function useEditSession({
  sessionId,
  demo,
  onSaved,
  onCancel,
  onBack,
}: UseEditSessionOptions): EditSessionViewProps {
  const { sessions, locations, username, updateSession, updateClimb, removeClimb, addClimb, seedDemoSessions } =
    usePrototype();
  const demoApplied = useRef(false);

  useEffect(() => {
    if (demo !== 'seed' || demoApplied.current) return;
    if (sessions.some((s) => s.id === sessionId)) return;
    seedDemoSessions();
    demoApplied.current = true;
  }, [demo, sessionId, seedDemoSessions, sessions]);

  const session = sessions.find((s) => s.id === sessionId);
  const location = locations.find((l) => l.id === session?.locationId);
  const canEdit = Boolean(session && session.status === 'completed');

  const [editingClimbId, setEditingClimbId] = useState<string | null>(null);
  const [draftClimb, setDraftClimb] = useState<SessionClimb | null>(null);
  const [isPublic, setIsPublic] = useState(session?.isPublic ?? false);
  const [publicError, setPublicError] = useState('');
  const [removeTarget, setRemoveTarget] = useState<SessionClimb | null>(null);

  useEffect(() => {
    setIsPublic(session?.isPublic ?? false);
  }, [session?.isPublic]);

  const saveSession = () => {
    if (!session) return;
    if (isPublic && !username.trim()) {
      setPublicError('Set your username in member profile to share sessions publicly.');
      return;
    }
    setPublicError('');
    updateSession(session.id, {
      isPublic,
      ownerUsername: username.trim() || session.ownerUsername,
    });
    onSaved();
  };

  const saveClimb = () => {
    if (!draftClimb || !editingClimbId || !session) return;
    if (editingClimbId === 'new') {
      const { id: _id, ...rest } = draftClimb;
      addClimb(session.id, rest);
    } else {
      updateClimb(session.id, editingClimbId, draftClimb);
    }
    setEditingClimbId(null);
    setDraftClimb(null);
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

  return {
    session: session ?? null,
    location,
    canEdit,
    editingClimbId,
    draftClimb,
    isPublic,
    publicError,
    removeTarget,
    onSaveSession: saveSession,
    onCancel,
    onDateChange: (date) => session && updateSession(session.id, { date }),
    onStartTimeChange: (startTime) => session && updateSession(session.id, { startTime }),
    onEndTimeChange: (endTime) => session && updateSession(session.id, { endTime }),
    onSetPrivate: () => setIsPublic(false),
    onSetPublic: () => setIsPublic(true),
    onAddClimb: () => {
      setEditingClimbId('new');
      setDraftClimb(emptyClimb());
    },
    onEditClimb: (climb) => {
      setEditingClimbId(climb.id);
      setDraftClimb({ ...climb });
    },
    onRemoveClimb: handleRemoveClimb,
    onDifficultyChange: (climb, level) =>
      session &&
      updateClimb(session.id, climb.id, {
        levelId: level.id,
        levelName: level.name,
        levelColor: level.color,
      }),
    onDraftChange: (patch) => setDraftClimb((c) => (c ? { ...c, ...patch } : c)),
    onSaveClimb: saveClimb,
    onCancelClimbEdit: () => {
      setEditingClimbId(null);
      setDraftClimb(null);
    },
    onConfirmRemoveClimb: confirmRemoveClimb,
    onCancelRemoveClimb: () => setRemoveTarget(null),
    onBack,
  };
}
