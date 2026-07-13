import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

import {
  BottomSheet,
  Button,
  Card,
  ClimbEditor,
  Dropdown,
  Link,
  Screen,
  Section,
  SessionClimbsList,
  SessionLocationPanel,
  SessionTimeDropdown,
  TextField,
} from '../../../src/components';
import { ui } from '../../../src/theme/colors';
import { TAKEN_USERNAMES } from '../../../src/constants/mockData';
import { FLOW_DEMO_SESSION_ID, type FlowDemoPreset } from '../../../src/constants/flowDemoSessions';
import { usePrototype } from '../../../src/context/PrototypeContext';
import type { SessionClimb } from '../../../src/types/climbingSession';
import {
  climbHasDetails,
  computeDurationMinutes,
  DURATION_PRESETS,
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

  if (!session) {
    return (
      <Screen
        title="Session not found"
        footer={<Link label="Back to dashboard" onPress={() => router.replace('/dashboard')} />}
      >
        <Card>
          <Text>This session could not be found.</Text>
        </Card>
      </Screen>
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
    <Screen
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
              <Button label="Save climb" onPress={saveClimb} />
              <Button label="Cancel" variant="secondary" onPress={cancelClimbEdit} />
            </>
          ) : (
            <Button label="Add climb" onPress={startAdd} />
          )}
          <Button
            label="Save / end session"
            variant="secondary"
            onPress={openEndSheet}
          />
        </>
      }
      overlay={
        <>
        <BottomSheet
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
            <TextField
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

          <SessionTimeDropdown
            label="End time"
            value={endTime}
            onChange={(value) => {
              setEndTime(value);
              setDurationMinutes(computeDurationMinutes(session.startTime, value));
            }}
          />

          <Dropdown
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

          <Button label="Confirm and save session" onPress={endSession} />
          <Button label="Cancel" variant="ghost" onPress={() => setShowEndSheet(false)} />
        </BottomSheet>

        <BottomSheet
          visible={Boolean(removeTarget)}
          title="Remove climb?"
          onClose={() => setRemoveTarget(null)}
        >
          <Text>
            {removeTarget?.name?.trim()
              ? `"${removeTarget.name}" has details that will be lost.`
              : 'This climb has details that will be lost.'}
          </Text>
          <Button label="Remove climb" onPress={confirmRemoveClimb} />
          <Button label="Cancel" variant="ghost" onPress={() => setRemoveTarget(null)} />
        </BottomSheet>
        </>
      }
    >
      {needsProfile ? (
        <Card>
          <Text style={{ fontWeight: '700' }}>Profile not complete</Text>
          <Text>
            You can keep logging this session. Tap Add location to search for your gym and set up
            difficulty levels.
          </Text>
        </Card>
      ) : null}

      {climbPrompt ? (
        <Card>
          <Text style={{ color: ui.danger }}>{climbPrompt}</Text>
        </Card>
      ) : null}

      <Section title="Session details">
        <TextField
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
        <SessionTimeDropdown
          label="Start time"
          value={session.startTime}
          onChange={(startTime) => updateSession(session.id, { startTime })}
        />
      </Section>

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

    </Screen>
  );
}
