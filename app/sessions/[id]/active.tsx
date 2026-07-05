import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import { ClimbEditor } from '../../../src/components/SessionClimb';
import { SessionClimbsList } from '../../../src/components/SessionClimbsList';
import { SessionLocationPanel } from '../../../src/components/SessionLocationPanel';
import { SessionTimeField } from '../../../src/components/SessionTimeField';
import { WireframeDropdown } from '../../../src/components/WireframeDropdown';
import {
  WireframeBox,
  WireframeBottomSheet,
  WireframeButton,
  WireframeField,
  WireframeLink,
  WireframeScreen,
  WireframeSection,
} from '../../../src/components/Wireframe';
import { TAKEN_USERNAMES } from '../../../src/constants/mockData';
import { FLOW_DEMO_SESSION_ID, type FlowDemoPreset } from '../../../src/constants/flowDemoSessions';
import { usePrototype } from '../../../src/context/PrototypeContext';
import type { SessionClimb } from '../../../src/types/climbingSession';
import {
  climbHasDetails,
  computeDurationMinutes,
  DURATION_PRESETS,
  END_TIME_PRESETS,
  formatSessionDate,
  nowTimeLabel,
  parseSessionDateDisplay,
} from '../../../src/utils/sessionUtils';
import { getUsernameError } from '../../../src/utils/validation';

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

export default function ActiveSessionScreen() {
  const { id, demo } = useLocalSearchParams<{ id: string; demo?: string }>();
  const {
    sessions,
    locations,
    username,
    setUsername,
    profileComplete,
    profileSkipped,
    updateSession,
    completeSession,
    addClimb,
    updateClimb,
    removeClimb,
    seedDemoActiveSession,
    seedFlowDemo,
  } = usePrototype();
  const demoApplied = useRef(false);
  const flowUiApplied = useRef<string | null>(null);

  const [editingClimbId, setEditingClimbId] = useState<string | null>(null);
  const [draftClimb, setDraftClimb] = useState<SessionClimb | null>(null);
  const [showEndSheet, setShowEndSheet] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [endTime, setEndTime] = useState(() => nowTimeLabel());
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>();
  const [customEndTime, setCustomEndTime] = useState('');
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
        setCustomEndTime('');
        setDurationMinutes(computeDurationMinutes('17:30', now));
        setCustomDuration('');
        setShowEndSheet(true);
      }
      if (demo === 'flow-end-sheet-filled') {
        setEndTime('19:30');
        setCustomEndTime('');
        setDurationMinutes(90);
        setCustomDuration('');
        setShowEndSheet(true);
      }
      flowUiApplied.current = demo;
      return;
    }

    if (demo !== 'active' || demoApplied.current) return;
    if (sessions.some((s) => s.id === id)) return;
    seedDemoActiveSession();
    demoApplied.current = true;
  }, [demo, id, seedDemoActiveSession, seedFlowDemo, sessions]);

  const session = sessions.find((s) => s.id === id);
  const location = locations.find((l) => l.id === session?.locationId) ?? locations[0];
  const needsProfile = profileSkipped || !profileComplete || locations.length === 0;

  const usernameError = useMemo(() => {
    if (!isPublic || username.trim()) return undefined;
    if (!usernameTouched && !usernameInput.trim()) return undefined;
    if (!usernameInput.trim()) return 'Username is required for public sessions';
    return getUsernameError(usernameInput, TAKEN_USERNAMES);
  }, [isPublic, username, usernameInput, usernameTouched]);

  const endTimeOptions = useMemo(() => {
    const now = nowTimeLabel();
    const presets = END_TIME_PRESETS.filter((preset) => preset !== now);
    return [
      { value: now, label: `Now (${now})` },
      ...presets.map((preset) => ({ value: preset, label: preset })),
    ];
  }, [showEndSheet]);

  const durationOptions = useMemo(
    () => DURATION_PRESETS.map((preset) => ({ value: String(preset.minutes), label: preset.label })),
    [],
  );

  const openEndSheet = () => {
    const now = nowTimeLabel();
    setEndTime(now);
    setCustomEndTime('');
    setDurationMinutes(computeDurationMinutes(session?.startTime ?? now, now));
    setCustomDuration('');
    setShowEndSheet(true);
  };

  if (!session) {
    return (
      <WireframeScreen
        title="Session not found"
        footer={<WireframeLink label="Back to dashboard" onPress={() => router.replace('/dashboard')} />}
      >
        <WireframeBox>
          <Text>This session could not be found.</Text>
        </WireframeBox>
      </WireframeScreen>
    );
  }

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
    if (!draftClimb) return;
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
    if (isPublic && !username.trim()) {
      setUsernameTouched(true);
      if (!usernameInput.trim() || usernameError) return;
      setUsername(usernameInput.trim());
    }
    const resolvedEnd = endTime;
    const duration =
      durationMinutes ?? computeDurationMinutes(session.startTime, resolvedEnd);
    completeSession(session.id, {
      endTime: resolvedEnd,
      durationMinutes: duration,
      isPublic,
      ownerUsername: username.trim() || usernameInput.trim() || 'member',
    });
    router.replace(`/sessions/${session.id}`);
  };

  const handleRemoveClimb = (climb: SessionClimb) => {
    if (climbHasDetails(climb)) {
      setRemoveTarget(climb);
      return;
    }
    removeClimb(session.id, climb.id);
  };

  const confirmRemoveClimb = () => {
    if (removeTarget) {
      removeClimb(session.id, removeTarget.id);
    }
    setRemoveTarget(null);
  };

  const cancelClimbEdit = () => {
    setEditingClimbId(null);
    setDraftClimb(null);
  };

  const isEditingClimb = Boolean(draftClimb && editingClimbId);

  return (
    <WireframeScreen
      title="Climbing session"
      headerRight={
        <Pressable onPress={() => router.replace('/dashboard')}>
          <Text style={{ fontSize: 15, textDecorationLine: 'underline' }}>Dashboard</Text>
        </Pressable>
      }
      footer={
        <>
          {isEditingClimb ? (
            <>
              <WireframeButton label="Save climb" onPress={saveClimb} />
              <WireframeButton label="Cancel" variant="secondary" onPress={cancelClimbEdit} />
            </>
          ) : (
            <WireframeButton label="Add climb" onPress={startAdd} />
          )}
          <WireframeButton
            label="Save / end session"
            variant="secondary"
            onPress={openEndSheet}
          />
        </>
      }
      overlay={
        <>
        <WireframeBottomSheet
          visible={showEndSheet}
          title="Save / end session"
          onClose={() => setShowEndSheet(false)}
        >
          <View style={{ gap: 4 }}>
            <Pressable onPress={() => setIsPublic(false)}>
              <Text>{!isPublic ? '●' : '○'} Private</Text>
            </Pressable>
            <Pressable onPress={() => setIsPublic(true)}>
              <Text>{isPublic ? '●' : '○'} Public</Text>
            </Pressable>
          </View>

          {isPublic && !username.trim() ? (
            <WireframeField
              label="Username"
              required
              value={usernameInput}
              onChangeText={(v) => {
                setUsernameInput(v);
                setUsernameTouched(true);
              }}
              error={usernameError}
              placeholder="Required for public sessions"
            />
          ) : isPublic && username.trim() ? (
            <Text>Sharing as {username}</Text>
          ) : null}

          <WireframeDropdown
            label="End time"
            value={endTime}
            options={endTimeOptions}
            onChange={(value) => {
              setEndTime(value);
              setCustomEndTime('');
              setDurationMinutes(computeDurationMinutes(session.startTime, value));
            }}
            customValue={customEndTime}
            customTime
            onCustomChange={(value) => {
              setCustomEndTime(value);
              setEndTime(value);
              setDurationMinutes(computeDurationMinutes(session.startTime, value));
            }}
          />

          <WireframeDropdown
            label="Duration"
            value={durationMinutes != null ? String(durationMinutes) : ''}
            options={durationOptions}
            onChange={(value) => {
              setDurationMinutes(Number(value));
              setCustomDuration('');
            }}
            customValue={customDuration}
            onCustomChange={(value) => {
              setCustomDuration(value);
              const minutes = Number(value);
              if (!Number.isNaN(minutes) && minutes > 0) {
                setDurationMinutes(minutes);
              }
            }}
            customPlaceholder="Minutes"
          />

          <WireframeButton label="Confirm and save session" onPress={endSession} />
          <WireframeButton label="Cancel" variant="ghost" onPress={() => setShowEndSheet(false)} />
        </WireframeBottomSheet>

        <WireframeBottomSheet
          visible={Boolean(removeTarget)}
          title="Remove climb?"
          onClose={() => setRemoveTarget(null)}
        >
          <Text>
            {removeTarget?.name?.trim()
              ? `"${removeTarget.name}" has details that will be lost.`
              : 'This climb has details that will be lost.'}
          </Text>
          <WireframeButton label="Remove climb" onPress={confirmRemoveClimb} />
          <WireframeButton label="Cancel" variant="ghost" onPress={() => setRemoveTarget(null)} />
        </WireframeBottomSheet>
        </>
      }
    >
      {needsProfile ? (
        <WireframeBox>
          <Text style={{ fontWeight: '700' }}>Profile not complete</Text>
          <Text>
            You can keep logging this session. Tap Add location to search for your gym and set up
            difficulty levels.
          </Text>
        </WireframeBox>
      ) : null}

      {climbPrompt ? (
        <WireframeBox>
          <Text style={{ color: '#C0392B' }}>{climbPrompt}</Text>
        </WireframeBox>
      ) : null}

      <WireframeSection title="Session details">
        <WireframeField
          label="Date"
          value={formatSessionDate(session.date)}
          onChangeText={(display) => {
            const iso = parseSessionDateDisplay(display);
            if (iso) updateSession(session.id, { date: iso });
          }}
          placeholder="Friday 03 Jul 2026"
        />
        <SessionLocationPanel
          sessionLocationId={session.locationId}
          onLocationLinked={(locationId, locationName) =>
            updateSession(session.id, { locationId, locationName })
          }
        />
        <SessionTimeField
          label="Start time"
          value={session.startTime}
          onChange={(startTime) => updateSession(session.id, { startTime })}
        />
      </WireframeSection>

      {draftClimb && editingClimbId ? (
        <ClimbEditor
          climb={draftClimb}
          location={location}
          onChange={(patch) => setDraftClimb((c) => (c ? { ...c, ...patch } : c))}
        />
      ) : (
        <SessionClimbsList
          climbs={session.climbs}
          location={location}
          onEditClimb={startEdit}
          onRemoveClimb={handleRemoveClimb}
          onDifficultyChange={(climb, level) =>
            updateClimb(session.id, climb.id, {
              levelId: level.id,
              levelName: level.name,
              levelColor: level.color,
            })
          }
        />
      )}

    </WireframeScreen>
  );
}
