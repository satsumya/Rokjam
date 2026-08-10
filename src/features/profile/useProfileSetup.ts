import { useEffect, useRef, useState } from 'react';

import { TAKEN_USERNAMES } from '../../constants/mockData';
import type { DifficultyLevel, Location } from '../../domain/types/profile';
import { useProfile } from '../../data/hooks/useProfile';
import { useSessions } from '../../data/hooks/useSessions';
import { locationHasGradedSessionClimbs } from '../../utils/sessionUtils';
import { getUsernameError, isUsernameAvailable } from '../../utils/validation';

import type { ProfileSetupViewProps } from './ProfileSetupView';

export type UseProfileSetupOptions = {
  onDone: () => void;
};

export function useProfileSetup({ onDone }: UseProfileSetupOptions): ProfileSetupViewProps {
  const {
    username,
    setUsername,
    avatar,
    setAvatar,
    locations,
    addLocation,
    updateLocation,
    removeLocation,
    setHomeLocation,
    addLevel,
    removeLevel,
    moveLevel,
    toggleLevelSort,
    updateLevel,
    strengthTags,
    improvementTags,
    addStrengthTag,
    removeStrengthTag,
    addImprovementTag,
    removeImprovementTag,
    setProfileComplete,
    setProfileSkipped,
    profileComplete,
  } = useProfile();
  const { sessions } = useSessions();

  const [openLocationId, setOpenLocationId] = useState<string | null>(null);
  const [usernameDraft, setUsernameDraft] = useState(username);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [levelsNudgeLocationId, setLevelsNudgeLocationId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [levelImpactPending, setLevelImpactPending] = useState<null | {
    locationId: string;
    action: () => void;
  }>(null);
  const [levelImpactAcknowledged, setLevelImpactAcknowledged] = useState<Record<string, true>>({});
  const locationCountRef = useRef(locations.length);

  useEffect(() => {
    setUsernameDraft(username);
  }, [username]);

  useEffect(() => {
    const previousCount = locationCountRef.current;
    locationCountRef.current = locations.length;
    if (previousCount === 0 && locations.length === 1) {
      setOpenLocationId(locations[0].id);
    }
  }, [locations]);

  const usernameError = usernameTouched ? getUsernameError(usernameDraft, TAKEN_USERNAMES) : undefined;
  const usernameSuccess =
    usernameTouched && isUsernameAvailable(usernameDraft, TAKEN_USERNAMES)
      ? 'Username available'
      : undefined;
  const usernameDirty = usernameDraft.trim() !== username.trim();
  const canConfirmUsername = usernameDirty && !getUsernameError(usernameDraft, TAKEN_USERNAMES);
  const isEditingCompleteProfile = profileComplete;
  const deleteTarget = locations.find((loc) => loc.id === deleteTargetId);

  const confirmUsername = () => {
    if (!canConfirmUsername) return;
    setUsername(usernameDraft.trim());
    setUsernameTouched(false);
  };

  const handleAddLocation = (address: string) => {
    const id = addLocation(address);
    setOpenLocationId(id);
    setLevelsNudgeLocationId(id);
  };

  const goToDashboard = () => {
    setUsernameTouched(true);
    if (getUsernameError(usernameDraft, TAKEN_USERNAMES)) return;
    setUsername(usernameDraft.trim());
    setProfileComplete(true);
    setProfileSkipped(false);
    onDone();
  };

  const handleExit = () => {
    if (isEditingCompleteProfile) {
      onDone();
      return;
    }
    setProfileSkipped(true);
    onDone();
  };

  const confirmDeleteLocation = () => {
    if (!deleteTargetId) return;
    const remaining = locations.filter((loc) => loc.id !== deleteTargetId);
    removeLocation(deleteTargetId);
    setDeleteTargetId(null);
    setOpenLocationId(remaining[0]?.id ?? null);
  };

  const runLevelEdit = (locationId: string, action: () => void) => {
    if (levelImpactAcknowledged[locationId] || !locationHasGradedSessionClimbs(sessions, locationId)) {
      action();
      return;
    }
    setLevelImpactPending({ locationId, action });
  };

  const confirmLevelImpact = () => {
    if (!levelImpactPending) return;
    const { locationId, action } = levelImpactPending;
    setLevelImpactAcknowledged((current) => ({ ...current, [locationId]: true }));
    setLevelImpactPending(null);
    action();
  };

  const handleReorderLevels = (locationId: string, fromIndex: number, toIndex: number) => {
    const location = locations.find((loc) => loc.id === locationId);
    if (!location) return;
    const next = [...location.levels];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    updateLocation(locationId, { levels: next });
  };

  return {
    avatar,
    usernameDraft,
    usernameError,
    usernameSuccess,
    canConfirmUsername,
    isEditingCompleteProfile,
    locations,
    openLocationId,
    levelsNudgeLocationId,
    deleteTarget,
    levelImpactPending: Boolean(levelImpactPending),
    strengthTags,
    improvementTags,
    onAvatarSelect: setAvatar,
    onUsernameDraftChange: (value) => {
      setUsernameDraft(value);
      setUsernameTouched(true);
    },
    onConfirmUsername: confirmUsername,
    onExit: handleExit,
    onGoToDashboard: goToDashboard,
    onToggleLocation: (locationId, isOpen) => setOpenLocationId(isOpen ? null : locationId),
    onAddLocation: handleAddLocation,
    onUpdateLocation: updateLocation,
    onSetHomeLocation: setHomeLocation,
    onDeleteLocationRequest: setDeleteTargetId,
    onConfirmDeleteLocation: confirmDeleteLocation,
    onCancelDeleteLocation: () => setDeleteTargetId(null),
    onToggleLevelSort: toggleLevelSort,
    onRunLevelEdit: runLevelEdit,
    onUpdateLevel: (locationId, levelId, patch: Partial<DifficultyLevel>) =>
      updateLevel(locationId, levelId, patch),
    onMoveLevel: moveLevel,
    onRemoveLevel: removeLevel,
    onReorderLevels: handleReorderLevels,
    onAddLevel: addLevel,
    onClearLevelsNudge: () => setLevelsNudgeLocationId(null),
    onAddStrengthTag: addStrengthTag,
    onRemoveStrengthTag: removeStrengthTag,
    onAddImprovementTag: addImprovementTag,
    onRemoveImprovementTag: removeImprovementTag,
    onConfirmLevelImpact: confirmLevelImpact,
    onCancelLevelImpact: () => setLevelImpactPending(null),
  };
}
